import Link from 'next/link';
import { getPublicHomeBundle } from '@/lib/api/public-queries';
import { ListingCard } from '@/components/cards/listing-card';
import { SpotlightCard } from '@/components/cards/spotlight-card';
import { CategoryChip } from '@/components/ui/chip';
import { Banner } from '@/components/ui/banner';
import { t } from '@/lib/copy/strings';

export const revalidate = 60; // 60-second cache

export default async function HomePage() {
  let bundle;
  try {
    bundle = await getPublicHomeBundle();
  } catch (error) {
    bundle = {
      pinned_announcement: null,
      this_week: [],
      categories: [],
      spotlight_strip: [],
      closing_soon: [],
      top_communities: [],
    };
  }

  const {
    pinned_announcement,
    this_week,
    categories,
    spotlight_strip,
    closing_soon,
    top_communities,
  } = bundle;

  return (
    <div className="flex flex-col gap-10 pb-16">
      {/* Pinned Announcement */}
      {pinned_announcement && (
        <section aria-label="Official announcement" className="max-w-7xl mx-auto w-full px-4 pt-4">
          <Banner
            variant="announcement"
            message={
              <span>
                <strong className="font-semibold">{pinned_announcement.title}: </strong>
                {pinned_announcement.body}
              </span>
            }
          />
        </section>
      )}

      {/* Hero Section */}
      <section className="bg-sand-light dark:bg-sand-light-dark border-b border-sand-dark dark:border-sand-dark-dark py-12 px-4 transition-colors">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-4">
          <span className="text-xs uppercase tracking-wider font-semibold text-terracotta dark:text-terracotta-dark">
            {t('app.campus')}
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-5xl text-ink dark:text-ink-dark leading-tight">
            {t('home.hero.title')}
          </h1>
          <p className="font-sans text-base sm:text-lg text-ink-muted dark:text-ink-muted-dark max-w-xl">
            {t('home.hero.subtitle')}
          </p>

          {/* Quick Search Box linking to /search */}
          <form action="/search" method="GET" className="w-full max-w-lg mt-3 flex items-stretch gap-2">
            <div className="relative flex-1">
              <input
                type="search"
                name="q"
                placeholder={t('home.search_placeholder')}
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-sand-dark dark:border-sand-dark-dark bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark placeholder:text-ink-muted dark:placeholder:text-ink-muted-dark text-sm focus:outline-none focus:ring-2 focus:ring-terracotta transition-shadow"
                required
              />
              <svg
                className="w-5 h-5 absolute left-3.5 top-3.5 text-ink-muted dark:text-ink-muted-dark pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              type="submit"
              className="px-5 h-12 rounded-xl bg-terracotta hover:bg-terracotta-hover text-white text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-terracotta"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto w-full px-4 flex flex-col gap-12">
        {/* Category Tiles */}
        <section aria-labelledby="categories-heading" className="flex flex-col gap-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 id="categories-heading" className="font-display font-bold text-2xl text-ink dark:text-ink-dark">
                {t('home.categories.heading')}
              </h2>
              <p className="text-sm text-ink-muted dark:text-ink-muted-dark">
                {t('home.categories.subheading')}
              </p>
            </div>
            <Link
              href="/explore"
              className="text-sm font-semibold text-terracotta dark:text-terracotta-dark hover:underline"
            >
              {t('home.view_all')} &rarr;
            </Link>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {categories.map((cat: any) => (
              <Link key={cat.id} href={`/categories/${cat.slug}`}>
                <CategoryChip
                  name={cat.name}
                  icon={cat.icon_key}
                  count={parseInt(cat.live_count, 10)}
                  selected={false}
                />
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Spotlight Strip */}
        {spotlight_strip.length > 0 && (
          <section aria-labelledby="spotlight-heading" className="flex flex-col gap-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-terracotta dark:text-terracotta-dark">
                  {t('common.paid_listing')}
                </span>
                <h2 id="spotlight-heading" className="font-display font-bold text-2xl text-ink dark:text-ink-dark">
                  {t('home.spotlight.heading')}
                </h2>
                <p className="text-sm text-ink-muted dark:text-ink-muted-dark">
                  {t('home.spotlight.subheading')}
                </p>
              </div>
              <Link
                href="/spotlight"
                className="text-sm font-semibold text-terracotta dark:text-terracotta-dark hover:underline"
              >
                {t('home.view_all')} &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {spotlight_strip.map((item) => (
                <SpotlightCard key={item.id} item={item} variant="strip" />
              ))}
            </div>
          </section>
        )}

        {/* This Week Events */}
        {this_week.length > 0 && (
          <section aria-labelledby="this-week-heading" className="flex flex-col gap-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 id="this-week-heading" className="font-display font-bold text-2xl text-ink dark:text-ink-dark">
                  {t('home.this_week.heading')}
                </h2>
                <p className="text-sm text-ink-muted dark:text-ink-muted-dark">
                  {t('home.this_week.subheading')}
                </p>
              </div>
              <Link
                href="/events?when=week"
                className="text-sm font-semibold text-terracotta dark:text-terracotta-dark hover:underline"
              >
                {t('home.view_all')} &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {this_week.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          </section>
        )}

        {/* Opportunities Closing Soon */}
        {closing_soon.length > 0 && (
          <section aria-labelledby="closing-soon-heading" className="flex flex-col gap-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 id="closing-soon-heading" className="font-display font-bold text-2xl text-ink dark:text-ink-dark">
                  {t('home.closing_soon.heading')}
                </h2>
                <p className="text-sm text-ink-muted dark:text-ink-muted-dark">
                  {t('home.closing_soon.subheading')}
                </p>
              </div>
              <Link
                href="/opportunities?closing_soon=true"
                className="text-sm font-semibold text-terracotta dark:text-terracotta-dark hover:underline"
              >
                {t('home.view_all')} &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {closing_soon.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          </section>
        )}

        {/* Popular Communities */}
        {top_communities.length > 0 && (
          <section aria-labelledby="communities-heading" className="flex flex-col gap-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 id="communities-heading" className="font-display font-bold text-2xl text-ink dark:text-ink-dark">
                  {t('home.top_communities.heading')}
                </h2>
                <p className="text-sm text-ink-muted dark:text-ink-muted-dark">
                  {t('home.top_communities.subheading')}
                </p>
              </div>
              <Link
                href="/communities?sort=stars"
                className="text-sm font-semibold text-terracotta dark:text-terracotta-dark hover:underline"
              >
                {t('home.view_all')} &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {top_communities.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
