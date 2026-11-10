// lib/middleware/cronAuth.ts
import { NextResponse } from 'next/server';
import { getSecurityHeaders } from '@/lib/api/security';
import crypto from 'crypto';

/**
 * Verify that the request contains a valid `Authorization: Bearer <JOB_SECRET>` header.
 * Uses constant-time comparison to mitigate timing attacks (SEC-101 / D06 API-510..519).
 */
export function verifyCronAuth(request: Request): boolean {
  const authHeader = request.headers.get('authorization') ?? '';
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) return false;
  const token = match[1].trim();

  // Check JOB_SECRET or CRON_SECRET with development fallback
  const secret = process.env.JOB_SECRET || process.env.CRON_SECRET || 'campusly_job_secret_default_2026';
  if (!secret) return false;

  const tokenBuf = Buffer.from(token);
  const secretBuf = Buffer.from(secret);

  if (tokenBuf.length !== secretBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(tokenBuf, secretBuf);
}

/** Helper to wrap a route handler with cron authentication. */
export function withCronAuth(handler: (request: Request) => Promise<Response>) {
  return async (request: Request) => {
    if (!verifyCronAuth(request)) {
      return NextResponse.json(
        { error: 'unauthorized', message: 'Valid JOB_SECRET Bearer token required.' },
        { status: 403, headers: getSecurityHeaders() }
      );
    }
    return handler(request);
  };
}
