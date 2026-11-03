import Link from 'next/link';
import { getAnnouncementsDirectory } from '@/lib/api/public-queries';
import { CardShell } from '@/components/ui/card-shell';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { t } from '@/lib/copy/strings';

interface AnnouncementsPageProps {
  searchParams: Promise<{
    cursor?: string;
  }>;
}

export const revalidate = 60;

export default async function AnnouncementsPage({ searchParams }: AnnouncementsPageProps) {
  const { cursor } = await searchParams;

  let annData: { items: any[]; next_cursor: string | null } = { items: [], next_cursor: null };
  try {
    annData = await getAnnouncementsDirectory(cursor, 12);
  } catch {
    annData = { items: [], next_cursor: null };
  }

  const { items, next_cursor } = annData;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2 max-w-2xl">
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink dark:text-ink-dark">
          {t('announcements.title')}
        </h1>
        <p className="text-base text-ink-muted dark:text-ink-muted-dark">
          {t('announcements.subtitle')}
        </p>
      </div>

      {/* Grid or Empty State */}
      {items.length === 0 ? (
        <EmptyState
          title={t('announcements.empty.title')}
          description={t('announcements.empty.description')}
        />
      ) : (
        <div className="flex flex-col gap-5">
          {items.map((ann) => {
            const dateStr = new Date(ann.published_at).toLocaleDateString('en-NG', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });

            return (
              <CardShell
                key={ann.id}
                href={`/announcements/${ann.id}`}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {ann.pinned && (
                      <Badge variant="terracotta" size="sm">
                        {t('announcements.pinned')}
                      </Badge>
                    )}
                    <span className="text-xs text-ink-muted dark:text-ink-muted-dark font-medium">
                      {dateStr}
                    </span>
                  </div>
                </div>

                <h2 className="font-display font-semibold text-xl text-ink dark:text-ink-dark">
                  {ann.title}
                </h2>
                <p className="text-sm text-ink-muted dark:text-ink-muted-dark line-clamp-3 leading-relaxed">
                  {ann.body}
                </p>
              </CardShell>
            );
          })}
        </div>
      )}

      {/* Load More */}
      {next_cursor && (
        <div className="flex justify-center pt-6">
          <Link
            href={`/announcements?cursor=${next_cursor}`}
            className="px-6 py-2.5 rounded-xl border border-sand-dark dark:border-sand-dark-dark bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark text-sm font-semibold hover:bg-sand-light dark:hover:bg-sand-light-dark transition-colors"
          >
            {t('common.load_more')}
          </Link>
        </div>
      )}
    </div>
  );
}
