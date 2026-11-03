import { z } from 'zod';
import { createApiHandler } from '@/lib/api/handler';
import { createSuccessResponse } from '@/lib/api/envelope';
import { getSpotlightDirectory } from '@/lib/api/public-queries';

const QuerySchema = z.object({
  category: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(24).optional().default(12),
});

export const GET = createApiHandler(
  { querySchema: QuerySchema },
  async ({ query, requestId }) => {
    const result = await getSpotlightDirectory(query.category, query.cursor, query.limit);

    return createSuccessResponse(result, requestId, {
      cacheControl: 'public, max-age=60, s-maxage=120, stale-while-revalidate=300',
    });
  }
);
