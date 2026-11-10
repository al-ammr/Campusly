import Link from 'next/link';
import {
  getPublicSearchResults,
  PublicListingSummary,
  PublicSpotlightItem,
} from '@/lib/api/public-queries';
import { ListingCard } from '@/components/cards/listing-card';
import { SpotlightCard } from '@/components/cards/spotlight-card';
import { EmptyState } from '@/components/ui/empty-state';
import { FilterChip } from '@/components/ui/chip';
import { t } from '@/lib/copy/strings';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    type?: 'all' | 'community' | 'event' | 'opportunity';
    category?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = '', type = 'all', category } = await searchParams;
  const cleanQ = q.trim();

  let searchData: {
    items: PublicListingSummary[];
    spotlight: PublicSpotlightItem[];
    next_cursor: string | null;
  } = { items: [], spotlight: [], next_cursor: null };
  if (cleanQ) {
    try {
      searchData = await getPublicSearchResults({
        q: cleanQ,
        type,
        category,
        limit: 24,
      });
    } catch {
      searchData = { items: [], spotlight: [], next_cursor: null };
    }
  }

  const { items, spotlight } = searchData;
  const types: Array<{ key: 'all' | 'community' | 'event' | 'opportunity'; label: string }> = [
    { key: 'all', label: t('search.filters.all') },
    { key: 'community', label: t('search.filters.community') },
    { key: 'event', label: t('search.filters.event') },
    { key: 'opportunity', label: t('search.filters.opportunity') },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-6">
      {/* Header and Search Field */}
      <div className="flex flex-col gap-4 max-w-2xl">
        <h1 className="font-display font-bold text-3xl text-ink dark:text-ink-dark">
          {t('search.title')}
        </h1>
        <form method="GET" action="/search" className="flex items-stretch gap-2">
          <input
            type="search"
            name="q"
            defaultValue={cleanQ}
            placeholder={t('search.placeholder')}
            className="w-full h-12 px-4 rounded-md border border-border dark:border-border-dark bg-surface dark:bg-canvas-dark text-ink dark:text-ink-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand shadow-xs"
            required
          />
          {type !== 'all' && <input type="hidden" name="type" value={type} />}
          {category && <input type="hidden" name="category" value={category} />}
          <button
            type="submit"
            className="px-6 h-12 rounded-md bg-brand hover:bg-brand-strong text-white text-sm font-semibold transition-colors shadow-xs"
          >
            Search
          </button>
        </form>
      </div>

      {/* Filter Pills */}
      {cleanQ && (
        <div className="flex flex-wrap gap-2 items-center" role="tablist" aria-label="Result type filters">
          {types.map((tp) => {
            const isSelected = type === tp.key;
            const targetUrl = `/search?q=${encodeURIComponent(cleanQ)}&type=${tp.key}${
              category ? `&category=${category}` : ''
            }`;
            return (
              <Link key={tp.key} href={targetUrl}>
                <FilterChip label={tp.label} selected={isSelected} />
              </Link>
            );
          })}
        </div>
      )}

      {/* Results or Empty State */}
      {!cleanQ ? (
        <div className="py-12 text-center text-ink-muted dark:text-ink-muted-dark">
          <p className="text-base">{t('home.hero.subtitle')}</p>
        </div>
      ) : items.length === 0 && spotlight.length === 0 ? (
        <EmptyState
          title={t('search.empty.title')}
          description={t('search.empty.description')}
          actionLabel={t('explore.title')}
          actionHref="/explore"
        />
      ) : (
        <div className="flex flex-col gap-10">
          {/* Spotlight Group if present */}
          {spotlight.length > 0 && (
            <section aria-label="Promoted listings" className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-terracotta dark:text-terracotta-dark">
                {t('search.spotlight_heading')} ({t('common.paid_listing')})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {spotlight.map((item) => (
                  <SpotlightCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}

          {/* Organic Results */}
          {items.length > 0 && (
            <section aria-label="Organic search results" className="flex flex-col gap-3">
              <span className="text-sm font-medium text-ink-muted dark:text-ink-muted-dark">
                {t('search.results_count', { count: items.length, query: cleanQ })}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                  <ListingCard key={item.id} listing={item} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
