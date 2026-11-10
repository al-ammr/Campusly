// app/api/v1/jobs/reconciliation-report/route.ts
import { NextResponse } from 'next/server';
import { withCronAuth } from '@/lib/middleware/cronAuth';
import { executeScheduledJob, reconciliationReport } from '@/lib/jobs';
import { getSecurityHeaders } from '@/lib/api/security';

const handler = withCronAuth(async () => {
  const result = await executeScheduledJob('reconciliation_report', reconciliationReport);
  return NextResponse.json(result, { status: result.ok ? 200 : 500, headers: getSecurityHeaders() });
});

export const GET = handler;
export const POST = handler;
