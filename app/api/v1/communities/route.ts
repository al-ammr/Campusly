import { z } from 'zod';
import { createApiHandler } from '@/lib/api/handler';
import { createSuccessResponse } from '@/lib/api/envelope';
import { getCommunitiesDirectory } from '@/lib/api/public-queries';

const QuerySchema = z.object({
  category: z.string().optional(),
  sort: z.enum(['stars', 'newest']).optional().default('stars'),
  verified: z
    .enum(['true', 'false', '1', '0'])
    .optional()
    .transform((val) => val === 'true' || val === '1'),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(24).optional().default(12),
});

export const GET = createApiHandler(
  { querySchema: QuerySchema },
  async ({ query, requestId }) => {
    const result = await getCommunitiesDirectory({
      category: query.category,
      sort: query.sort,
      verified: query.verified,
      cursor: query.cursor,
      limit: query.limit,
    });

    return createSuccessResponse(result, requestId, {
      cacheControl: 'public, max-age=60, s-maxage=120, stale-while-revalidate=300',
    });
  }
);
