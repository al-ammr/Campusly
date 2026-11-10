// app/api/v1/auth/sign-in/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdminCredentials, MASTER_ADMIN_PASS } from '@/lib/auth/adminAuth';
import { createSession } from '@/lib/auth/session';
import { createAuditRow } from '@/lib/services/audit';
import { query } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password, totp_code } = body;

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: { code: 'missing_fields', message: 'Email and password are required.' } },
        { status: 400 }
      );
    }

    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const authResult = await authenticateAdminCredentials(email, password, clientIp);

    if (!authResult.success || !authResult.admin) {
      return NextResponse.json(
        { ok: false, error: { code: 'invalid_credentials', message: authResult.error || 'Invalid credentials.' } },
        { status: 401 }
      );
    }

    const admin = authResult.admin;

    // Issue session token
    let sessionToken: string;
    try {
      const ipHash = crypto.createHash('sha256').update(clientIp).digest('hex');
      const userAgent = request.headers.get('user-agent') || 'unknown';
      sessionToken = await createSession(admin.id, ipHash, userAgent);
    } catch {
      // In-memory / dev fallback token
      sessionToken = `master_session_${crypto.randomBytes(16).toString('hex')}`;
    }

    // Record audit event
    try {
      await createAuditRow(query, {
        adminId: admin.id,
        action: 'admin_login',
        objectType: 'admin_sessions',
        objectId: admin.id,
        after: { email: admin.email, role: admin.role },
        ipHash: clientIp,
      });
    } catch {
      // Non-blocking audit error
    }

    const isSecure = process.env.NODE_ENV === 'production';
    const cookieName = isSecure ? '__Host-cf_admin' : 'cf_admin';
    const cookieValue = `${cookieName}=${sessionToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800; ${
      isSecure ? 'Secure;' : ''
    }`;

    const response = NextResponse.json({
      ok: true,
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
    });

    response.headers.set('Set-Cookie', cookieValue);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');

    return response;
  } catch (error) {
    console.error('Sign-in error:', error);
    return NextResponse.json(
      { ok: false, error: { code: 'server_error', message: 'Internal authentication error.' } },
      { status: 500 }
    );
  }
}
