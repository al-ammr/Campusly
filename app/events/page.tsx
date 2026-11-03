import Link from 'next/link';
import { getEventsDirectory, getCategoriesWithCounts } from '@/lib/api/public-queries';
import { ListingCard } from '@/components/cards/listing-card';
import { EmptyState } from '@/components/ui/empty-state';
import { FilterChip } from '@/components/ui/chip';
import { t } from '@/lib/copy/strings';

interface EventsPageProps {
  searchParams: Promise<{
    when?: 'week' | 'upcoming' | 'past';
    category?: string;
    free?: string;
    cursor?: string;
  }>;
}

export const revalidate = 60;

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const { when = 'upcoming', category, free, cursor } = await searchParams;
  const isFree = free === 'true' || free === '1';

  let eventsData: { items: any[]; next_cursor: string | null } = { items: [], next_cursor: null };
  try {
    eventsData = await getEventsDirectory({
      when,
      category,
      free: isFree ? true : undefined,
      cursor,
      limit: 12,
    });
  } catch {
    eventsData = { items: [], next_cursor: null };
  }

  const { items, next_cursor } = eventsData;

  const whenTabs: Array<{ key: 'upcoming' | 'week' | 'past'; label: string }> = [
    { key: 'upcoming', label: t('events.filter.when.upcoming') },
    { key: 'week', label: t('events.filter.when.week') },
    { key: 'past', label: t('events.filter.when.past') },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2 max-w-2xl">
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink dark:text-ink-dark">
          {t('events.title')}
        </h1>
        <p className="text-base text-ink-muted dark:text-ink-muted-dark">
          {t('events.subtitle')}
        </p>
      </div>

      {/* Filters in URL */}
      <div className="flex flex-wrap gap-2 items-center" role="tablist" aria-label="Event time filters">
        {whenTabs.map((tab) => {
          const isSelected = when === tab.key;
          const targetUrl = `/events?when=${tab.key}${isFree ? '&free=true' : ''}${
            category ? `&category=${category}` : ''
          }`;
          return (
            <Link key={tab.key} href={targetUrl}>
              <FilterChip label={tab.label} selected={isSelected} />
            </Link>
          );
        })}

        {/* Free toggle */}
        <Link
          href={`/events?when=${when}${!isFree ? '&free=true' : ''}${
            category ? `&category=${category}` : ''
          }`}
        >
          <FilterChip label={t('events.filter.free_only')} selected={isFree} />
        </Link>
      </div>

      {/* Events Grid or Empty State */}
      {items.length === 0 ? (
        <EmptyState
          title={t('events.empty.title')}
          description={t('events.empty.description')}
          actionLabel={t('events.submit_action')}
          actionHref="/submit"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((event) => (
            <ListingCard key={event.id} listing={event} />
          ))}
        </div>
      )}

      {/* Load More */}
      {next_cursor && (
        <div className="flex justify-center pt-6">
          <Link
            href={`/events?when=${when}${isFree ? '&free=true' : ''}${
              category ? `&category=${category}` : ''
            }&cursor=${next_cursor}`}
            className="px-6 py-2.5 rounded-xl border border-sand-dark dark:border-sand-dark-dark bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark text-sm font-semibold hover:bg-sand-light dark:hover:bg-sand-light-dark transition-colors"
          >
            {t('common.load_more')}
          </Link>
        </div>
      )}
    </div>
  );
}
