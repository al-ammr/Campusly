import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { GET as metricsHandler } from '@/app/api/v1/admin/metrics/route';

describe('PWA, Offline Strategy & Admin Metrics Specification (BP-14)', () => {
  describe('Production Service Worker Configuration (sw.js)', () => {
    const swPath = path.resolve(process.cwd(), 'public/sw.js');
    const swContent = fs.readFileSync(swPath, 'utf-8');

    it('precaches /offline fallback and app shell', () => {
      expect(swContent).toContain('/offline');
      expect(swContent).toContain('/manifest.json');
    });

    it('strictly excludes /admin and API write routes from caching (SEC-112)', () => {
      expect(swContent).toContain("url.pathname.startsWith('/admin')");
      expect(swContent).toContain("request.method !== 'GET'");
    });

    it('handles ADMIN_SIGNOUT message by purging client caches', () => {
      expect(swContent).toContain('ADMIN_SIGNOUT');
    });
  });

  describe('Admin Metrics API (API-452 / FR-435)', () => {
    it('returns CSV formatted export when export=csv is queried', async () => {
      const req = new Request('https://campusly.abu.edu.ng/api/v1/admin/metrics?export=csv', {
        headers: { Cookie: 'cf_admin=master_session_test' },
      });

      const res = await metricsHandler(req);
      expect(res.status).toBe(200);
      expect(res.headers.get('Content-Type')).toContain('text/csv');
      const text = await res.text();
      expect(text).toContain('Active Communities');
      expect(text).toContain('Top Zero-Result Query');
    });

    it('returns JSON metrics structure including zero-result queries', async () => {
      const req = new Request('https://campusly.abu.edu.ng/api/v1/admin/metrics?range=30d', {
        headers: { Cookie: 'cf_admin=master_session_test' },
      });

      const res = await metricsHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.ok).toBe(true);
      expect(data.metrics.summary).toBeDefined();
      expect(Array.isArray(data.metrics.zeroResultQueries)).toBe(true);
      expect(data.metrics.funnel).toBeDefined();
    });
  });
});
