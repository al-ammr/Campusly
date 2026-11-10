// middleware.ts
import { NextResponse, NextRequest } from 'next/server';
import { getSecurityHeaders } from '@/lib/api/security';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Fast bypass for Next.js internal assets, static chunks, styles and icons
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/icons') ||
    pathname === '/favicon.ico' ||
    pathname === '/sw.js'
  ) {
    return NextResponse.next();
  }

  // 1. Maintenance Mode Interceptor (BP-16)
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';
  const isExcludedFromMaintenance =
    pathname.startsWith('/maintenance') ||
    pathname.startsWith('/api/v1/auth') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/manifest.json');

  if (isMaintenanceMode && !isExcludedFromMaintenance) {
    const url = request.nextUrl.clone();
    url.pathname = '/maintenance';
    return NextResponse.rewrite(url);
  }

  // 2. Protect /dev routes in production
  if (process.env.NODE_ENV === 'production' && pathname.startsWith('/dev')) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // 2b. First-visit Landing Page interceptor for new users / new devices (before reaching Home Page)
  const isWelcomed = request.cookies.get('campusly_welcomed')?.value === '1';
  const hasSkipWelcome = request.nextUrl.searchParams.has('home') || request.nextUrl.searchParams.has('skip_welcome');

  if (pathname === '/' && !isWelcomed && !hasSkipWelcome) {
    const welcomeUrl = request.nextUrl.clone();
    welcomeUrl.pathname = '/welcome';
    return NextResponse.redirect(welcomeUrl);
  }

  // 3. Prepare response with strict security headers (D08 Section 5 / BP-16)
  const response = NextResponse.next();
  const securityHeaders = getSecurityHeaders({ isReportOnlyCsp: false });

  Object.entries(securityHeaders).forEach(([header, value]) => {
    response.headers.set(header, value);
  });

  // 4. Admin route headers (D08 SEC-112)
  if (pathname.startsWith('/admin')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
