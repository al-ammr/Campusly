import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { query } from '@/lib/db';
import { isS3Configured, uploadToStorage, getPublicStorageUrl } from './s3';

export const ALLOWED_MIME_TYPES = {
  'image/jpeg': { ext: 'jpg', maxBytes: 3145728, purpose: ['image', 'proof', 'receipt'] },
  'image/png': { ext: 'png', maxBytes: 3145728, purpose: ['image', 'proof', 'receipt'] },
  'image/webp': { ext: 'webp', maxBytes: 3145728, purpose: ['image', 'proof', 'receipt'] },
  'application/pdf': { ext: 'pdf', maxBytes: 5242880, purpose: ['proof', 'receipt'] },
} as const;

export type AllowedMimeType = keyof typeof ALLOWED_MIME_TYPES;

export interface ValidationResult {
  valid: boolean;
  code?: 'file_type_not_allowed' | 'file_too_large' | 'file_rejected';
  message?: string;
  detectedMime?: AllowedMimeType;
}

/**
 * Validates file buffer magic bytes against declared MIME type (D08 SEC-220 to SEC-225).
 * Disallows SVGs, executable code, and disguised scripts.
 */
export function validateFileSafety(
  buffer: Buffer,
  declaredMime: string,
  purpose: 'image' | 'proof' | 'receipt'
): ValidationResult {
  // 1. Check allowed MIME type
  if (!(declaredMime in ALLOWED_MIME_TYPES)) {
    return {
      valid: false,
      code: 'file_type_not_allowed',
      message: 'Only JPG, PNG, WebP or PDF files are accepted.',
    };
  }

  const mimeConfig = ALLOWED_MIME_TYPES[declaredMime as AllowedMimeType];

  // 2. Purpose restriction (PDF not allowed for listing banner images)
  if (!(mimeConfig.purpose as readonly string[]).includes(purpose)) {
    return {
      valid: false,
      code: 'file_rejected',
      message: `PDF files cannot be used as banner images.`,
    };
  }

  // 3. File size check
  if (buffer.length > mimeConfig.maxBytes) {
    return {
      valid: false,
      code: 'file_too_large',
      message: `The uploaded file exceeds the ${Math.round(mimeConfig.maxBytes / (1024 * 1024))}MB limit.`,
    };
  }

  // 4. Magic bytes verification (SEC-221)
  if (declaredMime === 'image/jpeg') {
    if (buffer.length < 3 || buffer[0] !== 0xff || buffer[1] !== 0xd8 || buffer[2] !== 0xff) {
      return { valid: false, code: 'file_rejected', message: 'File is corrupted or not a valid JPEG.' };
    }
  } else if (declaredMime === 'image/png') {
    if (
      buffer.length < 8 ||
      buffer[0] !== 0x89 ||
      buffer[1] !== 0x50 ||
      buffer[2] !== 0x4e ||
      buffer[3] !== 0x47 ||
      buffer[4] !== 0x0d ||
      buffer[5] !== 0x0a ||
      buffer[6] !== 0x1a ||
      buffer[7] !== 0x0a
    ) {
      return { valid: false, code: 'file_rejected', message: 'File is corrupted or not a valid PNG.' };
    }
  } else if (declaredMime === 'image/webp') {
    if (
      buffer.length < 12 ||
      buffer.toString('ascii', 0, 4) !== 'RIFF' ||
      buffer.toString('ascii', 8, 12) !== 'WEBP'
    ) {
      return { valid: false, code: 'file_rejected', message: 'File is corrupted or not a valid WebP.' };
    }
  } else if (declaredMime === 'application/pdf') {
    if (buffer.length < 4 || buffer.toString('ascii', 0, 4) !== '%PDF') {
      return { valid: false, code: 'file_rejected', message: 'File is corrupted or not a valid PDF document.' };
    }
  }

  // 5. Hostile content scan (SEC-223): Reject embedded scripts or disguised HTML
  const headSample = buffer.slice(0, Math.min(buffer.length, 2048)).toString('utf-8', 0).toLowerCase();
  const hostilePatterns = [
    '<script',
    '<html',
    '<svg',
    '<?php',
    'eval(',
    'data:text/html',
    'onload=',
    'onerror=',
  ];

  for (const pattern of hostilePatterns) {
    if (headSample.includes(pattern)) {
      return {
        valid: false,
        code: 'file_rejected',
        message: 'File failed safety checks.',
      };
    }
  }

  return { valid: true, detectedMime: declaredMime as AllowedMimeType };
}

/**
 * Persists an uploaded attachment to disk/storage and records it in attachments table.
 */
export async function storeAttachment(params: {
  buffer: Buffer;
  mime: AllowedMimeType;
  purpose: 'image' | 'proof' | 'receipt';
  deviceId?: string;
  altText?: string;
}) {
  const ext = ALLOWED_MIME_TYPES[params.mime].ext;
  const storageKey = `${params.purpose}_${crypto.randomUUID()}.${ext}`;

  let publicUrl = `/uploads/${storageKey}`;

  // If S3/Supabase storage is configured, upload to S3; otherwise save to local disk
  if (isS3Configured()) {
    try {
      const uploadRes = await uploadToStorage({
        key: storageKey,
        buffer: params.buffer,
        mime: params.mime,
      });
      publicUrl = uploadRes.publicUrl;
    } catch (err) {
      console.warn('[Storage] S3 upload failed, falling back to local filesystem:', err);
      const uploadsDir = path.resolve(process.cwd(), 'public/uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const filePath = path.join(uploadsDir, storageKey);
      await fs.promises.writeFile(filePath, params.buffer);
    }
  } else {
    // Ensure uploads directory exists
    const uploadsDir = path.resolve(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const filePath = path.join(uploadsDir, storageKey);
    await fs.promises.writeFile(filePath, params.buffer);
  }

  // Record in attachments table (API-224: delete_after set to 24h if not attached)
  const res = await query(
    `INSERT INTO attachments (
       owner_type, purpose, storage_key, mime, bytes, alt_text, scanned_at, delete_after
     ) VALUES (
       $1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '24 hours'
     ) RETURNING id, storage_key, bytes, mime, created_at;`,
    [
      params.purpose,
      params.purpose,
      storageKey,
      params.mime,
      params.buffer.length,
      params.altText || null,
    ]
  );

  return {
    id: res.rows[0].id,
    storageKey: res.rows[0].storage_key,
    url: publicUrl,
    bytes: res.rows[0].bytes,
  };
}
