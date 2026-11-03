import { NextRequest } from 'next/server';
import { env } from '@/lib/env';

export interface SecurityHeadersOptions {
  isReportOnlyCsp?: boolean;
}

/**
 * Returns mandatory security response headers from D08 Section 5.
 */
export function getSecurityHeaders(options?: SecurityHeadersOptions): Record<string, string> {
  const isReportOnly = options?.isReportOnlyCsp ?? true; // Report-only first per BP-05

  const cspValue = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');

  const headers: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-site',
  };

  if (env.NODE_ENV === 'production') {
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
  }

  if (isReportOnly) {
    headers['Content-Security-Policy-Report-Only'] = cspValue;
  } else {
    headers['Content-Security-Policy'] = cspValue;
  }

  return headers;
}

/**
 * Validates anti-forgery rules for state-changing browser writes (SEC-320).
 */
export function validateCsrf(req: NextRequest): boolean {
  const method = req.method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return true;
  }

  // Check custom action header
  const customHeader = req.headers.get('x-campusly-action');
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');

  // Allow custom header as proof of client script execution
  if (customHeader === '1' || customHeader === 'true') {
    return true;
  }

  // Check Origin against expected app origin
  const expectedOrigin = new URL(env.NEXT_PUBLIC_APP_URL).origin;

  if (origin && origin === expectedOrigin) {
    return true;
  }

  if (referer && referer.startsWith(expectedOrigin)) {
    return true;
  }

  // Allow localhost during local test / development
  if (env.NODE_ENV !== 'production') {
    if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
      return true;
    }
  }

  return false;
}

// 24-hour memory store for Idempotency-Key
interface IdempotencyRecord {
  status: number;
  body: any;
  headers: Record<string, string>;
  expiresAt: number;
}

const idempotencyStore = new Map<string, IdempotencyRecord>();
const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours (D06 Section 9)

export function getIdempotentResponse(key: string): IdempotencyRecord | null {
  const record = idempotencyStore.get(key);
  if (!record) return null;
  if (Date.now() >= record.expiresAt) {
    idempotencyStore.delete(key);
    return null;
  }
  return record;
}

export function saveIdempotentResponse(
  key: string,
  status: number,
  body: any,
  headers: Record<string, string> = {}
): void {
  idempotencyStore.set(key, {
    status,
    body,
    headers,
    expiresAt: Date.now() + IDEMPOTENCY_TTL_MS,
  });
}

export function clearIdempotencyStore(): void {
  idempotencyStore.clear();
}
