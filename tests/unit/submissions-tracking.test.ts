import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import * as db from '@/lib/db';
import * as email from '@/lib/email';
import { validateFileSafety } from '@/lib/storage/upload';
import { POST as submitListing } from '@/app/api/v1/submissions/route';
import { POST as presignUpload } from '@/app/api/v1/uploads/presign/route';
import { POST as checkDuplicates } from '@/app/api/v1/submissions/duplicates/route';
import { GET as getTrackStatus } from '@/app/api/v1/track/[code]/route';
import { POST as replyTrack } from '@/app/api/v1/track/[code]/reply/route';

vi.mock('@/lib/db', () => ({
  query: vi.fn().mockResolvedValue({ rows: [] }),
  withTransaction: vi.fn(),
}));

vi.mock('@/lib/email', () => ({
  sendEmail: vi.fn(),
}));

vi.mock('@/lib/settings', () => ({
  getSetting: vi.fn().mockImplementation((key: string) => {
    const defaults: Record<string, any> = {
      'submit.dailyCapPerDevice': 3,
      'track.lookupCapPerHour': 10,
      'review.infoReplyDays': 7,
    };
    return Promise.resolve(defaults[key] ?? 3);
  }),
}));

describe('BP-08: Submissions, Uploads & Tracking (API-201 to API-205)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('File validation & Safety (SEC-220 to SEC-228)', () => {
    it('accepts valid JPEG buffer', () => {
      const validJpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46]);
      const res = validateFileSafety(validJpeg, 'image/jpeg', 'image');
      expect(res.valid).toBe(true);
      expect(res.detectedMime).toBe('image/jpeg');
    });

    it('accepts valid PNG buffer', () => {
      const validPng = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
      const res = validateFileSafety(validPng, 'image/png', 'image');
      expect(res.valid).toBe(true);
      expect(res.detectedMime).toBe('image/png');
    });

    it('rejects PDF for banner image purpose', () => {
      const validPdf = Buffer.from('%PDF-1.4 mock content');
      const res = validateFileSafety(validPdf, 'application/pdf', 'image');
      expect(res.valid).toBe(false);
      expect(res.code).toBe('file_rejected');
    });

    it('rejects disguised HTML or script tags inside image buffer (SEC-223)', () => {
      const hostileBuffer = Buffer.from([
        0xff,
        0xd8,
        0xff,
        ...Buffer.from('<html><script>alert(1)</script></html>'),
      ]);
      const res = validateFileSafety(hostileBuffer, 'image/jpeg', 'image');
      expect(res.valid).toBe(false);
      expect(res.code).toBe('file_rejected');
    });

    it('rejects oversize files (>3MB for images)', () => {
      const largeBuffer = Buffer.alloc(3145728 + 10);
      largeBuffer[0] = 0xff;
      largeBuffer[1] = 0xd8;
      largeBuffer[2] = 0xff;
      const res = validateFileSafety(largeBuffer, 'image/jpeg', 'image');
      expect(res.valid).toBe(false);
      expect(res.code).toBe('file_too_large');
    });
  });

  describe('API-201: POST /api/v1/submissions', () => {
    const validBody = {
      kind: 'community',
      title: 'Google Developer Student Club',
      summary: 'Tech community for passionate student developers.',
      description: 'We host regular study jams, workshops, and solution challenge sessions.',
      category_id: '123e4567-e89b-12d3-a456-426614174000',
      contact_name: 'Ibrahim Abubakar',
      contact_channel: 'WhatsApp: 08012345678',
      contact_email: 'ibrahim@example.com',
      form_started_at: Date.now() - 5000, // 5 seconds ago (valid)
      honeypot: '',
      links: [{ label: 'Official Group', url: 'https://chat.whatsapp.com/test' }],
    };

    it('rejects submission if honeypot is filled (SEC-410, API-220)', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: 'campusly_device=0123456789abcdef0123456789abcdef',
          'X-Campusly-Action': '1',
        },
        body: JSON.stringify({ ...validBody, honeypot: 'bot-fill-value' }),
      });

      const res = await submitListing(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error.code).toBe('validation_failed');
    });

    it('rejects submission if completed faster than minimum fill time (<3s, API-220)', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: 'campusly_device=0123456789abcdef0123456789abcdef',
          'X-Campusly-Action': '1',
        },
        body: JSON.stringify({ ...validBody, form_started_at: Date.now() - 500 }),
      });

      const res = await submitListing(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error.code).toBe('validation_failed');
    });

    it('creates submission successfully, generates CY-XXXX-XXXX tracking code, and sends email', async () => {
      (db.query as any)
        .mockResolvedValueOnce({ rows: [] }) // block check
        .mockResolvedValueOnce({ rows: [{ count: 0 }] }); // daily cap count

      (db.withTransaction as any).mockImplementation(async (cb: any) => {
        const client = {
          query: vi
            .fn()
            .mockResolvedValueOnce({ rows: [{ id: 'device-1' }] }) // device
            .mockResolvedValueOnce({ rows: [{ id: 'campus-1' }] }) // campus
            .mockResolvedValueOnce({ rows: [{ id: 'listing-1' }] }) // listing
            .mockResolvedValueOnce({ rows: [] }) // meta
            .mockResolvedValueOnce({ rows: [] }) // links
            .mockResolvedValueOnce({ rows: [] }), // status history
        };
        return cb(client);
      });

      const req = new NextRequest('http://localhost:3000/api/v1/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: 'campusly_device=0123456789abcdef0123456789abcdef',
          'X-Campusly-Action': '1',
        },
        body: JSON.stringify(validBody),
      });

      const res = await submitListing(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.data.status).toBe('pending');
      expect(json.data.tracking_code).toMatch(/^CY-[0-9A-HJ-NP-Z]{4}-[0-9A-HJ-NP-Z]{4}$/);
      expect(email.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'ibrahim@example.com',
          subject: expect.stringContaining('Submission Received'),
        })
      );
    });
  });

  describe('API-202b: POST /api/v1/uploads/presign', () => {
    it('returns presigned upload data and storage key for valid image payload', async () => {
      (db.query as any).mockResolvedValueOnce({ rows: [{ id: 'att-1' }] });

      const req = new NextRequest('http://localhost:3000/api/v1/uploads/presign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: 'campusly_device=0123456789abcdef0123456789abcdef',
          'X-Campusly-Action': '1',
        },
        body: JSON.stringify({
          mime_type: 'image/jpeg',
          bytes: 1048576,
          purpose: 'image',
        }),
      });

      const res = await presignUpload(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.data).toHaveProperty('upload_url');
      expect(json.data.storage_key).toContain('image_');
      expect(json.data.storage_key).toContain('.jpg');
    });
  });

  describe('API-203: POST /api/v1/submissions/duplicates', () => {
    it('queries and returns duplicate matches by title', async () => {
      (db.query as any).mockResolvedValueOnce({
        rows: [
          {
            id: 'l-1',
            kind: 'community',
            slug: 'gdg-abu',
            title: 'GDG ABU Zaria',
            summary: 'Tech club',
            status: 'Approved',
            category_id: 'c-1',
            category_slug: 'tech',
            category_name: 'Tech',
            created_at: new Date().toISOString(),
          },
        ],
      });

      const req = new NextRequest('http://localhost:3000/api/v1/submissions/duplicates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: 'campusly_device=0123456789abcdef0123456789abcdef',
          'X-Campusly-Action': '1',
        },
        body: JSON.stringify({
          kind: 'community',
          title: 'GDG ABU',
        }),
      });

      const res = await checkDuplicates(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.data.matches.length).toBe(1);
      expect(json.data.matches[0].title).toBe('GDG ABU Zaria');
    });
  });

  describe('API-204: GET /api/v1/track/[code]', () => {
    it('returns neutral 404 not_found for malformed tracking code (API-223)', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/track/BAD-CODE-123', {
        headers: { Cookie: 'campusly_device=0123456789abcdef0123456789abcdef' },
      });
      const res = await getTrackStatus(req, { params: Promise.resolve({ code: 'BAD-CODE-123' }) });
      const json = await res.json();

      expect(res.status).toBe(404);
      expect(json.error.code).toBe('not_found');
    });

    it('returns status object with next_step and label for valid code', async () => {
      (db.query as any).mockResolvedValueOnce({
        rows: [
          {
            id: 'listing-1',
            title: 'GDGOC ABU Zaria',
            kind: 'community',
            status: 'Pending',
            updated_at: new Date().toISOString(),
            reason_code: null,
            status_note: null,
            status_changed_at: new Date().toISOString(),
          },
        ],
      });

      const req = new NextRequest('http://localhost:3000/api/v1/track/CY-7K3M-9QXP', {
        headers: { Cookie: 'campusly_device=0123456789abcdef0123456789abcdef' },
      });
      const res = await getTrackStatus(req, { params: Promise.resolve({ code: 'CY-7K3M-9QXP' }) });
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.data.tracking_code).toBe('CY-7K3M-9QXP');
      expect(json.data.status).toBe('pending');
      expect(json.data.label).toBe('Pending review');
    });
  });

  describe('API-205: POST /api/v1/track/[code]/reply', () => {
    it('refuses reply if status is not Needs info (409 wrong_state)', async () => {
      (db.query as any).mockResolvedValueOnce({
        rows: [
          {
            id: 'listing-1',
            title: 'GDGOC ABU Zaria',
            kind: 'community',
            status: 'Approved',
            updated_at: new Date().toISOString(),
          },
        ],
      });

      const req = new NextRequest('http://localhost:3000/api/v1/track/CY-7K3M-9QXP/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: 'campusly_device=0123456789abcdef0123456789abcdef',
          'X-Campusly-Action': '1',
        },
        body: JSON.stringify({ message: 'Here is the requested details' }),
      });

      const res = await replyTrack(req, { params: Promise.resolve({ code: 'CY-7K3M-9QXP' }) });
      const json = await res.json();

      expect(res.status).toBe(409);
      expect(json.error.code).toBe('wrong_state');
    });

    it('refuses reply if the reply window has closed (410 window_closed)', async () => {
      // 10 days ago (window is 7 days)
      const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
      (db.query as any).mockResolvedValueOnce({
        rows: [
          {
            id: 'listing-1',
            title: 'GDGOC ABU Zaria',
            kind: 'community',
            status: 'Needs info',
            updated_at: tenDaysAgo,
            status_changed_at: tenDaysAgo,
          },
        ],
      });

      const req = new NextRequest('http://localhost:3000/api/v1/track/CY-7K3M-9QXP/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: 'campusly_device=0123456789abcdef0123456789abcdef',
          'X-Campusly-Action': '1',
        },
        body: JSON.stringify({ message: 'Late response' }),
      });

      const res = await replyTrack(req, { params: Promise.resolve({ code: 'CY-7K3M-9QXP' }) });
      const json = await res.json();

      expect(res.status).toBe(410);
      expect(json.error.code).toBe('window_closed');
    });
  });
});
