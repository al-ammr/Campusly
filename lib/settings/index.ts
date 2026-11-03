import { query, withTransaction } from '@/lib/db';
import {
  SETTINGS_DEFAULTS,
  SettingsKey,
  SettingValue,
  SettingDefinition,
} from './defaults';

export * from './defaults';

interface CacheEntry {
  value: any;
  cachedAt: number;
}

// In-memory cache with 60-second TTL (BR-206, BP-04)
const settingsCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 1000;

/**
 * Retrieve a typed setting from database or memory cache, falling back to D07 defaults.
 */
export async function getSetting<K extends SettingsKey>(
  key: K
): Promise<SettingValue<K>> {
  const now = Date.now();
  const cached = settingsCache.get(key);

  if (cached && now - cached.cachedAt < CACHE_TTL_MS) {
    return cached.value as SettingValue<K>;
  }

  const def = SETTINGS_DEFAULTS[key] as SettingDefinition<SettingValue<K>> | undefined;
  if (!def) {
    throw new Error(`[Settings] Unknown setting key: ${key}`);
  }

  try {
    const res = await query<{ value: any }>(
      'SELECT value FROM settings WHERE key = $1 LIMIT 1',
      [key]
    );

    if (res?.rows && res.rows.length > 0) {
      const dbValue = res.rows[0].value;
      settingsCache.set(key, { value: dbValue, cachedAt: now });
      return dbValue as SettingValue<K>;
    }
  } catch (error) {
    // If DB is temporarily unreachable or testing without table, fallback to canonical default
    console.warn(`[Settings] Failed to fetch key ${key} from DB, using D07 default:`, error);
  }

  // Cache fallback default
  settingsCache.set(key, { value: def.defaultValue, cachedAt: now });
  return def.defaultValue;
}

/**
 * Update a setting with audit trail and range validation (Lead only).
 * Writes settings row, settings_history row, and audit_log row in one transaction.
 */
export async function updateSetting<K extends SettingsKey>(
  key: K,
  newValue: SettingValue<K>,
  adminId: string,
  note: string,
  ipHash: string = 'system_internal'
): Promise<void> {
  const def = SETTINGS_DEFAULTS[key] as SettingDefinition<SettingValue<K>> | undefined;
  if (!def) {
    throw new Error(`[Settings] Unknown setting key: ${key}`);
  }

  if (!note || note.trim().length === 0) {
    throw new Error('[Settings] A descriptive note is mandatory for every setting modification.');
  }

  // Validate range if applicable
  if (typeof newValue === 'number') {
    if (def.min !== undefined && newValue < def.min) {
      throw new Error(`[Settings] Value ${newValue} is below minimum allowed ${def.min} for ${key}`);
    }
    if (def.max !== undefined && newValue > def.max) {
      throw new Error(`[Settings] Value ${newValue} exceeds maximum allowed ${def.max} for ${key}`);
    }
  }

  const oldValue = await getSetting(key);

  await withTransaction(async (client) => {
    // 1. Upsert into settings table
    await client.query(
      `INSERT INTO settings (key, value, type, description, updated_by, updated_at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
       ON CONFLICT (key) DO UPDATE SET
         value = EXCLUDED.value,
         updated_by = EXCLUDED.updated_by,
         updated_at = CURRENT_TIMESTAMP;`,
      [key, JSON.stringify(newValue), def.type, def.description, adminId]
    );

    // 2. Append to settings_history
    await client.query(
      `INSERT INTO settings_history (key, old_value, new_value, note, changed_by, at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP);`,
      [key, JSON.stringify(oldValue), JSON.stringify(newValue), note, adminId]
    );

    // 3. Write immutable audit log
    await client.query(
      `INSERT INTO audit_log (admin_id, action, object_type, object_id, before, after, ip_hash, at)
       VALUES ($1, 'SETTING_UPDATE', 'setting', NULL, $2, $3, $4, CURRENT_TIMESTAMP);`,
      [
        adminId,
        JSON.stringify({ key, value: oldValue }),
        JSON.stringify({ key, value: newValue, note }),
        ipHash,
      ]
    );
  });

  // Invalidate in-memory cache
  settingsCache.delete(key);
}

/**
 * Clear in-memory settings cache (useful in test runner).
 */
export function clearSettingsCache(): void {
  settingsCache.clear();
}
