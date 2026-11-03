import Link from 'next/link';
import { getSpotlightDirectory, PublicSpotlightItem } from '@/lib/api/public-queries';
import { SpotlightCard } from '@/components/cards/spotlight-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Banner } from '@/components/ui/banner';
import { t } from '@/lib/copy/strings';

interface SpotlightPageProps {
  searchParams: Promise<{
    category?: string;
    cursor?: string;
  }>;
}

export const revalidate = 60;

export default async function SpotlightPage({ searchParams }: SpotlightPageProps) {
  const { category, cursor } = await searchParams;

  let spotlightData: {
    featured_strip: PublicSpotlightItem[];
    items: PublicSpotlightItem[];
    next_cursor: string | null;
  } = { featured_strip: [], items: [], next_cursor: null };
  try {
    spotlightData = await getSpotlightDirectory(category, cursor, 12);
  } catch {
    spotlightData = { featured_strip: [], items: [], next_cursor: null };
  }

  const { featured_strip, items, next_cursor } = spotlightData;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2 max-w-2xl">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-terracotta dark:text-terracotta-dark">
            {t('common.paid_listing')}
          </span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink dark:text-ink-dark">
          {t('spotlight.title')}
        </h1>
        <p className="text-base text-ink-muted dark:text-ink-muted-dark">
          {t('spotlight.subtitle')}
        </p>
      </div>

      {/* Paid Disclaimer Banner */}
      <Banner
        variant="warning"
        message={
          <span>
            <strong className="font-semibold">{t('common.paid_listing')} — </strong>
            {t('spotlight.paid_disclaimer')}
          </span>
        }
      />

      {/* Featured Strip if present */}
      {featured_strip.length > 0 && (
        <section aria-labelledby="featured-heading" className="flex flex-col gap-4">
          <h2 id="featured-heading" className="font-display font-semibold text-2xl text-ink dark:text-ink-dark">
            {t('spotlight.featured_strip')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured_strip.map((item) => (
              <SpotlightCard key={item.id} item={item} variant="strip" />
            ))}
          </div>
        </section>
      )}

      {/* Ranked Items or Empty State */}
      <section aria-labelledby="ranked-heading" className="flex flex-col gap-4">
        <h2 id="ranked-heading" className="font-display font-semibold text-2xl text-ink dark:text-ink-dark">
          {t('spotlight.ranked_items')}
        </h2>

        {items.length === 0 && featured_strip.length === 0 ? (
          <EmptyState
            title={t('spotlight.empty.title')}
            description={t('spotlight.empty.description')}
            actionLabel={t('spotlight.post_action')}
            actionHref="/spotlight/new"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item) => (
              <SpotlightCard key={item.id} item={item} variant="ranked" />
            ))}
          </div>
        )}

        {/* Load More */}
        {next_cursor && (
          <div className="flex justify-center pt-6">
            <Link
              href={`/spotlight?${category ? `category=${category}&` : ''}cursor=${next_cursor}`}
              className="px-6 py-2.5 rounded-xl border border-sand-dark dark:border-sand-dark-dark bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark text-sm font-semibold hover:bg-sand-light dark:hover:bg-sand-light-dark transition-colors"
            >
              {t('common.load_more')}
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
