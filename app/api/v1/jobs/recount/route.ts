// app/api/v1/jobs/recount/route.ts
import { NextResponse } from 'next/server';
import { withCronAuth } from '@/lib/middleware/cronAuth';
import { executeScheduledJob, recountStars } from '@/lib/jobs';
import { getSecurityHeaders } from '@/lib/api/security';

const handler = withCronAuth(async () => {
  const result = await executeScheduledJob('recount_stars', recountStars);
  return NextResponse.json(result, { status: result.ok ? 200 : 500, headers: getSecurityHeaders() });
});

export const GET = handler;
export const POST = handler;
