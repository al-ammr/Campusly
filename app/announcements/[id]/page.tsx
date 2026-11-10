import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAnnouncementDetail } from '@/lib/api/public-queries';
import { getCuratedAnnouncementByIdOrSlug } from '@/lib/data/curated-announcements';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Building2,
  Pin,
  Tag,
  Share2,
} from 'lucide-react';

interface AnnouncementDetailPageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: AnnouncementDetailPageProps) {
  const { id } = await params;
  let title = 'Announcement | Campusly';

  const curated = getCuratedAnnouncementByIdOrSlug(id);
  if (curated) {
    title = `${curated.title} | Campusly - ABU Zaria`;
  } else {
    try {
      const ann = await getAnnouncementDetail(id);
      if (ann) {
        title = `${ann.title} | Campusly - ABU Zaria`;
      }
    } catch {
      // ignore
    }
  }

  return { title };
}

export default async function AnnouncementDetailPage({ params }: AnnouncementDetailPageProps) {
  const { id } = await params;

  // 1. Try DB first
  let ann: any = null;
  try {
    ann = await getAnnouncementDetail(id);
  } catch {
    ann = null;
  }

  // 2. Try curated list
  const curated = getCuratedAnnouncementByIdOrSlug(id);

  if (!ann && !curated) {
    notFound();
  }

  const finalAnn = curated || {
    id: ann.id,
    slug: ann.id,
    title: ann.title,
    body: ann.body,
    summary: ann.body.slice(0, 160),
    published_at: ann.published_at,
    pinned: ann.pinned,
    category: 'Notice',
    authority: 'ABU Administration',
    readTime: '2 min read',
    tags: ['Notice', 'ABU Zaria'],
  };

  const dateStr = new Date(finalAnn.published_at).toLocaleDateString('en-NG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col gap-6">
      {/* Back Link */}
      <nav aria-label="Breadcrumb">
        <Link
          href="/announcements"
          className="inline-flex items-center gap-2 text-xs font-semibold text-brand dark:text-brand-dark hover:underline transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
          <span>Back to Announcements</span>
        </Link>
      </nav>

      {/* Main Notice Card */}
      <article className="rounded-2xl sm:rounded-3xl bg-[#FFFFF0] dark:bg-canvas-dark border border-border dark:border-border-dark p-6 sm:p-10 shadow-xs flex flex-col gap-6">
        {/* Header - No overhead badge */}
        <header className="flex flex-col gap-4 border-b border-border/70 dark:border-border-dark/70 pb-6">
          <div className="flex items-center gap-2.5 flex-wrap text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container dark:bg-surface-dark border border-border dark:border-border-dark text-[11px] font-semibold text-ink-muted dark:text-ink-muted-dark">
              {finalAnn.category}
            </span>
            {finalAnn.pinned && (
              <span className="inline-flex items-center gap-1 text-brand dark:text-brand-dark font-semibold text-[11px]">
                <Pin className="w-3 h-3" strokeWidth={2} />
                Pinned
              </span>
            )}
            <span className="text-ink-muted dark:text-ink-muted-dark font-mono text-[11px]">
              {dateStr}
            </span>
            <span className="text-border dark:text-border-dark">•</span>
            <span className="text-ink-muted dark:text-ink-muted-dark text-[11px]">
              {finalAnn.readTime || '2 min read'}
            </span>
          </div>

          <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-ink dark:text-ink-dark leading-tight">
            {finalAnn.title}
          </h1>

          <div className="flex items-center gap-2 pt-1 text-xs text-ink-muted dark:text-ink-muted-dark">
            <Building2 className="w-4 h-4 text-brand dark:text-brand-dark" strokeWidth={1.5} />
            <span className="font-semibold text-ink dark:text-ink-dark">
              {finalAnn.authority}
            </span>
            <span>•</span>
            <span>Ahmadu Bello University</span>
          </div>
        </header>

        {/* Notice Body in Simple English */}
        <div className="text-sm sm:text-base text-ink dark:text-ink-dark leading-relaxed whitespace-pre-line space-y-4">
          {finalAnn.body}
        </div>

        {/* Tags */}
        {finalAnn.tags && finalAnn.tags.length > 0 && (
          <div className="pt-4 border-t border-border/60 dark:border-border-dark/60 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-ink-muted dark:text-ink-muted-dark flex items-center gap-1 mr-1">
              <Tag className="w-3 h-3" strokeWidth={1.5} />
              Tags:
            </span>
            {finalAnn.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full bg-surface-container dark:bg-surface-dark border border-border dark:border-border-dark text-[11px] text-ink-muted dark:text-ink-muted-dark font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <Link
          href="/announcements"
          className="px-5 py-2.5 rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark text-xs sm:text-sm font-semibold hover:bg-surface-container transition-colors shadow-xs"
        >
          &larr; View Other Announcements
        </Link>
        <Link
          href="/explore"
          className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-strong text-white text-xs sm:text-sm font-semibold transition-all shadow-xs"
        >
          Explore Campus Communities &rarr;
        </Link>
      </div>
    </div>
  );
}
