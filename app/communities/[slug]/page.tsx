import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { CheckCircle2 } from 'lucide-react';
import { getPublicListingDetail } from '@/lib/api/public-queries';
import { ListingCard } from '@/components/cards/listing-card';
import { ListingActions } from '@/components/interaction/listing-actions';
import { t } from '@/lib/copy/strings';

interface CommunityPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: CommunityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const community = await getPublicListingDetail('community', slug);

  if (!community) {
    return { title: 'Not Found | Campusly' };
  }

  const ogImageUrl = `/api/v1/og/listing/${community.id}`;

  return {
    title: `${community.title} | Campusly ABU Zaria`,
    description: community.summary,
    openGraph: {
      title: `${community.title} | Campusly ABU Zaria`,
      description: community.summary,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: community.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${community.title} | Campusly ABU Zaria`,
      description: community.summary,
      images: [ogImageUrl],
    },
  };
}

export default async function CommunityPage({ params }: CommunityPageProps) {
  const { slug } = await params;
  const community = await getPublicListingDetail('community', slug);

  if (!community) {
    notFound();
  }

  const { details, links, upcoming = [] } = community;
  const shareText = encodeURIComponent(`Check out ${community.title} on Campusly ABU Zaria`);
  const shareUrl = encodeURIComponent(`https://campusly.abu.edu.ng/communities/${slug}`);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Top Stack Quick Share & Breadcrumb Strip */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2">
          <Link
            href="/explore"
            className="text-xs font-semibold text-brand hover:underline flex items-center gap-1"
          >
            &larr; Directory
          </Link>
          <span className="text-xs text-border" aria-hidden="true">&bull;</span>
          <Link
            href={`/categories/${community.category.slug}`}
            className="text-xs text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark font-medium"
          >
            {community.category.name}
          </Link>
        </nav>

        {/* Quick Social Share Chips */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark mr-1">
            Share:
          </span>
          <a
            aria-label="Share on WhatsApp"
            href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center hover:bg-emerald-500/20 transition-colors shadow-2xs"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.044-1.013-.069-.239-.07-.548-.188-.938-.354-1.644-.701-2.714-2.364-2.798-2.474-.083-.112-.676-.9-.676-1.716 0-.816.427-1.218.579-1.383.152-.165.334-.207.446-.207.112 0 .224 0 .324.004.105.004.246-.039.384.293.144.343.489 1.194.532 1.282.043.088.072.19.014.305-.058.115-.088.187-.174.288-.088.102-.185.228-.265.306-.089.088-.182.183-.078.361.104.178.462.763.993 1.237.683.609 1.258.798 1.436.886.178.089.282.074.386-.044.105-.119.447-.52.566-.699.119-.179.239-.149.401-.089.163.059 1.034.488 1.212.577.178.089.297.133.341.208.044.074.044.434-.1.839z" />
            </svg>
          </a>
          <a
            aria-label="Share on X"
            href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-surface-container text-ink dark:text-ink-dark flex items-center justify-center hover:bg-raised transition-colors shadow-2xs"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Hero Cover Banner & Profile Card Layering */}
      <div className="flex flex-col relative">
        {/* Cover Photo / Architectural Canvas */}
        <div className="relative w-full h-44 sm:h-56 rounded-lg overflow-hidden border border-border dark:border-border-dark bg-secondary dark:bg-canvas-dark shadow-xs">
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-3 right-3 bg-surface dark:bg-surface-dark px-3 py-1 rounded-sm shadow-xs flex items-center gap-1.5 border border-border dark:border-border-dark">
            <span className="w-2 h-2 rounded-full bg-brand" aria-hidden="true" />
            <span className="text-xs font-semibold text-ink dark:text-ink-dark">ABU Campus Chapter</span>
          </div>
        </div>

        {/* Floating Emblem & Profile Metadata Card */}
        <div className="relative -mt-10 bg-surface-container dark:bg-canvas-dark border border-border dark:border-border-dark rounded-lg p-5 sm:p-7 shadow-xs">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            {/* Emblem (Borderless) */}
            <div className="w-16 h-16 rounded-xl bg-raised dark:bg-raised-dark shadow-sm p-1.5 flex items-center justify-center -mt-8 relative">
              <div className="w-full h-full rounded-sm bg-surface-container flex items-center justify-center text-brand font-bold text-xl">
                {community.title.charAt(0)}
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {community.verified && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-secondary text-white text-xs font-semibold shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                  <span>Verified Community</span>
                </div>
              )}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-secondary/10 dark:bg-secondary/20 text-secondary-light dark:text-secondary border border-secondary/20 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-success" aria-hidden="true" />
                <span>Active Chapter</span>
              </div>
            </div>
          </div>

          {/* Heading & Summary */}
          <div className="mt-4">
            <h1 className="font-display font-bold text-2xl sm:text-4xl text-ink dark:text-ink-dark leading-tight">
              {community.title}
            </h1>
            <p className="text-xs uppercase tracking-wider font-semibold text-brand dark:text-brand-strong mt-1 font-mono">
              Ahmadu Bello University, Zaria
            </p>
            <p className="text-base text-ink-muted dark:text-ink-muted-dark mt-2.5 leading-relaxed max-w-3xl">
              {community.summary}
            </p>
          </div>

          {/* Key Metadata Architectural Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="bg-surface dark:bg-surface-dark p-3.5 rounded-md border border-border dark:border-border-dark shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark block mb-1">
                Open To
              </span>
              <p className="text-xs sm:text-sm font-semibold text-ink dark:text-ink-dark truncate">
                {details.who_can_join || 'All Faculties & Depts'}
              </p>
            </div>
            <div className="bg-surface dark:bg-surface-dark p-3.5 rounded-md border border-border dark:border-border-dark shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark block mb-1">
                Meeting Place
              </span>
              <p className="text-xs sm:text-sm font-semibold text-ink dark:text-ink-dark truncate">
                {details.meeting_times ? 'Designated Halls' : 'Main Campus Quad'}
              </p>
            </div>
            <div className="bg-surface dark:bg-surface-dark p-3.5 rounded-md border border-border dark:border-border-dark shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark block mb-1">
                Cadence
              </span>
              <p className="text-xs sm:text-sm font-semibold text-ink dark:text-ink-dark truncate">
                {details.meeting_times || 'Weekly Sessions'}
              </p>
            </div>
            <div className="bg-surface dark:bg-surface-dark p-3.5 rounded-md border border-border dark:border-border-dark shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark block mb-1">
                Chartered
              </span>
              <p className="text-xs sm:text-sm font-semibold text-ink dark:text-ink-dark truncate">
                {details.founded_year || 'Est. ABU Zaria'}
              </p>
            </div>
          </div>

          {/* Action Bar (Star, Share, Report) */}
          <div className="mt-6 pt-4 border-t border-border dark:border-border-dark flex items-center justify-between flex-wrap gap-4">
            <ListingActions
              id={community.id}
              kind="community"
              title={community.title}
              summary={community.summary}
              starCount={community.star_count}
            />
            {details.how_to_join && (
              <a
                href="#join-section"
                className="py-2 px-5 rounded-md bg-brand hover:bg-brand-strong text-white font-semibold text-sm shadow-xs transition-colors"
              >
                How to Join &rarr;
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Content & Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
        {/* Left Column: Description & Registry Details */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <section aria-labelledby="about-heading" className="bg-surface-container dark:bg-canvas-dark border border-border dark:border-border-dark rounded-lg p-6 shadow-xs flex flex-col gap-3">
            <h2 id="about-heading" className="font-display font-bold text-xl text-ink dark:text-ink-dark">
              {t('community.about')}
            </h2>
            <div className="text-sm sm:text-base text-ink dark:text-ink-dark whitespace-pre-line leading-relaxed">
              {community.description}
            </div>
          </section>

          {/* Membership & Meetings Section */}
          <section id="join-section" className="bg-surface-container dark:bg-canvas-dark border border-border dark:border-border-dark rounded-lg p-6 shadow-xs flex flex-col gap-4">
            <h2 className="font-display font-bold text-lg text-ink dark:text-ink-dark">
              Membership &amp; Participation
            </h2>
            {details.how_to_join && (
              <div>
                <h3 className="font-semibold text-sm text-brand dark:text-brand-strong">
                  {t('community.how_to_join')}
                </h3>
                <p className="text-sm text-ink-muted dark:text-ink-muted-dark mt-1 leading-relaxed">
                  {details.how_to_join}
                </p>
              </div>
            )}
            {details.who_can_join && (
              <div className="pt-2 border-t border-border">
                <h3 className="font-semibold text-sm text-brand dark:text-brand-strong">
                  {t('community.who_can_join')}
                </h3>
                <p className="text-sm text-ink-muted dark:text-ink-muted-dark mt-1 leading-relaxed">
                  {details.who_can_join}
                </p>
              </div>
            )}
            {details.meeting_times && (
              <div className="pt-2 border-t border-border">
                <h3 className="font-semibold text-sm text-brand dark:text-brand-strong">
                  {t('community.meetings')}
                </h3>
                <p className="text-sm text-ink-muted dark:text-ink-muted-dark mt-1 leading-relaxed">
                  {details.meeting_times}
                </p>
              </div>
            )}
          </section>

          {/* Upcoming Events by Community */}
          <section aria-labelledby="upcoming-events-heading" className="flex flex-col gap-4">
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

        {/* Right Column: Contact & Official Verification Links */}
        <aside className="flex flex-col gap-6">
          <div className="bg-surface-container dark:bg-canvas-dark border border-border dark:border-border-dark rounded-lg p-5 flex flex-col gap-4 shadow-xs">
            <h3 className="font-display font-semibold text-base text-ink dark:text-ink-dark">
              {t('common.contact')}
            </h3>
            {community.contact.name && (
              <div className="text-sm">
                <span className="text-xs text-ink-muted dark:text-ink-muted-dark block">Leadership Contact</span>
                <span className="font-semibold text-ink dark:text-ink-dark">{community.contact.name}</span>
              </div>
            )}
            {community.contact.channel && (
              <div className="text-sm">
                <span className="text-xs text-ink-muted dark:text-ink-muted-dark block">Official Channel</span>
                <span className="font-semibold text-ink dark:text-ink-dark">{community.contact.channel}</span>
              </div>
            )}

            {links.length > 0 && (
              <div className="flex flex-col gap-2.5 pt-3 border-t border-border">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark">
                  Verified Links
                </span>
                {links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-brand dark:text-brand-strong hover:underline flex items-center justify-between p-2 rounded-lg bg-raised dark:bg-raised-dark border border-border"
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
