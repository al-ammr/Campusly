import { z } from 'zod';
import { createApiHandler } from '@/lib/api/handler';
import { createSuccessResponse } from '@/lib/api/envelope';
import { getEventsDirectory } from '@/lib/api/public-queries';

const QuerySchema = z.object({
  when: z.enum(['week', 'upcoming', 'past']).optional().default('upcoming'),
  category: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  free: z
    .enum(['true', 'false', '1', '0'])
    .optional()
    .transform((val) => val === 'true' || val === '1'),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(24).optional().default(12),
});

export const GET = createApiHandler(
  { querySchema: QuerySchema },
  async ({ query, requestId }) => {
    const result = await getEventsDirectory({
      when: query.when,
      category: query.category,
      from: query.from,
      to: query.to,
      free: query.free,
      cursor: query.cursor,
      limit: query.limit,
    });

    return createSuccessResponse(result, requestId, {
      cacheControl: 'public, max-age=60, s-maxage=120, stale-while-revalidate=300',
    });
  }
);
