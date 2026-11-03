import { query } from '@/lib/db';
import { isOpportunityClosingSoon, rankListings, calculateEventEndTime } from '@/lib/rules';

export interface PublicListingSummary {
  id: string;
  kind: 'community' | 'event' | 'opportunity';
  slug: string;
  title: string;
  summary: string;
  category: {
    id: string;
    slug: string;
    name: string;
    icon_key: string;
  };
  image: {
    url: string;
    alt: string;
  } | null;
  status: 'Approved' | 'Verified';
  verified: boolean;
  star_count?: number;
  starts_at?: string;
  ends_at?: string;
  deadline_at?: string;
  is_rolling?: boolean;
  closing_soon?: boolean;
  created_at: string;
}

export interface PublicListingDetail extends PublicListingSummary {
  description: string;
  links: Array<{ label: string; url: string; is_official: boolean }>;
  contact: {
    name: string;
    channel: string;
  };
  details: Record<string, any>;
  upcoming?: PublicListingSummary[];
  updated_at: string;
}

export interface PublicSpotlightItem {
  id: string;
  reference: string;
  business_name: string;
  offer: string;
  description: string;
  category: {
    id: string;
    slug: string;
    name: string;
  };
  plan: 'standard' | 'featured';
  paid_label: 'Paid listing';
  contact: string;
  image: { url: string; alt: string } | null;
  starts_at: string;
  ends_at: string;
  rank_group: 'featured_strip' | 'ranked';
}

export interface PublicAnnouncement {
  id: string;
  title: string;
  body: string;
  image: { url: string; alt: string } | null;
  pinned: boolean;
  published_at: string;
}

/**
 * Transforms raw DB row into clean PublicListingSummary, stripping any private fields.
 */
export function formatListingSummary(row: any): PublicListingSummary {
  const isVerified = row.status === 'Verified' && row.kind === 'community';
  const closingSoon =
    row.kind === 'opportunity' && row.deadline_at
      ? isOpportunityClosingSoon(new Date(row.deadline_at))
      : undefined;

  return {
    id: row.id,
    kind: row.kind,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    category: {
      id: row.category_id,
      slug: row.category_slug,
      name: row.category_name,
      icon_key: row.category_icon_key || '',
    },
    image: row.image_storage_key
      ? {
          url: `/uploads/${row.image_storage_key}`,
          alt: row.image_alt_text || row.title,
        }
      : null,
    status: isVerified ? 'Verified' : 'Approved',
    verified: isVerified,
    star_count: row.kind === 'community' ? (row.star_count ?? 0) : undefined,
    starts_at: row.starts_at ? new Date(row.starts_at).toISOString() : undefined,
    ends_at: row.ends_at ? new Date(row.ends_at).toISOString() : undefined,
    deadline_at: row.deadline_at ? new Date(row.deadline_at).toISOString() : undefined,
    is_rolling: row.is_rolling ?? undefined,
    closing_soon: closingSoon,
    created_at: new Date(row.created_at).toISOString(),
  };
}

/**
 * Transforms raw Spotlight DB row into clean PublicSpotlightItem.
 */
export function formatSpotlightItem(row: any, rankGroup: 'featured_strip' | 'ranked' = 'ranked'): PublicSpotlightItem {
  return {
    id: row.id,
    reference: row.reference,
    business_name: row.business_name,
    offer: row.offer,
    description: row.description,
    category: {
      id: row.category_id,
      slug: row.category_slug,
      name: row.category_name,
    },
    plan: row.plan,
    paid_label: 'Paid listing',
    contact: row.contact,
    image: row.image_storage_key
      ? {
          url: `/uploads/${row.image_storage_key}`,
          alt: row.business_name,
        }
      : null,
    starts_at: new Date(row.starts_at).toISOString(),
    ends_at: new Date(row.ends_at).toISOString(),
    rank_group: rankGroup,
  };
}

/**
 * Common SQL SELECT fragment for listings with category and image metadata.
 */
export const LISTINGS_SELECT_SQL = `
  SELECT
    l.id, l.kind, l.slug, l.status, l.title, l.summary, l.description,
    l.star_count, l.star_count_reached_at, l.created_at, l.updated_at,
    l.category_id, c.slug AS category_slug, c.name AS category_name, c.icon_key AS category_icon_key,
    a.storage_key AS image_storage_key, a.alt_text AS image_alt_text,
    l.contact_name, l.contact_channel,
    em.starts_at, em.ends_at, em.venue, em.map_link, em.register_link, em.is_free,
    om.type AS opportunity_type, om.organiser, om.deadline_at, om.is_rolling, om.eligibility, om.apply_link,
    cm.how_to_join, cm.who_can_join, cm.meeting_times, cm.founded_year, cm.size_band, cm.verified_at
  FROM listings l
  JOIN categories c ON l.category_id = c.id
  LEFT JOIN attachments a ON l.image_id = a.id
  LEFT JOIN event_meta em ON l.id = em.listing_id
  LEFT JOIN opportunity_meta om ON l.id = om.listing_id
  LEFT JOIN community_meta cm ON l.id = cm.listing_id
`;

/**
 * Encode / Decode cursor token
 */
export function encodeCursor(offset: number): string {
  return Buffer.from(JSON.stringify({ offset })).toString('base64url');
}

export function decodeCursor(cursor?: string | null): number {
  if (!cursor) return 0;
  try {
    const raw = Buffer.from(cursor, 'base64url').toString('utf-8');
    const parsed = JSON.parse(raw);
    return typeof parsed.offset === 'number' && parsed.offset >= 0 ? parsed.offset : 0;
  } catch {
    return 0;
  }
}

/**
 * Fetch public Home page bundle (API-101).
 */
export async function getPublicHomeBundle() {
  // 1. Pinned Announcement
  const annRes = await query(
    `SELECT id, title, body, starts_at AS published_at
     FROM announcements
     WHERE status = 'published' AND pinned = TRUE
     ORDER BY starts_at DESC LIMIT 1`
  );
  const pinnedAnnouncement = annRes.rows.length > 0 ? annRes.rows[0] : null;

  // 2. This Week Upcoming Events (up to 6)
  const eventsRes = await query(
    `${LISTINGS_SELECT_SQL}
     WHERE l.kind = 'event' AND l.status IN ('Approved', 'Verified')
       AND em.starts_at >= CURRENT_TIMESTAMP
       AND em.starts_at <= CURRENT_TIMESTAMP + INTERVAL '7 days'
     ORDER BY em.starts_at ASC LIMIT 6`
  );
  const thisWeek = eventsRes.rows.map(formatListingSummary);

  // 3. Category Tiles
  const categoriesRes = await query(
    `SELECT c.id, c.slug, c.name, c.icon_key,
            COUNT(l.id) FILTER (WHERE l.status IN ('Approved', 'Verified')) AS live_count
     FROM categories c
     LEFT JOIN listings l ON c.id = l.category_id
     WHERE c.kind = 'community'
     GROUP BY c.id, c.slug, c.name, c.icon_key, c.sort
     ORDER BY c.sort ASC LIMIT 10`
  );
  const categories = categoriesRes.rows;

  // 4. Featured Spotlight Strip (up to 6)
  const spotlightRes = await query(
    `SELECT s.id, s.reference, s.business_name, s.offer, s.description, s.contact, s.plan,
            s.starts_at, s.ends_at, s.category_id, c.slug AS category_slug, c.name AS category_name,
            a.storage_key AS image_storage_key
     FROM spotlight_listings s
     JOIN categories c ON s.category_id = c.id
     LEFT JOIN attachments a ON s.image_id = a.id
     WHERE s.status = 'Active' AND s.plan = 'featured'
       AND s.starts_at <= CURRENT_TIMESTAMP AND s.ends_at > CURRENT_TIMESTAMP
     ORDER BY s.starts_at DESC LIMIT 6`
  );
  const spotlightStrip = spotlightRes.rows.map((r) => formatSpotlightItem(r, 'featured_strip'));

  // 5. Closing Soon Opportunities (up to 4)
  const oppsRes = await query(
    `${LISTINGS_SELECT_SQL}
     WHERE l.kind = 'opportunity' AND l.status IN ('Approved', 'Verified')
       AND om.deadline_at >= CURRENT_TIMESTAMP
       AND om.deadline_at <= CURRENT_TIMESTAMP + INTERVAL '7 days'
     ORDER BY om.deadline_at ASC LIMIT 4`
  );
  const closingSoon = oppsRes.rows.map(formatListingSummary);

  // 6. Top Communities by Stars (up to 6)
  const commRes = await query(
    `${LISTINGS_SELECT_SQL}
     WHERE l.kind = 'community' AND l.status IN ('Approved', 'Verified')
     ORDER BY l.star_count DESC, l.star_count_reached_at ASC LIMIT 6`
  );
  const topCommunities = commRes.rows.map(formatListingSummary);

  return {
    pinned_announcement: pinnedAnnouncement,
    this_week: thisWeek,
    categories,
    spotlight_strip: spotlightStrip,
    closing_soon: closingSoon,
    top_communities: topCommunities,
  };
}

/**
 * Fetch links for a listing
 */
export async function getListingLinks(listingId: string): Promise<Array<{ label: string; url: string; is_official: boolean }>> {
  const res = await query(
    `SELECT label, url, is_official
     FROM links
     WHERE listing_id = $1
     ORDER BY sort ASC, created_at ASC`,
    [listingId]
  );
  return res.rows.map((r) => ({
    label: r.label,
    url: r.url,
    is_official: Boolean(r.is_official),
  }));
}

/**
 * Fetch upcoming events for a community (API-107)
 */
export async function getCommunityUpcomingEvents(communityId: string): Promise<PublicListingSummary[]> {
  const res = await query(
    `${LISTINGS_SELECT_SQL}
     WHERE l.kind = 'event'
       AND l.status IN ('Approved', 'Verified')
       AND em.community_id = $1
       AND em.starts_at >= CURRENT_TIMESTAMP
     ORDER BY em.starts_at ASC LIMIT 6`,
    [communityId]
  );
  return res.rows.map(formatListingSummary);
}

/**
 * Fetch single listing detail by id or slug
 */
export async function getPublicListingDetail(
  kind: 'community' | 'event' | 'opportunity',
  idOrSlug: string
): Promise<PublicListingDetail | null> {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
  const whereClause = isUuid ? 'l.id = $1' : 'l.slug = $1';

  const res = await query(
    `${LISTINGS_SELECT_SQL}
     WHERE l.kind = $2 AND l.status IN ('Approved', 'Verified') AND ${whereClause}
     LIMIT 1`,
    [idOrSlug, kind]
  );

  if (res.rows.length === 0) {
    return null;
  }

  const row = res.rows[0];
  const summary = formatListingSummary(row);
  const links = await getListingLinks(row.id);

  let details: Record<string, any> = {};
  if (kind === 'event') {
    details = {
      starts_at: row.starts_at ? new Date(row.starts_at).toISOString() : null,
      ends_at: row.ends_at ? new Date(row.ends_at).toISOString() : null,
      venue: row.venue,
      map_link: row.map_link,
      register_link: row.register_link,
      is_free: Boolean(row.is_free),
    };
  } else if (kind === 'opportunity') {
    details = {
      type: row.opportunity_type,
      organiser: row.organiser,
      deadline_at: row.deadline_at ? new Date(row.deadline_at).toISOString() : null,
      is_rolling: Boolean(row.is_rolling),
      eligibility: row.eligibility,
      apply_link: row.apply_link,
    };
  } else if (kind === 'community') {
    details = {
      how_to_join: row.how_to_join,
      who_can_join: row.who_can_join,
      meeting_times: row.meeting_times,
      founded_year: row.founded_year,
      size_band: row.size_band,
      verified_at: row.verified_at ? new Date(row.verified_at).toISOString() : null,
    };
  }

  let upcoming: PublicListingSummary[] | undefined;
  if (kind === 'community') {
    upcoming = await getCommunityUpcomingEvents(row.id);
  }

  return {
    ...summary,
    description: row.description,
    links,
    contact: {
      name: row.contact_name,
      channel: row.contact_channel,
    },
    details,
    upcoming,
    updated_at: new Date(row.updated_at).toISOString(),
  };
}

/**
 * Category overview with counts (API-104)
 */
export async function getCategoriesWithCounts() {
  const res = await query(
    `SELECT
       c.id, c.slug, c.name, c.icon_key, c.sort,
       COUNT(DISTINCT l.id) FILTER (WHERE l.kind = 'community' AND l.status IN ('Approved', 'Verified')) AS live_communities,
       COUNT(DISTINCT l2.id) FILTER (WHERE l2.kind = 'event' AND l2.status IN ('Approved', 'Verified') AND em.starts_at >= CURRENT_TIMESTAMP) AS upcoming_events
     FROM categories c
     LEFT JOIN listings l ON c.id = l.category_id AND l.kind = 'community'
     LEFT JOIN listings l2 ON c.id = l2.category_id AND l2.kind = 'event'
     LEFT JOIN event_meta em ON l2.id = em.listing_id
     WHERE c.kind = 'community'
     GROUP BY c.id, c.slug, c.name, c.icon_key, c.sort
     ORDER BY c.sort ASC`
  );
  return res.rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    icon_key: r.icon_key,
    sort: r.sort,
    live_communities: parseInt(r.live_communities || '0', 10),
    upcoming_events: parseInt(r.upcoming_events || '0', 10),
  }));
}

/**
 * Single category + first page of communities (API-105)
 */
export async function getCategoryWithCommunities(slug: string, cursor?: string | null, limit = 12) {
  const catRes = await query(
    `SELECT id, slug, name, icon_key, description
     FROM categories
     WHERE slug = $1 AND kind = 'community'
     LIMIT 1`,
    [slug]
  );
  if (catRes.rows.length === 0) return null;

  const category = catRes.rows[0];
  const offset = decodeCursor(cursor);
  const safeLimit = Math.min(Math.max(limit, 1), 24);

  const res = await query(
    `${LISTINGS_SELECT_SQL}
     WHERE l.category_id = $1 AND l.kind = 'community' AND l.status IN ('Approved', 'Verified')
     ORDER BY l.star_count DESC, l.star_count_reached_at ASC
     LIMIT $2 OFFSET $3`,
    [category.id, safeLimit + 1, offset]
  );

  const hasMore = res.rows.length > safeLimit;
  const items = (hasMore ? res.rows.slice(0, safeLimit) : res.rows).map(formatListingSummary);
  const nextCursor = hasMore ? encodeCursor(offset + safeLimit) : null;

  return {
    category,
    items,
    next_cursor: nextCursor,
  };
}

/**
 * Community directory (API-106)
 */
export async function getCommunitiesDirectory(params: {
  category?: string;
  sort?: 'stars' | 'newest';
  verified?: boolean;
  cursor?: string;
  limit?: number;
}) {
  const limit = Math.min(Math.max(params.limit || 12, 1), 24);
  const offset = decodeCursor(params.cursor);

  const conditions: string[] = ["l.kind = 'community'", "l.status IN ('Approved', 'Verified')"];
  const values: any[] = [];

  if (params.category) {
    values.push(params.category);
    conditions.push(`c.slug = $${values.length}`);
  }

  if (params.verified) {
    conditions.push("l.status = 'Verified'");
  }

  const orderBy =
    params.sort === 'newest'
      ? 'l.created_at DESC, l.id DESC'
      : 'l.star_count DESC, l.star_count_reached_at ASC, l.created_at DESC';

  values.push(limit + 1);
  const limitIdx = values.length;
  values.push(offset);
  const offsetIdx = values.length;

  const res = await query(
    `${LISTINGS_SELECT_SQL}
     WHERE ${conditions.join(' AND ')}
     ORDER BY ${orderBy}
     LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
    values
  );

  const hasMore = res.rows.length > limit;
  const items = (hasMore ? res.rows.slice(0, limit) : res.rows).map(formatListingSummary);

  return {
    items,
    next_cursor: hasMore ? encodeCursor(offset + limit) : null,
  };
}

/**
 * Events list (API-108)
 */
export async function getEventsDirectory(params: {
  when?: 'week' | 'upcoming' | 'past';
  category?: string;
  from?: string;
  to?: string;
  free?: boolean;
  cursor?: string;
  limit?: number;
}) {
  const limit = Math.min(Math.max(params.limit || 12, 1), 24);
  const offset = decodeCursor(params.cursor);

  const conditions: string[] = ["l.kind = 'event'", "l.status IN ('Approved', 'Verified')"];
  const values: any[] = [];

  if (params.category) {
    values.push(params.category);
    conditions.push(`c.slug = $${values.length}`);
  }

  if (params.free === true) {
    conditions.push('em.is_free = TRUE');
  }

  if (params.from) {
    values.push(params.from);
    conditions.push(`em.starts_at >= $${values.length}`);
  }

  if (params.to) {
    values.push(params.to);
    conditions.push(`em.starts_at <= $${values.length}`);
  }

  let orderBy = 'em.starts_at ASC';
  if (!params.from && !params.to) {
    if (params.when === 'past') {
      conditions.push('em.starts_at < CURRENT_TIMESTAMP');
      orderBy = 'em.starts_at DESC';
    } else if (params.when === 'week') {
      conditions.push('em.starts_at >= CURRENT_TIMESTAMP AND em.starts_at <= CURRENT_TIMESTAMP + INTERVAL \'7 days\'');
    } else {
      // default: upcoming
      conditions.push('em.starts_at >= CURRENT_TIMESTAMP');
    }
  }

  values.push(limit + 1);
  const limitIdx = values.length;
  values.push(offset);
  const offsetIdx = values.length;

  const res = await query(
    `${LISTINGS_SELECT_SQL}
     WHERE ${conditions.join(' AND ')}
     ORDER BY ${orderBy}
     LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
    values
  );

  const hasMore = res.rows.length > limit;
  const items = (hasMore ? res.rows.slice(0, limit) : res.rows).map(formatListingSummary);

  return {
    items,
    next_cursor: hasMore ? encodeCursor(offset + limit) : null,
  };
}

/**
 * Opportunities list (API-111)
 */
export async function getOpportunitiesDirectory(params: {
  type?: string;
  category?: string;
  closing_soon?: boolean;
  cursor?: string;
  limit?: number;
}) {
  const limit = Math.min(Math.max(params.limit || 12, 1), 24);
  const offset = decodeCursor(params.cursor);

  const conditions: string[] = ["l.kind = 'opportunity'", "l.status IN ('Approved', 'Verified')"];
  const values: any[] = [];

  if (params.type) {
    values.push(params.type);
    conditions.push(`om.type = $${values.length}`);
  }

  if (params.category) {
    values.push(params.category);
    conditions.push(`c.slug = $${values.length}`);
  }

  if (params.closing_soon) {
    conditions.push("om.deadline_at >= CURRENT_TIMESTAMP AND om.deadline_at <= CURRENT_TIMESTAMP + INTERVAL '7 days'");
  } else {
    // Only return opportunities that have not expired or are rolling
    conditions.push('(om.deadline_at IS NULL OR om.deadline_at >= CURRENT_TIMESTAMP OR om.is_rolling = TRUE)');
  }

  values.push(limit + 1);
  const limitIdx = values.length;
  values.push(offset);
  const offsetIdx = values.length;

  const res = await query(
    `${LISTINGS_SELECT_SQL}
     WHERE ${conditions.join(' AND ')}
     ORDER BY om.deadline_at ASC NULLS LAST, l.created_at DESC
     LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
    values
  );

  const hasMore = res.rows.length > limit;
  const items = (hasMore ? res.rows.slice(0, limit) : res.rows).map(formatListingSummary);

  return {
    items,
    next_cursor: hasMore ? encodeCursor(offset + limit) : null,
  };
}

/**
 * Spotlight list (API-113)
 */
export async function getSpotlightDirectory(categorySlug?: string, cursor?: string, limit = 12) {
  const safeLimit = Math.min(Math.max(limit, 1), 24);
  const offset = decodeCursor(cursor);

  // 1. Featured Strip
  const stripRes = await query(
    `SELECT s.id, s.reference, s.business_name, s.offer, s.description, s.contact, s.plan,
            s.starts_at, s.ends_at, s.category_id, c.slug AS category_slug, c.name AS category_name,
            a.storage_key AS image_storage_key
     FROM spotlight_listings s
     JOIN categories c ON s.category_id = c.id
     LEFT JOIN attachments a ON s.image_id = a.id
     WHERE s.status = 'Active' AND s.plan = 'featured'
       AND s.starts_at <= CURRENT_TIMESTAMP AND s.ends_at > CURRENT_TIMESTAMP
     ORDER BY s.starts_at DESC LIMIT 6`
  );
  const featuredStrip = stripRes.rows.map((r) => formatSpotlightItem(r, 'featured_strip'));

  // 2. Ranked Items
  const conditions: string[] = [
    "s.status = 'Active'",
    "s.starts_at <= CURRENT_TIMESTAMP",
    "s.ends_at > CURRENT_TIMESTAMP",
  ];
  const values: any[] = [];

  if (categorySlug) {
    values.push(categorySlug);
    conditions.push(`c.slug = $${values.length}`);
  }

  values.push(safeLimit + 1);
  const limitIdx = values.length;
  values.push(offset);
  const offsetIdx = values.length;

  const itemsRes = await query(
    `SELECT s.id, s.reference, s.business_name, s.offer, s.description, s.contact, s.plan,
            s.starts_at, s.ends_at, s.category_id, c.slug AS category_slug, c.name AS category_name,
            a.storage_key AS image_storage_key
     FROM spotlight_listings s
     JOIN categories c ON s.category_id = c.id
     LEFT JOIN attachments a ON s.image_id = a.id
     WHERE ${conditions.join(' AND ')}
     ORDER BY s.starts_at DESC
     LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
    values
  );

  const hasMore = itemsRes.rows.length > safeLimit;
  const items = (hasMore ? itemsRes.rows.slice(0, safeLimit) : itemsRes.rows).map((r) =>
    formatSpotlightItem(r, 'ranked')
  );

  return {
    featured_strip: featuredStrip,
    items,
    next_cursor: hasMore ? encodeCursor(offset + safeLimit) : null,
  };
}

/**
 * Spotlight single detail (API-114)
 */
export async function getSpotlightDetail(idOrReference: string): Promise<PublicSpotlightItem | null> {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrReference);
  const whereClause = isUuid ? 's.id = $1' : 's.reference = $1';

  const res = await query(
    `SELECT s.id, s.reference, s.business_name, s.offer, s.description, s.contact, s.plan,
            s.starts_at, s.ends_at, s.category_id, c.slug AS category_slug, c.name AS category_name,
            a.storage_key AS image_storage_key
     FROM spotlight_listings s
     JOIN categories c ON s.category_id = c.id
     LEFT JOIN attachments a ON s.image_id = a.id
     WHERE s.status = 'Active'
       AND s.starts_at <= CURRENT_TIMESTAMP AND s.ends_at > CURRENT_TIMESTAMP
       AND ${whereClause}
     LIMIT 1`,
    [idOrReference]
  );

  if (res.rows.length === 0) return null;
  return formatSpotlightItem(res.rows[0], res.rows[0].plan === 'featured' ? 'featured_strip' : 'ranked');
}

/**
 * Announcements directory (API-115)
 */
export async function getAnnouncementsDirectory(cursor?: string, limit = 12) {
  const safeLimit = Math.min(Math.max(limit, 1), 24);
  const offset = decodeCursor(cursor);

  const res = await query(
    `SELECT a.id, a.title, a.body, a.pinned, a.starts_at AS published_at,
            att.storage_key AS image_storage_key
     FROM announcements a
     LEFT JOIN attachments att ON a.image_id = att.id
     WHERE a.status = 'published'
     ORDER BY a.pinned DESC, a.starts_at DESC
     LIMIT $1 OFFSET $2`,
    [safeLimit + 1, offset]
  );

  const hasMore = res.rows.length > safeLimit;
  const items: PublicAnnouncement[] = (hasMore ? res.rows.slice(0, safeLimit) : res.rows).map((r) => ({
    id: r.id,
    title: r.title,
    body: r.body,
    image: r.image_storage_key
      ? {
          url: `/uploads/${r.image_storage_key}`,
          alt: r.title,
        }
      : null,
    pinned: Boolean(r.pinned),
    published_at: new Date(r.published_at).toISOString(),
  }));

  return {
    items,
    next_cursor: hasMore ? encodeCursor(offset + safeLimit) : null,
  };
}

/**
 * Announcement detail (API-116)
 */
export async function getAnnouncementDetail(id: string): Promise<PublicAnnouncement | null> {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  if (!isUuid) return null;

  const res = await query(
    `SELECT a.id, a.title, a.body, a.pinned, a.starts_at AS published_at,
            att.storage_key AS image_storage_key
     FROM announcements a
     LEFT JOIN attachments att ON a.image_id = att.id
     WHERE a.id = $1 AND a.status = 'published'
     LIMIT 1`,
    [id]
  );

  if (res.rows.length === 0) return null;
  const r = res.rows[0];
  return {
    id: r.id,
    title: r.title,
    body: r.body,
    image: r.image_storage_key
      ? {
          url: `/uploads/${r.image_storage_key}`,
          alt: r.title,
        }
      : null,
    pinned: Boolean(r.pinned),
    published_at: new Date(r.published_at).toISOString(),
  };
}

/**
 * Search all kinds with organic results and separate Spotlight group (API-102)
 */
export async function getPublicSearchResults(params: {
  q: string;
  type?: 'all' | 'community' | 'event' | 'opportunity';
  category?: string;
  limit?: number;
}) {
  const cleanQuery = params.q.trim();
  const limit = Math.min(Math.max(params.limit || 12, 1), 24);
  const type = params.type || 'all';

  if (!cleanQuery) {
    return { items: [], spotlight: [], next_cursor: null };
  }

  // 1. Organic Search Query (Listings)
  let whereClause = `l.status IN ('Approved', 'Verified')`;
  const queryParams: any[] = [`%${cleanQuery}%`, `%${cleanQuery}%`];

  whereClause += ` AND (l.title ILIKE $1 OR l.summary ILIKE $2)`;

  if (type !== 'all') {
    queryParams.push(type);
    whereClause += ` AND l.kind = $${queryParams.length}`;
  }

  if (params.category) {
    queryParams.push(params.category);
    whereClause += ` AND c.slug = $${queryParams.length}`;
  }

  queryParams.push(limit + 1);
  const sql = `
    ${LISTINGS_SELECT_SQL}
    WHERE ${whereClause}
    ORDER BY l.star_count DESC, l.created_at DESC
    LIMIT $${queryParams.length};
  `;

  const res = await query(sql, queryParams);
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

  return {
    items,
    spotlight: spotlightItems,
    next_cursor: hasMore && items.length > 0 ? items[items.length - 1].id : null,
  };
}

export async function getSearchSuggestions(q: string) {
  const cleanQ = q.trim();
  if (!cleanQ) {
    return { suggestions: [], categories: [] };
  }

  // 1. Matches from titles across Approved/Verified listings
  const titlesRes = await query(
    `SELECT title
     FROM listings
     WHERE status IN ('Approved', 'Verified')
       AND title ILIKE $1
     ORDER BY star_count DESC, created_at DESC
     LIMIT 6`,
    [`%${cleanQ}%`]
  );
  const suggestions = titlesRes.rows.map((r) => r.title);

  // 2. Category matches
  const catRes = await query(
    `SELECT id, slug, name, icon_key
     FROM categories
     WHERE kind = 'community' AND name ILIKE $1
     ORDER BY sort ASC
     LIMIT 3`,
    [`%${cleanQ}%`]
  );
  const categories = catRes.rows;

  return { suggestions, categories };
}

/**
 * iCalendar RFC 5545 generator for an event (API-110)
 */
export function generateIcsCalendar(event: PublicListingDetail): string {
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const formatIcsDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
  };

  const nowIcs = formatIcsDate(new Date().toISOString());
  const startIcs = formatIcsDate(event.starts_at || event.created_at);
  const endIcs = formatIcsDate(event.ends_at) || startIcs;

  // Escape special chars according to RFC 5545
  const escapeIcs = (str?: string) =>
    (str || '')
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n');

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Campusly ABU Zaria//Campusly Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}@campusly.abu.edu.ng`,
    `DTSTAMP:${nowIcs}`,
    `DTSTART:${startIcs}`,
    `DTEND:${endIcs}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    `DESCRIPTION:${escapeIcs(event.summary)}`,
    `LOCATION:${escapeIcs(event.details.venue || 'ABU Zaria')}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return lines.join('\r\n') + '\r\n';
}

