import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getPublicListingDetail } from '@/lib/api/public-queries';
import { CategoryChip } from '@/components/ui/chip';
import { Badge, ClosingSoonBadge } from '@/components/ui/badge';
import { ListingActions } from '@/components/interaction/listing-actions';
import { t } from '@/lib/copy/strings';

interface OpportunityDetailPageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: OpportunityDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const opp = await getPublicListingDetail('opportunity', id);

  if (!opp) {
    return { title: 'Not Found | Campusly' };
  }

  const ogImageUrl = `/api/v1/og/listing/${opp.id}`;

  return {
    title: `${opp.title} | Campusly Opportunities`,
    description: opp.summary,
    openGraph: {
      title: `${opp.title} | Campusly Opportunities`,
      description: opp.summary,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: opp.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${opp.title} | Campusly Opportunities`,
      description: opp.summary,
      images: [ogImageUrl],
    },
  };
}

export default async function OpportunityDetailPage({ params }: OpportunityDetailPageProps) {
  const { id } = await params;
  const opp = await getPublicListingDetail('opportunity', id);

  if (!opp) {
    notFound();
  }

  const { details } = opp;

  const deadlineDate = opp.deadline_at ? new Date(opp.deadline_at) : null;
  const formattedDeadline = deadlineDate
    ? deadlineDate.toLocaleDateString('en-NG', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb">
        <Link
          href="/opportunities"
          className="text-xs font-semibold text-terracotta dark:text-terracotta-dark hover:underline flex items-center gap-1"
        >
          &larr; {t('opportunities.title')}
        </Link>
      </nav>

      {/* Header */}
      <header className="flex flex-col gap-4 border-b border-sand-dark dark:border-sand-dark-dark pb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <CategoryChip
            name={opp.category.name}
            icon={opp.category.icon_key}
            selected={false}
          />
          {details.type && (
            <Badge variant="terracotta" size="sm">
              {details.type}
            </Badge>
          )}
          {opp.closing_soon && <ClosingSoonBadge />}
        </div>

        <h1 className="font-display font-bold text-3xl sm:text-5xl text-ink dark:text-ink-dark leading-tight">
          {opp.title}
        </h1>
        <p className="text-lg text-ink-muted dark:text-ink-muted-dark leading-relaxed">
          {opp.summary}
        </p>

        {/* Opportunity Actions: Share, Report (D06 API-207) */}
        <div className="pt-2">
          <ListingActions
            id={opp.id}
            kind="opportunity"
            title={opp.title}
            summary={opp.summary}
          />
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 flex flex-col gap-6">
          <section aria-labelledby="desc-heading" className="flex flex-col gap-3">
            <h2 id="desc-heading" className="font-display font-bold text-xl text-ink dark:text-ink-dark">
              About this opportunity
            </h2>
            <div className="text-base text-ink dark:text-ink-dark whitespace-pre-line leading-relaxed">
              {opp.description}
            </div>
          </section>

          {/* Eligibility Criteria */}
          {details.eligibility && (
            <section className="bg-surface-container dark:bg-canvas-dark p-6 rounded-lg border border-border dark:border-border-dark flex flex-col gap-2 shadow-xs">
              <h3 className="font-semibold text-sm text-ink dark:text-ink-dark">
                {t('opportunities.detail.eligibility')}
              </h3>
              <p className="text-sm text-ink-muted dark:text-ink-muted-dark leading-relaxed">
                {details.eligibility}
              </p>
            </section>
          )}

          {/* Apply button */}
          {details.apply_link && (
            <div className="pt-4">
              <a
                href={details.apply_link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 rounded-md bg-brand hover:bg-brand-strong text-white text-sm font-semibold transition-colors shadow-xs inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
              >
                <span>{t('opportunities.detail.apply')}</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6">
          <div className="bg-surface-container dark:bg-canvas-dark border border-border dark:border-border-dark rounded-lg p-5 flex flex-col gap-4 shadow-xs">
            <div>
              <span className="text-xs font-semibold text-terracotta dark:text-terracotta-dark uppercase tracking-wider block">
                {t('opportunities.detail.deadline')}
              </span>
              <p className="font-semibold text-sm text-ink dark:text-ink-dark mt-1">
                {details.is_rolling
                  ? t('opportunities.detail.rolling')
                  : formattedDeadline || 'Not specified'}
              </p>
            </div>

            {details.organiser && (
              <div className="pt-3 border-t border-sand-dark dark:border-sand-dark-dark">
                <span className="text-xs font-semibold text-terracotta dark:text-terracotta-dark uppercase tracking-wider block">
                  {t('opportunities.detail.organiser')}
                </span>
                <p className="text-sm font-medium text-ink dark:text-ink-dark mt-1">
                  {details.organiser}
                </p>
              </div>
            )}

            {(opp.contact.name || opp.contact.channel) && (
              <div className="pt-3 border-t border-sand-dark dark:border-sand-dark-dark">
                <span className="text-xs font-semibold text-terracotta dark:text-terracotta-dark uppercase tracking-wider block">
                  Contact Channel
                </span>
                {opp.contact.name && (
                  <p className="text-xs font-medium text-ink dark:text-ink-dark mt-1">
                    {opp.contact.name}
                  </p>
                )}
                {opp.contact.channel && (
                  <p className="text-xs text-ink-muted dark:text-ink-muted-dark">
                    {opp.contact.channel}
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
