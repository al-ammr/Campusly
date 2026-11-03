import { createApiHandler } from '@/lib/api/handler';
import { getPublicHomeBundle } from '@/lib/api/public-queries';
import { createSuccessResponse } from '@/lib/api/envelope';

export const GET = createApiHandler({}, async ({ requestId }) => {
  const bundle = await getPublicHomeBundle();
  return createSuccessResponse(bundle, requestId, {
    cacheControl: 'public, max-age=60, stale-while-revalidate=300',
  });
});
