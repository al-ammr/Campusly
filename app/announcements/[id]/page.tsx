import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAnnouncementDetail } from '@/lib/api/public-queries';
import { Badge } from '@/components/ui/badge';
import { t } from '@/lib/copy/strings';

interface AnnouncementDetailPageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 60;

export default async function AnnouncementDetailPage({ params }: AnnouncementDetailPageProps) {
  const { id } = await params;
  const ann = await getAnnouncementDetail(id);

  if (!ann) {
    notFound();
  }

  const dateStr = new Date(ann.published_at).toLocaleDateString('en-NG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb">
        <Link
          href="/announcements"
          className="text-xs font-semibold text-terracotta dark:text-terracotta-dark hover:underline flex items-center gap-1"
        >
          &larr; {t('announcements.title')}
        </Link>
      </nav>

      {/* Header */}
      <header className="flex flex-col gap-4 border-b border-sand-dark dark:border-sand-dark-dark pb-6">
        <div className="flex items-center gap-2">
          {ann.pinned && (
            <Badge variant="terracotta" size="sm">
              {t('announcements.pinned')}
            </Badge>
          )}
          <span className="text-xs text-ink-muted dark:text-ink-muted-dark font-medium">
            Published on {dateStr}
          </span>
        </div>

        <h1 className="font-display font-bold text-3xl sm:text-5xl text-ink dark:text-ink-dark leading-tight">
          {ann.title}
        </h1>
      </header>

      {/* Full Body */}
      <article className="text-base sm:text-lg text-ink dark:text-ink-dark whitespace-pre-line leading-relaxed">
        {ann.body}
      </article>
    </div>
  );
}
