import Link from 'next/link';
import { getAnnouncementsDirectory } from '@/lib/api/public-queries';
import { getCuratedAnnouncements } from '@/lib/data/curated-announcements';
import {
  Bell,
  Pin,
  Clock,
  Calendar,
  ArrowRight,
  GraduationCap,
  Bus,
  Laptop,
  BookOpen,
  Award,
  Sparkles,
} from 'lucide-react';

interface AnnouncementsPageProps {
  searchParams: Promise<{
    cursor?: string;
    category?: string;
  }>;
}

export const revalidate = 60;

export const metadata = {
  title: 'Announcements | Campusly - Ahmadu Bello University',
  description:
    'Campus notices, academic calendar updates, bus timetables, and helpful news for ABU Zaria students.',
};

export default async function AnnouncementsPage({ searchParams }: AnnouncementsPageProps) {
  const { cursor, category } = await searchParams;

  let dbItems: any[] = [];
  let next_cursor: string | null = null;
  try {
    const annData = await getAnnouncementsDirectory(cursor, 12);
    dbItems = annData.items || [];
    next_cursor = annData.next_cursor;
  } catch {
    dbItems = [];
    next_cursor = null;
  }

  // Curated fallback data so page is never empty
  const curatedList = getCuratedAnnouncements();

  const items = dbItems.length > 0
    ? dbItems.map((item) => ({
        id: item.id,
        slug: item.id,
        title: item.title,
        body: item.body,
        summary: item.body.slice(0, 160) + '...',
        pinned: item.pinned,
        published_at: item.published_at,
        category: 'Campus Notice',
        authority: 'ABU Zaria',
        readTime: '2 min read',
      }))
    : curatedList;

  // Filter by category
  const filteredItems = category && category !== 'all'
    ? items.filter((ann) => ann.category.toLowerCase().includes(category.toLowerCase()))
    : items;

  // Category filter tabs
  const categories = [
    { label: 'All Notices', value: 'all' },
    { label: 'Academic', value: 'academic', icon: GraduationCap },
    { label: 'Tech & Hackathons', value: 'tech', icon: Laptop },
    { label: 'Bus & Transit', value: 'transit', icon: Bus },
    { label: 'Library', value: 'library', icon: BookOpen },
    { label: 'Grants', value: 'grants', icon: Award },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col gap-6 sm:gap-8">
      {/* Clean Header - NO overhead badge */}
      <div className="flex flex-col gap-2 max-w-2xl">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand/10 dark:bg-brand-dark/15 flex items-center justify-center text-brand dark:text-brand-dark shrink-0">
            <Bell className="w-5 h-5" strokeWidth={2} />
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink dark:text-ink-dark tracking-tight">
            Announcements
          </h1>
        </div>
        <p className="text-sm sm:text-base text-ink-muted dark:text-ink-muted-dark leading-relaxed">
          Important updates, academic dates, transit schedules, and student notices across Samaru and Kongo campuses.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive = (!category && cat.value === 'all') || category === cat.value;
          const Icon = cat.icon;
          return (
            <Link
              key={cat.value}
              href={cat.value === 'all' ? '/announcements' : `/announcements?category=${cat.value}`}
              className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-brand text-white font-bold shadow-xs'
                  : 'bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark hover:border-brand/40'
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" strokeWidth={2} />}
              <span>{cat.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((ann) => {
          const dateStr = new Date(ann.published_at).toLocaleDateString('en-NG', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });

          return (
            <Link
              key={ann.id}
              href={`/announcements/${ann.slug || ann.id}`}
              className="group rounded-2xl bg-[#FFFFF0] dark:bg-canvas-dark border border-border dark:border-border-dark p-6 shadow-xs hover:shadow-xl hover:border-brand/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between gap-5"
            >
              <div className="flex flex-col gap-3">
                {/* Meta Row */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container dark:bg-surface-dark border border-border dark:border-border-dark text-[11px] font-semibold text-ink-muted dark:text-ink-muted-dark">
                    {ann.category}
                  </span>

                  <div className="flex items-center gap-2 text-[11px] text-ink-muted dark:text-ink-muted-dark">
                    {ann.pinned && (
                      <span className="inline-flex items-center gap-1 text-brand dark:text-brand-dark font-semibold">
                        <Pin className="w-3 h-3" strokeWidth={2} />
                        Pinned
                      </span>
                    )}
                    <span>{dateStr}</span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="font-display font-bold text-lg text-ink dark:text-ink-dark group-hover:text-brand dark:group-hover:text-brand-dark transition-colors leading-snug line-clamp-2">
                  {ann.title}
                </h2>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-muted-dark leading-relaxed line-clamp-3">
                  {ann.summary || ann.body}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-border/70 dark:border-border-dark/70 flex items-center justify-between text-xs">
                <span className="text-ink-muted dark:text-ink-muted-dark font-medium text-[11px] truncate max-w-[160px]">
                  {ann.authority}
                </span>

                <span className="inline-flex items-center gap-1 text-brand dark:text-brand-dark font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>Read notice</span>
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Pagination */}
      {next_cursor && (
        <div className="flex justify-center pt-4">
          <Link
            href={`/announcements?cursor=${next_cursor}`}
            className="px-6 py-2.5 rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark text-xs sm:text-sm font-semibold hover:bg-surface-container transition-colors shadow-xs"
          >
            Load Older Announcements
          </Link>
        </div>
      )}
    </div>
  );
}
