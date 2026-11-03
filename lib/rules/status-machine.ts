import { withTransaction } from '@/lib/db';

export type ListingStatus =
  | 'Pending'
  | 'Approved'
  | 'Verified'
  | 'Needs info'
  | 'Rejected'
  | 'Hidden'
  | 'Removed';

export type SpotlightStatus =
  | 'Awaiting payment'
  | 'Receipt submitted'
  | 'Active'
  | 'Paused'
  | 'Expired'
  | 'Cancelled'
  | 'Rejected';

export type ActorRole = 'reviewer' | 'finance' | 'lead' | 'submitter' | 'system';

export interface TransitionListingParams {
  listingId: string;
  toStatus: ListingStatus;
  actorRole: ActorRole;
  actorId?: string;
  reasonCode?: string;
  note?: string;
  ipHash?: string;
}

export interface TransitionSpotlightParams {
  spotlightId: string;
  toStatus: SpotlightStatus;
  actorRole: ActorRole;
  actorId?: string;
  reasonCode?: string;
  note?: string;
  bankReference?: string;
  ipHash?: string;
}

export interface TransitionResult<T> {
  id: string;
  previousStatus: T;
  newStatus: T;
  updatedAt: Date;
}

/**
 * Validates allowed moves in the Listing state machine (D07 BR-001 to BR-008, D05 Section 7).
 */
export function validateListingMove(
  fromStatus: ListingStatus,
  toStatus: ListingStatus,
  kind: string,
  actorRole: ActorRole,
  reasonCode?: string
): void {
  if (fromStatus === toStatus) {
    throw new Error(`[Status Error] Listing is already in status '${toStatus}'.`);
  }

  // BR-007: Removed is permanent
  if (fromStatus === 'Removed') {
    throw new Error("[Status Error] A 'Removed' listing cannot be transitioned to any other status.");
  }

  // Move to Removed is allowed from any status except Removed, but requires Admin and Reason
  if (toStatus === 'Removed') {
    if (!['reviewer', 'finance', 'lead'].includes(actorRole)) {
      throw new Error("[Status Error] Only admins may transition a listing to 'Removed'.");
    }
    if (!reasonCode) {
      throw new Error("[Status Error] A reason is required to remove a listing.");
    }
    return;
  }

  // Move to Verified applies ONLY to communities (BR-003, BR-030)
  if (toStatus === 'Verified') {
    if (kind !== 'community') {
      throw new Error("[Status Error] Only communities can be granted 'Verified' status.");
    }
    if (!['reviewer', 'finance', 'lead'].includes(actorRole)) {
      throw new Error("[Status Error] Only admins may grant 'Verified' status.");
    }
  }

  switch (fromStatus) {
    case 'Pending':
      if (toStatus === 'Approved') {
        if (!['reviewer', 'finance', 'lead'].includes(actorRole)) {
          throw new Error("[Status Error] Only admins may approve listings.");
        }
      } else if (toStatus === 'Needs info') {
        if (!['reviewer', 'finance', 'lead'].includes(actorRole)) {
          throw new Error("[Status Error] Only admins may request more information.");
        }
        if (!reasonCode) {
          throw new Error("[Status Error] A written question/reason is required for 'Needs info'.");
        }
      } else if (toStatus === 'Rejected') {
        if (!['reviewer', 'finance', 'lead'].includes(actorRole)) {
          throw new Error("[Status Error] Only admins may reject listings.");
        }
        if (!reasonCode) {
          throw new Error("[Status Error] A reason is required to reject a submission.");
        }
      } else {
        throw new Error(`[Status Error] Illegal transition from 'Pending' to '${toStatus}'.`);
      }
      break;

    case 'Needs info':
      if (toStatus === 'Pending') {
        // Submitter replied within window or system reset
        if (!['submitter', 'system', 'lead'].includes(actorRole)) {
          throw new Error("[Status Error] Only submitter reply or system may return Needs info to Pending.");
        }
      } else if (toStatus === 'Rejected') {
        // Window expired (system) or admin closed
        if (!reasonCode) {
          throw new Error("[Status Error] A reason is required to reject from Needs info.");
        }
      } else {
        throw new Error(`[Status Error] Illegal transition from 'Needs info' to '${toStatus}'.`);
      }
      break;

    case 'Approved':
      if (toStatus === 'Verified') {
        // Handled above
      } else if (toStatus === 'Hidden') {
        if (!['reviewer', 'finance', 'lead'].includes(actorRole)) {
          throw new Error("[Status Error] Only admins may hide a listing.");
        }
        if (!reasonCode) {
          throw new Error("[Status Error] A reason is required to hide a listing.");
        }
      } else {
        throw new Error(`[Status Error] Illegal transition from 'Approved' to '${toStatus}'.`);
      }
      break;

    case 'Verified':
      if (toStatus === 'Approved') {
        // Badge removed under BR-034
        if (!['reviewer', 'finance', 'lead', 'system'].includes(actorRole)) {
          throw new Error("[Status Error] Only admins or system may remove Verified badge.");
        }
      } else if (toStatus === 'Hidden') {
        if (!reasonCode) {
          throw new Error("[Status Error] A reason is required to hide a Verified listing.");
        }
      } else {
        throw new Error(`[Status Error] Illegal transition from 'Verified' to '${toStatus}'.`);
      }
      break;

    case 'Hidden':
      if (toStatus !== 'Approved' && toStatus !== 'Verified') {
        throw new Error(`[Status Error] A hidden listing can only be restored to 'Approved' or 'Verified', not '${toStatus}'.`);
      }
      break;

    case 'Rejected':
      throw new Error("[Status Error] A rejected listing is final and cannot be reopened (BR-004).");

    default:
      throw new Error(`[Status Error] Unknown status '${fromStatus}'.`);
  }
}

/**
 * Validates allowed moves in the Spotlight lifecycle (D07 BR-120 to BR-130).
 */
export function validateSpotlightMove(
  fromStatus: SpotlightStatus,
  toStatus: SpotlightStatus,
  actorRole: ActorRole,
  hasConfirmedPayment: boolean,
  reasonCode?: string
): void {
  if (fromStatus === toStatus) {
    throw new Error(`[Spotlight Status Error] Listing is already in status '${toStatus}'.`);
  }

  // Expired, Cancelled, and Rejected listings cannot be reactivated (BR-129)
  if (['Expired', 'Cancelled', 'Rejected'].includes(fromStatus)) {
    throw new Error(`[Spotlight Status Error] A '${fromStatus}' listing cannot be reactivated. Sellers must renew with a new reference (BR-129).`);
  }

  switch (fromStatus) {
    case 'Awaiting payment':
      if (toStatus === 'Receipt submitted') {
        // Submitter uploaded receipt
      } else if (toStatus === 'Cancelled') {
        // 7-day unpaid hold passed
      } else {
        throw new Error(`[Spotlight Status Error] Cannot transition from 'Awaiting payment' to '${toStatus}'.`);
      }
      break;

    case 'Receipt submitted':
      if (toStatus === 'Active') {
        // Must be Finance or Lead (BR-141, ARC-703)
        if (!['finance', 'lead'].includes(actorRole)) {
          throw new Error("[Spotlight Status Error] Only Finance or Lead roles may activate a Spotlight listing.");
        }
        if (!hasConfirmedPayment) {
          throw new Error("[Spotlight Status Error] Listing cannot be Active without Confirmed in Bank ticked (BR-141).");
        }
      } else if (toStatus === 'Awaiting payment') {
        // Fix requested
        if (!reasonCode) {
          throw new Error("[Spotlight Status Error] A fix reason is required to return to 'Awaiting payment'.");
        }
      } else if (toStatus === 'Rejected') {
        if (!reasonCode) {
          throw new Error("[Spotlight Status Error] A rejection reason is required.");
        }
      } else {
        throw new Error(`[Spotlight Status Error] Cannot transition from 'Receipt submitted' to '${toStatus}'.`);
      }
      break;

    case 'Active':
      if (toStatus === 'Expired') {
        // Period elapsed
      } else if (toStatus === 'Paused') {
        if (!['reviewer', 'finance', 'lead'].includes(actorRole)) {
          throw new Error("[Spotlight Status Error] Only admins may pause an Active listing.");
        }
        if (!reasonCode) {
          throw new Error("[Spotlight Status Error] A reason is required to pause a listing.");
        }
      } else {
        throw new Error(`[Spotlight Status Error] Cannot transition from 'Active' to '${toStatus}'.`);
      }
      break;

    case 'Paused':
      if (toStatus === 'Active') {
        // Admin resumed
        if (!['reviewer', 'finance', 'lead'].includes(actorRole)) {
          throw new Error("[Spotlight Status Error] Only admins may resume a paused listing.");
        }
      } else if (toStatus === 'Expired') {
        // Period elapsed unfrozen
      } else if (toStatus === 'Rejected') {
        if (!reasonCode) {
          throw new Error("[Spotlight Status Error] A reason is required to reject a paused listing.");
        }
      } else {
        throw new Error(`[Spotlight Status Error] Cannot transition from 'Paused' to '${toStatus}'.`);
      }
      break;
  }
}

/**
 * The single authoritative status function for standard listings (ARC-701, D07).
 */
export async function transitionListingStatus(
  params: TransitionListingParams
): Promise<TransitionResult<ListingStatus>> {
  return await withTransaction(async (client) => {
    // 1. Fetch current status and kind with row lock
    const currentRes = await client.query<{ status: ListingStatus; kind: string }>(
      'SELECT status, kind FROM listings WHERE id = $1 FOR UPDATE',
      [params.listingId]
    );

    if (currentRes.rows.length === 0) {
      throw new Error(`[Status Error] Listing '${params.listingId}' not found.`);
    }

    const { status: fromStatus, kind } = currentRes.rows[0];

    // 2. Validate transition rules
    validateListingMove(
      fromStatus,
      params.toStatus,
      kind,
      params.actorRole,
      params.reasonCode
    );

    const now = new Date();

    // 3. Update listing record
    await client.query(
      `UPDATE listings
       SET status = $1,
           approved_at = CASE WHEN $1 IN ('Approved', 'Verified') AND approved_at IS NULL THEN $2 ELSE approved_at END,
           hidden_reason = CASE WHEN $1 = 'Hidden' THEN $3 ELSE hidden_reason END,
           updated_at = $2
       WHERE id = $4`,
      [params.toStatus, now, params.reasonCode || null, params.listingId]
    );

    // 4. Append to status_history
    await client.query(
      `INSERT INTO status_history (listing_id, from_status, to_status, reason_code, note, actor_type, actor_id, at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        params.listingId,
        fromStatus,
        params.toStatus,
        params.reasonCode || null,
        params.note || null,
        params.actorRole,
        params.actorId || null,
        now,
      ]
    );

    // 5. Append to audit_log
    await client.query(
      `INSERT INTO audit_log (admin_id, action, object_type, object_id, before, after, ip_hash, at)
       VALUES ($1, $2, 'listing', $3, $4, $5, $6, $7)`,
      [
        params.actorId || null,
        `LISTING_STATUS_${params.toStatus.toUpperCase()}`,
        params.listingId,
        JSON.stringify({ status: fromStatus }),
        JSON.stringify({ status: params.toStatus, reason: params.reasonCode, note: params.note }),
        params.ipHash || 'system',
        now,
      ]
    );

    return {
      id: params.listingId,
      previousStatus: fromStatus,
      newStatus: params.toStatus,
      updatedAt: now,
    };
  });
}

/**
 * The single authoritative status function for Spotlight listings (ARC-701, D07).
 */
export async function transitionSpotlightStatus(
  params: TransitionSpotlightParams
): Promise<TransitionResult<SpotlightStatus>> {
  return await withTransaction(async (client) => {
    // 1. Fetch current status with row lock
    const currentRes = await client.query<{ status: SpotlightStatus }>(
      'SELECT status FROM spotlight_listings WHERE id = $1 FOR UPDATE',
      [params.spotlightId]
    );

    if (currentRes.rows.length === 0) {
      throw new Error(`[Spotlight Error] Spotlight listing '${params.spotlightId}' not found.`);
    }

    const fromStatus = currentRes.rows[0].status;

    // Check payment confirmation status
    const paymentRes = await client.query<{ confirmed: boolean }>(
      `SELECT EXISTS (
         SELECT 1 FROM spotlight_payments
         WHERE spotlight_id = $1 AND confirmed_in_bank = TRUE AND status = 'confirmed'
       ) AS confirmed`,
      [params.spotlightId]
    );
    const hasConfirmedPayment = Boolean(paymentRes.rows[0]?.confirmed);

    // 2. Validate transition rules
    validateSpotlightMove(
      fromStatus,
      params.toStatus,
      params.actorRole,
      hasConfirmedPayment,
      params.reasonCode
    );

    const now = new Date();

    // 3. Update spotlight listing record
    await client.query(
      `UPDATE spotlight_listings
       SET status = $1,
           starts_at = CASE WHEN $1 = 'Active' AND starts_at IS NULL THEN $2 ELSE starts_at END,
           paused_at = CASE WHEN $1 = 'Paused' THEN $2 ELSE NULL END,
           updated_at = $2
       WHERE id = $3`,
      [params.toStatus, now, params.spotlightId]
    );

    // 4. Append to audit_log
    await client.query(
      `INSERT INTO audit_log (admin_id, action, object_type, object_id, before, after, ip_hash, at)
       VALUES ($1, $2, 'spotlight_listing', $3, $4, $5, $6, $7)`,
      [
        params.actorId || null,
        `SPOTLIGHT_STATUS_${params.toStatus.toUpperCase().replace(/\s+/g, '_')}`,
        params.spotlightId,
        JSON.stringify({ status: fromStatus }),
        JSON.stringify({ status: params.toStatus, reason: params.reasonCode, note: params.note }),
        params.ipHash || 'system',
        now,
      ]
    );

    return {
      id: params.spotlightId,
      previousStatus: fromStatus,
      newStatus: params.toStatus,
      updatedAt: now,
    };
  });
}
