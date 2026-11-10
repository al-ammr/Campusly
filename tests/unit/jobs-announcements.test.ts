import { describe, it, expect } from 'vitest';
import { verifyCronAuth } from '@/lib/middleware/cronAuth';
import { executeScheduledJob } from '@/lib/jobs';

describe('Scheduled Jobs & Background Automation Specification (BP-13)', () => {
  describe('Cron Authentication & Timing-Safe Verification', () => {
    it('rejects requests without authorization header', () => {
      const req = new Request('https://campusly.abu.edu.ng/api/v1/jobs/expire-spotlight');
      expect(verifyCronAuth(req)).toBe(false);
    });

    it('rejects requests with malformed or incorrect token', () => {
      const req = new Request('https://campusly.abu.edu.ng/api/v1/jobs/expire-spotlight', {
        headers: { Authorization: 'Bearer totally_wrong_secret_key_123' },
      });
      expect(verifyCronAuth(req)).toBe(false);
    });

    it('accepts requests with matching JOB_SECRET', () => {
      const secret = process.env.JOB_SECRET || process.env.CRON_SECRET || 'campusly_job_secret_default_2026';
      const req = new Request('https://campusly.abu.edu.ng/api/v1/jobs/expire-spotlight', {
        headers: { Authorization: `Bearer ${secret}` },
      });
      expect(verifyCronAuth(req)).toBe(true);
    });
  });

  describe('Scheduled Job Execution Wrapper', () => {
    it('executes job function and returns structured outcome', async () => {
      const result = await executeScheduledJob('test_mock_job', async () => {
        return { processed: 42 };
      });

      expect(result.ok).toBe(true);
      expect(result.job).toBe('test_mock_job');
      expect(result.result).toEqual({ processed: 42 });
    });

    it('catches runner errors and records failure cleanly without crashing', async () => {
      const result = await executeScheduledJob('test_failing_job', async () => {
        throw new Error('Simulated network timeout');
      });

      expect(result.ok).toBe(false);
      expect(result.job).toBe('test_failing_job');
      expect(result.error).toContain('Simulated network timeout');
    });
  });
});
