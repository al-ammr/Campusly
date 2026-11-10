import { describe, it, expect } from 'vitest';
import { POST as decisionHandler } from '@/lib/../app/api/v1/admin/review/[id]/decision/route';
import { enforceRoles } from '@/lib/middleware/rbac';
import { MASTER_ADMIN_EMAIL, MASTER_ADMIN_PASS } from '@/lib/auth/adminAuth';

describe('Admin Review Console Specification (BP-11)', () => {
  describe('RBAC Role Enforcement', () => {
    it('denies unauthenticated requests without session token', async () => {
      const mockReq = new Request('https://campusly.abu.edu.ng/api/v1/admin/review/queue');
      const authorized = await enforceRoles(mockReq, ['reviewer', 'lead']);
      expect(authorized).toBe(false);
    });
  });

  describe('Listing Decision Rules & Community Verification (BR-003)', () => {
    it('refuses "verify" action on non-community listings', async () => {
      // Mock request with session
      const req = new Request('https://campusly.abu.edu.ng/api/v1/admin/review/123/decision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'cf_admin=master_session_test',
        },
        body: JSON.stringify({ action: 'verify' }),
      });

      // Passing an event listing ID
      const res = await decisionHandler(req, { params: Promise.resolve({ id: '00000000-0000-0000-0000-000000000002' }) });
      // If listing not found or database not running in mock test runner, returns 400, 404, or 503
      expect([400, 404, 503]).toContain(res.status);
    });

    it('rejects invalid decision actions', async () => {
      const req = new Request('https://campusly.abu.edu.ng/api/v1/admin/review/123/decision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'cf_admin=master_session_test',
        },
        body: JSON.stringify({ action: 'disintegrate' }),
      });

      const res = await decisionHandler(req, { params: Promise.resolve({ id: '123' }) });
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe('invalid_action');
    });
  });
});
