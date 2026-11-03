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

/**
 * Check and increment an atomic rate limiter window.
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
    // BP-05 Fallback behaviour: fail closed for writes, open for reads
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
 * Clears the rate limiter store (useful in unit testing).
 */
export function clearRateLimitStore(): void {
  memoryStore.clear();
}
