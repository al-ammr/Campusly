import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Simple telemetry endpoint that receives anonymous events.
 * Events are expected to be JSON objects and are logged to the server console
 * (or could be persisted to a DB in a real implementation).
 */
export async function POST(request: NextRequest) {
  try {
    const event = await request.json();
    // Basic validation – ensure it's an object with at least a type property
    if (!event || typeof event !== 'object' || typeof (event as any).type !== 'string') {
      return NextResponse.json({ error: 'Invalid event payload' }, { status: 400 });
    }
    if (process.env.NODE_ENV === 'development') {
      console.log('🛰️ Telemetry event received:', event);
    }
    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (err) {
    console.error('Telemetry endpoint error:', err);
    return NextResponse.json({ error: 'Malformed JSON' }, { status: 400 });
  }
}
