import { z } from 'zod';
import * as crypto from 'crypto';
import { createApiHandler } from '@/lib/api/handler';
import { createSuccessResponse, createErrorResponse, ERROR_CATALOGUE } from '@/lib/api/envelope';
import { ALLOWED_MIME_TYPES, AllowedMimeType } from '@/lib/storage/upload';
import { query } from '@/lib/db';

const PresignSchema = z.object({
  mime_type: z.string(),
  bytes: z.number().int().positive(),
  purpose: z.enum(['image', 'proof', 'receipt']),
});

export const POST = createApiHandler(
  { bodySchema: PresignSchema },
  async ({ body, requestId }) => {
    const { mime_type, bytes, purpose } = body;

    if (!(mime_type in ALLOWED_MIME_TYPES)) {
      return createErrorResponse(ERROR_CATALOGUE.FILE_TYPE_NOT_ALLOWED, requestId);
    }

    const mimeConfig = ALLOWED_MIME_TYPES[mime_type as AllowedMimeType];
    if (!(mimeConfig.purpose as readonly string[]).includes(purpose)) {
      return createErrorResponse(ERROR_CATALOGUE.FILE_REJECTED, requestId);
    }

    if (bytes > mimeConfig.maxBytes) {
      return createErrorResponse(ERROR_CATALOGUE.FILE_TOO_LARGE, requestId);
    }

    const ext = mimeConfig.ext;
    const storageKey = `${purpose}_${crypto.randomUUID()}.${ext}`;

    // Record placeholder in attachments table
    const res = await query(
      `INSERT INTO attachments (
         owner_type, purpose, storage_key, mime, bytes, delete_after
       ) VALUES (
         $1, $2, $3, $4, $5, CURRENT_TIMESTAMP + INTERVAL '24 hours'
       ) RETURNING id, storage_key;`,
      [purpose, purpose, storageKey, mime_type, bytes]
    );

    // In local / standard serverless, direct upload endpoint can be POST /api/v1/uploads or pre-signed URL
    const uploadUrl = `/api/v1/uploads?key=${storageKey}`;

    return createSuccessResponse(
      {
        attachment_id: res.rows[0].id,
        upload_url: uploadUrl,
        storage_key: storageKey,
        max_bytes: mimeConfig.maxBytes,
        expires_in: 3600,
      },
      requestId
    );
  }
);
