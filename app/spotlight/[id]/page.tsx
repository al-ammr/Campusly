import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSpotlightDetail } from '@/lib/api/public-queries';
import { PaidBadge, Badge } from '@/components/ui/badge';
import { Banner } from '@/components/ui/banner';
import { SpotlightActions } from '@/components/interaction/spotlight-actions';
import { SpotlightOrderStatus } from '@/components/SpotlightOrderStatus';
import { t } from '@/lib/copy/strings';

interface SpotlightDetailPageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 60;

export default async function SpotlightDetailPage({ params }: SpotlightDetailPageProps) {
  const { id } = await params;

  // Handle Order Reference lookup (e.g. SPT-ABU-XXXXX)
  if (id.startsWith('SPT-')) {
    return <SpotlightOrderStatus reference={id} />;
  }

  const item = await getSpotlightDetail(id);

  if (!item) {
    notFound();
  }

  const isFeatured = item.plan === 'featured';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb">
        <Link
          href="/spotlight"
          className="text-xs font-semibold text-terracotta dark:text-terracotta-dark hover:underline flex items-center gap-1"
        >
          &larr; {t('spotlight.title')}
        </Link>
      </nav>

      {/* Header */}
      <header className="flex flex-col gap-4 border-b border-sand-dark dark:border-sand-dark-dark pb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <PaidBadge />
          {isFeatured && (
            <Badge variant="terracotta" size="sm">
              Featured Plan
            </Badge>
          )}
          <span className="text-xs text-ink-muted dark:text-ink-muted-dark font-medium">
            {item.category.name}
          </span>
        </div>

        <h1 className="font-display font-bold text-3xl sm:text-5xl text-ink dark:text-ink-dark leading-tight">
          {item.business_name}
        </h1>
        <p className="font-sans font-medium text-xl text-terracotta dark:text-terracotta-dark">
          {item.offer}
        </p>

        {/* Spotlight Actions: Share & Report (API-208) */}
        <div className="pt-2">
          <SpotlightActions
            id={item.id}
            businessName={item.business_name}
            offer={item.offer}
          />
        </div>
      </header>

      {/* Paid Notice Banner */}
      <Banner
        variant="warning"
        message={
          <span>
            <strong className="font-semibold">{t('common.paid_listing')} — </strong>
            {t('spotlight.paid_disclaimer')}
          </span>
        }
      />

      {/* Description */}
      <section aria-labelledby="desc-heading" className="flex flex-col gap-3">
        <h2 id="desc-heading" className="font-display font-bold text-xl text-ink dark:text-ink-dark">
          About this service
        </h2>
        <div className="text-base text-ink dark:text-ink-dark whitespace-pre-line leading-relaxed">
          {item.description}
        </div>
      </section>

      {/* Contact Box */}
      <section className="bg-surface-container dark:bg-canvas-dark p-6 rounded-lg border border-border dark:border-border-dark flex flex-col gap-3 shadow-xs">
        <h3 className="font-semibold text-sm text-ink dark:text-ink-dark">
          Contact & Bookings
        </h3>
        <p className="text-base font-medium text-ink dark:text-ink-dark">
          {item.contact}
        </p>
      </section>
    </div>
  );
}
