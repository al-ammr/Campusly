// lib/auth/passwordHash.ts
import crypto from 'crypto';

/**
 * Hash a plaintext password using standard scrypt (RFC 7914 / SEC-101).
 * Format: scrypt$<N>$<r>$<p>$<saltHex>$<derivedKeyHex>
 */
export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`scrypt$16384$8$1$${salt}$${derivedKey.toString('hex')}`);
    });
  });
}

/** Verify a password against a stored hash using timing-safe comparison. */
export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const parts = hash.split('$');
      if (parts.length !== 6 || parts[0] !== 'scrypt') {
        return resolve(false);
      }
      const N = parseInt(parts[1], 10);
      const r = parseInt(parts[2], 10);
      const p = parseInt(parts[3], 10);
      const salt = parts[4];
      const keyHex = parts[5];
      const expectedBuffer = Buffer.from(keyHex, 'hex');

      crypto.scrypt(password, salt, expectedBuffer.length, { N, r, p, maxmem: 64 * 1024 * 1024 }, (err, derivedKey) => {
        if (err) return resolve(false);
        resolve(crypto.timingSafeEqual(expectedBuffer, derivedKey));
      });
    } catch {
      resolve(false);
    }
  });
}
