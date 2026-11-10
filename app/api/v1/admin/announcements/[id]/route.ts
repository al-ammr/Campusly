// app/api/v1/admin/announcements/[id]/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { enforceRoles } from '@/lib/middleware/rbac';
import { getAdminFromRequest } from '@/lib/auth/adminAuth';
import { getSecurityHeaders } from '@/lib/api/security';
import { createAuditRow } from '@/lib/services/audit';

export async function PATCH(
  request: Request,
  routeContext: { params: Promise<{ id: string }> | { id: string } }
) {
  const authorized = await enforceRoles(request, ['reviewer', 'lead']);
  if (!authorized) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 403, headers: getSecurityHeaders() });
  }

  const currentAdmin = await getAdminFromRequest(request);
  const params = await Promise.resolve(routeContext.params);
  const id = params?.id;
  if (!id) {
    return NextResponse.json({ error: 'invalid_id' }, { status: 400, headers: getSecurityHeaders() });
  }

  const body = await request.json().catch(() => ({}));
  const { pinned, status, title, body: contentBody } = body;

  try {
    const cur = await query(`SELECT * FROM announcements WHERE id = $1 LIMIT 1`, [id]);
    if (cur.rows.length === 0) {
      return NextResponse.json({ error: 'not_found' }, { status: 404, headers: getSecurityHeaders() });
    }

    const prev = cur.rows[0];
    const newPinned = pinned !== undefined ? !!pinned : prev.pinned;
    const newStatus = status !== undefined ? status : prev.status;
    const newTitle = title !== undefined ? title.trim().substring(0, 128) : prev.title;
    const newBody = contentBody !== undefined ? contentBody.trim() : prev.body;

    await query(
      `UPDATE announcements
       SET pinned = $1, status = $2, title = $3, body = $4, updated_at = NOW()
       WHERE id = $5`,
      [newPinned, newStatus, newTitle, newBody, id]
    );

    await createAuditRow(query, {
      adminId: currentAdmin?.id || null,
      action: 'announcement_update',
      objectType: 'announcements',
      objectId: id,
      before: { pinned: prev.pinned, status: prev.status },
      after: { pinned: newPinned, status: newStatus },
    });

    return NextResponse.json({ ok: true, id }, { status: 200, headers: getSecurityHeaders() });
  } catch (error: any) {
    return NextResponse.json({ error: 'server_error' }, { status: 500, headers: getSecurityHeaders() });
  }
}

export async function DELETE(
  request: Request,
  routeContext: { params: Promise<{ id: string }> | { id: string } }
) {
  const authorized = await enforceRoles(request, ['lead']);
  if (!authorized) {
    return NextResponse.json({ error: 'unauthorized', message: 'Lead role required to delete announcements' }, { status: 403, headers: getSecurityHeaders() });
  }

  const currentAdmin = await getAdminFromRequest(request);
  const params = await Promise.resolve(routeContext.params);
  const id = params?.id;
  if (!id) {
    return NextResponse.json({ error: 'invalid_id' }, { status: 400, headers: getSecurityHeaders() });
  }

  try {
    await query(`DELETE FROM announcements WHERE id = $1`, [id]);
    await createAuditRow(query, {
      adminId: currentAdmin?.id || null,
      action: 'announcement_delete',
      objectType: 'announcements',
      objectId: id,
    });

    return NextResponse.json({ ok: true, id }, { status: 200, headers: getSecurityHeaders() });
  } catch (error) {
    return NextResponse.json({ error: 'server_error' }, { status: 500, headers: getSecurityHeaders() });
  }
}
