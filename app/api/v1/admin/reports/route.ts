// app/api/v1/admin/reports/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { enforceRoles } from '@/lib/middleware/rbac';
import { getSecurityHeaders } from '@/lib/api/security';

export async function GET(request: Request) {
  const authorized = await enforceRoles(request, ['reviewer', 'lead']);
  if (!authorized) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 403, headers: getSecurityHeaders() });
  }

  try {
    const res = await query(
      `SELECT l.id, l.title, l.kind, l.status, l.created_at,
              COUNT(r.id)::int as total_reports,
              COUNT(DISTINCT r.device_id)::int as distinct_device_reports,
              ARRAY_AGG(DISTINCT r.reason) as reasons,
              MAX(r.created_at) as latest_report_at
       FROM reports r
       JOIN listings l ON r.listing_id = l.id
       GROUP BY l.id, l.title, l.kind, l.status, l.created_at
       ORDER BY distinct_device_reports DESC, latest_report_at DESC
       LIMIT 100`
    );

    return NextResponse.json({ ok: true, items: res.rows }, { status: 200, headers: getSecurityHeaders() });
  } catch (error) {
    return NextResponse.json({ error: 'server_error' }, { status: 500, headers: getSecurityHeaders() });
  }
}
