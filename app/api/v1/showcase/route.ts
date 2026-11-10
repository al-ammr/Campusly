import { NextResponse } from 'next/server';
import { getShowcaseBundle } from '@/lib/showcase/service';
import { getSecurityHeaders } from '@/lib/api/security';

export const revalidate = 60; // Cache 60 seconds

export async function GET() {
  try {
    const bundle = await getShowcaseBundle();
    return NextResponse.json(
      { ok: true, data: bundle },
      {
        status: 200,
        headers: {
          ...getSecurityHeaders(),
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  } catch (error) {
    console.error('[API /showcase] Error:', error);
    return NextResponse.json(
      { error: 'failed_to_fetch_showcase' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
