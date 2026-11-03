import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPublicListingDetail } from '@/lib/api/public-queries';
import { VerifiedBadge } from '@/components/ui/badge';
import { CategoryChip } from '@/components/ui/chip';
import { ListingCard } from '@/components/cards/listing-card';
import { t } from '@/lib/copy/strings';

interface CommunityPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export default async function CommunityPage({ params }: CommunityPageProps) {
  const { slug } = await params;
  const community = await getPublicListingDetail('community', slug);

  if (!community) {
    notFound();
  }

  const { details, links, upcoming = [] } = community;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Back Link */}
      <nav aria-label="Breadcrumb">
        <Link
          href={`/categories/${community.category.slug}`}
          className="text-xs font-semibold text-terracotta dark:text-terracotta-dark hover:underline flex items-center gap-1"
        >
          &larr; {community.category.name}
        </Link>
      </nav>

      {/* Community Header */}
      <header className="flex flex-col gap-4 border-b border-sand-dark dark:border-sand-dark-dark pb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <CategoryChip
            name={community.category.name}
            icon={community.category.icon_key}
            selected={false}
          />
          {community.verified && <VerifiedBadge />}
          {community.star_count !== undefined && (
            <span className="text-xs font-medium text-ink-muted dark:text-ink-muted-dark flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-warm-ochre fill-current" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{community.star_count} stars</span>
            </span>
          )}
        </div>

        <h1 className="font-display font-bold text-3xl sm:text-5xl text-ink dark:text-ink-dark leading-tight">
          {community.title}
        </h1>
        <p className="text-lg text-ink-muted dark:text-ink-muted-dark leading-relaxed">
          {community.summary}
        </p>
      </header>

      {/* Main Content & Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Description */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <section aria-labelledby="about-heading" className="flex flex-col gap-3">
            <h2 id="about-heading" className="font-display font-bold text-xl text-ink dark:text-ink-dark">
              {t('community.about')}
            </h2>
            <div className="text-base text-ink dark:text-ink-dark whitespace-pre-line leading-relaxed">
              {community.description}
            </div>
          </section>

          {/* Membership & Meetings */}
          {(details.how_to_join || details.who_can_join || details.meeting_times) && (
            <section className="bg-sand-light dark:bg-sand-light-dark p-6 rounded-2xl border border-sand-dark dark:border-sand-dark-dark flex flex-col gap-4">
              {details.who_can_join && (
                <div>
                  <h3 className="font-semibold text-sm text-ink dark:text-ink-dark">
                    {t('community.who_can_join')}
                  </h3>
                  <p className="text-sm text-ink-muted dark:text-ink-muted-dark mt-0.5">
                    {details.who_can_join}
                  </p>
                </div>
              )}
              {details.how_to_join && (
                <div>
                  <h3 className="font-semibold text-sm text-ink dark:text-ink-dark">
                    {t('community.how_to_join')}
                  </h3>
                  <p className="text-sm text-ink-muted dark:text-ink-muted-dark mt-0.5">
                    {details.how_to_join}
                  </p>
                </div>
              )}
              {details.meeting_times && (
                <div>
                  <h3 className="font-semibold text-sm text-ink dark:text-ink-dark">
                    {t('community.meetings')}
                  </h3>
                  <p className="text-sm text-ink-muted dark:text-ink-muted-dark mt-0.5">
                    {details.meeting_times}
                  </p>
                </div>
              )}
            </section>
          )}

          {/* Upcoming Events by Community */}
          <section aria-labelledby="upcoming-events-heading" className="flex flex-col gap-4 pt-4">
            <h2 id="upcoming-events-heading" className="font-display font-bold text-xl text-ink dark:text-ink-dark">
              {t('community.upcoming_events')}
            </h2>
            {upcoming.length === 0 ? (
              <p className="text-sm text-ink-muted dark:text-ink-muted-dark italic">
                {t('community.no_upcoming')}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {upcoming.map((ev) => (
                  <ListingCard key={ev.id} listing={ev} />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Sidebar: Contact & Official Links */}
        <aside className="flex flex-col gap-6">
          <div className="bg-surface dark:bg-surface-dark border border-sand-dark dark:border-sand-dark-dark rounded-2xl p-5 flex flex-col gap-4">
            <h3 className="font-display font-semibold text-base text-ink dark:text-ink-dark">
              {t('common.contact')}
            </h3>
            {community.contact.name && (
              <div className="text-sm">
                <span className="text-xs text-ink-muted dark:text-ink-muted-dark block">Coordinator</span>
                <span className="font-medium text-ink dark:text-ink-dark">{community.contact.name}</span>
              </div>
            )}
            {community.contact.channel && (
              <div className="text-sm">
                <span className="text-xs text-ink-muted dark:text-ink-muted-dark block">Official Channel</span>
                <span className="font-medium text-ink dark:text-ink-dark">{community.contact.channel}</span>
              </div>
            )}

            {links.length > 0 && (
              <div className="flex flex-col gap-2 pt-2 border-t border-sand-dark dark:border-sand-dark-dark">
                <span className="text-xs text-ink-muted dark:text-ink-muted-dark font-medium">Links</span>
                {links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-terracotta dark:text-terracotta-dark hover:underline flex items-center justify-between"
                  >
                    <span>{link.label}</span>
                    <span aria-hidden="true">&nearr;</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
