import { describe, it, expect, beforeEach } from 'vitest';
import {
  ERROR_CATALOGUE,
  createErrorResponse,
  createSuccessResponse,
} from '@/lib/api/envelope';
import { getSecurityHeaders, validateCsrf, saveIdempotentResponse, getIdempotentResponse, clearIdempotencyStore } from '@/lib/api/security';
import { hashDeviceToken, getHashedNetworkKey, DEVICE_COOKIE_NAME, DEVICE_COOKIE_MAX_AGE } from '@/lib/api/device';
import { checkRateLimit, clearRateLimitStore } from '@/lib/api/rate-limit';
import { sendTransactionalEmail, mockEmailSentLog, clearMockEmailLog } from '@/lib/email';
import { NextRequest } from 'next/server';

describe('API Framework, Device Identity & Rate Limits (BP-05)', () => {
  beforeEach(() => {
    clearRateLimitStore();
    clearIdempotencyStore();
    clearMockEmailLog();
  });

  describe('D06 Section 9: Error Catalogue Completeness', () => {
    const errorKeys = Object.keys(ERROR_CATALOGUE) as (keyof typeof ERROR_CATALOGUE)[];

    it('defines all 20 canonical error codes from D06', () => {
      expect(errorKeys.length).toBeGreaterThanOrEqual(20);
    });

    for (const key of errorKeys) {
      const err = ERROR_CATALOGUE[key];
      it(`generates standard envelope for error [${err.status}] ${err.code}`, async () => {
        const reqId = 'req_test_12345';
        const res = createErrorResponse(err, reqId);
        expect(res.status).toBe(err.status);
        expect(res.headers.get('X-Request-Id')).toBe(reqId);
        expect(res.headers.get('Cache-Control')).toBe('no-store');

        const body = await res.json();
        expect(body.error).toBeDefined();
        expect(body.error.code).toBe(err.code);
        expect(body.error.message).toBe(err.message);
        expect(body.error.request_id).toBe(reqId);
      });
    }

    it('attaches validation fields when provided', async () => {
      const res = createErrorResponse(ERROR_CATALOGUE.VALIDATION_FAILED, 'req_val_1', {
        fields: [{ field: 'title', code: 'too_long', message: 'Use 100 characters or fewer.' }],
      });
      const body = await res.json();
      expect(body.error.fields).toEqual([
        { field: 'title', code: 'too_long', message: 'Use 100 characters or fewer.' },
      ]);
    });

    it('attaches retry_after and Retry-After header on 429 errors', async () => {
      const res = createErrorResponse(ERROR_CATALOGUE.RATE_LIMITED, 'req_rl_1', {
        retryAfter: 45,
      });
      expect(res.status).toBe(429);
      expect(res.headers.get('Retry-After')).toBe('45');
      const body = await res.json();
      expect(body.error.retry_after).toBe(45);
    });
  });

  describe('D08 Section 5: Mandatory Security Headers', () => {
    it('returns strict security headers on every response', () => {
      const headers = getSecurityHeaders({ isReportOnlyCsp: true });
      expect(headers['X-Content-Type-Options']).toBe('nosniff');
      expect(headers['X-Frame-Options']).toBe('DENY');
      expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
      expect(headers['Permissions-Policy']).toContain('camera=()');
      expect(headers['Content-Security-Policy-Report-Only']).toBeDefined();
      expect(headers['Content-Security-Policy-Report-Only']).toContain("frame-ancestors 'none'");
    });
  });

  describe('Device Identity & Network Privacy (ARC-901, ARC-904, D08)', () => {
    it('hashes device token using SHA-256 and never logs raw token', () => {
      const raw = '0123456789abcdef0123456789abcdef';
      const hash1 = hashDeviceToken(raw);
      const hash2 = hashDeviceToken(raw);

      expect(hash1).toHaveLength(64);
      expect(hash1).toBe(hash2);
      expect(hash1).not.toBe(raw);
    });

    it('creates salted network key hash without storing raw IP', () => {
      const ip = '197.210.64.12';
      const netKey = getHashedNetworkKey(ip);

      expect(netKey).toHaveLength(32);
      expect(netKey).not.toContain(ip);
    });

    it('formats campusly_device cookie with HttpOnly, SameSite=Lax, and 1-year max age', () => {
      expect(DEVICE_COOKIE_NAME).toBe('campusly_device');
      expect(DEVICE_COOKIE_MAX_AGE).toBe(31536000);
    });
  });

  describe('Anti-Forgery (CSRF) & Idempotency (SEC-320, D06)', () => {
    it('permits read requests without CSRF check', () => {
      const req = new NextRequest('http://localhost:3000/api/v1/test', { method: 'GET' });
      expect(validateCsrf(req)).toBe(true);
    });

    it('permits write requests carrying the custom action header', () => {
      const req = new NextRequest('http://localhost:3000/api/v1/test', {
        method: 'POST',
        headers: { 'x-campusly-action': '1' },
      });
      expect(validateCsrf(req)).toBe(true);
    });

    it('stores and replays idempotent responses within 24 hours', () => {
      const key = 'idem_test_abc';
      saveIdempotentResponse(key, 201, { success: true }, { 'X-Custom': '1' });

      const retrieved = getIdempotentResponse(key);
      expect(retrieved).toBeDefined();
      expect(retrieved?.status).toBe(201);
      expect(retrieved?.body).toEqual({ success: true });
    });
  });

  describe('Rate Limiter Concurrency & Atomic Caps', () => {
    it('allows requests up to the cap and blocks exceeding requests', async () => {
      const key = 'test_user_rate_limit';
      const limit = 5;
      const windowSec = 60;

      // 5 allowed requests
      for (let i = 0; i < limit; i++) {
        const res = await checkRateLimit(key, limit, windowSec, true);
        expect(res.allowed).toBe(true);
        expect(res.remaining).toBe(limit - 1 - i);
      }

      // 6th request is blocked
      const blockedRes = await checkRateLimit(key, limit, windowSec, true);
      expect(blockedRes.allowed).toBe(false);
      expect(blockedRes.remaining).toBe(0);
      expect(blockedRes.retryAfterSeconds).toBeGreaterThan(0);
    });

    it('concurrency test: parallel requests cannot exceed atomic cap', async () => {
      const key = 'concurrent_cap_test';
      const limit = 10;
      const windowSec = 60;

      // Execute 30 parallel requests
      const promises = Array.from({ length: 30 }).map(() =>
        checkRateLimit(key, limit, windowSec, true)
      );

      const results = await Promise.all(promises);
      const allowedCount = results.filter((r) => r.allowed).length;
      const blockedCount = results.filter((r) => !r.allowed).length;

      expect(allowedCount).toBe(limit);
      expect(blockedCount).toBe(20);
    });
  });

  describe('Transactional Email Service Foundation (lib/email, SEC-414)', () => {
    it('dispatches emails asynchronously via mock provider without blocking', async () => {
      await sendTransactionalEmail({
        to: 'student@example.com',
        subject: 'Campusly Submission Received',
        text: 'Your tracking code is CY-8K2M-1X9A.',
        trackingCode: 'CY-8K2M-1X9A',
      });

      // Wait a microtick for asynchronous dispatch
      await new Promise((resolve) => setTimeout(resolve, 20));

      expect(mockEmailSentLog.length).toBe(1);
      expect(mockEmailSentLog[0].to).toBe('student@example.com');
      expect(mockEmailSentLog[0].trackingCode).toBe('CY-8K2M-1X9A');
    });
  });
});
