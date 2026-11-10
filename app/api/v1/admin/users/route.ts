// app/api/v1/admin/users/route.ts
import { NextResponse } from 'next/server';
import { query, withTransaction } from '@/lib/db';
import { enforceRoles } from '@/lib/middleware/rbac';
import { getAdminFromRequest } from '@/lib/auth/adminAuth';
import { hashPassword } from '@/lib/auth/passwordHash';
import { getSecurityHeaders } from '@/lib/api/security';
import { createAuditRow } from '@/lib/services/audit';

export async function GET(request: Request) {
  const authorized = await enforceRoles(request, ['lead']);
  if (!authorized) {
    return NextResponse.json({ error: 'unauthorized', message: 'Lead role required.' }, { status: 403, headers: getSecurityHeaders() });
  }

  try {
    const res = await query(
      `SELECT id, email, role, active, last_login_at, created_at
       FROM admins
       ORDER BY created_at ASC`
    );

    return NextResponse.json({ ok: true, users: res.rows }, { status: 200, headers: getSecurityHeaders() });
  } catch (error) {
    return NextResponse.json({ error: 'server_error' }, { status: 500, headers: getSecurityHeaders() });
  }
}

export async function POST(request: Request) {
  const authorized = await enforceRoles(request, ['lead']);
  if (!authorized) {
    return NextResponse.json({ error: 'unauthorized', message: 'Lead role required.' }, { status: 403, headers: getSecurityHeaders() });
  }

  const currentAdmin = await getAdminFromRequest(request);
  const body = await request.json().catch(() => ({}));
  const { email, password, role } = body;

  if (!email || !password || !role) {
    return NextResponse.json({ error: 'missing_fields', message: 'Email, password and role are required.' }, { status: 400, headers: getSecurityHeaders() });
  }

  const validRoles = ['reviewer', 'finance', 'lead'];
  if (!validRoles.includes(role.toLowerCase())) {
    return NextResponse.json({ error: 'invalid_role', message: 'Role must be reviewer, finance, or lead.' }, { status: 400, headers: getSecurityHeaders() });
  }

  if (password.length < 12) {
    return NextResponse.json({ error: 'weak_password', message: 'Password must be at least 12 characters (SEC-102).' }, { status: 400, headers: getSecurityHeaders() });
  }

  try {
    const hashedPassword = await hashPassword(password);
    const normalizedEmail = email.toLowerCase().trim();

    let newAdminId: string;
    await withTransaction(async (client) => {
      const res = await client.query<{ id: string }>(
        `INSERT INTO admins (email, password_hash, role, active)
         VALUES ($1, $2, $3, TRUE)
         ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role, active = TRUE
         RETURNING id`,
        [normalizedEmail, hashedPassword, role.toLowerCase()]
      );
      newAdminId = res.rows[0].id;

      await createAuditRow(client, {
        adminId: currentAdmin?.id || null,
        action: 'admin_create',
        objectType: 'admins',
        objectId: newAdminId,
        after: { email: normalizedEmail, role },
      });
    });

    return NextResponse.json({ ok: true, email: normalizedEmail, role }, { status: 201, headers: getSecurityHeaders() });
  } catch (error: any) {
    return NextResponse.json({ error: 'server_error', message: error.message }, { status: 500, headers: getSecurityHeaders() });
  }
}
