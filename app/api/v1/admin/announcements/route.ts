// app/api/v1/admin/announcements/route.ts
import { NextResponse } from 'next/server';
import { query, withTransaction } from '@/lib/db';
import { enforceRoles } from '@/lib/middleware/rbac';
import { getAdminFromRequest } from '@/lib/auth/adminAuth';
import { getSecurityHeaders } from '@/lib/api/security';
import { createAuditRow } from '@/lib/services/audit';

export async function GET(request: Request) {
  const authorized = await enforceRoles(request, ['reviewer', 'lead']);
  if (!authorized) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 403, headers: getSecurityHeaders() });
  }

  try {
    const res = await query(
      `SELECT id, title, body, pinned, status, starts_at, ends_at, created_at, updated_at
       FROM announcements
       ORDER BY pinned DESC, created_at DESC`
    );

    return NextResponse.json({ ok: true, announcements: res.rows }, { status: 200, headers: getSecurityHeaders() });
  } catch (error) {
    return NextResponse.json({ error: 'server_error' }, { status: 500, headers: getSecurityHeaders() });
  }
}

export async function POST(request: Request) {
  const authorized = await enforceRoles(request, ['reviewer', 'lead']);
  if (!authorized) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 403, headers: getSecurityHeaders() });
  }

  const currentAdmin = await getAdminFromRequest(request);
  const body = await request.json().catch(() => ({}));
  const { title, body: contentBody, pinned, ends_at } = body;

  if (!title || !contentBody) {
    return NextResponse.json({ error: 'missing_fields', message: 'Title and content are required' }, { status: 400, headers: getSecurityHeaders() });
  }

  try {
    const campusRes = await query('SELECT id FROM campuses WHERE active = TRUE LIMIT 1');
    const campusId = campusRes.rows[0]?.id;

    const res = await query<{ id: string }>(
      `INSERT INTO announcements (campus_id, title, body, pinned, starts_at, ends_at, status, created_by)
       VALUES ($1, $2, $3, $4, NOW(), $5, 'published', $6)
       RETURNING id, title, pinned, starts_at, ends_at`,
      [campusId, title.trim().substring(0, 128), contentBody.trim(), !!pinned, ends_at ? new Date(ends_at) : null, currentAdmin?.id || null]
    );

    const created = res.rows[0];
    await createAuditRow(query, {
      adminId: currentAdmin?.id || null,
      action: 'announcement_create',
      objectType: 'announcements',
      objectId: created.id,
      after: { title, pinned: !!pinned },
    });

    return NextResponse.json({ ok: true, announcement: created }, { status: 201, headers: getSecurityHeaders() });
  } catch (error: any) {
    return NextResponse.json({ error: 'server_error', message: error.message }, { status: 500, headers: getSecurityHeaders() });
  }
}
