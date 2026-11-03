import { createApiHandler } from '@/lib/api/handler';
import { createSuccessResponse, createErrorResponse, ERROR_CATALOGUE } from '@/lib/api/envelope';
import { getPublicListingDetail } from '@/lib/api/public-queries';

export const GET = createApiHandler(
  {},
  async ({ params, requestId }) => {
    const id = params?.id;
    if (!id) {
      return createErrorResponse(ERROR_CATALOGUE.NOT_AVAILABLE, requestId);
    }

    const detail = await getPublicListingDetail('opportunity', id);
    if (!detail) {
      return createErrorResponse(ERROR_CATALOGUE.NOT_AVAILABLE, requestId);
    }

    return createSuccessResponse(detail, requestId, {
      cacheControl: 'public, max-age=60, s-maxage=120, stale-while-revalidate=300',
    });
  }
);
