import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { Calendar } from 'lucide-react';
import { getPublicListingDetail } from '@/lib/api/public-queries';
import { CategoryChip } from '@/components/ui/chip';
import { Badge } from '@/components/ui/badge';
import { ListingActions } from '@/components/interaction/listing-actions';
import { t } from '@/lib/copy/strings';

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await getPublicListingDetail('event', id);

  if (!event) {
    return { title: 'Not Found | Campusly' };
  }

  const ogImageUrl = `/api/v1/og/listing/${event.id}`;

  return {
    title: `${event.title} | Campusly Events`,
    description: event.summary,
    openGraph: {
      title: `${event.title} | Campusly Events`,
      description: event.summary,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: event.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${event.title} | Campusly Events`,
      description: event.summary,
      images: [ogImageUrl],
    },
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  const event = await getPublicListingDetail('event', id);

  if (!event) {
    notFound();
  }

  const { details, links } = event;

  const startDate = event.starts_at ? new Date(event.starts_at) : null;
  const endDate = event.ends_at ? new Date(event.ends_at) : null;

  const formattedDate = startDate
    ? startDate.toLocaleDateString('en-NG', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  const formattedTime = startDate
    ? `${startDate.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', hour12: true })} WAT`
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb">
        <Link
          href="/events"
          className="text-xs font-semibold text-terracotta dark:text-terracotta-dark hover:underline flex items-center gap-1"
        >
          &larr; {t('events.title')}
        </Link>
      </nav>

      {/* Event Header */}
      <header className="flex flex-col gap-4 border-b border-sand-dark dark:border-sand-dark-dark pb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <CategoryChip
            name={event.category.name}
            icon={event.category.icon_key}
            selected={false}
          />
          {details.is_free && (
            <Badge variant="verified" size="sm">
              {t('common.free')}
            </Badge>
          )}
        </div>

        <h1 className="font-display font-bold text-3xl sm:text-5xl text-ink dark:text-ink-dark leading-tight">
          {event.title}
        </h1>
        <p className="text-lg text-ink-muted dark:text-ink-muted-dark leading-relaxed">
          {event.summary}
        </p>

        {/* Event Actions: Add to Calendar, Share, Report (API-110, API-207) */}
        <div className="pt-2">
          <ListingActions
            id={event.id}
            kind="event"
            title={event.title}
            summary={event.summary}
            icsUrl={`/api/v1/events/${event.id}/calendar.ics`}
          />
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Description */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <section aria-labelledby="desc-heading" className="flex flex-col gap-3">
            <h2 id="desc-heading" className="font-display font-bold text-xl text-ink dark:text-ink-dark">
              About this event
            </h2>
            <div className="text-base text-ink dark:text-ink-dark whitespace-pre-line leading-relaxed">
              {event.description}
            </div>
          </section>

          {/* Action links */}
          <div className="flex flex-wrap gap-3 pt-4">
            {details.register_link && (
              <a
                href={details.register_link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-md bg-brand hover:bg-brand-strong text-white text-sm font-semibold transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
              >
                {t('events.detail.register')} &rarr;
              </a>
            )}
            <a
              href={`/api/v1/events/${event.id}/calendar.ics`}
              download={`${event.slug}.ics`}
              className="px-5 py-3 rounded-md border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark text-sm font-semibold hover:bg-surface-container transition-colors shadow-xs flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-ink-muted dark:text-ink-muted-dark" strokeWidth={1.5} aria-hidden="true" />
              <span>{t('events.detail.add_calendar')}</span>
            </a>
          </div>
        </div>

        {/* Sidebar: When & Where */}
        <aside className="flex flex-col gap-6">
          <div className="bg-surface-container dark:bg-canvas-dark border border-border dark:border-border-dark rounded-lg p-5 flex flex-col gap-4 shadow-xs">
            <div>
              <span className="text-xs font-semibold text-terracotta dark:text-terracotta-dark uppercase tracking-wider block">
                {t('events.detail.when')}
              </span>
              <p className="font-semibold text-sm text-ink dark:text-ink-dark mt-1">
                {formattedDate}
              </p>
              <p className="text-xs text-ink-muted dark:text-ink-muted-dark">
                {formattedTime}
              </p>
            </div>

            <div className="pt-3 border-t border-sand-dark dark:border-sand-dark-dark">
              <span className="text-xs font-semibold text-terracotta dark:text-terracotta-dark uppercase tracking-wider block">
                {t('events.detail.where')}
              </span>
              <p className="font-medium text-sm text-ink dark:text-ink-dark mt-1">
                {details.venue || 'ABU Zaria Campus'}
              </p>
              {details.map_link && (
                <a
                  href={details.map_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-terracotta dark:text-terracotta-dark hover:underline mt-1 inline-block"
                >
                  {t('events.detail.view_map')} &nearr;
                </a>
              )}
            </div>

            {(event.contact.name || event.contact.channel) && (
              <div className="pt-3 border-t border-sand-dark dark:border-sand-dark-dark">
                <span className="text-xs font-semibold text-terracotta dark:text-terracotta-dark uppercase tracking-wider block">
                  Organiser Contact
                </span>
                {event.contact.name && (
                  <p className="text-xs font-medium text-ink dark:text-ink-dark mt-1">
                    {event.contact.name}
                  </p>
                )}
                {event.contact.channel && (
                  <p className="text-xs text-ink-muted dark:text-ink-muted-dark">
                    {event.contact.channel}
                  </p>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
