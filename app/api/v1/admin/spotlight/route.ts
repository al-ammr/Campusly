// app/api/v1/admin/spotlight/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { enforceRoles } from '@/lib/middleware/rbac';
import { getSecurityHeaders } from '@/lib/api/security';

export async function GET(request: Request) {
  const authorized = await enforceRoles(request, ['finance', 'lead']);
  if (!authorized) {
    return NextResponse.json({ error: 'unauthorized', message: 'Finance or Lead role required' }, { status: 403, headers: getSecurityHeaders() });
  }

  const url = new URL(request.url);
  const isExport = url.searchParams.get('export') === 'csv';

  try {
    const res = await query(
      `SELECT s.id, s.reference, s.status as listing_status, s.plan, s.business_name,
              s.offer, s.contact, s.starts_at, s.ends_at, s.created_at,
              p.id as payment_id, p.status as payment_status, p.amount_kobo,
              p.amount_received_kobo, p.bank_reference, p.bank_sender_name,
              p.confirmed_in_bank, p.confirmed_at, p.admin_note,
              c.name as category_name
       FROM spotlight_listings s
       LEFT JOIN spotlight_payments p ON p.spotlight_id = s.id
       LEFT JOIN categories c ON s.category_id = c.id
       ORDER BY s.created_at DESC
       LIMIT 200`
    );

    if (isExport) {
      // Generate CSV Export for reconciliation (D07 BR-160 / API-429)
      const rows = res.rows;
      const headers = ['Reference', 'Business Name', 'Plan', 'Listing Status', 'Payment Status', 'Amount (NGN)', 'Confirmed In Bank', 'Bank Reference', 'Created At'];
      const csvLines = [headers.join(',')];

      for (const r of rows) {
        csvLines.push(
          [
            `"${r.reference}"`,
            `"${r.business_name.replace(/"/g, '""')}"`,
            `"${r.plan}"`,
            `"${r.listing_status}"`,
            `"${r.payment_status || 'pending'}"`,
            (r.amount_kobo / 100).toFixed(2),
            r.confirmed_in_bank ? 'YES' : 'NO',
            `"${r.bank_reference || ''}"`,
            `"${new Date(r.created_at).toISOString()}"`,
          ].join(',')
        );
      }

      const csvContent = csvLines.join('\n');
      return new Response(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="spotlight-reconciliation-${new Date().toISOString().slice(0, 10)}.csv"`,
          ...getSecurityHeaders(),
        },
      });
    }

    return NextResponse.json({ ok: true, orders: res.rows }, { status: 200, headers: getSecurityHeaders() });
  } catch (error) {
    return NextResponse.json({ error: 'server_error' }, { status: 500, headers: getSecurityHeaders() });
  }
}
