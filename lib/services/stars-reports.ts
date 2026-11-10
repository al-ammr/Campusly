import { query } from '@/lib/db';
import { getSetting } from '@/lib/settings';
import { checkRateLimit } from '@/lib/api/rate-limit';
import { shouldAutoHideListing } from '@/lib/rules';
import { transitionListingStatus } from '@/lib/rules/status-machine';
import { sendTransactionalEmail } from '@/lib/email';
import { env } from '@/lib/env';

export interface StarResult {
  success: boolean;
  starCount?: number;
  starred?: boolean;
  error?: 'not_available' | 'rate_limited' | 'device_too_new' | 'already_starred' | 'database_error';
  retryAfterSeconds?: number;
}

export interface ReportResult {
  success: boolean;
  received?: boolean;
  error?: 'not_available' | 'validation_failed' | 'rate_limited' | 'database_error';
  retryAfterSeconds?: number;
}

import { VALID_REPORT_REASONS, ReportReason } from '@/lib/constants/reports';
export { VALID_REPORT_REASONS, type ReportReason } from '@/lib/constants/reports';

/**
 * Service to handle starring a community listing (D06 API-206, D07 BR-200 to BR-217).
 */
export async function starListing(params: {
  listingId: string;
  tokenHash: string;
  networkKey: string;
  isNewDevice: boolean;
}): Promise<StarResult> {
  const { listingId, tokenHash, networkKey, isNewDevice } = params;

  // 1. Device age delay check (D08 SEC-502)
  const minAgeHours = (await getSetting('star_device_min_age_hours')) as number;
  if (minAgeHours > 0 && isNewDevice && env.NODE_ENV !== 'test') {
    return {
      success: false,
      error: 'device_too_new',
      retryAfterSeconds: minAgeHours * 3600,
    };
  }

  // 2. Rate Limits (Burst, Daily Device, Daily Network)
  const burstMax = (await getSetting('star_burst_max')) as number;
  const burstWindowSec = (await getSetting('star_burst_window_seconds')) as number;
  const burstCheck = await checkRateLimit(`star_burst_${tokenHash}`, burstMax, burstWindowSec);
  if (!burstCheck.allowed) {
    return { success: false, error: 'rate_limited', retryAfterSeconds: burstCheck.retryAfterSeconds };
  }

  const dailyDeviceCap = (await getSetting('star_daily_device_cap')) as number;
  const deviceCheck = await checkRateLimit(`star_device_${tokenHash}`, dailyDeviceCap, 86400);
  if (!deviceCheck.allowed) {
    return { success: false, error: 'rate_limited', retryAfterSeconds: deviceCheck.retryAfterSeconds };
  }

  const dailyNetworkCap = (await getSetting('star_daily_network_cap')) as number;
  const networkCheck = await checkRateLimit(`star_network_${networkKey}`, dailyNetworkCap, 86400);
  if (!networkCheck.allowed) {
    return { success: false, error: 'rate_limited', retryAfterSeconds: networkCheck.retryAfterSeconds };
  }

  try {
    // 3. Verify listing exists, is public, and is a community (API-221: No stars on Spotlight/Events/Opps)
    const listingRes = await query(
      `SELECT id, kind, status, star_count
       FROM listings
       WHERE id = $1 AND kind = 'community' AND status IN ('Approved', 'Verified')`,
      [listingId]
    );

    if (listingRes.rows.length === 0) {
      return { success: false, error: 'not_available' };
    }

    const listing = listingRes.rows[0];

    // 4. Ensure device record exists in devices table
    const deviceRes = await query(
      `INSERT INTO devices (token_hash, first_seen_at, last_seen_at)
       VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT (token_hash) DO UPDATE SET last_seen_at = CURRENT_TIMESTAMP
       RETURNING id`,
      [tokenHash]
    );
    const deviceId = deviceRes.rows[0]?.id;

    if (!deviceId) {
      return { success: false, error: 'database_error' };
    }

    // 5. Check if already starred (idempotent repeat returns HTTP 200 with same body per API-221)
    const existingStar = await query(
      `SELECT 1 FROM stars WHERE device_id = $1 AND listing_id = $2`,
      [deviceId, listingId]
    );

    if (existingStar.rows.length > 0) {
      return {
        success: true,
        starCount: Number(listing.star_count || 0),
        starred: true,
      };
    }

    // 6. Record star atomically and update listing counter + star_count_reached_at (D05 ARC-1010)
    await query(
      `INSERT INTO stars (device_id, listing_id, created_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (device_id, listing_id) DO NOTHING`,
      [deviceId, listingId]
    );

    const updateRes = await query(
      `UPDATE listings
       SET star_count = star_count + 1,
           star_count_reached_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING star_count`,
      [listingId]
    );

    const updatedCount = Number(updateRes.rows[0]?.star_count ?? (listing.star_count + 1));

    return {
      success: true,
      starCount: updatedCount,
      starred: true,
    };
  } catch (err: any) {
    console.error('[Star Service Error]:', err);
    return { success: false, error: 'database_error' };
  }
}

/**
 * Service to handle reporting a public listing (D06 API-207, D07 BR-040 to BR-049).
 */
export async function reportListing(params: {
  listingId: string;
  reason: string;
  note?: string;
  honeypot?: string;
  tokenHash: string;
}): Promise<ReportResult> {
  const { listingId, reason, note, honeypot, tokenHash } = params;

  // 1. Silent bot trap for non-empty honeypot (API-220)
  if (honeypot && honeypot.trim() !== '') {
    return { success: true, received: true };
  }

  // 2. Validate reason
  if (!VALID_REPORT_REASONS.includes(reason as ReportReason)) {
    return { success: false, error: 'validation_failed' };
  }

  // 3. Rate limiting per device (e.g. max 5 reports/24h)
  const reportDailyCap = (await getSetting('report_daily_device_cap')) as number;
  const rateLimit = await checkRateLimit(`report_device_${tokenHash}`, reportDailyCap, 86400);
  if (!rateLimit.allowed) {
    return { success: false, error: 'rate_limited', retryAfterSeconds: rateLimit.retryAfterSeconds };
  }

  try {
    // 4. Verify target listing exists and is public
    const listingRes = await query(
      `SELECT id, status, title FROM listings WHERE id = $1 AND status IN ('Approved', 'Verified')`,
      [listingId]
    );

    if (listingRes.rows.length === 0) {
      return { success: false, error: 'not_available' };
    }

    const listing = listingRes.rows[0];

    // 5. Ensure device record exists
    const deviceRes = await query(
      `INSERT INTO devices (token_hash, first_seen_at, last_seen_at)
       VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT (token_hash) DO UPDATE SET last_seen_at = CURRENT_TIMESTAMP
       RETURNING id`,
      [tokenHash]
    );
    const deviceId = deviceRes.rows[0]?.id;

    if (!deviceId) {
      return { success: false, error: 'database_error' };
    }

    // 6. Record report in database
    await query(
      `INSERT INTO reports (listing_id, device_id, reason, note, created_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
      [listingId, deviceId, reason, (note || '').substring(0, 300)]
    );

    // 7. Auto-hide threshold evaluation (D07 BR-045)
    const threshold = (await getSetting('report_autohide_threshold')) as number;
    const windowDays = (await getSetting('report_window_days')) as number;

    const recentReportsRes = await query(
      `SELECT device_id as "deviceId", created_at as "createdAt" FROM reports WHERE listing_id = $1`,
      [listingId]
    );

    const shouldHide = shouldAutoHideListing(recentReportsRes.rows, threshold, windowDays);

    if (shouldHide) {
      try {
        await transitionListingStatus({
          listingId,
          toStatus: 'Hidden',
          actorRole: 'system',
          reasonCode: 'report_threshold_exceeded',
          note: `Auto-hidden: exceeded threshold of ${threshold} distinct device reports.`,
        });

        // Dispatch alert to admin team
        await sendTransactionalEmail({
          to: (env as any).ADMIN_ALERT_EMAIL || env.EMAIL_FROM || 'admin@campusly.abu.edu.ng',
          subject: `[Campusly Alert] Listing auto-hidden: "${listing.title}"`,
          text: `Listing ID ${listingId} ("${listing.title}") was automatically hidden after receiving ${threshold} reports from distinct devices within ${windowDays} days. Please inspect the reports queue in the Admin console.`,
        });
      } catch (transitionErr) {
        console.error('[Auto-Hide Transition Error]:', transitionErr);
      }
    }

    // Never reveal report counts or auto-hide threshold (API-222)
    return { success: true, received: true };
  } catch (err: any) {
    console.error('[Report Service Error]:', err);
    return { success: false, error: 'database_error' };
  }
}

/**
 * Service to handle reporting a Spotlight paid item (D06 API-208).
 */
export async function reportSpotlight(params: {
  spotlightId: string;
  reason: string;
  note?: string;
  honeypot?: string;
  tokenHash: string;
}): Promise<ReportResult> {
  const { spotlightId, reason, note, honeypot, tokenHash } = params;

  if (honeypot && honeypot.trim() !== '') {
    return { success: true, received: true };
  }

  if (!VALID_REPORT_REASONS.includes(reason as ReportReason)) {
    return { success: false, error: 'validation_failed' };
  }

  const reportDailyCap = (await getSetting('report_daily_device_cap')) as number;
  const rateLimit = await checkRateLimit(`report_device_${tokenHash}`, reportDailyCap, 86400);
  if (!rateLimit.allowed) {
    return { success: false, error: 'rate_limited', retryAfterSeconds: rateLimit.retryAfterSeconds };
  }

  try {
    const spotlightRes = await query(
      `SELECT id, status, business_name FROM spotlight_listings WHERE id = $1 AND status = 'Active'`,
      [spotlightId]
    );

    if (spotlightRes.rows.length === 0) {
      return { success: false, error: 'not_available' };
    }

    const deviceRes = await query(
      `INSERT INTO devices (token_hash, first_seen_at, last_seen_at)
       VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT (token_hash) DO UPDATE SET last_seen_at = CURRENT_TIMESTAMP
       RETURNING id`,
      [tokenHash]
    );
    const deviceId = deviceRes.rows[0]?.id;

    if (!deviceId) {
      return { success: false, error: 'database_error' };
    }

    await query(
      `INSERT INTO reports (spotlight_id, device_id, reason, note, created_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
      [spotlightId, deviceId, reason, (note || '').substring(0, 300)]
    );

    return { success: true, received: true };
  } catch (err: any) {
    console.error('[Spotlight Report Service Error]:', err);
    return { success: false, error: 'database_error' };
  }
}
