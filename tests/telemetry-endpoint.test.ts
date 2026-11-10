import { test, expect } from 'vitest';
import { POST } from '@/app/api/v1/telemetry/route';

/**
 * Helper to create a mock NextRequest compatible with the route handler.
 */
function mockNextRequest(body: any) {
  const request = new Request('http://localhost/api/v1/telemetry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as import('next/server').NextRequest;
  return request;
}

test('telemetry endpoint accepts valid event', async () => {
  const resp = await POST(mockNextRequest({ type: 'test-event', payload: {} }));
  const json = await resp.json();
  expect(resp.status).toBe(200);
  expect(json.status).toBe('ok');
});

test('telemetry endpoint rejects invalid payload', async () => {
  const resp = await POST(mockNextRequest({ foo: 'bar' }));
  const json = await resp.json();
  expect(resp.status).toBe(400);
  expect(json.error).toBe('Invalid event payload');
});
