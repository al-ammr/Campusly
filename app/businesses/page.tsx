import * as React from 'react';
import Link from 'next/link';
import { getShowcaseBundle } from '@/lib/showcase/service';
import {
  Store,
  CheckCircle2,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Tag,
  TrendingUp,
  Award,
} from 'lucide-react';

export const revalidate = 60;

export const metadata = {
  title: 'Explore Businesses | Campusly - Ahmadu Bello University',
  description:
    'Discover verified student enterprises, campus services, printing hubs, repair centers, and dining spots across Samaru and Kongo campuses.',
};

export default async function BusinessesPage() {
  const bundle = await getShowcaseBundle();
  const topBusinesses = bundle.topBusinesses;

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 sm:gap-10">
      {/* Page Header */}
      <div className="rounded-lg bg-surface-container dark:bg-canvas-dark border border-border dark:border-border-dark p-6 sm:p-10 lg:p-12 shadow-xs">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-xs font-semibold shadow-xs">
            <Store className="w-4 h-4 text-brand dark:text-brand-dark" strokeWidth={1.5} />
            <span className="uppercase tracking-wider font-mono text-secondary-light dark:text-secondary text-[11px] font-bold">
              Campus Commercial Registry
            </span>
            <span className="text-border dark:text-border-dark">•</span>
            <span className="text-ink-muted dark:text-ink-muted-dark text-[11px] font-mono">Samaru &amp; Kongo</span>
          </div>

          <h1 className="font-display font-bold text-3xl sm:text-5xl text-ink dark:text-ink-dark tracking-tight">
            Explore Campus Businesses &amp; Student Ventures
          </h1>
          <p className="text-base sm:text-lg text-ink-muted dark:text-ink-muted-dark leading-relaxed">
            Support verified student-led businesses, essential academic printing hubs, repair engineers, and campus dining. Zero middlemen, direct WhatsApp and in-person contact.
          </p>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <Link
              href="/submit?kind=business"
              className="px-6 py-3 rounded-md bg-brand hover:bg-brand-strong text-white text-sm font-semibold transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.99] shadow-xs flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
            >
              <span>List Your Business (Free)</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link
              href="/spotlight"
              className="px-6 py-3 rounded-md bg-surface dark:bg-canvas-dark hover:bg-surface-container border border-border dark:border-border-dark text-ink dark:text-ink-dark text-sm font-semibold transition-all shadow-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
            >
              Promote on Spotlight
            </Link>
          </div>
        </div>
      </div>

      {/* Top 10 Ranked Businesses Leaderboard */}
      <section aria-labelledby="top-ranked-heading" className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand dark:text-brand-dark">
              <TrendingUp className="w-4 h-4" strokeWidth={1.5} />
              <span>Official Campus Rankings</span>
            </div>
            <h2 id="top-ranked-heading" className="font-display font-bold text-2xl sm:text-3xl text-ink dark:text-ink-dark mt-1">
              Top 10 Ranked Campus Businesses
            </h2>
            <p className="text-sm text-ink-muted dark:text-ink-muted-dark mt-1">
              Ranked dynamically by verified student ratings, responsiveness, and customer satisfaction scores.
            </p>
          </div>
          <span className="text-xs text-ink-muted dark:text-ink-muted-dark font-mono px-3 py-1.5 rounded-sm bg-surface-container dark:bg-canvas-dark border border-border dark:border-border-dark w-fit">
            Updated Hourly • 100% Student Verified
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {topBusinesses.map((biz) => {
            const isTopThree = biz.rank <= 3;
            return (
              <article
                key={biz.id}
                className={`relative flex flex-col lg:flex-row items-start lg:items-center justify-between p-6 sm:p-7 rounded-lg border transition-all duration-200 hover:shadow-sm ${
                  isTopThree
                    ? 'bg-surface dark:bg-canvas-dark border-brand/50 dark:border-brand-dark/50 shadow-xs'
                    : 'bg-surface dark:bg-surface-dark border-border dark:border-border-dark shadow-xs'
                }`}
              >
                <div className="flex items-start gap-4 sm:gap-6 flex-1">
                  {/* Rank Badge - Neutral and No Hashtag */}
                  <div className="w-12 h-12 rounded-lg bg-surface-container dark:bg-canvas-dark border border-border dark:border-border-dark flex items-center justify-center font-display font-bold text-lg text-ink dark:text-ink-dark shrink-0 shadow-xs">
                    {biz.rank < 10 ? `0${biz.rank}` : biz.rank}
                  </div>

                  {/* Business Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-display font-bold text-lg sm:text-xl text-ink dark:text-ink-dark">
                        {biz.name}
                      </h3>
                      {biz.verified && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-success/10 border border-success/20 text-success dark:text-success-dark text-[11px] font-semibold">
                          <CheckCircle2 className="w-3 h-3" strokeWidth={1.5} />
                          Verified
                        </span>
                      )}
                      <span className="text-xs px-2.5 py-0.5 rounded-sm bg-surface-container dark:bg-canvas-dark border border-border dark:border-border-dark text-ink-muted dark:text-ink-muted-dark font-medium">
                        {biz.category}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-muted-dark leading-relaxed max-w-3xl">
                      {biz.description}
                    </p>

                    {biz.featuredOffer && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-brand/10 dark:bg-brand/15 text-brand dark:text-brand-dark text-xs font-semibold">
                        <Tag className="w-3.5 h-3.5" strokeWidth={1.5} />
                        <span>{biz.featuredOffer}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs text-ink-muted dark:text-ink-muted-dark pt-1 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-secondary-light dark:text-secondary" strokeWidth={1.5} />
                        {biz.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-ink dark:text-ink-dark">
                        <Award className="w-3.5 h-3.5 text-brand dark:text-brand-dark" strokeWidth={1.5} />
                        {biz.score} / {biz.scoreMax || 10}
                      </span>
                      {biz.reviewCount && (
                        <>
                          <span>•</span>
                          <span>({biz.reviewCount} student ratings)</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Direct Action Button */}
                <div className="mt-5 lg:mt-0 lg:ml-6 shrink-0 w-full lg:w-auto">
                  <a
                    href={biz.actionButton.link}
                    target={biz.actionButton.behavior || '_blank'}
                    rel="noopener noreferrer"
                    className="w-full lg:w-auto px-6 py-2.5 rounded-md bg-brand hover:bg-brand-strong text-white text-xs sm:text-sm font-semibold transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.99] shadow-xs flex items-center justify-center gap-2 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
                  >
                    <span>{biz.actionButton.label}</span>
                    <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Trust & Safety Assurance */}
      <section className="p-6 sm:p-8 rounded-lg bg-surface-container dark:bg-canvas-dark border border-border dark:border-border-dark flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start text-xs font-bold uppercase tracking-wider text-success dark:text-success-dark">
            <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
            <span>Collegiate Consumer Protection</span>
          </div>
          <h3 className="font-display font-bold text-xl text-ink dark:text-ink-dark">
            Zero Fake Reviews. Transparent Student Peer Oversight.
          </h3>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-muted-dark max-w-2xl leading-relaxed">
            Every business listing on Campusly is verified by campus peer reviews. If you experience poor service or misleading claims, you can submit a flagged report for immediate administrative review.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/submit?kind=business"
            className="px-5 py-2.5 rounded-md bg-brand hover:bg-brand-strong text-white text-xs font-semibold transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.99] shadow-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
          >
            Apply to Join Top 10
          </Link>
        </div>
      </section>
    </div>
  );
}
