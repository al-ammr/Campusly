import { describe, it, expect } from 'vitest';
import { env } from '@/lib/env';

describe('Environment Validator (lib/env.ts)', () => {
  it('loads valid environment configuration without throwing', () => {
    expect(env).toBeDefined();
    expect(env.DATABASE_URL).toBeDefined();
    expect(env.SESSION_SECRET).toBeDefined();
    expect(env.NEXT_PUBLIC_APP_URL).toBeDefined();
  });

  it('has valid default campus slug', () => {
    expect(env.NEXT_PUBLIC_DEFAULT_CAMPUS_SLUG).toBe('abu-zaria');
  });

  it('enforces minimum length for session secret and encryption keys', () => {
    expect(env.SESSION_SECRET).toBeDefined();
    expect(env.DATA_ENCRYPTION_KEY).toBeDefined();
    expect(env.SESSION_SECRET?.length).toBeGreaterThanOrEqual(32);
    expect(env.DATA_ENCRYPTION_KEY?.length).toBeGreaterThanOrEqual(32);
  });
});
