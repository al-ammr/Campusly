// lib/auth/totp.ts
import crypto from 'crypto';

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Encode(buffer: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;
    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }

  return output;
}

function base32Decode(str: string): Buffer {
  const cleanStr = str.toUpperCase().replace(/=+$/, '');
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (let i = 0; i < cleanStr.length; i++) {
    const idx = BASE32_ALPHABET.indexOf(cleanStr[i]);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

function generateHotp(secretBuffer: Buffer, counter: number): string {
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigInt64BE(BigInt(counter));

  const hmac = crypto.createHmac('sha1', secretBuffer);
  hmac.update(counterBuffer);
  const digest = hmac.digest();

  const offset = digest[digest.length - 1] & 0xf;
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  const otp = (binary % 1000000).toString().padStart(6, '0');
  return otp;
}

/**
 * Generate a new TOTP secret for an admin. The secret is Base32 encoded.
 * Returns the secret and a QR code data URL (otpauth URI) that can be rendered.
 */
export function generateTotpSecret(): { secret: string; otpauthUrl: string } {
  const randomBytes = crypto.randomBytes(20);
  const secret = base32Encode(randomBytes);
  const otpauthUrl = `otpauth://totp/Campusly:admin?secret=${secret}&issuer=Campusly`;
  return { secret, otpauthUrl };
}

/** Verify a TOTP code against a stored secret (checks current, prev, and next 30s window). */
export function verifyTotpCode(secret: string, token: string): boolean {
  if (!token || token.length !== 6) return false;
  try {
    const key = base32Decode(secret);
    const epochSeconds = Math.floor(Date.now() / 1000);
    const currentCounter = Math.floor(epochSeconds / 30);

    for (const offset of [-1, 0, 1]) {
      const generated = generateHotp(key, currentCounter + offset);
      if (generated === token) {
        return true;
      }
    }
  } catch {
    return false;
  }
  return false;
}

/** Generate a random backup code (hex string). */
export function generateBackupCode(): string {
  return crypto.randomBytes(4).toString('hex'); // 8‑char hex
}
