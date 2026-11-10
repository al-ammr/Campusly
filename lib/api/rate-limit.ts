import { env } from '@/lib/env';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory atomic rate limiter store
const memoryStore = new Map<string, RateLimitRecord>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
  totalLimit: number;
}

function checkMemoryRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
  isWrite: boolean = false
): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  try {
    let record = memoryStore.get(key);

    if (!record || now >= record.resetAt) {
      record = {
        count: 1,
        resetAt: now + windowMs,
      };
      memoryStore.set(key, record);
      return {
        allowed: true,
        remaining: Math.max(0, limit - 1),
        retryAfterSeconds: windowSeconds,
        totalLimit: limit,
      };
    }

    if (record.count >= limit) {
      const retryAfter = Math.ceil((record.resetAt - now) / 1000);
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: Math.max(1, retryAfter),
        totalLimit: limit,
      };
    }

    record.count += 1;
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    return {
      allowed: true,
      remaining: Math.max(0, limit - record.count),
      retryAfterSeconds: Math.max(1, retryAfter),
      totalLimit: limit,
    };
  } catch (error) {
    console.error('[RateLimit Error]:', error);
    if (isWrite) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: 60,
        totalLimit: limit,
      };
    }
    return {
      allowed: true,
      remaining: 1,
      retryAfterSeconds: 0,
      totalLimit: limit,
    };
  }
}

/**
 * Check and increment an atomic rate limiter window.
 * Uses Upstash Redis REST pipeline when configured, falling back to memory store.
 *
 * @param key Unique identifier (e.g. `submit:${tokenHash}`)
 * @param limit Maximum allowed events in window
 * @param windowSeconds Window length in seconds
 * @param isWrite Whether this is a state-changing write action
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
  isWrite: boolean = false
): Promise<RateLimitResult> {
  // If in test environment or Upstash not configured, use memory store
  if (env.NODE_ENV === 'test' || !env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    return checkMemoryRateLimit(key, limit, windowSeconds, isWrite);
  }

  try {
    const response = await fetch(`${env.UPSTASH_REDIS_REST_URL}/pipeline`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', `ratelimit:${key}`],
        ['EXPIRE', `ratelimit:${key}`, windowSeconds, 'NX'],
        ['TTL', `ratelimit:${key}`],
      ]),
    });

    if (!response.ok) {
      throw new Error(`Upstash HTTP Error ${response.status}`);
    }

    const results = await response.json();
    const currentCount = Number(results[0]?.result || 1);
    const ttlSeconds = Number(results[2]?.result || windowSeconds);
    const retryAfter = ttlSeconds > 0 ? ttlSeconds : windowSeconds;

    if (currentCount > limit) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: retryAfter,
        totalLimit: limit,
      };
    }

    return {
      allowed: true,
      remaining: Math.max(0, limit - currentCount),
      retryAfterSeconds: retryAfter,
      totalLimit: limit,
    };
  } catch (error) {
    console.warn('[Upstash RateLimit Warning] Falling back to memory store:', error instanceof Error ? error.message : error);
    return checkMemoryRateLimit(key, limit, windowSeconds, isWrite);
  }
}

/**
 * Clears the rate limiter store (useful in unit testing).
 */
export function clearRateLimitStore(): void {
  memoryStore.clear();
}
