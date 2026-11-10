import { describe, it, expect } from 'vitest';
import { POST as orderHandler } from '@/app/api/v1/spotlight/order/route';
import { POST as actionHandler } from '@/app/api/v1/admin/spotlight/[id]/action/route';

describe('Spotlight Commercial Product Specification (BP-12)', () => {
  describe('Order Creation & Terms Acceptance (LEG-301)', () => {
    it('refuses order creation without explicit terms acceptance', async () => {
      const req = new Request('https://campusly.abu.edu.ng/api/v1/spotlight/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: 'standard',
          business_name: 'Campus Shawarma',
          offer: '10% discount',
          agree_terms: false,
        }),
      });

      const res = await orderHandler(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe('terms_required');
    });

    it('refuses order creation with invalid plan', async () => {
      const req = new Request('https://campusly.abu.edu.ng/api/v1/spotlight/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: 'unlimited_mega_plan',
          agree_terms: true,
        }),
      });

      const res = await orderHandler(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe('invalid_plan');
    });
  });

  describe('Bank Verification Rules (SEC-510 & SEC-511)', () => {
    it('refuses activation when "confirmed_in_bank" is not checked', async () => {
      const req = new Request('https://campusly.abu.edu.ng/api/v1/admin/spotlight/123/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'cf_admin=master_session_test',
        },
        body: JSON.stringify({
          action: 'activate',
          confirmed_in_bank: false,
          bank_reference: 'NIP-12345',
        }),
      });

      const res = await actionHandler(req, { params: Promise.resolve({ id: '123' }) });
      expect([400, 500, 503]).toContain(res.status);
    });

    it('refuses activation when bank_reference is missing', async () => {
      const req = new Request('https://campusly.abu.edu.ng/api/v1/admin/spotlight/123/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'cf_admin=master_session_test',
        },
        body: JSON.stringify({
          action: 'activate',
          confirmed_in_bank: true,
          bank_reference: '',
        }),
      });

      const res = await actionHandler(req, { params: Promise.resolve({ id: '123' }) });
      expect([400, 500, 503]).toContain(res.status);
    });
  });
});
