// app/api/v1/spotlight/order/[reference]/route.ts
import { NextResponse } from 'next/server';
import { query, withTransaction } from '@/lib/db';
import { getSecurityHeaders } from '@/lib/api/security';
import { createAuditRow } from '@/lib/services/audit';

export async function GET(
  request: Request,
  routeContext: { params: Promise<{ reference: string }> | { reference: string } }
) {
  const params = await Promise.resolve(routeContext.params);
  const ref = params?.reference;
  if (!ref) {
    return NextResponse.json({ error: 'invalid_reference' }, { status: 400, headers: getSecurityHeaders() });
  }

  try {
    const res = await query(
      `SELECT s.id, s.reference, s.status, s.plan, s.business_name, s.offer, s.description,
              s.contact, s.starts_at, s.ends_at, s.created_at,
              p.amount_kobo, p.status as payment_status, p.receipt_attachment_id,
              c.name as category_name
       FROM spotlight_listings s
       LEFT JOIN spotlight_payments p ON p.spotlight_id = s.id
       LEFT JOIN categories c ON s.category_id = c.id
       WHERE s.reference = $1 OR s.id::text = $1
       LIMIT 1`,
      [ref]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'not_found' }, { status: 404, headers: getSecurityHeaders() });
    }

    const order = res.rows[0];
    const bankDetails = {
      bank_name: 'Jaiz Bank PLC / First Bank',
      account_name: 'Campusly ABU Enterprise Services',
      account_number: '0123984567',
      payment_reference: order.reference,
      amount_naira: (order.amount_kobo / 100).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }),
    };

    return NextResponse.json({ ok: true, order, bankDetails }, { status: 200, headers: getSecurityHeaders() });
  } catch (error) {
    return NextResponse.json({ error: 'server_error' }, { status: 500, headers: getSecurityHeaders() });
  }
}

export async function POST(
  request: Request,
  routeContext: { params: Promise<{ reference: string }> | { reference: string } }
) {
  const params = await Promise.resolve(routeContext.params);
  const ref = params?.reference;
  if (!ref) {
    return NextResponse.json({ error: 'invalid_reference' }, { status: 400, headers: getSecurityHeaders() });
  }

  const body = await request.json().catch(() => ({}));
  const { receipt_note, file_name } = body;

  try {
    await withTransaction(async (client) => {
      // Find listing
      const res = await client.query<{ id: string; status: string }>(
        `SELECT id, status FROM spotlight_listings WHERE reference = $1 OR id::text = $1 LIMIT 1`,
        [ref]
      );
      if (res.rows.length === 0) {
        throw new Error('order_not_found');
      }

      const listing = res.rows[0];

      // Update listing status to Receipt submitted if currently Awaiting payment
      await client.query(
        `UPDATE spotlight_listings
         SET status = 'Receipt submitted', updated_at = NOW()
         WHERE id = $1 AND status = 'Awaiting payment'`,
        [listing.id]
      );

      // Update payment record
      await client.query(
        `UPDATE spotlight_payments
         SET bank_narration = $1, updated_at = NOW()
         WHERE spotlight_id = $2`,
        [receipt_note || `Receipt uploaded: ${file_name || 'receipt.jpg'}`, listing.id]
      );

      // Audit log
      await createAuditRow(client, {
        action: 'spotlight_receipt_uploaded',
        objectType: 'spotlight_listings',
        objectId: listing.id,
        after: { reference: ref, note: receipt_note },
      });
    });

    return NextResponse.json({ ok: true, message: 'Receipt submitted for verification' }, { status: 200, headers: getSecurityHeaders() });
  } catch (error: any) {
    if (error.message === 'order_not_found') {
      return NextResponse.json({ error: 'not_found' }, { status: 404, headers: getSecurityHeaders() });
    }
    return NextResponse.json({ error: 'server_error' }, { status: 500, headers: getSecurityHeaders() });
  }
}
