// app/api/v1/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth/adminAuth';

export async function GET(request: NextRequest) {
  const admin = await getAdminFromRequest(request);

  if (!admin) {
    const res = NextResponse.json({ authenticated: false, admin: null }, { status: 401 });
    res.headers.set('Cache-Control', 'no-store');
    res.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return res;
  }

  const res = NextResponse.json({
    authenticated: true,
    admin: {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    },
  });
  res.headers.set('Cache-Control', 'no-store');
  res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return res;
}
