// app/api/v1/og/listing/[id]/route.tsx
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { createErrorResponse, ERROR_CATALOGUE } from '@/lib/api/envelope';
import { getSecurityHeaders } from '@/lib/api/security';

export async function GET(
  req: NextRequest,
  routeContext: { params: Promise<{ id: string }> | { id: string } }
) {
  const params = await Promise.resolve(routeContext.params);
  const listingId = params?.id;
  const requestId = req.headers.get('x-request-id') || crypto.randomUUID();

  if (!listingId) {
    return createErrorResponse(ERROR_CATALOGUE.NOT_AVAILABLE, requestId);
  }

  // Fetch listing data using canonical db query
  const res = await query(
    `SELECT id, kind, title, summary, description, status 
     FROM listings 
     WHERE id = $1`,
    [listingId]
  );

  const listing = res.rows[0];
  if (!listing || (listing.status !== 'Approved' && listing.status !== 'VERIFIED')) {
    return createErrorResponse(ERROR_CATALOGUE.NOT_AVAILABLE, requestId);
  }

  const title = listing.title || 'Campusly Listing';
  const summary = listing.summary || listing.description || 'Explore on Campusly ABU Zaria';

  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#FCF9F4',
          padding: '60px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#9F3C16',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '24px',
              fontWeight: 'bold',
            }}
          >
            C
          </div>
          <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#1F1C18' }}>Campusly</span>
          <span style={{ fontSize: '20px', color: '#4A634E' }}>• ABU Zaria</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h1 style={{ fontSize: '56px', fontWeight: 'bold', color: '#1F1C18', margin: 0 }}>
            {title}
          </h1>
          <p style={{ fontSize: '26px', color: '#4A453E', margin: 0 }}>{summary}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '20px', color: '#9F3C16', fontWeight: '600' }}>
            campusly.abu.edu.ng
          </span>
          <span style={{ fontSize: '18px', color: '#8A726A' }}>No login required</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );

  const headers = new Headers(imageResponse.headers);
  headers.set('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
  headers.set('Content-Type', 'image/png');

  return new Response(imageResponse.body, {
    status: 200,
    headers,
  });
}
