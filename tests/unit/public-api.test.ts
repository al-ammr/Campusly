import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import * as db from '@/lib/db';
import {
  formatListingSummary,
  formatSpotlightItem,
  generateIcsCalendar,
  PublicListingDetail,
} from '@/lib/api/public-queries';
import { GET as getHome } from '@/app/api/v1/home/route';
import { GET as getSuggest } from '@/app/api/v1/search/suggest/route';
import { GET as getCategories } from '@/app/api/v1/categories/route';
import { GET as getCategoryDetail } from '@/app/api/v1/categories/[slug]/route';
import { GET as getCommunities } from '@/app/api/v1/communities/route';
import { GET as getCommunityDetail } from '@/app/api/v1/communities/[slug]/route';
import { GET as getEvents } from '@/app/api/v1/events/route';
import { GET as getEventDetail } from '@/app/api/v1/events/[id]/route';
import { GET as getEventIcs } from '@/app/api/v1/events/[id]/calendar.ics/route';
import { GET as getOpportunities } from '@/app/api/v1/opportunities/route';
import { GET as getOpportunityDetail } from '@/app/api/v1/opportunities/[id]/route';
import { GET as getSpotlight } from '@/app/api/v1/spotlight/route';
import { GET as getSpotlightDetail } from '@/app/api/v1/spotlight/[id]/route';
import { GET as getAnnouncements } from '@/app/api/v1/announcements/route';
import { GET as getAnnouncementDetail } from '@/app/api/v1/announcements/[id]/route';
import { GET as getConfig } from '@/app/api/v1/config/route';
import { GET as getMeState } from '@/app/api/v1/me/state/route';

vi.mock('@/lib/db', () => ({
  query: vi.fn(),
}));

describe('BP-06: Public Read API & Caching (API-101 to API-118)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Data projection & privacy (Zero private fields leaked)', () => {
    it('strips private fields from raw listing rows', () => {
      const rawRow = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        kind: 'community',
        slug: 'gdgoc-abu',
        title: 'GDGOC ABU Zaria',
        summary: 'Google Developer Student Club',
        description: 'Detailed description',
        status: 'Approved',
        category_id: 'cat-1',
        category_slug: 'tech-code',
        category_name: 'Tech & Code',
        category_icon_key: 'laptop',
        image_storage_key: 'img_123.jpg',
        image_alt_text: 'GDGOC logo',
        star_count: 42,
        created_at: new Date('2026-01-01').toISOString(),
        // PRIVATE FIELDS THAT MUST BE STRIPPED:
        owner_email: 'admin@gdgoc.com',
        submitter_device_token: 'secret-hash',
        admin_notes: 'Reviewed and verified by Lead',
        tracking_code: 'CY-ABCD-1234',
      };

      const summary = formatListingSummary(rawRow);
      expect((summary as any).owner_email).toBeUndefined();
      expect((summary as any).submitter_device_token).toBeUndefined();
      expect((summary as any).admin_notes).toBeUndefined();
      expect((summary as any).tracking_code).toBeUndefined();
      expect(summary.verified).toBe(false);
      expect(summary.status).toBe('Approved');
    });

    it('correctly marks verified community status only when status is Verified and kind is community', () => {
      const verifiedRow = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        kind: 'community',
        slug: 'gdgoc-abu',
        title: 'GDGOC ABU Zaria',
        summary: 'Google Developer Student Club',
        status: 'Verified',
        category_id: 'cat-1',
        category_slug: 'tech',
        category_name: 'Tech',
        created_at: new Date('2026-01-01').toISOString(),
      };
      const summary = formatListingSummary(verifiedRow);
      expect(summary.verified).toBe(true);
      expect(summary.status).toBe('Verified');
    });
  });

  describe('API-101: /api/v1/home', () => {
    it('returns bundled home content with proper Cache-Control', async () => {
      (db.query as any).mockResolvedValue({ rows: [] });

      const req = new NextRequest('http://localhost:3000/api/v1/home');
      const res = await getHome(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.data).toHaveProperty('pinned_announcement');
      expect(json.data).toHaveProperty('this_week');
      expect(json.data).toHaveProperty('categories');
      expect(json.data).toHaveProperty('spotlight_strip');
      expect(json.data).toHaveProperty('closing_soon');
      expect(json.data).toHaveProperty('top_communities');
      expect(res.headers.get('cache-control')).toContain('public');
    });
  });

  describe('API-103: /api/v1/search/suggest', () => {
    it('returns suggestions and categories for query', async () => {
      (db.query as any)
        .mockResolvedValueOnce({ rows: [{ title: 'Google Developer Group' }] })
        .mockResolvedValueOnce({ rows: [{ id: 'cat-1', slug: 'tech', name: 'Tech' }] });

      const req = new NextRequest('http://localhost:3000/api/v1/search/suggest?q=google', {
        headers: { Cookie: 'campusly_device=0123456789abcdef0123456789abcdef' },
      });
      const res = await getSuggest(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.data.suggestions).toEqual(['Google Developer Group']);
      expect(json.data.categories[0].name).toBe('Tech');
    });

    it('rejects query longer than 80 chars with validation_failed', async () => {
      const longQ = 'a'.repeat(81);
      const req = new NextRequest(`http://localhost:3000/api/v1/search/suggest?q=${longQ}`);
      const res = await getSuggest(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error.code).toBe('validation_failed');
    });
  });

  describe('API-104 & API-105: Categories', () => {
    it('API-104 returns all categories with live counts', async () => {
      (db.query as any).mockResolvedValue({
        rows: [
          { id: 'cat-1', slug: 'tech', name: 'Tech', icon_key: 'laptop', sort: 1, live_communities: '5', upcoming_events: '2' },
        ],
      });

      const req = new NextRequest('http://localhost:3000/api/v1/categories');
      const res = await getCategories(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.data[0].live_communities).toBe(5);
      expect(json.data[0].upcoming_events).toBe(2);
    });

    it('API-105 returns 404 not_found when category does not exist', async () => {
      (db.query as any).mockResolvedValue({ rows: [] });

      const req = new NextRequest('http://localhost:3000/api/v1/categories/unknown-cat');
      const res = await getCategoryDetail(req, { params: Promise.resolve({ slug: 'unknown-cat' }) });
      const json = await res.json();

      expect(res.status).toBe(404);
      expect(json.error.code).toBe('not_found');
    });
  });

  describe('API-107, 109, 112, 114, 116: Detail Neutral 404 (API-120)', () => {
    it('returns neutral 404 not_available when a listing does not exist or is not public', async () => {
      (db.query as any).mockResolvedValue({ rows: [] });

      const req = new NextRequest('http://localhost:3000/api/v1/communities/deleted-community');
      const res = await getCommunityDetail(req, { params: Promise.resolve({ slug: 'deleted-community' }) });
      const json = await res.json();

      expect(res.status).toBe(404);
      expect(json.error.code).toBe('not_available');
      expect(json.error.message).toBe('This listing is no longer available or does not exist.');
    });

    it('returns neutral 404 not_available for unknown event', async () => {
      (db.query as any).mockResolvedValue({ rows: [] });

      const req = new NextRequest('http://localhost:3000/api/v1/events/123e4567-e89b-12d3-a456-426614174000');
      const res = await getEventDetail(req, { params: Promise.resolve({ id: '123e4567-e89b-12d3-a456-426614174000' }) });
      const json = await res.json();

      expect(res.status).toBe(404);
      expect(json.error.code).toBe('not_available');
    });

    it('returns neutral 404 not_available for unknown opportunity', async () => {
      (db.query as any).mockResolvedValue({ rows: [] });

      const req = new NextRequest('http://localhost:3000/api/v1/opportunities/unknown-opp');
      const res = await getOpportunityDetail(req, { params: Promise.resolve({ id: 'unknown-opp' }) });
      const json = await res.json();

      expect(res.status).toBe(404);
      expect(json.error.code).toBe('not_available');
    });

    it('returns neutral 404 not_available for non-active spotlight listing', async () => {
      (db.query as any).mockResolvedValue({ rows: [] });

      const req = new NextRequest('http://localhost:3000/api/v1/spotlight/SP-TEST-1234');
      const res = await getSpotlightDetail(req, { params: Promise.resolve({ id: 'SP-TEST-1234' }) });
      const json = await res.json();

      expect(res.status).toBe(404);
      expect(json.error.code).toBe('not_available');
    });
  });

  describe('API-110: Calendar .ics export (RFC 5545)', () => {
    it('generates valid RFC 5545 iCalendar content with CRLF line endings', () => {
      const mockEvent: PublicListingDetail = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        kind: 'event',
        slug: 'gdg-info-session',
        title: 'GDG Info Session',
        summary: 'Annual introduction session',
        description: 'Full details of session',
        status: 'Approved',
        verified: false,
        category: { id: 'c1', slug: 'tech', name: 'Tech', icon_key: 'laptop' },
        image: null,
        contact: { name: 'GDG Lead', channel: 'WhatsApp' },
        links: [],
        details: {
          venue: 'Assembly Hall, Main Campus',
          is_free: true,
        },
        starts_at: '2026-11-10T10:00:00.000Z',
        ends_at: '2026-11-10T12:00:00.000Z',
        created_at: '2026-11-01T00:00:00.000Z',
        updated_at: '2026-11-01T00:00:00.000Z',
      };

      const ics = generateIcsCalendar(mockEvent);
      expect(ics).toContain('BEGIN:VCALENDAR');
      expect(ics).toContain('VERSION:2.0');
      expect(ics).toContain('BEGIN:VEVENT');
      expect(ics).toContain(`UID:${mockEvent.id}@campusly.abu.edu.ng`);
      expect(ics).toContain('SUMMARY:GDG Info Session');
      expect(ics).toContain('LOCATION:Assembly Hall\\, Main Campus');
      expect(ics).toContain('END:VEVENT');
      expect(ics).toContain('END:VCALENDAR');
      expect(ics).toContain('\r\n');
    });

    it('returns text/calendar HTTP response with attachment filename', async () => {
      (db.query as any)
        .mockResolvedValueOnce({
          rows: [
            {
              id: '123e4567-e89b-12d3-a456-426614174000',
              kind: 'event',
              slug: 'tech-summit-2026',
              title: 'Tech Summit 2026',
              summary: 'Summit',
              description: 'Desc',
              status: 'Approved',
              category_id: 'c1',
              category_slug: 'tech',
              category_name: 'Tech',
              created_at: '2026-11-01T00:00:00.000Z',
              updated_at: '2026-11-01T00:00:00.000Z',
              starts_at: '2026-11-15T09:00:00.000Z',
              ends_at: '2026-11-15T17:00:00.000Z',
              venue: 'ICT Center',
              is_free: true,
            },
          ],
        })
        .mockResolvedValueOnce({ rows: [] }); // links query

      const req = new NextRequest('http://localhost:3000/api/v1/events/123e4567-e89b-12d3-a456-426614174000/calendar.ics');
      const res = await getEventIcs(req, {
        params: Promise.resolve({ id: '123e4567-e89b-12d3-a456-426614174000' }),
      });

      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('text/calendar');
      expect(res.headers.get('content-disposition')).toContain('tech-summit-2026.ics');
    });
  });

  describe('API-117: Client configuration (Zero secrets)', () => {
    it('returns runtime public settings and no confidential data', async () => {
      // Mock getSetting calls by letting defaults resolve or mocking db query
      (db.query as any).mockResolvedValue({ rows: [] });

      const req = new NextRequest('http://localhost:3000/api/v1/config');
      const res = await getConfig(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.data).toHaveProperty('spotlight.plans.standard');
      expect(json.data).toHaveProperty('spotlight.plans.featured');
      expect(json.data).toHaveProperty('limits.title_max_length', 100);
      expect(json.data).toHaveProperty('limits.summary_max_length', 280);
      expect(json.data).toHaveProperty('limits.description_max_length', 4000);

      // Verify no secrets exist
      const serialized = JSON.stringify(json.data);
      expect(serialized).not.toContain('jwt');
      expect(serialized).not.toContain('secret');
      expect(serialized).not.toContain('password');
      expect(serialized).not.toContain('hash');
    });
  });

  describe('API-118: Device state (/api/v1/me/state)', () => {
    it('returns empty array when no IDs requested and is non-cached (no-store)', async () => {
      (db.query as any).mockResolvedValue({ rows: [] });

      const req = new NextRequest('http://localhost:3000/api/v1/me/state');
      const res = await getMeState(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.data.starred).toEqual([]);
      expect(res.headers.get('cache-control')).toContain('no-store');
    });

    it('queries starred IDs belonging to the device', async () => {
      const mockId = '123e4567-e89b-12d3-a456-426614174000';
      (db.query as any).mockResolvedValueOnce({ rows: [{ listing_id: mockId }] });

      const req = new NextRequest(`http://localhost:3000/api/v1/me/state?ids=${mockId}`, {
        headers: { Cookie: 'campusly_device=0123456789abcdef0123456789abcdef' },
      });
      const res = await getMeState(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.data.starred).toContain(mockId);
    });
  });
});
