import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, ERROR_CATALOGUE } from '@/lib/api/envelope';
import { getSecurityHeaders, validateCsrf } from '@/lib/api/security';
import { getOrCreateDeviceContext } from '@/lib/api/device';
import { reportListing } from '@/lib/services/stars-reports';

export async function POST(
  req: NextRequest,
  routeContext: { params: Promise<{ id: string }> | { id: string } }
) {
  const params = await Promise.resolve(routeContext.params);
  const listingId = params?.id;
  const requestId = req.headers.get('x-request-id') || crypto.randomUUID();

  // 1. Anti-forgery check for browser writes (D08 Section 5)
  if (!validateCsrf(req)) {
    return createErrorResponse(ERROR_CATALOGUE.FORGERY_DETECTED, requestId);
  }

  if (!listingId) {
    return createErrorResponse(ERROR_CATALOGUE.NOT_AVAILABLE, requestId);
  }

  // 2. Parse body safely
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return createErrorResponse(ERROR_CATALOGUE.VALIDATION_FAILED, requestId);
  }

  const { reason, note, honeypot } = body;

  if (!reason || typeof reason !== 'string') {
    return createErrorResponse(ERROR_CATALOGUE.VALIDATION_FAILED, requestId);
  }

  // 3. Extract or provision device identity
  const responseHeaders = new Headers(getSecurityHeaders({ isReportOnlyCsp: true }));
  const { context: deviceContext } = await getOrCreateDeviceContext(req, responseHeaders);

  // 4. Record report and check auto-hide threshold
  const result = await reportListing({
    listingId,
    reason,
    note: typeof note === 'string' ? note : undefined,
    honeypot: typeof honeypot === 'string' ? honeypot : undefined,
    tokenHash: deviceContext.tokenHash,
  });

  if (!result.success) {
    if (result.error === 'not_available') {
      return createErrorResponse(ERROR_CATALOGUE.NOT_AVAILABLE, requestId);
    }
    if (result.error === 'validation_failed') {
      return createErrorResponse(ERROR_CATALOGUE.VALIDATION_FAILED, requestId);
    }
    if (result.error === 'rate_limited') {
      const err = { ...ERROR_CATALOGUE.RATE_LIMITED };
      const res = createErrorResponse(err, requestId);
      if (result.retryAfterSeconds) {
        res.headers.set('Retry-After', String(result.retryAfterSeconds));
      }
      return res;
    }
    return createErrorResponse(ERROR_CATALOGUE.INTERNAL_ERROR, requestId);
  }

  // 5. Return 202 Accepted (API-207)
  responseHeaders.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  responseHeaders.set('X-Request-Id', requestId);

  return NextResponse.json(
    createSuccessResponse(
      {
        received: true,
      },
      requestId
    ),
    {
      status: 202,
      headers: responseHeaders,
    }
  );
}
