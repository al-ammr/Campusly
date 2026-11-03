import Link from 'next/link';
import { getCategoriesWithCounts } from '@/lib/api/public-queries';
import { CardShell } from '@/components/ui/card-shell';
import { Badge } from '@/components/ui/badge';
import { t } from '@/lib/copy/strings';

export const revalidate = 120;

export default async function ExplorePage() {
  let categories: any[] = [];
  try {
    categories = await getCategoriesWithCounts();
  } catch {
    categories = [];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">
      <div className="flex flex-col gap-2 max-w-2xl">
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink dark:text-ink-dark">
          {t('explore.title')}
        </h1>
        <p className="text-base text-ink-muted dark:text-ink-muted-dark">
          {t('explore.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <CardShell
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="flex flex-col justify-between h-full"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl" aria-hidden="true">
                  {cat.icon_key === 'laptop'
                    ? '💻'
                    : cat.icon_key === 'book'
                    ? '📚'
                    : cat.icon_key === 'heart'
                    ? '❤️'
                    : cat.icon_key === 'palette'
                    ? '🎨'
                    : '🏛️'}
                </span>
                <Badge variant="neutral" size="sm">
                  {cat.live_communities} communities
                </Badge>
              </div>
              <h2 className="font-display font-semibold text-xl text-ink dark:text-ink-dark">
                {cat.name}
              </h2>
            </div>

            <div className="mt-4 pt-3 border-t border-sand-dark dark:border-sand-dark-dark flex items-center justify-between text-xs text-ink-muted dark:text-ink-muted-dark font-medium">
              <span>{cat.upcoming_events} upcoming events</span>
              <span className="text-terracotta dark:text-terracotta-dark">Explore &rarr;</span>
            </div>
          </CardShell>
        ))}
      </div>
    </div>
  );
}
