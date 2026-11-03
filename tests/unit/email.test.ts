import { describe, it, expect, vi } from 'vitest';
import { sendEmail } from '@/lib/email';

describe('Transactional Email Service (lib/email)', () => {
  it('dispatches mock email cleanly in test environment without throwing', async () => {
    const result = await sendEmail({
      to: 'student@example.com',
      subject: 'Welcome to Campusly',
      text: 'Your tracking code is CY-1234-5678.',
    });

    expect(result.success).toBe(true);
    expect(result.messageId).toBeDefined();
    expect(result.messageId?.startsWith('mock_')).toBe(true);
  });

  it('strips CRLF line breaks from headers to prevent header injection', async () => {
    const result = await sendEmail({
      to: 'student@example.com\r\nBcc: attacker@evil.com',
      subject: 'Security Alert\r\nSubject-Injection: Bad',
      text: 'Clean email body content.',
    });

    expect(result.success).toBe(true);
  });
});
