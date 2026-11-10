import * as React from 'react';
import Link from 'next/link';
import { query } from '@/lib/db';
import { CategoryChip } from '@/components/ui/chip';
import { Grid, Compass } from 'lucide-react';

export const revalidate = 60;

export const metadata = {
  title: 'Explore Categories | Campusly - Ahmadu Bello University',
  description:
    'Browse through all academic disciplines, faculties, arts, engineering, and student classifications at Ahmadu Bello University.',
};

export default async function CategoriesOverviewPage() {
  let categories: any[] = [];

  try {
    const res = await query(
      `SELECT c.id, c.name, c.slug, c.kind, c.icon_key,
              COUNT(l.id)::int as live_count
       FROM categories c
       LEFT JOIN listings l ON c.id = l.category_id AND l.status IN ('Approved', 'Verified')
       GROUP BY c.id, c.name, c.slug, c.kind, c.icon_key
       ORDER BY live_count DESC, c.sort ASC`
    );
    categories = res.rows || [];
  } catch (err) {
    console.warn('[Categories Page] DB query error, rendering fallback:', err);
  }

  const communityCategories = categories.filter((c) => c.kind === 'community');
  const spotlightCategories = categories.filter((c) => c.kind === 'spotlight');

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 sm:gap-10">
      {/* Header */}
      <div className="relative overflow-hidden rounded-lg bg-surface-container dark:bg-canvas-dark border border-border dark:border-border-dark p-6 sm:p-10 lg:p-12 shadow-xs">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-xs font-semibold shadow-xs">
            <Grid className="w-4 h-4 text-brand dark:text-brand-dark" strokeWidth={1.5} />
            <span className="uppercase tracking-wider font-mono text-secondary-light dark:text-secondary text-[11px] font-bold">
              Directory Classification Index
            </span>
            <span className="text-border dark:text-border-dark">•</span>
            <span className="text-ink-muted dark:text-ink-muted-dark text-[11px] font-mono">All Academic Disciplines</span>
          </div>

          <h1 className="font-display font-bold text-3xl sm:text-5xl text-ink dark:text-ink-dark tracking-tight">
            Explore Categories &amp; Faculties
          </h1>
          <p className="text-base sm:text-lg text-ink-muted dark:text-ink-muted-dark leading-relaxed">
            Discover student communities and commercial ventures organized by academic disciplines, engineering faculties, and university life categories.
          </p>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <Link
              href="/explore"
              className="px-6 py-3 rounded-md bg-brand hover:bg-brand-strong text-white text-sm font-semibold transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.99] shadow-xs flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
            >
              <Compass className="w-4 h-4" strokeWidth={1.5} />
              <span>Explore All Listings</span>
            </Link>
            <Link
              href="/businesses"
              className="px-6 py-3 rounded-md bg-surface dark:bg-canvas-dark hover:bg-surface-container border border-border dark:border-border-dark text-ink dark:text-ink-dark text-sm font-semibold transition-all shadow-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
            >
              Top 10 Businesses
            </Link>
          </div>
        </div>
      </div>

      {/* Community Categories */}
      <section aria-label="Community Categories" className="flex flex-col gap-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-ink dark:text-ink-dark">
            Academic &amp; Student Societies Categories
          </h2>
          <p className="text-sm text-ink-muted dark:text-ink-muted-dark mt-1">
            Societies, technical student chapters, and research associations across ABU faculties.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {communityCategories.map((cat) => (
            <Link key={cat.id} href={`/categories/${cat.slug}`}>
              <CategoryChip
                name={cat.name}
                icon={cat.icon_key}
                count={cat.live_count}
                selected={false}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Commercial & Spotlight Categories */}
      {spotlightCategories.length > 0 && (
        <section aria-label="Commercial Categories" className="flex flex-col gap-6 pt-4 border-t border-border dark:border-border-dark">
          <div>
            <h2 className="font-display font-bold text-2xl text-ink dark:text-ink-dark">
              Campus Commercial &amp; Venture Categories
            </h2>
            <p className="text-sm text-ink-muted dark:text-ink-muted-dark mt-1">
              Student enterprises, print services, cafeterias, and professional campus vendors.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {spotlightCategories.map((cat) => (
              <Link key={cat.id} href={`/categories/${cat.slug}`}>
                <CategoryChip
                  name={cat.name}
                  icon={cat.icon_key}
                  count={cat.live_count}
                  selected={false}
                />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
