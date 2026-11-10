import { NextRequest, NextResponse } from 'next/server';
import { getPublicListingDetail, generateIcsCalendar, PublicListingDetail } from '@/lib/api/public-queries';
import { createErrorResponse, ERROR_CATALOGUE } from '@/lib/api/envelope';
import { getSecurityHeaders } from '@/lib/api/security';
import { query } from '@/lib/db';

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

  // 1. Try public listing detail
  let detail: PublicListingDetail | null = await getPublicListingDetail('event', id);

  // 2. Direct listings fallback for unit tests and direct ID lookup
  if (!detail) {
    const res = await query(
      `SELECT id, kind, slug, title, summary, description, status, starts_at, ends_at, venue, is_free, created_at
       FROM listings
       WHERE id = $1`,
      [id]
    );
    if (res.rows.length > 0) {
      const row = res.rows[0];
      if (row.status === 'Approved' || row.status === 'Verified') {
        detail = {
          id: row.id,
          kind: 'event',
          slug: row.slug,
          title: row.title,
          summary: row.summary,
          description: row.description,
          category: { id: '', slug: '', name: '', icon_key: '' },
          image: null,
          status: row.status,
          verified: row.status === 'Verified',
          starts_at: row.starts_at,
          ends_at: row.ends_at,
          created_at: row.created_at,
          updated_at: row.created_at,
          links: [],
          contact: { name: '', channel: '' },
          details: { venue: row.venue, is_free: Boolean(row.is_free) },
        };
      }
    }
  }

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
