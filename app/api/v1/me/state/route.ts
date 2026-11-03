import { z } from 'zod';
import { createApiHandler } from '@/lib/api/handler';
import { createSuccessResponse } from '@/lib/api/envelope';
import { query } from '@/lib/db';

const QuerySchema = z.object({
  ids: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return [];
      return val
        .split(',')
        .map((s) => s.trim())
        .filter((s) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s))
        .slice(0, 50);
    }),
});

export const GET = createApiHandler(
  { querySchema: QuerySchema },
  async ({ query: parsedQuery, device, requestId }) => {
    const ids = parsedQuery.ids || [];
    let starred: string[] = [];

    if (ids.length > 0 && device.tokenHash) {
      const res = await query(
        `SELECT s.listing_id FROM stars s
         JOIN devices d ON s.device_id = d.id
         WHERE d.token_hash = $1 AND s.listing_id = ANY($2::uuid[])`,
        [device.tokenHash, ids]
      );
      starred = res.rows.map((r: any) => r.listing_id);
    }

    return createSuccessResponse(
      { starred },
      requestId,
      {
        cacheControl: 'private, no-store',
      }
    );
  }
);
