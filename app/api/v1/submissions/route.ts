import { z } from 'zod';
import * as crypto from 'crypto';
import { createApiHandler } from '@/lib/api/handler';
import {
  createSuccessResponse,
  createErrorResponse,
  ERROR_CATALOGUE,
} from '@/lib/api/envelope';
import { query, withTransaction } from '@/lib/db';
import { getSetting } from '@/lib/settings';
import { generateTrackingCode } from '@/lib/rules';
import { sendEmail } from '@/lib/email';

const LinkSchema = z.object({
  label: z.string().min(1).max(64),
  url: z.string().url().refine((val) => val.startsWith('https://') || val.startsWith('http://'), {
    message: 'Links must use https:// protocol',
  }),
  is_official: z.boolean().optional().default(false),
});

const SubmissionSchema = z.object({
  kind: z.enum(['community', 'event', 'opportunity']),
  title: z.string().trim().min(3).max(100),
  summary: z.string().trim().min(10).max(160),
  description: z.string().trim().min(20).max(3000),
  category_id: z.string().uuid(),
  contact_name: z.string().trim().min(2).max(80),
  contact_channel: z.string().trim().min(3).max(256),
  contact_email: z.string().email().optional().or(z.literal('')),
  image_id: z.string().uuid().optional(),
  verification_request: z.boolean().optional().default(false),
  honeypot: z.string().optional(),
  form_started_at: z.union([z.string(), z.number()]),
  links: z.array(LinkSchema).max(5).optional().default([]),

  // Kind-specific details
  event_details: z
    .object({
      starts_at: z.string(),
      ends_at: z.string().optional(),
      venue: z.string().min(2).max(160),
      map_link: z.string().url().optional().or(z.literal('')),
      register_link: z.string().url().optional().or(z.literal('')),
      is_free: z.boolean().optional().default(true),
    })
    .optional(),

  opportunity_details: z
    .object({
      type: z.enum(['internship', 'scholarship', 'competition', 'grant', 'job', 'other']),
      organiser: z.string().min(2).max(120),
      deadline_at: z.string().optional(),
      is_rolling: z.boolean().optional().default(false),
      eligibility: z.string().max(1000).optional(),
      apply_link: z.string().url().optional().or(z.literal('')),
    })
    .optional(),

  community_details: z
    .object({
      how_to_join: z.string().max(1000).optional(),
      who_can_join: z.string().max(1000).optional(),
      meeting_times: z.string().max(256).optional(),
      founded_year: z.number().int().min(1962).max(2030).optional(),
      size_band: z.string().max(64).optional(),
    })
    .optional(),
});

function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .substring(0, 48);
  const suffix = crypto.randomBytes(2).toString('hex');
  return `${base}-${suffix}`;
}

export const POST = createApiHandler(
  { bodySchema: SubmissionSchema },
  async ({ body, device, requestId }) => {
    // 1. Anti-bot checks (API-220, BR-012)
    if (body.honeypot && body.honeypot.trim().length > 0) {
      return createErrorResponse(ERROR_CATALOGUE.VALIDATION_FAILED, requestId);
    }

    const startedTime = new Date(body.form_started_at).getTime();
    if (isNaN(startedTime) || Date.now() - startedTime < 3000) {
      return createErrorResponse(ERROR_CATALOGUE.VALIDATION_FAILED, requestId);
    }

    // 2. Blocked Submitter check (BR-047, BR-048)
    const blockCheck = await query(
      `SELECT blocked_until FROM devices WHERE token_hash = $1 AND blocked_until > CURRENT_TIMESTAMP LIMIT 1`,
      [device.tokenHash]
    );
    if (blockCheck.rows.length > 0) {
      return createErrorResponse(ERROR_CATALOGUE.BLOCKED_REPEAT, requestId);
    }

    // 3. Daily Cap per Device (BR-011)
    const dailyCap = (await getSetting('submit.dailyCapPerDevice')) as number;
    const countRes = await query(
      `SELECT COUNT(*)::int AS count
       FROM listings l
       JOIN devices d ON l.device_id = d.id
       WHERE d.token_hash = $1 AND l.created_at >= CURRENT_DATE`,
      [device.tokenHash]
    );
    const todayCount = countRes.rows[0]?.count || 0;
    if (todayCount >= dailyCap) {
      return createErrorResponse(ERROR_CATALOGUE.RATE_LIMITED, requestId, {
        retryAfter: 86400,
      });
    }

    // 4. Prepare fields
    const trackingCode = generateTrackingCode();
    const slug = slugify(body.title);

    // 5. ACID Transaction (ARC-1100)
    let listingId: string;
    try {
      listingId = await withTransaction(async (client) => {
        // Fetch or create device
        const devRes = await client.query(
          `INSERT INTO devices (token_hash, first_seen_at, last_seen_at)
           VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
           ON CONFLICT (token_hash) DO UPDATE SET last_seen_at = CURRENT_TIMESTAMP
           RETURNING id`,
          [device.tokenHash]
        );
        const deviceId = devRes.rows[0].id;

        // Fetch primary campus
        const campusRes = await client.query(`SELECT id FROM campuses LIMIT 1`);
        if (campusRes.rows.length === 0) {
          throw new Error('No campus configured in database');
        }
        const campusId = campusRes.rows[0].id;

        // Insert into listings
        const listingInsert = await client.query(
          `INSERT INTO listings (
             campus_id, kind, slug, status, category_id, title, summary, description,
             image_id, tracking_code, device_id, contact_name, contact_channel, contact_email,
             star_count, report_count
           ) VALUES (
             $1, $2, $3, 'Pending', $4, $5, $6, $7,
             $8, $9, $10, $11, $12, $13,
             0, 0
           ) RETURNING id`,
          [
            campusId,
            body.kind,
            slug,
            body.category_id,
            body.title,
            body.summary,
            body.description,
            body.image_id || null,
            trackingCode,
            deviceId,
            body.contact_name,
            body.contact_channel,
            body.contact_email || null,
          ]
        );
        const newListingId = listingInsert.rows[0].id;

        // Insert kind meta
        if (body.kind === 'event' && body.event_details) {
          await client.query(
            `INSERT INTO event_meta (
               listing_id, starts_at, ends_at, venue, map_link, register_link, is_free
             ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              newListingId,
              body.event_details.starts_at,
              body.event_details.ends_at || null,
              body.event_details.venue,
              body.event_details.map_link || null,
              body.event_details.register_link || null,
              body.event_details.is_free,
            ]
          );
        } else if (body.kind === 'opportunity' && body.opportunity_details) {
          await client.query(
            `INSERT INTO opportunity_meta (
               listing_id, type, organiser, deadline_at, is_rolling, eligibility, apply_link
             ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              newListingId,
              body.opportunity_details.type,
              body.opportunity_details.organiser,
              body.opportunity_details.deadline_at || null,
              body.opportunity_details.is_rolling,
              body.opportunity_details.eligibility || null,
              body.opportunity_details.apply_link || null,
            ]
          );
        } else if (body.kind === 'community' && body.community_details) {
          await client.query(
            `INSERT INTO community_meta (
               listing_id, how_to_join, who_can_join, meeting_times, founded_year, size_band
             ) VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              newListingId,
              body.community_details.how_to_join || null,
              body.community_details.who_can_join || null,
              body.community_details.meeting_times || null,
              body.community_details.founded_year || null,
              body.community_details.size_band || null,
            ]
          );
        }

        // Insert links
        for (let i = 0; i < body.links.length; i++) {
          const l = body.links[i];
          await client.query(
            `INSERT INTO links (listing_id, label, url, is_official, sort)
             VALUES ($1, $2, $3, $4, $5)`,
            [newListingId, l.label, l.url, l.is_official, i + 1]
          );
        }

        // Record initial status history
        await client.query(
          `INSERT INTO status_history (
             listing_id, from_status, to_status, actor_type, note
           ) VALUES (
             $1, NULL, 'Pending', 'submitter', 'Submission created'
           )`,
          [newListingId]
        );

        return newListingId;
      });
    } catch (err: any) {
      return createErrorResponse(ERROR_CATALOGUE.VALIDATION_FAILED, requestId);
    }

    // 6. Async Transactional Email Notification (SEC-414: no actionable links)
    if (body.contact_email) {
      void sendEmail({
        to: body.contact_email,
        subject: `Campusly Submission Received: ${body.title}`,
        text: `Hello ${body.contact_name},\n\nYour submission for "${body.title}" has been received by Campusly.\nYour tracking code is: ${trackingCode}\n\nYou can track review status at any time on Campusly by entering your tracking code in the Track tab.\n\nThank you,\nCampusly Team (GDGOC ABU Zaria)`,
      });
    }

    return createSuccessResponse(
      {
        tracking_code: trackingCode,
        status: 'pending',
      },
      requestId,
      { status: 201 }
    );
  }
);
