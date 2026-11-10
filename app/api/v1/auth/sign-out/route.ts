// app/api/v1/auth/sign-out/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth/adminAuth';
import { query } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request);
    const cookieHeader = request.headers.get('cookie') || '';
    const match =
      cookieHeader.match(/(?:__Host-)?cf_admin=([^;]+)/) ||
      cookieHeader.match(/campusly_admin_session=([^;]+)/);

    if (match) {
      const rawToken = match[1];
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
      try {
        await query(`DELETE FROM admin_sessions WHERE token_hash = $1`, [tokenHash]);
      } catch {
        // Silently continue
      }
    }

    const response = NextResponse.json({ ok: true, message: 'Signed out successfully.' });

    // Clear both possible cookie names
    response.headers.append(
      'Set-Cookie',
      'cf_admin=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0;'
    );
    response.headers.append(
      'Set-Cookie',
      '__Host-cf_admin=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; Secure;'
    );
    response.headers.append(
      'Set-Cookie',
      'campusly_admin_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0;'
    );

    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');

    return response;
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Sign out failed.' }, { status: 500 });
  }
}
