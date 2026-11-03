import { z } from 'zod';
import { createApiHandler } from '@/lib/api/handler';
import {
  createSuccessResponse,
  createErrorResponse,
  ERROR_CATALOGUE,
} from '@/lib/api/envelope';
import { query } from '@/lib/db';
import { getSetting } from '@/lib/settings';
import { transitionListingStatus } from '@/lib/rules/status-machine';

const ReplySchema = z.object({
  message: z.string().trim().min(5).max(2000),
  attachment_id: z.string().uuid().optional(),
});

export const POST = createApiHandler(
  { bodySchema: ReplySchema },
  async ({ body, params, requestId }) => {
    const rawCode = params?.code || '';
    const code = rawCode.trim().toUpperCase();

    // 1. Fetch listing
    const res = await query(
      `SELECT l.id, l.title, l.kind, l.status, l.updated_at,
              sh.at AS status_changed_at
       FROM listings l
       LEFT JOIN LATERAL (
         SELECT at FROM status_history
         WHERE listing_id = l.id
         ORDER BY at DESC LIMIT 1
       ) sh ON true
       WHERE l.tracking_code = $1 LIMIT 1`,
      [code]
    );

    if (res.rows.length === 0) {
      return createErrorResponse(ERROR_CATALOGUE.NOT_FOUND, requestId);
    }

    const listing = res.rows[0];

    // 2. Validate current status is 'Needs info'
    if (listing.status !== 'Needs info') {
      return createErrorResponse(ERROR_CATALOGUE.WRONG_STATE, requestId);
    }

    // 3. Check reply window
    const infoDays = ((await getSetting('review.infoReplyDays')) as number) || 7;
    const changedAt = listing.status_changed_at ? new Date(listing.status_changed_at) : new Date(listing.updated_at);
    const windowEnd = new Date(changedAt.getTime() + infoDays * 24 * 60 * 60 * 1000);

    if (Date.now() > windowEnd.getTime()) {
      return createErrorResponse(ERROR_CATALOGUE.WINDOW_CLOSED, requestId);
    }

    // 4. Transition status: Needs info -> Pending
    await transitionListingStatus({
      listingId: listing.id,
      toStatus: 'Pending',
      actorRole: 'submitter',
      note: body.message,
    });

    return createSuccessResponse(
      {
        tracking_code: code,
        status: 'pending',
        label: 'Pending review',
        next_step: 'Our team will review your reply within 2 working days.',
        changed_at: new Date().toISOString(),
      },
      requestId
    );
  }
);
