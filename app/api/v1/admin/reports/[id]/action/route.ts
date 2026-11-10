// app/api/v1/admin/reports/[id]/action/route.ts
import { NextResponse } from 'next/server';
import { withTransaction, query } from '@/lib/db';
import { enforceRoles } from '@/lib/middleware/rbac';
import { getSecurityHeaders } from '@/lib/api/security';
import { createAuditRow } from '@/lib/services/audit';

export async function POST(
  request: Request,
  routeContext: { params: Promise<{ id: string }> | { id: string } }
) {
  const authorized = await enforceRoles(request, ['reviewer', 'lead']);
  if (!authorized) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 403, headers: getSecurityHeaders() });
  }

  const params = await Promise.resolve(routeContext.params);
  const listingId = params?.id;
  if (!listingId) {
    return NextResponse.json({ error: 'invalid_id' }, { status: 400, headers: getSecurityHeaders() });
  }

  const body = await request.json().catch(() => ({}));
  const { action, note } = body;

  if (!['dismiss', 'hide', 'restore'].includes(action)) {
    return NextResponse.json({ error: 'invalid_action' }, { status: 400, headers: getSecurityHeaders() });
  }

  await withTransaction(async (client) => {
    if (action === 'dismiss') {
      // Clear reports and restore to Approved if Hidden
      await client.query(`DELETE FROM reports WHERE listing_id = $1`, [listingId]);
      await client.query(
        `UPDATE listings SET status = 'Approved', updated_at = NOW() WHERE id = $1 AND status = 'Hidden'`,
        [listingId]
      );
    } else if (action === 'hide') {
      await client.query(
        `UPDATE listings SET status = 'Hidden', updated_at = NOW() WHERE id = $1`,
        [listingId]
      );
    } else if (action === 'restore') {
      await client.query(
        `UPDATE listings SET status = 'Approved', updated_at = NOW() WHERE id = $1`,
        [listingId]
      );
    }

    await createAuditRow(client, {
      action: `report_${action}`,
      objectType: 'reports',
      objectId: listingId,
      note: typeof note === 'string' ? note : undefined,
    });
  });

  return NextResponse.json({ ok: true, action }, { status: 200, headers: getSecurityHeaders() });
}
