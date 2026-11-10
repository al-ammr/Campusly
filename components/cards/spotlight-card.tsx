import * as React from 'react';
import { CardShell } from '@/components/ui/card-shell';
import { PublicSpotlightItem } from '@/lib/api/public-queries';
import { ArrowRight, Tag, Sparkles, Phone } from 'lucide-react';

export interface SpotlightCardProps {
  item: PublicSpotlightItem;
  variant?: 'strip' | 'ranked';
}

export function SpotlightCard({ item, variant = 'ranked' }: SpotlightCardProps) {
  const isFeatured = item.plan === 'featured';

  return (
    <CardShell
      href={`/spotlight/${item.id}`}
      isFeatured={isFeatured}
      className="flex flex-col justify-between h-full p-5 sm:p-6 relative group overflow-hidden"
    >
      {/* Corner Ambient Glow for Featured Listings */}
      {isFeatured && (
        <div
          className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-gradient-to-br from-brand/15 dark:from-[#D4A373]/15 to-transparent pointer-events-none blur-xl"
          aria-hidden="true"
        />
      )}

      <div className="flex flex-col gap-3.5 relative z-10">
        {/* Badges: Paid listing + Plan + Category */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium text-ink-muted dark:text-[#C4B5A5] bg-black/5 dark:bg-white/[0.06] border border-border/60 dark:border-white/[0.08] shadow-2xs">
              <Tag className="w-3 h-3 text-brand/80 dark:text-[#D4A373]" strokeWidth={1.75} aria-hidden="true" />
              <span>Paid listing</span>
            </span>

            {isFeatured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-gradient-to-r from-amber-500 to-brand text-white dark:from-[#D4A373] dark:to-[#B36B39] dark:text-[#1A0D07] shadow-xs">
                <Sparkles className="w-2.5 h-2.5 shrink-0" strokeWidth={2} aria-hidden="true" />
                <span>Featured</span>
              </span>
            )}
          </div>

          <span className="text-xs font-semibold text-ink-muted dark:text-[#A8988B] tracking-wide uppercase">
            {item.category.name}
          </span>
        </div>

        {/* Business Name, Offer Callout & Description */}
        <div className="flex flex-col gap-2">
          <h3 className="font-display font-extrabold text-base sm:text-xl text-ink dark:text-[#FFFFF0] line-clamp-1 group-hover:text-brand dark:group-hover:text-[#D4A373] transition-colors tracking-tight">
            {item.business_name}
          </h3>

          {item.offer && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand/10 dark:bg-[#D4A373]/10 border border-brand/20 dark:border-[#D4A373]/25 w-fit my-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand dark:bg-[#D4A373] shrink-0" />
              <span className="font-sans font-bold text-xs sm:text-sm text-brand-strong dark:text-[#F3A261] line-clamp-1">
                {item.offer}
              </span>
            </div>
          )}

          <p className="text-xs sm:text-sm text-ink-muted dark:text-[#B8A798] line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      {/* Contact & Details Footer */}
      <div className="mt-5 pt-3.5 border-t border-border/60 dark:border-white/[0.08] flex items-center justify-between text-xs text-ink-muted dark:text-[#A8988B] relative z-10">
        <span className="inline-flex items-center gap-1.5 truncate max-w-[180px] font-mono text-xs text-ink-muted dark:text-[#C4B5A5]">
          <Phone className="w-3.5 h-3.5 text-brand/70 dark:text-[#D4A373]/70 shrink-0" strokeWidth={1.75} aria-hidden="true" />
          <span>{item.contact}</span>
        </span>
        <span className="font-bold text-xs sm:text-sm text-brand dark:text-[#D4A373] flex items-center gap-1.5 group-hover:gap-2 transition-all">
          <span>Details</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" strokeWidth={2} aria-hidden="true" />
        </span>
      </div>
    </CardShell>
  );
}
