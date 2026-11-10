// app/api/v1/admin/audit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth/adminAuth';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await query(
      `SELECT a.id, a.action, a.object_type, a.object_id, a.before, a.after, a.ip_hash, a.at,
              adm.email as admin_email, adm.role as admin_role
       FROM audit_log a
       LEFT JOIN admins adm ON a.admin_id = adm.id
       ORDER BY a.at DESC
       LIMIT 100`
    );

    const response = NextResponse.json({
      ok: true,
      items: res.rows,
    });
    response.headers.set('Cache-Control', 'no-store');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  } catch (err) {
    return NextResponse.json({ ok: false, error: 'Failed to fetch audit log' }, { status: 500 });
  }
}
