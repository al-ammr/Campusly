// app/api/v1/admin/settings/route.ts
import { NextResponse } from 'next/server';
import { query, withTransaction } from '@/lib/db';
import { enforceRoles } from '@/lib/middleware/rbac';
import { getAdminFromRequest } from '@/lib/auth/adminAuth';
import { getSecurityHeaders } from '@/lib/api/security';
import { createAuditRow } from '@/lib/services/audit';

export async function GET(request: Request) {
  const authorized = await enforceRoles(request, ['lead']);
  if (!authorized) {
    return NextResponse.json({ error: 'unauthorized', message: 'Lead role required.' }, { status: 403, headers: getSecurityHeaders() });
  }

  try {
    const res = await query(
      `SELECT key, value, type, description, updated_at
       FROM settings
       ORDER BY key ASC`
    );

    return NextResponse.json({ ok: true, settings: res.rows }, { status: 200, headers: getSecurityHeaders() });
  } catch (error) {
    return NextResponse.json({ error: 'server_error' }, { status: 500, headers: getSecurityHeaders() });
  }
}

export async function PATCH(request: Request) {
  const authorized = await enforceRoles(request, ['lead']);
  if (!authorized) {
    return NextResponse.json({ error: 'unauthorized', message: 'Lead role required.' }, { status: 403, headers: getSecurityHeaders() });
  }

  const admin = await getAdminFromRequest(request);
  const body = await request.json().catch(() => ({}));
  const { key, value, note } = body;

  if (!key || value === undefined) {
    return NextResponse.json({ error: 'invalid_payload', message: 'Key and value are required.' }, { status: 400, headers: getSecurityHeaders() });
  }

  try {
    await withTransaction(async (client) => {
      // 1. Get current setting
      const cur = await client.query(`SELECT value, type FROM settings WHERE key = $1 LIMIT 1`, [key]);
      if (cur.rows.length === 0) {
        throw new Error('setting_not_found');
      }

      const oldValue = cur.rows[0].value;

      // 2. Update setting
      await client.query(
        `UPDATE settings
         SET value = $1, updated_by = $2, updated_at = NOW()
         WHERE key = $3`,
        [JSON.stringify(value), admin?.id || null, key]
      );

      // 3. Write settings history
      await client.query(
        `INSERT INTO settings_history (key, old_value, new_value, changed_by, at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [key, JSON.stringify(oldValue), JSON.stringify(value), admin?.id || null]
      );

      // 4. Write immutable audit row
      await createAuditRow(client, {
        adminId: admin?.id || null,
        action: 'setting_update',
        objectType: 'settings',
        objectId: key,
        before: { key, value: oldValue },
        after: { key, value },
        note: typeof note === 'string' ? note : 'Updated via Admin Settings Console',
      });
    });

    return NextResponse.json({ ok: true, key, value }, { status: 200, headers: getSecurityHeaders() });
  } catch (error: any) {
    if (error.message === 'setting_not_found') {
      return NextResponse.json({ error: 'not_found' }, { status: 404, headers: getSecurityHeaders() });
    }
    return NextResponse.json({ error: 'server_error' }, { status: 500, headers: getSecurityHeaders() });
  }
}
