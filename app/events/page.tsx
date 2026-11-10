import * as React from 'react';
import type { Metadata } from 'next';
import { getEventsDirectory, getCategoriesWithCounts, PublicListingSummary } from '@/lib/api/public-queries';
import { EventsClientView, EventCategoryItem } from '@/components/events/EventsClientView';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Events | Campusly - Ahmadu Bello University',
  description:
    'Discover upcoming summits, technical workshops, academic conferences, sports meets, and student events across ABU Zaria.',
};

interface EventsPageProps {
  searchParams?: Promise<{
    when?: 'week' | 'upcoming' | 'past';
    category?: string;
    free?: string;
    cursor?: string;
  }> | {
    when?: 'week' | 'upcoming' | 'past';
    category?: string;
    free?: string;
    cursor?: string;
  };
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  // Support both Next.js 14 synchronous and Next.js 15 Promise-based searchParams
  const resolvedParams = searchParams
    ? typeof (searchParams as any).then === 'function'
      ? await searchParams
      : searchParams
    : {};

  const { when = 'upcoming', category = '', free = '', cursor } = resolvedParams as any;
  const isFree = free === 'true' || free === '1';

  let events: PublicListingSummary[] = [];
  let nextCursor: string | null = null;
  let categories: EventCategoryItem[] = [];

  try {
    const [eventsRes, catsRes] = await Promise.all([
      getEventsDirectory({
        when: when as any,
        category: category || undefined,
        free: isFree ? true : undefined,
        cursor,
        limit: 18,
      }),
      getCategoriesWithCounts(),
    ]);

    events = eventsRes?.items || [];
    nextCursor = eventsRes?.next_cursor || null;
    categories = (catsRes || []).map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      icon_key: c.icon_key,
    }));
  } catch (err) {
    // Graceful fallback when database is disconnected / initial bootstrap
    events = [];
    nextCursor = null;
    categories = [];
  }

  return (
    <div className="w-full min-h-screen bg-[#FFFFF0] dark:bg-surface-dark pb-16">
      <EventsClientView
        initialEvents={events}
        categories={categories}
        initialWhen={when}
        initialFree={isFree}
        initialCategory={category}
        nextCursor={nextCursor}
      />
    </div>
  );
}
