// app/api/v1/admin/review/queue/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { enforceRoles } from '@/lib/middleware/rbac';
import { getSecurityHeaders } from '@/lib/api/security';

/**
 * GET /api/v1/admin/review/queue
 * Returns a list of listings pending review.
 * Optional query param `status` = pending|needs_info|all (default pending).
 */
export async function GET(request: Request) {
  // RBAC: only Reviewer, Finance, Lead can access
  const authorized = await enforceRoles(request, ['reviewer', 'finance', 'lead']);
  if (!authorized) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 403, headers: getSecurityHeaders() });
  }

  const url = new URL(request.url);
  const statusParam = url.searchParams.get('status') ?? 'pending';

  let sql = `
    SELECT id, title, kind, status, created_at, star_count
    FROM listings
  `;
  const params: any[] = [];

  if (statusParam === 'pending') {
    sql += ` WHERE status = 'Pending'`;
  } else if (statusParam === 'needs_info') {
    sql += ` WHERE status = 'Needs info'`;
  } else if (statusParam !== 'all') {
    sql += ` WHERE status = $1`;
    params.push(statusParam);
  }

  sql += ` ORDER BY created_at DESC LIMIT 100`;

  const res = await query(sql, params);

  return NextResponse.json({ listings: res.rows }, { status: 200, headers: getSecurityHeaders() });
}
