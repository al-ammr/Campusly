import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

export const dynamic = 'force-dynamic';

export async function GET() {
  const payload = {
    data: {
      status: 'healthy',
      build_id: env.NEXT_PUBLIC_BUILD_ID || 'local',
      time: new Date().toISOString(),
    },
  };

  return NextResponse.json(payload, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'Content-Type': 'application/json',
    },
  });
}
