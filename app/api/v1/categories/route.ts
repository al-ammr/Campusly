import { createApiHandler } from '@/lib/api/handler';
import { createSuccessResponse } from '@/lib/api/envelope';
import { getCategoriesWithCounts } from '@/lib/api/public-queries';

export const GET = createApiHandler(
  {},
  async ({ requestId }) => {
    const categories = await getCategoriesWithCounts();
    return createSuccessResponse(categories, requestId, {
      cacheControl: 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
    });
  }
);
