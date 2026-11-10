import { query, withTransaction } from '@/lib/db';
import {
  ShowcaseCategory,
  ShowcaseIntro,
  ShowcaseGalleryItem,
  ShowcaseCta,
  TopBusinessItem,
  ShowcaseBundle,
} from './types';
import {
  DEFAULT_SHOWCASE_CATEGORIES,
  DEFAULT_SHOWCASE_INTRO,
  DEFAULT_SHOWCASE_GALLERY,
  DEFAULT_SHOWCASE_CTA,
  DEFAULT_TOP_BUSINESSES,
  DEFAULT_SHOWCASE_BUNDLE,
} from './defaults';
import { createAuditRow } from '@/lib/services/audit';

// In-memory cache for fast SSR rendering with 30-second TTL
let cachedBundle: { data: ShowcaseBundle; cachedAt: number } | null = null;
const CACHE_TTL_MS = 30 * 1000;

export function invalidateShowcaseCache() {
  cachedBundle = null;
}

/**
 * Fetch the full Showcase Bundle from settings table or fallback to canonical defaults.
 */
export async function getShowcaseBundle(): Promise<ShowcaseBundle> {
  const now = Date.now();
  if (cachedBundle && now - cachedBundle.cachedAt < CACHE_TTL_MS) {
    return cachedBundle.data;
  }

  try {
    const res = await query<{ key: string; value: any }>(
      `SELECT key, value FROM settings WHERE key IN (
        'showcase.categories',
        'showcase.intro',
        'showcase.gallery',
        'showcase.cta',
        'showcase.top_businesses'
      )`
    );

    const map = new Map<string, any>();
    if (res?.rows) {
      for (const row of res.rows) {
        map.set(row.key, row.value);
      }
    }

    const categories: ShowcaseCategory[] =
      map.get('showcase.categories') || DEFAULT_SHOWCASE_CATEGORIES;
    const intro: ShowcaseIntro =
      map.get('showcase.intro') || DEFAULT_SHOWCASE_INTRO;
    const gallery: ShowcaseGalleryItem[] =
      map.get('showcase.gallery') || DEFAULT_SHOWCASE_GALLERY;
    const cta: ShowcaseCta =
      map.get('showcase.cta') || DEFAULT_SHOWCASE_CTA;
    const topBusinesses: TopBusinessItem[] =
      map.get('showcase.top_businesses') || DEFAULT_TOP_BUSINESSES;

    const bundle: ShowcaseBundle = {
      categories,
      intro,
      gallery: [...gallery].sort((a, b) => a.order - b.order),
      cta,
      topBusinesses: [...topBusinesses].sort((a, b) => a.rank - b.rank),
      updatedAt: new Date().toISOString(),
    };

    cachedBundle = { data: bundle, cachedAt: now };
    return bundle;
  } catch (error) {
    console.warn('[Showcase] Using default showcase bundle due to DB fallback:', error);
    return DEFAULT_SHOWCASE_BUNDLE;
  }
}

/**
 * Atomically update showcase components with audit logging
 */
export async function updateShowcaseComponent<T>(
  key:
    | 'showcase.categories'
    | 'showcase.intro'
    | 'showcase.gallery'
    | 'showcase.cta'
    | 'showcase.top_businesses',
  value: T,
  adminId: string,
  note: string,
  description: string
): Promise<void> {
  invalidateShowcaseCache();

  try {
    await withTransaction(async (client) => {
      // 1. Read existing value for audit log
      const prev = await client.query('SELECT value FROM settings WHERE key = $1', [key]);
      const beforeVal = prev.rows.length > 0 ? prev.rows[0].value : null;

      // 2. Upsert into settings table
      await client.query(
        `INSERT INTO settings (key, value, type, description, updated_by, updated_at)
         VALUES ($1, $2, 'json', $3, $4, CURRENT_TIMESTAMP)
         ON CONFLICT (key) DO UPDATE SET
           value = EXCLUDED.value,
           updated_by = EXCLUDED.updated_by,
           updated_at = CURRENT_TIMESTAMP;`,
        [key, JSON.stringify(value), description, adminId]
      );

      // 3. Insert into settings_history
      await client.query(
        `INSERT INTO settings_history (key, old_value, new_value, note, changed_by, at)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP);`,
        [key, JSON.stringify(beforeVal), JSON.stringify(value), note, adminId]
      );

      // 4. Record audit log
      await createAuditRow(client, {
        adminId,
        action: 'UPDATE_SHOWCASE',
        objectType: 'settings',
        before: beforeVal,
        after: { key, updated: true },
        ipHash: 'admin_console',
      });
    });
  } catch (error) {
    console.error(`[Showcase] Failed to update key ${key}:`, error);
    throw error;
  }
}

/**
 * Manage Categories: Add, edit, remove
 */
export async function saveCategories(
  categories: ShowcaseCategory[],
  adminId: string,
  note = 'Updated showcase categories'
): Promise<ShowcaseCategory[]> {
  await updateShowcaseComponent(
    'showcase.categories',
    categories,
    adminId,
    note,
    'Exploration categories displayed on home showcase'
  );
  return categories;
}

/**
 * Manage Intro text: update title, subtitle, body, features
 */
export async function saveIntro(
  intro: ShowcaseIntro,
  adminId: string,
  note = 'Updated showcase write-up and intro content'
): Promise<ShowcaseIntro> {
  await updateShowcaseComponent(
    'showcase.intro',
    intro,
    adminId,
    note,
    'Showcase descriptive write-up and introductory text'
  );
  return intro;
}

/**
 * Manage Gallery: upload, reorder, delete images
 */
export async function saveGallery(
  gallery: ShowcaseGalleryItem[],
  adminId: string,
  note = 'Updated showcase gallery images'
): Promise<ShowcaseGalleryItem[]> {
  const ordered = gallery.map((item, index) => ({
    ...item,
    order: index + 1,
  }));
  await updateShowcaseComponent(
    'showcase.gallery',
    ordered,
    adminId,
    note,
    'Home page sliding gallery carousel items'
  );
  return ordered;
}

/**
 * Manage CTA Button: text and destination link
 */
export async function saveCta(
  cta: ShowcaseCta,
  adminId: string,
  note = 'Updated showcase explore call-to-action button'
): Promise<ShowcaseCta> {
  await updateShowcaseComponent(
    'showcase.cta',
    cta,
    adminId,
    note,
    'Showcase explore call-to-action button label and URL'
  );
  return cta;
}

/**
 * Manage Top 10 Businesses ranking: add, remove, edit, reorder
 */
export async function saveTopBusinesses(
  businesses: TopBusinessItem[],
  adminId: string,
  note = 'Updated Top 10 businesses ranking'
): Promise<TopBusinessItem[]> {
  // Enforce ranking positions 1..N
  const ranked = businesses.map((b, idx) => ({
    ...b,
    rank: idx + 1,
  }));
  await updateShowcaseComponent(
    'showcase.top_businesses',
    ranked,
    adminId,
    note,
    'Ranked Top 10 Businesses for Explore Businesses category'
  );
  return ranked;
}
