import { z } from 'zod';
import { createApiHandler } from '@/lib/api/handler';
import { createSuccessResponse } from '@/lib/api/envelope';
import { query } from '@/lib/db';
import { LISTINGS_SELECT_SQL, formatListingSummary } from '@/lib/api/public-queries';

const DuplicatesSchema = z.object({
  kind: z.enum(['community', 'event', 'opportunity']),
  title: z.string().min(1).max(100),
  links: z.array(z.string()).optional(),
});

export const POST = createApiHandler(
  { bodySchema: DuplicatesSchema },
  async ({ body, requestId }) => {
    const { kind, title } = body;
    const cleanTitle = title.trim();

    // Find up to 3 active approved/verified listings with similar titles
    const res = await query(
      `${LISTINGS_SELECT_SQL}
       WHERE l.kind = $1 AND l.status IN ('Approved', 'Verified')
         AND l.title ILIKE $2
       ORDER BY l.star_count DESC, l.created_at DESC
       LIMIT 3;`,
      [kind, `%${cleanTitle}%`]
    );

    const matches = res.rows.map(formatListingSummary);
    return createSuccessResponse({ matches }, requestId);
  }
);
