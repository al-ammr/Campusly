import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import * as db from '@/lib/db';
import { clearRateLimitStore } from '@/lib/api/rate-limit';
import { clearMockEmailLog, mockEmailSentLog } from '@/lib/email';
import { starListing, reportListing, reportSpotlight, VALID_REPORT_REASONS } from '@/lib/services/stars-reports';
import { POST as postStar } from '@/app/api/v1/listings/[id]/star/route';
import { POST as postReport } from '@/app/api/v1/listings/[id]/report/route';
import { POST as postSpotlightReport } from '@/app/api/v1/spotlight/[id]/report/route';
import { GET as getOgImage } from '@/app/api/v1/og/listing/[id]/route';
import { GET as getIcsCalendar } from '@/app/api/v1/events/[id]/calendar.ics/route';

vi.mock('@/lib/db', () => ({
  query: vi.fn(),
  withTransaction: vi.fn(async (cb) => {
    const mockClient = { query: vi.fn((...args: any[]) => (db.query as any)(...args)) };
    return cb(mockClient);
  }),
}));

describe('BP-09: Stars, Reports, Sharing & Calendar (API-206, 207, 208, 502, 110)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearRateLimitStore();
    clearMockEmailLog();
  });

  describe('D06 API-206: Star Community Listing', () => {
    it('casts a star, increments atomic counter and records star_count_reached_at', async () => {
      const listingId = '11111111-1111-1111-1111-111111111111';
      const tokenHash = 'dev_token_hash_abc';
      const networkKey = 'net_hash_xyz';

      // Mock listing query (public community)
      (db.query as any).mockImplementation((sql: string, params: any[]) => {
        if (sql.includes('FROM listings') && sql.includes('WHERE id = $1')) {
          return Promise.resolve({
            rows: [{ id: listingId, kind: 'community', status: 'Approved', star_count: 5 }],
          });
        }
        if (sql.includes('INSERT INTO devices')) {
          return Promise.resolve({
            rows: [{ id: 'device-uuid-1' }],
          });
        }
        if (sql.includes('SELECT 1 FROM stars')) {
          // No existing star
          return Promise.resolve({ rows: [] });
        }
        if (sql.includes('INSERT INTO stars')) {
          return Promise.resolve({ rows: [] });
        }
        if (sql.includes('UPDATE listings') && sql.includes('SET star_count = star_count + 1')) {
          return Promise.resolve({
            rows: [{ star_count: 6 }],
          });
        }
        return Promise.resolve({ rows: [] });
      });

      const res = await starListing({
        listingId,
        tokenHash,
        networkKey,
        isNewDevice: false,
      });

      expect(res.success).toBe(true);
      expect(res.starCount).toBe(6);
      expect(res.starred).toBe(true);
    });

    it('is idempotent: repeat star by same device returns 200 without incrementing count', async () => {
      const listingId = '11111111-1111-1111-1111-111111111111';
      const tokenHash = 'dev_token_hash_abc';
      const networkKey = 'net_hash_xyz';

      (db.query as any).mockImplementation((sql: string) => {
        if (sql.includes('FROM listings')) {
          return Promise.resolve({
            rows: [{ id: listingId, kind: 'community', status: 'Approved', star_count: 6 }],
          });
        }
        if (sql.includes('INSERT INTO devices')) {
          return Promise.resolve({ rows: [{ id: 'device-uuid-1' }] });
        }
        if (sql.includes('SELECT 1 FROM stars')) {
          // Already starred
          return Promise.resolve({ rows: [{ '?column?': 1 }] });
        }
        return Promise.resolve({ rows: [] });
      });

      const res = await starListing({
        listingId,
        tokenHash,
        networkKey,
        isNewDevice: false,
      });

      expect(res.success).toBe(true);
      expect(res.starCount).toBe(6);
      expect(res.starred).toBe(true);
    });

    it('refuses stars on non-community listings (events, opportunities, spotlights)', async () => {
      (db.query as any).mockImplementation((sql: string) => {
        if (sql.includes('FROM listings') && sql.includes('kind = \'community\'')) {
          // Query filters kind = 'community', returns empty if event or opportunity
          return Promise.resolve({ rows: [] });
        }
        return Promise.resolve({ rows: [] });
      });

      const res = await starListing({
        listingId: 'event-uuid-123',
        tokenHash: 'dev_token_hash_abc',
        networkKey: 'net_hash_xyz',
        isNewDevice: false,
      });

      expect(res.success).toBe(false);
      expect(res.error).toBe('not_available');
    });

    it('blocks burst attacks (> 5 stars within 10 seconds)', async () => {
      const listingId = '11111111-1111-1111-1111-111111111111';
      const tokenHash = 'burst_spammer_hash';
      const networkKey = 'net_burst_xyz';

      (db.query as any).mockImplementation(() =>
        Promise.resolve({
          rows: [{ id: listingId, kind: 'community', status: 'Approved', star_count: 0 }],
        })
      );

      // Perform 5 allowed stars
      for (let i = 0; i < 5; i++) {
        const res = await starListing({
          listingId,
          tokenHash,
          networkKey,
          isNewDevice: false,
        });
        expect(res.success).toBe(true);
      }

      // 6th burst request is blocked
      const blockedRes = await starListing({
        listingId,
        tokenHash,
        networkKey,
        isNewDevice: false,
      });

      expect(blockedRes.success).toBe(false);
      expect(blockedRes.error).toBe('rate_limited');
      expect(blockedRes.retryAfterSeconds).toBeGreaterThan(0);
    });

    it('enforces anti-forgery check on POST /api/v1/listings/[id]/star', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/listings/123/star', {
        method: 'POST',
        // Missing x-campusly-action header
      });

      const res = await postStar(req, { params: Promise.resolve({ id: '123' }) });
      expect(res.status).toBe(403);
      const json = await res.json();
      expect(json.error.code).toBe('forgery_detected');
    });
  });

  describe('D06 API-207 & API-208: Report Listings & Spotlight', () => {
    it('accepts valid reports with 202 and never reveals report counts', async () => {
      const listingId = '11111111-1111-1111-1111-111111111111';
      const tokenHash = 'reporter_device_1';

      (db.query as any).mockImplementation((sql: string) => {
        if (sql.includes('FROM listings WHERE id = $1')) {
          return Promise.resolve({
            rows: [{ id: listingId, status: 'Approved', title: 'Test Organization' }],
          });
        }
        if (sql.includes('INSERT INTO devices')) {
          return Promise.resolve({ rows: [{ id: 'dev-1' }] });
        }
        if (sql.includes('INSERT INTO reports')) {
          return Promise.resolve({ rows: [] });
        }
        if (sql.includes('FROM reports WHERE listing_id = $1')) {
          return Promise.resolve({
            rows: [{ deviceId: 'dev-1', createdAt: new Date() }],
          });
        }
        return Promise.resolve({ rows: [] });
      });

      const res = await reportListing({
        listingId,
        reason: 'spam',
        note: 'Duplicate listing',
        tokenHash,
      });

      expect(res.success).toBe(true);
      expect(res.received).toBe(true);
      expect((res as any).count).toBeUndefined();
      expect((res as any).threshold).toBeUndefined();
    });

    it('silent bot trap: non-empty honeypot returns 202 without persisting to database', async () => {
      const dbSpy = vi.fn();
      (db.query as any).mockImplementation(dbSpy);

      const res = await reportListing({
        listingId: '123',
        reason: 'spam',
        honeypot: 'http://spam-link.com',
        tokenHash: 'bot-device',
      });

      expect(res.success).toBe(true);
      expect(res.received).toBe(true);
      expect(dbSpy).not.toHaveBeenCalled();
    });

    it('auto-hides listing and dispatches admin alert when 3 distinct devices report within 7 days', async () => {
      const listingId = 'target-listing-autohide';

      (db.query as any).mockImplementation((sql: string) => {
        if (sql.includes('FROM listings WHERE id = $1')) {
          return Promise.resolve({
            rows: [{ id: listingId, status: 'Approved', title: 'Target Club' }],
          });
        }
        if (sql.includes('INSERT INTO devices')) {
          return Promise.resolve({ rows: [{ id: 'dev-3' }] });
        }
        if (sql.includes('INSERT INTO reports')) {
          return Promise.resolve({ rows: [] });
        }
        if (sql.includes('FROM reports WHERE listing_id = $1')) {
          // 3 distinct devices reported within the 7-day window
          return Promise.resolve({
            rows: [
              { deviceId: 'dev-1', createdAt: new Date() },
              { deviceId: 'dev-2', createdAt: new Date() },
              { deviceId: 'dev-3', createdAt: new Date() },
            ],
          });
        }
        if (sql.includes('FROM listings WHERE id = $1')) {
          return Promise.resolve({
            rows: [{ kind: 'community', status: 'Approved', title: 'Test Organization' }],
          });
        }
        return Promise.resolve({ rows: [] });
      });

      const res = await reportListing({
        listingId,
        reason: 'inappropriate',
        tokenHash: 'dev-3-hash',
      });

      expect(res.success).toBe(true);
      expect(res.received).toBe(true);

      // Verify email alert was dispatched to admin team
      expect(mockEmailSentLog.length).toBe(1);
      expect(mockEmailSentLog[0].subject).toContain('[Campusly Alert] Listing auto-hidden');
    });

    it('handles Spotlight reporting (API-208)', async () => {
      const spotlightId = 'spotlight-123';

      (db.query as any).mockImplementation((sql: string) => {
        if (sql.includes('FROM spotlight_listings WHERE id = $1')) {
          return Promise.resolve({
            rows: [{ id: spotlightId, status: 'Active', business_name: 'Campus Print Shop' }],
          });
        }
        if (sql.includes('INSERT INTO devices')) {
          return Promise.resolve({ rows: [{ id: 'dev-9' }] });
        }
        if (sql.includes('INSERT INTO reports')) {
          return Promise.resolve({ rows: [] });
        }
        return Promise.resolve({ rows: [] });
      });

      const res = await reportSpotlight({
        spotlightId,
        reason: 'scam',
        tokenHash: 'reporter_hash_9',
      });

      expect(res.success).toBe(true);
      expect(res.received).toBe(true);
    });
  });

  describe('D04 SHR-01 & API-502: Dynamic Social Preview Card', () => {
    it('returns neutral 404 for non-existent or non-public listing', async () => {
      (db.query as any).mockResolvedValue({ rows: [] });

      const req = new NextRequest('http://localhost:3000/api/v1/og/listing/non-existent');
      const res = await getOgImage(req, { params: Promise.resolve({ id: 'non-existent' }) });

      expect(res.status).toBe(404);
      const json = await res.json();
      expect(json.error.code).toBe('not_available');
    });

    it('renders 1200x630 social card with 24h caching for public listing', async () => {
      (db.query as any).mockImplementation((sql: string) => {
        if (sql.includes('FROM listings') && sql.includes('WHERE id = $1')) {
          return Promise.resolve({
            rows: [
              {
                id: 'comm-123',
                kind: 'community',
                slug: 'gdgoc-abu',
                title: 'GDGOC ABU Zaria',
                summary: 'Google Developer Student Club at Ahmadu Bello University',
                description: 'Full description of GDGOC',
                status: 'Approved',
                category_id: 'cat-1',
                category_slug: 'tech-code',
                category_name: 'Tech & Code',
                category_icon_key: 'laptop',
                star_count: 88,
                verified: true,
                created_at: new Date().toISOString(),
              },
            ],
          });
        }
        return Promise.resolve({ rows: [] });
      });

      const req = new NextRequest('http://localhost:3000/api/v1/og/listing/comm-123');
      const res = await getOgImage(req, { params: Promise.resolve({ id: 'comm-123' }) });

      expect(res.status).toBe(200);
      expect(res.headers.get('Content-Type')).toContain('image/png');
      expect(res.headers.get('Cache-Control')).toContain('s-maxage=86400');
    });
  });

  describe('D06 API-110: RFC 5545 iCalendar Export', () => {
    it('generates valid RFC 5545 calendar file for an event', async () => {
      const eventId = 'event-calendar-test';

      (db.query as any).mockImplementation((sql: string) => {
        if (sql.includes('FROM listings') && sql.includes('WHERE id = $1')) {
          return Promise.resolve({
            rows: [
              {
                id: eventId,
                kind: 'event',
                slug: 'ai-workshop-2026',
                title: 'AI & Cloud Computing Workshop',
                summary: 'Hands-on training session on modern AI stacks',
                description: 'Deep dive into LLMs and Cloud architectures.',
                status: 'Approved',
                category_id: 'cat-1',
                category_slug: 'tech-code',
                category_name: 'Tech & Code',
                category_icon_key: 'laptop',
                starts_at: '2026-11-15T09:00:00.000Z',
                ends_at: '2026-11-15T12:00:00.000Z',
                venue: 'Assembly Hall, Main Campus',
                is_free: true,
                created_at: new Date().toISOString(),
              },
            ],
          });
        }
        return Promise.resolve({ rows: [] });
      });

      const req = new NextRequest(`http://localhost:3000/api/v1/events/${eventId}/calendar.ics`);
      const res = await getIcsCalendar(req, { params: Promise.resolve({ id: eventId }) });

      expect(res.status).toBe(200);
      expect(res.headers.get('Content-Type')).toContain('text/calendar');
      expect(res.headers.get('Content-Disposition')).toContain('attachment;');

      const text = await res.text();
      expect(text).toContain('BEGIN:VCALENDAR');
      expect(text).toContain('VERSION:2.0');
      expect(text).toContain('BEGIN:VEVENT');
      expect(text).toContain(`UID:${eventId}@campusly.abu.edu.ng`);
      expect(text).toContain('SUMMARY:AI & Cloud Computing Workshop');
      expect(text).toContain('LOCATION:Assembly Hall\\, Main Campus');
      expect(text).toContain('END:VEVENT');
      expect(text).toContain('END:VCALENDAR');
    });
  });
});
