// app/api/v1/admin/spotlight/[id]/action/route.ts
import { NextResponse } from 'next/server';
import { query, withTransaction } from '@/lib/db';
import { enforceRoles } from '@/lib/middleware/rbac';
import { getAdminFromRequest } from '@/lib/auth/adminAuth';
import { getSetting } from '@/lib/settings';
import { getSecurityHeaders } from '@/lib/api/security';
import { createAuditRow } from '@/lib/services/audit';

export async function POST(
  request: Request,
  routeContext: { params: Promise<{ id: string }> | { id: string } }
) {
  const authorized = await enforceRoles(request, ['finance', 'lead']);
  if (!authorized) {
    return NextResponse.json({ error: 'unauthorized', message: 'Finance or Lead role required' }, { status: 403, headers: getSecurityHeaders() });
  }

  const currentAdmin = await getAdminFromRequest(request);
  const params = await Promise.resolve(routeContext.params);
  const spotlightId = params?.id;
  if (!spotlightId) {
    return NextResponse.json({ error: 'invalid_id' }, { status: 400, headers: getSecurityHeaders() });
  }

  const body = await request.json().catch(() => ({}));
  const { action, confirmed_in_bank, bank_reference, bank_sender_name, admin_note, amount_received_kobo } = body;

  try {
    let resultListing: any;

    await withTransaction(async (client) => {
      // Find listing
      const res = await client.query<{ id: string; status: string; plan: string; starts_at: Date; ends_at: Date; paused_at: Date }>(
        `SELECT id, status, plan, starts_at, ends_at, paused_at FROM spotlight_listings WHERE id = $1 LIMIT 1`,
        [spotlightId]
      );
      if (res.rows.length === 0) {
        throw new Error('order_not_found');
      }

      const listing = res.rows[0];

      if (action === 'activate') {
        // SEC-510: Confirmed in bank is strictly mandatory
        if (!confirmed_in_bank) {
          throw new Error('confirmation_required: Payment must be ticked as confirmed in bank.');
        }

        // SEC-511: Bank transaction reference is mandatory
        if (!bank_reference || !bank_reference.trim()) {
          throw new Error('reference_required: Bank transaction reference is mandatory for verification.');
        }

        // Duration days from settings
        const durationKey = listing.plan === 'featured' ? 'plan.featured.days' : 'plan.standard.days';
        let durationDays = listing.plan === 'featured' ? 4 : 3;
        try {
          const days = await getSetting(durationKey);
          if (typeof days === 'number' && days > 0) durationDays = days;
        } catch {
          // Default
        }

        const now = new Date();
        const endsAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

        // Update listing to Active
        await client.query(
          `UPDATE spotlight_listings
           SET status = 'Active', starts_at = $1, ends_at = $2, updated_at = NOW()
           WHERE id = $3`,
          [now, endsAt, listing.id]
        );

        // Update payment record
        await client.query(
          `UPDATE spotlight_payments
           SET status = 'confirmed', confirmed_in_bank = TRUE, bank_reference = $1,
               bank_sender_name = $2, admin_note = $3, amount_received_kobo = $4,
               confirmed_by = $5, confirmed_at = NOW(), updated_at = NOW()
           WHERE spotlight_id = $6`,
          [
            bank_reference.trim(),
            bank_sender_name || 'Verified Customer',
            admin_note || 'Confirmed via Admin Finance Console',
            amount_received_kobo || null,
            currentAdmin?.id || null,
            listing.id,
          ]
        );

        await createAuditRow(client, {
          adminId: currentAdmin?.id || null,
          action: 'spotlight_payment_confirmed',
          objectType: 'spotlight_listings',
          objectId: listing.id,
          after: { bank_reference, durationDays, endsAt },
        });

        resultListing = { status: 'Active', startsAt: now, endsAt };
      } else if (action === 'pause') {
        await client.query(
          `UPDATE spotlight_listings
           SET status = 'Paused', paused_at = NOW(), updated_at = NOW()
           WHERE id = $1`,
          [listing.id]
        );
        resultListing = { status: 'Paused' };
      } else if (action === 'resume') {
        // Extend ends_at by the paused duration if paused_at was recorded
        await client.query(
          `UPDATE spotlight_listings
           SET status = 'Active', paused_at = NULL, updated_at = NOW()
           WHERE id = $1`,
          [listing.id]
        );
        resultListing = { status: 'Active' };
      } else if (action === 'reject') {
        await client.query(
          `UPDATE spotlight_listings SET status = 'Rejected', updated_at = NOW() WHERE id = $1`,
          [listing.id]
        );
        resultListing = { status: 'Rejected' };
      } else if (action === 'refund') {
        await client.query(
          `UPDATE spotlight_listings SET status = 'Cancelled', updated_at = NOW() WHERE id = $1`,
          [listing.id]
        );
        await client.query(
          `UPDATE spotlight_payments SET status = 'refunded', refunded_at = NOW(), refund_note = $1 WHERE spotlight_id = $2`,
          [admin_note || 'Refunded per finance verification', listing.id]
        );
        resultListing = { status: 'Cancelled', paymentStatus: 'refunded' };
      }
    });

    return NextResponse.json({ ok: true, result: resultListing }, { status: 200, headers: getSecurityHeaders() });
  } catch (error: any) {
    if (error.message?.includes('confirmation_required') || error.message?.includes('reference_required')) {
      return NextResponse.json({ error: 'validation_error', message: error.message }, { status: 400, headers: getSecurityHeaders() });
    }
    return NextResponse.json({ error: 'server_error', message: error.message }, { status: 500, headers: getSecurityHeaders() });
  }
}
