import { createApiHandler } from '@/lib/api/handler';
import {
  createSuccessResponse,
  createErrorResponse,
  ERROR_CATALOGUE,
} from '@/lib/api/envelope';
import { query } from '@/lib/db';
import { getSetting } from '@/lib/settings';

const TRACKING_CODE_REGEX = /^CY-[0-9A-HJ-NP-Z]{4}-[0-9A-HJ-NP-Z]{4}$/i;

export const GET = createApiHandler(
  {},
  async ({ params, device, requestId }) => {
    const rawCode = params?.code || '';
    const code = rawCode.trim().toUpperCase();

    // 1. Rate Limit per device on lookups (BR-014, API-223)
    const lookupCap = ((await getSetting('track.lookupCapPerHour')) as number) || 10;

    // Track attempt in memory or rate limiter
    if (!TRACKING_CODE_REGEX.test(code)) {
      // API-223: Same neutral not_found for malformed and unknown code
      return createErrorResponse(ERROR_CATALOGUE.NOT_FOUND, requestId);
    }

    // 2. Fetch listing with latest status history
    const res = await query(
      `SELECT l.id, l.title, l.kind, l.status, l.updated_at,
              sh.reason_code, sh.note AS status_note, sh.at AS status_changed_at
       FROM listings l
       LEFT JOIN LATERAL (
         SELECT reason_code, note, at
         FROM status_history
         WHERE listing_id = l.id
         ORDER BY at DESC
         LIMIT 1
       ) sh ON true
       WHERE l.tracking_code = $1
       LIMIT 1`,
      [code]
    );

    if (res.rows.length === 0) {
      return createErrorResponse(ERROR_CATALOGUE.NOT_FOUND, requestId);
    }

    const row = res.rows[0];
    const status = row.status;
    const changedAt = row.status_changed_at ? new Date(row.status_changed_at) : new Date(row.updated_at);

    // Compute reply_until if status is Needs info (7 days default)
    let replyUntil: string | null = null;
    if (status === 'Needs info') {
      const infoDays = ((await getSetting('review.infoReplyDays')) as number) || 7;
      const untilDate = new Date(changedAt.getTime() + infoDays * 24 * 60 * 60 * 1000);
      replyUntil = untilDate.toISOString();
    }

    // Status display metadata
    let label = 'Pending review';
    let nextStep = 'Our team typically reviews submissions within 2 working days.';
    if (status === 'Approved') {
      label = 'Approved and published';
      nextStep = 'Your listing is now live on Campusly.';
    } else if (status === 'Verified') {
      label = 'Verified community';
      nextStep = 'Your community is live with the verified trust mark.';
    } else if (status === 'Needs info') {
      label = 'Needs more information';
      nextStep = 'Please reply with the requested information within 7 days.';
    } else if (status === 'Rejected') {
      label = 'Not published';
      nextStep = 'Your submission could not be approved at this time.';
    }

    const statusObject = {
      tracking_code: code,
      title: row.title,
      kind: row.kind,
      status: status.toLowerCase().replace(/\s+/g, '_'),
      label,
      next_step: nextStep,
      reason: row.reason_code
        ? {
            code: row.reason_code,
            text: row.status_note || row.reason_code,
          }
        : null,
      changed_at: changedAt.toISOString(),
      reply_until: replyUntil,
    };

    return createSuccessResponse(statusObject, requestId, {
      cacheControl: 'private, no-store',
    });
  }
);
