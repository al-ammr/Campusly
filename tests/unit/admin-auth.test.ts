import { describe, it, expect, beforeEach } from 'vitest';
import {
  authenticateAdminCredentials,
  isLockedOut,
  recordFailedAttempt,
  clearFailedAttempts,
  MASTER_ADMIN_EMAIL,
  MASTER_ADMIN_PASS,
} from '@/lib/auth/adminAuth';
import { hashPassword, verifyPassword } from '@/lib/auth/passwordHash';
import { generateTotpSecret, verifyTotpCode } from '@/lib/auth/totp';

describe('Admin Authentication & Security Specification (BP-10)', () => {
  const testIp = '192.168.1.100';

  beforeEach(() => {
    clearFailedAttempts('admin@campusly.abu.edu.ng', testIp);
    clearFailedAttempts('fake@campusly.abu.fake', testIp);
  });

  describe('Master Lead Credentials Wiring', () => {
    it('successfully authenticates master admin with configured password', async () => {
      const result = await authenticateAdminCredentials(
        MASTER_ADMIN_EMAIL,
        MASTER_ADMIN_PASS,
        testIp
      );

      expect(result.success).toBe(true);
      expect(result.admin).toBeDefined();
      expect(result.admin?.role).toBe('lead');
      expect(result.admin?.email).toBe(MASTER_ADMIN_EMAIL);
    });

    it('rejects master admin if password does not match', async () => {
      const result = await authenticateAdminCredentials(
        MASTER_ADMIN_EMAIL,
        'WrongPassword123!',
        testIp
      );

      expect(result.success).toBe(false);
      expect(result.admin).toBeUndefined();
    });

    it('allows shorthand "admin" alias for master lead admin', async () => {
      const result = await authenticateAdminCredentials(
        'admin',
        MASTER_ADMIN_PASS,
        testIp
      );

      expect(result.success).toBe(true);
      expect(result.admin?.role).toBe('lead');
    });
  });

  describe('Memory-hard Scrypt Password Hashing (SEC-103)', () => {
    it('hashes passwords using scrypt with proper format', async () => {
      const rawPassword = '@AdminAccess2026$';
      const hash = await hashPassword(rawPassword);

      expect(hash.startsWith('scrypt$16384$8$1$')).toBe(true);
      const parts = hash.split('$');
      expect(parts.length).toBe(6);

      const isValid = await verifyPassword(hash, rawPassword);
      expect(isValid).toBe(true);

      const isInvalid = await verifyPassword(hash, 'IncorrectPassword');
      expect(isInvalid).toBe(false);
    });
  });

  describe('Lockout Enforcement (SEC-105)', () => {
    it('locks account out after 5 consecutive failed attempts for 15 minutes', () => {
      const email = 'target@campusly.abu.fake';
      expect(isLockedOut(email, testIp)).toBe(false);

      for (let i = 0; i < 4; i++) {
        recordFailedAttempt(email, testIp);
        expect(isLockedOut(email, testIp)).toBe(false);
      }

      // 5th attempt locks
      recordFailedAttempt(email, testIp);
      expect(isLockedOut(email, testIp)).toBe(true);

      clearFailedAttempts(email, testIp);
      expect(isLockedOut(email, testIp)).toBe(false);
    });
  });

  describe('RFC 6238 TOTP Two-Factor Authentication (SEC-104)', () => {
    it('generates Base32 TOTP secret and valid otpauth URL', () => {
      const { secret, otpauthUrl } = generateTotpSecret();
      expect(secret).toBeDefined();
      expect(secret.length).toBeGreaterThanOrEqual(16);
      expect(otpauthUrl).toContain('otpauth://totp/Campusly:admin');
      expect(otpauthUrl).toContain(secret);
    });

    it('rejects invalid or incorrect length TOTP tokens', () => {
      const { secret } = generateTotpSecret();
      expect(verifyTotpCode(secret, '12')).toBe(false);
      expect(verifyTotpCode(secret, 'ABCDEF')).toBe(false);
    });
  });
});
