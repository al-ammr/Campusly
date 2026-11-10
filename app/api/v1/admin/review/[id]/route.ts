// app/api/v1/admin/review/[id]/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { enforceRoles } from '@/lib/middleware/rbac';
import { getSecurityHeaders } from '@/lib/api/security';

export async function GET(
  request: Request,
  routeContext: { params: Promise<{ id: string }> | { id: string } }
) {
  const authorized = await enforceRoles(request, ['reviewer', 'finance', 'lead']);
  if (!authorized) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 403, headers: getSecurityHeaders() });
  }

  const params = await Promise.resolve(routeContext.params);
  const listingId = params?.id;
  if (!listingId) {
    return NextResponse.json({ error: 'invalid_id' }, { status: 400, headers: getSecurityHeaders() });
  }

  try {
    const listingRes = await query(
      `SELECT l.*, c.name as category_name
       FROM listings l
       LEFT JOIN categories c ON l.category_id = c.id
       WHERE l.id = $1 LIMIT 1`,
      [listingId]
    );

    if (listingRes.rows.length === 0) {
      return NextResponse.json({ error: 'not_found' }, { status: 404, headers: getSecurityHeaders() });
    }

    const listing = listingRes.rows[0];

    // Meta details
    let meta: any = null;
    if (listing.kind === 'community') {
      const metaRes = await query(`SELECT * FROM community_meta WHERE listing_id = $1 LIMIT 1`, [listingId]);
      meta = metaRes.rows[0] || null;
    } else if (listing.kind === 'event') {
      const metaRes = await query(`SELECT * FROM event_meta WHERE listing_id = $1 LIMIT 1`, [listingId]);
      meta = metaRes.rows[0] || null;
    } else if (listing.kind === 'opportunity') {
      const metaRes = await query(`SELECT * FROM opportunity_meta WHERE listing_id = $1 LIMIT 1`, [listingId]);
      meta = metaRes.rows[0] || null;
    }

    // Links
    const linksRes = await query(`SELECT * FROM listing_links WHERE listing_id = $1`, [listingId]);

    // Attachments
    const attachmentsRes = await query(
      `SELECT id, original_name, mime_type, size_bytes, storage_key, created_at
       FROM attachments
       WHERE listing_id = $1`,
      [listingId]
    );

    // Status History
    const historyRes = await query(
      `SELECT id, from_status, to_status, note, actor_type, at
       FROM status_history
       WHERE listing_id = $1
       ORDER BY at DESC`,
      [listingId]
    );

    // Duplicate hints
    const duplicatesRes = await query(
      `SELECT id, title, slug, status, created_at
       FROM listings
       WHERE id != $1 AND (title ILIKE $2 OR slug = $3)
       LIMIT 5`,
      [listingId, `%${listing.title}%`, listing.slug]
    );

    return NextResponse.json(
      {
        listing,
        meta,
        links: linksRes.rows,
        attachments: attachmentsRes.rows,
        history: historyRes.rows,
        duplicates: duplicatesRes.rows,
      },
      { status: 200, headers: getSecurityHeaders() }
    );
  } catch (error) {
    return NextResponse.json({ error: 'server_error' }, { status: 500, headers: getSecurityHeaders() });
  }
}
