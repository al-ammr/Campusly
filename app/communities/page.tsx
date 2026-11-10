import * as React from 'react';
import Link from 'next/link';
import { query } from '@/lib/db';
import { ListingCard } from '@/components/cards/listing-card';
import { LISTINGS_SELECT_SQL, formatListingSummary, PublicListingSummary } from '@/lib/api/public-queries';
import { Users, PlusCircle } from 'lucide-react';

export const revalidate = 60;

export const metadata = {
  title: 'Explore Communities | Campusly - Ahmadu Bello University',
  description:
    'Browse all registered student communities, academic societies, engineering clubs, and cultural guilds across Ahmadu Bello University.',
};

export default async function CommunitiesDirectoryPage() {
  let communities: PublicListingSummary[] = [];

  try {
    const res = await query(
      `${LISTINGS_SELECT_SQL}
       WHERE l.kind = 'community' AND l.status IN ('Approved', 'Verified')
       ORDER BY (l.status = 'Verified') DESC, l.star_count DESC, l.created_at DESC
       LIMIT 60`
    );
    communities = (res.rows || []).map(formatListingSummary);
  } catch (err) {
    console.warn('[Communities Page] DB query error, rendering empty fallback:', err);
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 sm:gap-10">
      {/* Header */}
      <div className="relative overflow-hidden rounded-lg bg-surface-container dark:bg-canvas-dark border border-border dark:border-border-dark p-6 sm:p-10 lg:p-12 shadow-xs">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-xs font-semibold shadow-xs">
            <Users className="w-4 h-4 text-brand dark:text-brand-dark" strokeWidth={1.5} />
            <span className="uppercase tracking-wider font-mono text-secondary-light dark:text-secondary text-[11px] font-bold">
              Societies &amp; Student Guilds
            </span>
            <span className="text-border dark:text-border-dark">•</span>
            <span className="text-ink-muted dark:text-ink-muted-dark text-[11px] font-mono">150+ Campus Communities</span>
          </div>

          <h1 className="font-display font-bold text-3xl sm:text-5xl text-ink dark:text-ink-dark tracking-tight">
            Explore Campus Communities
          </h1>
          <p className="text-base sm:text-lg text-ink-muted dark:text-ink-muted-dark leading-relaxed">
            Connect with student associations, technical developer circles, creative arts societies, and departmental clubs across Samaru and Kongo campuses.
          </p>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <Link
              href="/submit"
              className="px-6 py-3 rounded-md bg-brand hover:bg-brand-strong text-white text-sm font-semibold transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.99] shadow-xs flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
            >
              <PlusCircle className="w-4 h-4" strokeWidth={1.5} />
              <span>Register Your Community</span>
            </Link>
            <Link
              href="/explore"
              className="px-6 py-3 rounded-md bg-surface dark:bg-canvas-dark hover:bg-surface-container border border-border dark:border-border-dark text-ink dark:text-ink-dark text-sm font-semibold transition-all shadow-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
            >
              Filter by Intention
            </Link>
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <section aria-label="Communities Directory" className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-2xl text-ink dark:text-ink-dark">
            All Registered Student Societies
          </h2>
          <span className="text-xs text-ink-muted dark:text-ink-muted-dark font-mono">
            {communities.length} {communities.length === 1 ? 'Community' : 'Communities'} Listed
          </span>
        </div>

        {communities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-lg bg-surface-container dark:bg-canvas-dark border border-border dark:border-border-dark space-y-3">
            <Users className="w-10 h-10 text-brand/40 mx-auto" strokeWidth={1.5} />
            <h3 className="font-display font-bold text-lg text-ink dark:text-ink-dark">
              No Communities Found in Registry Yet
            </h3>
            <p className="text-sm text-ink-muted dark:text-ink-muted-dark max-w-md mx-auto">
              Be the first departmental association or student chapter executive to register your club.
            </p>
            <div className="pt-2">
              <Link
                href="/submit"
                className="px-5 py-2.5 rounded-md bg-brand hover:bg-brand-strong text-white text-xs font-semibold shadow-xs"
              >
                Submit Community Listing
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
