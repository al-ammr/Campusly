// lib/jobs/index.ts
import { query, withTransaction } from '@/lib/db';
import crypto from 'crypto';

export interface JobExecutionResult {
  ok: boolean;
  job: string;
  result?: any;
  error?: string;
}

/**
 * Execute a background scheduled job with immutable logging into `job_runs` (D05 ARC-1101 / D06 API-510..518).
 */
export async function executeScheduledJob(
  jobName: string,
  runnerFn: () => Promise<any>
): Promise<JobExecutionResult> {
  const startedAt = new Date();
  let runId: string | null = null;

  try {
    const startRes = await query<{ id: string }>(
      `INSERT INTO job_runs (job, started_at) VALUES ($1, $2) RETURNING id`,
      [jobName.substring(0, 64), startedAt]
    );
    runId = startRes.rows[0]?.id;
  } catch {
    // DB logging fallback
  }

  try {
    const outcome = await runnerFn();
    const finishedAt = new Date();

    if (runId) {
      await query(
        `UPDATE job_runs
         SET finished_at = $1, result = $2
         WHERE id = $3`,
        [finishedAt, JSON.stringify(outcome ?? { success: true }), runId]
      );
    }

    return { ok: true, job: jobName, result: outcome };
  } catch (error: any) {
    const finishedAt = new Date();
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (runId) {
      await query(
        `UPDATE job_runs
         SET finished_at = $1, error = $2
         WHERE id = $3`,
        [finishedAt, errorMessage, runId]
      );
    }

    return { ok: false, job: jobName, error: errorMessage };
  }
}

// 1. Expire Spotlight (API-510)
export async function expireSpotlight(): Promise<{ expiredCount: number }> {
  const res = await query(
    `UPDATE spotlight_listings
     SET status = 'Expired', updated_at = NOW()
     WHERE status = 'Active' AND ends_at IS NOT NULL AND ends_at <= NOW()
     RETURNING id`
  );
  return { expiredCount: res.rowCount ?? 0 };
}

// 2. Rotate Featured (API-511)
export async function rotateFeatured(): Promise<{ rotatedCount: number }> {
  // Reassign slot numbers 1..6 for active featured listings
  const res = await query(
    `WITH ordered AS (
       SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) as new_slot
       FROM spotlight_listings
       WHERE status = 'Active' AND plan = 'featured'
       LIMIT 6
     )
     UPDATE spotlight_listings s
     SET slot_number = o.new_slot, updated_at = NOW()
     FROM ordered o
     WHERE s.id = o.id
     RETURNING s.id`
  );
  return { rotatedCount: res.rowCount ?? 0 };
}

// 3. Close Opportunities (API-512)
export async function closeOpportunities(): Promise<{ closedCount: number }> {
  const res = await query(
    `UPDATE listings l
     SET status = 'Hidden', updated_at = NOW()
     FROM opportunity_meta om
     WHERE l.id = om.listing_id
       AND l.kind = 'opportunity'
       AND l.status = 'Approved'
       AND om.deadline IS NOT NULL
       AND om.deadline <= NOW()
     RETURNING l.id`
  );
  return { closedCount: res.rowCount ?? 0 };
}

// 4. Stale Submissions (API-513)
export async function staleSubmissions(): Promise<{ archivedCount: number }> {
  const res = await query(
    `UPDATE listings
     SET status = 'Rejected', updated_at = NOW()
     WHERE status = 'Needs info' AND updated_at < NOW() - INTERVAL '14 days'
     RETURNING id`
  );
  return { archivedCount: res.rowCount ?? 0 };
}

// 5. Unpaid Holds (API-514)
export async function unpaidHolds(): Promise<{ cancelledCount: number }> {
  const res = await query(
    `UPDATE spotlight_listings
     SET status = 'Cancelled', updated_at = NOW()
     WHERE status = 'Awaiting payment' AND created_at < NOW() - INTERVAL '48 hours'
     RETURNING id`
  );
  return { cancelledCount: res.rowCount ?? 0 };
}

// 6. Verification Review (API-515)
export async function verificationReview(): Promise<{ flaggedCount: number }> {
  // Find communities verified over 1 year ago
  const res = await query(
    `SELECT l.id, l.title, l.approved_at
     FROM listings l
     WHERE l.kind = 'community' AND l.status = 'Verified'
       AND l.approved_at IS NOT NULL
       AND l.approved_at < NOW() - INTERVAL '365 days'`
  );
  return { flaggedCount: res.rowCount ?? 0 };
}

// 7. Retention (API-516)
export async function retentionPurge(): Promise<{ purgedDevices: number }> {
  // Purge devices unseen for more than 12 months (D07 / SEC-543)
  const res = await query(
    `DELETE FROM devices
     WHERE last_seen_at < NOW() - INTERVAL '365 days'
     RETURNING id`
  );
  return { purgedDevices: res.rowCount ?? 0 };
}

// 8. Recount (API-517)
export async function recountStars(): Promise<{ recountedListings: number }> {
  const res = await query(
    `WITH counts AS (
       SELECT listing_id, COUNT(id)::int as actual_stars
       FROM stars
       GROUP BY listing_id
     )
     UPDATE listings l
     SET star_count = COALESCE(c.actual_stars, 0), updated_at = NOW()
     FROM counts c
     WHERE l.id = c.listing_id AND l.star_count != c.actual_stars
     RETURNING l.id`
  );
  return { recountedListings: res.rowCount ?? 0 };
}

// 9. Reconciliation Report (API-518)
export async function reconciliationReport(): Promise<{
  activeSpotlights: number;
  confirmedRevenueKobo: number;
  pendingReceipts: number;
}> {
  const revRes = await query<{ sum: string }>(
    `SELECT COALESCE(SUM(amount_kobo), 0)::text as sum FROM spotlight_payments WHERE confirmed_in_bank = TRUE`
  );
  const activeRes = await query<{ count: string }>(
    `SELECT COUNT(id)::text as count FROM spotlight_listings WHERE status = 'Active'`
  );
  const pendingRes = await query<{ count: string }>(
    `SELECT COUNT(id)::text as count FROM spotlight_listings WHERE status = 'Receipt submitted'`
  );

  return {
    activeSpotlights: parseInt(activeRes.rows[0]?.count || '0', 10),
    confirmedRevenueKobo: parseInt(revRes.rows[0]?.sum || '0', 10),
    pendingReceipts: parseInt(pendingRes.rows[0]?.count || '0', 10),
  };
}
