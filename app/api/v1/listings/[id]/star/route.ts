import { NextRequest } from 'next/server';
import { createSuccessResponse, createErrorResponse, ERROR_CATALOGUE } from '@/lib/api/envelope';
import { getSecurityHeaders, validateCsrf } from '@/lib/api/security';
import { getOrCreateDeviceContext } from '@/lib/api/device';
import { starListing } from '@/lib/services/stars-reports';

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

  // 2. Extract or provision device identity
  const responseHeaders = new Headers(getSecurityHeaders({ isReportOnlyCsp: true }));
  const { context: deviceContext } = await getOrCreateDeviceContext(req, responseHeaders);

  const headersObj: Record<string, string> = {};
  responseHeaders.forEach((val, key) => {
    headersObj[key] = val;
  });

  // 3. Execute starListing business rule
  const result = await starListing({
    listingId,
    tokenHash: deviceContext.tokenHash,
    networkKey: deviceContext.networkKey,
    isNewDevice: deviceContext.isNewDevice,
  });

  if (!result.success) {
    if (result.error === 'not_available') {
      return createErrorResponse(ERROR_CATALOGUE.NOT_AVAILABLE, requestId, { headers: headersObj });
    }
    if (result.error === 'rate_limited') {
      const err = { ...ERROR_CATALOGUE.RATE_LIMITED };
      return createErrorResponse(err, requestId, {
        retryAfter: result.retryAfterSeconds,
        headers: headersObj,
      });
    }
    if (result.error === 'device_too_new') {
      return createErrorResponse(ERROR_CATALOGUE.DEVICE_TOO_NEW, requestId, { headers: headersObj });
    }
    return createErrorResponse(ERROR_CATALOGUE.INTERNAL_ERROR, requestId, { headers: headersObj });
  }

  return createSuccessResponse(
    {
      starred: result.starred,
      star_count: result.starCount,
    },
    requestId,
    {
      status: 200,
      headers: headersObj,
    }
  );
}
