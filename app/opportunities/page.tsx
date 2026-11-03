import Link from 'next/link';
import { getOpportunitiesDirectory, PublicListingSummary } from '@/lib/api/public-queries';
import { ListingCard } from '@/components/cards/listing-card';
import { EmptyState } from '@/components/ui/empty-state';
import { FilterChip } from '@/components/ui/chip';
import { t } from '@/lib/copy/strings';

interface OpportunitiesPageProps {
  searchParams: Promise<{
    type?: string;
    category?: string;
    closing_soon?: string;
    cursor?: string;
  }>;
}

export const revalidate = 60;

export default async function OpportunitiesPage({ searchParams }: OpportunitiesPageProps) {
  const { type, category, closing_soon, cursor } = await searchParams;
  const isClosingSoon = closing_soon === 'true' || closing_soon === '1';

  let oppsData: { items: PublicListingSummary[]; next_cursor: string | null } = {
    items: [],
    next_cursor: null,
  };
  try {
    oppsData = await getOpportunitiesDirectory({
      type,
      category,
      closing_soon: isClosingSoon ? true : undefined,
      cursor,
      limit: 12,
    });
  } catch {
    oppsData = { items: [], next_cursor: null };
  }

  const { items, next_cursor } = oppsData;

  const opportunityTypes = [
    { key: '', label: t('opportunities.filter.all_types') },
    { key: 'internship', label: 'Internships' },
    { key: 'scholarship', label: 'Scholarships' },
    { key: 'competition', label: 'Competitions' },
    { key: 'grant', label: 'Grants' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2 max-w-2xl">
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink dark:text-ink-dark">
          {t('opportunities.title')}
        </h1>
        <p className="text-base text-ink-muted dark:text-ink-muted-dark">
          {t('opportunities.subtitle')}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center" role="tablist" aria-label="Opportunity filters">
        {/* Closing Soon toggle */}
        <Link
          href={`/opportunities?${!isClosingSoon ? 'closing_soon=true' : ''}${
            type ? `&type=${type}` : ''
          }${category ? `&category=${category}` : ''}`}
        >
          <FilterChip label={t('opportunities.filter.closing_soon')} selected={isClosingSoon} />
        </Link>

        {/* Type pills */}
        {opportunityTypes.map((tp) => {
          const isSelected = (!type && tp.key === '') || type === tp.key;
          const targetUrl = `/opportunities?${tp.key ? `type=${tp.key}` : ''}${
            isClosingSoon ? '&closing_soon=true' : ''
          }${category ? `&category=${category}` : ''}`;
          return (
            <Link key={tp.key || 'all'} href={targetUrl}>
              <FilterChip label={tp.label} selected={isSelected} />
            </Link>
          );
        })}
      </div>

      {/* Grid or Empty State */}
      {items.length === 0 ? (
        <EmptyState
          title={t('opportunities.empty.title')}
          description={t('opportunities.empty.description')}
          actionLabel={t('opportunities.submit_action')}
          actionHref="/submit"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((opp) => (
            <ListingCard key={opp.id} listing={opp} />
          ))}
        </div>
      )}

      {/* Load More */}
      {next_cursor && (
        <div className="flex justify-center pt-6">
          <Link
            href={`/opportunities?${type ? `type=${type}&` : ''}${
              isClosingSoon ? 'closing_soon=true&' : ''
            }${category ? `category=${category}&` : ''}cursor=${next_cursor}`}
            className="px-6 py-2.5 rounded-xl border border-sand-dark dark:border-sand-dark-dark bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark text-sm font-semibold hover:bg-sand-light dark:hover:bg-sand-light-dark transition-colors"
          >
            {t('common.load_more')}
          </Link>
        </div>
      )}
    </div>
  );
}
