import { z } from 'zod';
import { createApiHandler } from '@/lib/api/handler';
import { createSuccessResponse, createErrorResponse, ERROR_CATALOGUE } from '@/lib/api/envelope';
import { getCategoryWithCommunities } from '@/lib/api/public-queries';

const QuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(24).optional().default(12),
});

export const GET = createApiHandler(
  { querySchema: QuerySchema },
  async ({ query, params, requestId }) => {
    const slug = params?.slug;
    if (!slug) {
      return createErrorResponse(ERROR_CATALOGUE.NOT_FOUND, requestId);
    }

    const result = await getCategoryWithCommunities(slug, query.cursor, query.limit);
    if (!result) {
      return createErrorResponse(ERROR_CATALOGUE.NOT_FOUND, requestId);
    }

    return createSuccessResponse(result, requestId, {
      cacheControl: 'public, max-age=60, s-maxage=120, stale-while-revalidate=300',
    });
  }
);
