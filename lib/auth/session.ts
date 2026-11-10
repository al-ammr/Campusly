// lib/auth/session.ts
import crypto from 'crypto';
import { query } from '@/lib/db';
import { getSetting } from '@/lib/settings';

/**
 * Generate a cryptographically secure session ID (128‑bit) and return the raw ID
 * as well as a SHA‑256 hash to store in the database.
 */
export async function createSession(
  adminId: string,
  ipHash: string = '0000000000000000000000000000000000000000000000000000000000000000',
  userAgent: string = 'unknown'
): Promise<string> {
  const rawId = crypto.randomBytes(16).toString('hex'); // 128‑bit
  const hash = crypto.createHash('sha256').update(rawId).digest('hex');

  let idleTimeoutMins = 60;
  let absoluteTimeoutMins = 480;

  try {
    const idle = await getSetting('admin_session_idle_minutes' as any);
    if (typeof idle === 'number') idleTimeoutMins = idle;
    const abs = await getSetting('admin_session_absolute_hours' as any);
    if (typeof abs === 'number') absoluteTimeoutMins = abs * 60;
  } catch {
    // Fall back to defaults
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + absoluteTimeoutMins * 60 * 1000);

  await query(
    `INSERT INTO admin_sessions (admin_id, token_hash, expires_at, ip_hash, user_agent, created_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [adminId, hash, expiresAt, ipHash, userAgent, now]
  );

  return rawId;
}

/** Refresh the session expiration timestamp */
export async function touchSession(sessionHash: string): Promise<void> {
  await query(
    `UPDATE admin_sessions
     SET expires_at = NOW() + INTERVAL '1 hour'
     WHERE token_hash = $1`,
    [sessionHash]
  );
}

/** Invalidate all sessions for a given admin */
export async function revokeAdminSessions(adminId: string): Promise<void> {
  await query(`DELETE FROM admin_sessions WHERE admin_id = $1`, [adminId]);
}

/** Extract session token from request cookies */
export function getSessionFromRequest(request?: Request): string | null {
  if (request) {
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
      const match = cookieHeader.match(/campusly_admin_session=([^;]+)/);
      if (match) return match[1];
    }
  }
  return null;
}
