import * as crypto from 'crypto';
import { NextRequest } from 'next/server';
import { env } from '@/lib/env';
import { query } from '@/lib/db';

export const DEVICE_COOKIE_NAME = 'campusly_device';
export const DEVICE_COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

export interface DeviceContext {
  tokenHash: string;
  isNewDevice: boolean;
  networkKey: string;
}

/**
 * Hash an anonymous device token using SHA-256.
 * The raw token is stored only in the client cookie; database holds only the hash.
 */
export function hashDeviceToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

/**
 * Generate a salted SHA-256 hash of a client IP address.
 * Never stores or logs raw IP addresses (ARC-904, D08).
 */
export function getHashedNetworkKey(ip: string): string {
  const salt = env.SESSION_SECRET || 'campusly_network_salt_default';
  return crypto.createHash('sha256').update(`${salt}:${ip}`).digest('hex').substring(0, 32);
}

/**
 * Extracts or provisions the anonymous device identity and network hash.
 */
export async function getOrCreateDeviceContext(
  req: NextRequest,
  setCookieHeaders?: Headers
): Promise<{ context: DeviceContext; cookieToSet?: string }> {
  // Extract client IP (handling standard reverse proxy headers)
  const forwarded = req.headers.get('x-forwarded-for');
  const rawIp = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
  const networkKey = getHashedNetworkKey(rawIp);

  const existingCookie = req.cookies.get(DEVICE_COOKIE_NAME)?.value;

  if (existingCookie && /^[0-9a-fA-F]{32}$/.test(existingCookie)) {
    const tokenHash = hashDeviceToken(existingCookie);
    return {
      context: {
        tokenHash,
        isNewDevice: false,
        networkKey,
      },
    };
  }

  // Generate 128-bit random token (32 hex characters)
  const newRawToken = crypto.randomBytes(16).toString('hex');
  const tokenHash = hashDeviceToken(newRawToken);

  // Attempt to record new device in database (if connected)
  try {
    await query(
      `INSERT INTO devices (token_hash, first_seen_at, last_seen_at)
       VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT (token_hash) DO UPDATE SET last_seen_at = CURRENT_TIMESTAMP;`,
      [tokenHash]
    );
  } catch (error) {
    // If DB is offline, continue anonymously with hash
  }

  // Format cookie string with mandatory security attributes
  const isProd = env.NODE_ENV === 'production';
  const cookieValue = `${DEVICE_COOKIE_NAME}=${newRawToken}; Path=/; Max-Age=${DEVICE_COOKIE_MAX_AGE}; HttpOnly; SameSite=Lax${
    isProd ? '; Secure' : ''
  }`;

  if (setCookieHeaders) {
    setCookieHeaders.append('Set-Cookie', cookieValue);
  }

  return {
    context: {
      tokenHash,
      isNewDevice: true,
      networkKey,
    },
    cookieToSet: cookieValue,
  };
}
