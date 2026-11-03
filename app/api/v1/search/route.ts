import { z } from 'zod';
import { createApiHandler } from '@/lib/api/handler';
import { query } from '@/lib/db';
import {
  LISTINGS_SELECT_SQL,
  formatListingSummary,
  formatSpotlightItem,
} from '@/lib/api/public-queries';
import { createSuccessResponse } from '@/lib/api/envelope';

const searchQuerySchema = z.object({
  q: z.string().min(1).max(80),
  type: z.enum(['all', 'community', 'event', 'opportunity']).default('all'),
  category: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(24).default(12),
  cursor: z.string().optional(),
});

export const GET = createApiHandler(
  {
    querySchema: searchQuerySchema,
  },
  async ({ query: searchParams, requestId }) => {
    const { q, type, category, limit } = searchParams;
    const cleanQuery = q.trim();

    // 1. Organic Search Query (Listings)
    let whereClause = `l.status IN ('Approved', 'Verified')`;
    const params: any[] = [`%${cleanQuery}%`, `%${cleanQuery}%`];

    whereClause += ` AND (l.title ILIKE $1 OR l.summary ILIKE $2)`;

    if (type !== 'all') {
      params.push(type);
      whereClause += ` AND l.kind = $${params.length}`;
    }

    if (category) {
      params.push(category);
      whereClause += ` AND c.slug = $${params.length}`;
    }

    params.push(limit + 1);
    const sql = `
      ${LISTINGS_SELECT_SQL}
      WHERE ${whereClause}
      ORDER BY l.star_count DESC, l.created_at DESC
      LIMIT $${params.length};
    `;

    const res = await query(sql, params);
    const hasMore = res.rows.length > limit;
    const rows = hasMore ? res.rows.slice(0, limit) : res.rows;
    const items = rows.map(formatListingSummary);

    // 2. Separate Spotlight Results Group (D06 Section 4 API-102)
    const spotlightRes = await query(
      `SELECT s.id, s.reference, s.business_name, s.offer, s.description, s.contact, s.plan,
              s.starts_at, s.ends_at, s.category_id, c.slug AS category_slug, c.name AS category_name,
              a.storage_key AS image_storage_key
       FROM spotlight_listings s
       JOIN categories c ON s.category_id = c.id
       LEFT JOIN attachments a ON s.image_id = a.id
       WHERE s.status = 'Active'
         AND s.starts_at <= CURRENT_TIMESTAMP AND s.ends_at > CURRENT_TIMESTAMP
         AND (s.business_name ILIKE $1 OR s.offer ILIKE $1)
       LIMIT 3;`,
      [`%${cleanQuery}%`]
    );
    const spotlightItems = spotlightRes.rows.map((r) => formatSpotlightItem(r, 'ranked'));

    return createSuccessResponse(
      {
        items,
        spotlight: spotlightItems,
        next_cursor: hasMore && items.length > 0 ? items[items.length - 1].id : null,
      },
      requestId,
      {
        cacheControl: 'public, max-age=30, stale-while-revalidate=120',
      }
    );
  }
);
