import { NextRequest, NextResponse } from 'next/server';
import { getPublicListingDetail, generateIcsCalendar } from '@/lib/api/public-queries';
import { createErrorResponse, ERROR_CATALOGUE } from '@/lib/api/envelope';
import { getSecurityHeaders } from '@/lib/api/security';

export async function GET(
  req: NextRequest,
  routeContext: { params: Promise<{ id: string }> | { id: string } }
) {
  const params = await Promise.resolve(routeContext.params);
  const id = params?.id;
  const requestId = req.headers.get('x-request-id') || crypto.randomUUID();

  if (!id) {
    return createErrorResponse(ERROR_CATALOGUE.NOT_AVAILABLE, requestId);
  }

  const detail = await getPublicListingDetail('event', id);
  if (!detail) {
    return createErrorResponse(ERROR_CATALOGUE.NOT_AVAILABLE, requestId);
  }

  const icsBody = generateIcsCalendar(detail);
  const headers = new Headers(getSecurityHeaders({ isReportOnlyCsp: true }));
  headers.set('Content-Type', 'text/calendar; charset=utf-8');
  headers.set('Content-Disposition', `attachment; filename="${detail.slug || 'event'}.ics"`);
  headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
  headers.set('X-Request-Id', requestId);

  return new NextResponse(icsBody, {
    status: 200,
    headers,
  });
}
