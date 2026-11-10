// app/api/v1/admin/review/[id]/decision/route.ts
import { NextResponse } from 'next/server';
import { withTransaction, query } from '@/lib/db';
import { enforceRoles } from '@/lib/middleware/rbac';
import { getSecurityHeaders } from '@/lib/api/security';
import { createAuditRow } from '@/lib/services/audit';

/**
 * POST /api/v1/admin/review/:id/decision
 * Body: { action: 'approve'|'verify'|'needs_info'|'reject', note?: string }
 * Performs state transition on listing status.
 */
export async function POST(
  request: Request,
  routeContext: { params: Promise<{ id: string }> | { id: string } }
) {
  // RBAC check – only Reviewer, Lead can decide
  const authorized = await enforceRoles(request, ['reviewer', 'lead']);
  if (!authorized) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 403, headers: getSecurityHeaders() });
  }

  const params = await Promise.resolve(routeContext.params);
  const listingId = params?.id;
  if (!listingId) {
    return NextResponse.json({ error: 'invalid_id' }, { status: 400, headers: getSecurityHeaders() });
  }

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400, headers: getSecurityHeaders() });
  }

  const { action, note, reason } = body;
  const allowed = ['approve', 'verify', 'needs_info', 'reject', 'hide', 'restore', 'remove'];
  if (!allowed.includes(action)) {
    return NextResponse.json({ error: 'invalid_action' }, { status: 400, headers: getSecurityHeaders() });
  }

  try {
    // Load current listing
    const currentRes = await query<{ id: string; status: string; kind: string }>(
      `SELECT id, status, kind FROM listings WHERE id = $1 LIMIT 1`,
      [listingId]
    );
    if (currentRes.rows.length === 0) {
      return NextResponse.json({ error: 'not_found' }, { status: 404, headers: getSecurityHeaders() });
    }

    const current = currentRes.rows[0];

    // Map action to canonical status
    const newStatus = (() => {
      switch (action) {
        case 'approve': return 'Approved';
        case 'verify': return 'Verified';
        case 'needs_info': return 'Needs info';
        case 'reject': return 'Rejected';
        case 'hide': return 'Hidden';
        case 'restore': return 'Approved';
        case 'remove': return 'Removed';
        default: return 'Pending';
      }
    })();

    // Verified status applies ONLY to communities (BR-003)
    if (newStatus === 'Verified' && current.kind !== 'community') {
      return NextResponse.json(
        { error: 'invalid_status_transition', message: 'Verified status applies only to communities' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    await withTransaction(async (client) => {
      await client.query(
        `UPDATE listings
         SET status = $1,
             approved_at = CASE WHEN $1 IN ('Approved', 'Verified') THEN NOW() ELSE approved_at END,
             updated_at = NOW()
         WHERE id = $2`,
        [newStatus, listingId]
      );

      const combinedNote = typeof note === 'string'
        ? (reason ? `[${reason}] ${note}` : note)
        : (typeof reason === 'string' ? reason : null);

      await client.query(
        `INSERT INTO status_history (listing_id, from_status, to_status, note, actor_type)
         VALUES ($1, $2, $3, $4, 'admin')`,
        [listingId, current.status, newStatus, combinedNote]
      );

      await createAuditRow(client, {
        action: `review_${action}`,
        objectType: 'listings',
        objectId: listingId,
        before: { status: current.status },
        after: { status: newStatus },
        note: combinedNote ?? undefined,
      });
    });

    return NextResponse.json({ success: true, newStatus }, { status: 200, headers: getSecurityHeaders() });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'database_unavailable', message: err?.message || 'Database connection error' },
      { status: 503, headers: getSecurityHeaders() }
    );
  }
}
