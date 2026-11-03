import { describe, it, expect } from 'vitest';
import { GET } from '@/app/api/v1/health/route';

describe('Health Endpoint (GET /api/v1/health)', () => {
  it('returns status 200 with healthy state and ISO timestamp', async () => {
    const response = await GET();
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('data');
    expect(body.data).toHaveProperty('status', 'healthy');
    expect(body.data).toHaveProperty('build_id');
    expect(body.data).toHaveProperty('time');

    // Verify time is a valid ISO 8601 string
    const timestamp = Date.parse(body.data.time);
    expect(Number.isNaN(timestamp)).toBe(false);
  });

  it('sets no-store cache headers for uptime monitoring', async () => {
    const response = await GET();
    expect(response.headers.get('Cache-Control')).toContain('no-store');
  });
});
