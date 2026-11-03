import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategoryWithCommunities } from '@/lib/api/public-queries';
import { ListingCard } from '@/components/cards/listing-card';
import { EmptyState } from '@/components/ui/empty-state';
import { t } from '@/lib/copy/strings';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ cursor?: string }>;
}

export const revalidate = 60;

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { cursor } = await searchParams;

  const data = await getCategoryWithCommunities(slug, cursor);
  if (!data) {
    notFound();
  }

  const { category, items, next_cursor } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Category Header */}
      <div className="flex flex-col gap-2 max-w-2xl border-b border-sand-dark dark:border-sand-dark-dark pb-6">
        <Link
          href="/explore"
          className="text-xs font-semibold text-terracotta dark:text-terracotta-dark hover:underline flex items-center gap-1"
        >
          &larr; {t('explore.title')}
        </Link>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink dark:text-ink-dark">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-base text-ink-muted dark:text-ink-muted-dark leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      {/* Communities Grid */}
      <section aria-labelledby="communities-heading" className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 id="communities-heading" className="font-display font-semibold text-2xl text-ink dark:text-ink-dark">
            {t('category.communities_heading', { category: category.name })}
          </h2>
          <span className="text-xs text-ink-muted dark:text-ink-muted-dark font-medium">
            {items.length} listed
          </span>
        </div>

        {items.length === 0 ? (
          <EmptyState
            title={t('category.empty.title')}
            description={t('category.empty.description')}
            actionLabel={t('category.submit_action')}
            actionHref="/submit"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        {/* Load more if next_cursor */}
        {next_cursor && (
          <div className="flex justify-center pt-6">
            <Link
              href={`/categories/${slug}?cursor=${next_cursor}`}
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
