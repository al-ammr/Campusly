import { z } from 'zod';
import { createApiHandler } from '@/lib/api/handler';
import { createSuccessResponse } from '@/lib/api/envelope';
import { getSearchSuggestions } from '@/lib/api/public-queries';

const QuerySchema = z.object({
  q: z.string().trim().min(1, 'Query must not be empty').max(80, 'Query cannot exceed 80 characters'),
});

export const GET = createApiHandler(
  { querySchema: QuerySchema },
  async ({ query, requestId }) => {
    const result = await getSearchSuggestions(query.q);
    return createSuccessResponse(result, requestId, {
      cacheControl: 'public, max-age=60, s-maxage=120, stale-while-revalidate=300',
    });
  }
);
