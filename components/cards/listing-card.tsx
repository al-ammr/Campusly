import * as React from 'react';
import Link from 'next/link';
import { CardShell } from '@/components/ui/card-shell';
import { Badge, VerifiedBadge, PaidBadge, ClosingSoonBadge } from '@/components/ui/badge';
import { CategoryChip } from '@/components/ui/chip';
import { PublicListingSummary } from '@/lib/api/public-queries';
import { t } from '@/lib/copy/strings';
import { Star, ArrowRight, Calendar, Clock } from 'lucide-react';

export interface ListingCardProps {
  listing: PublicListingSummary;
  priority?: boolean;
}

export function ListingCard({ listing }: ListingCardProps) {
  const href =
    listing.kind === 'community'
      ? `/communities/${listing.slug}`
      : listing.kind === 'event'
      ? `/events/${listing.id}`
      : `/opportunities/${listing.id}`;

  const formattedDate = listing.starts_at
    ? new Date(listing.starts_at).toLocaleDateString('en-NG', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;

  const formattedDeadline = listing.deadline_at
    ? new Date(listing.deadline_at).toLocaleDateString('en-NG', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <CardShell href={href} className="flex flex-col justify-between h-full p-5 sm:p-6">
      <div className="flex flex-col gap-3.5">
        {/* Top Badges and Category */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CategoryChip
            name={listing.category.name}
            icon={listing.category.icon_key}
            selected={false}
          />
          <div className="flex items-center gap-1.5 flex-wrap">
            {listing.verified && <VerifiedBadge />}
            {listing.closing_soon && <ClosingSoonBadge />}
            {listing.kind === 'event' && listing.starts_at && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium text-ink-muted dark:text-[#C4B5A5] bg-surface-container dark:bg-white/[0.05] border border-border/60 dark:border-white/[0.06] shadow-2xs">
                <Calendar className="w-3 h-3 text-brand dark:text-[#D4A373] shrink-0" strokeWidth={1.75} aria-hidden="true" />
                <span>{formattedDate}</span>
              </span>
            )}
            {listing.kind === 'opportunity' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium text-brand dark:text-[#E8A87C] bg-brand/10 dark:bg-[#3D2214] border border-brand/20 dark:border-[#D4A373]/20 shadow-2xs">
                <Clock className="w-3 h-3 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                <span>{listing.is_rolling ? 'Rolling' : formattedDeadline ? `Due ${formattedDeadline}` : 'Opportunity'}</span>
              </span>
            )}
          </div>
        </div>

        {/* Title & Summary */}
        <div className="flex flex-col gap-1.5">
          <h3 className="font-display font-bold text-base sm:text-lg text-ink dark:text-[#FFFFF0] line-clamp-2 leading-snug group-hover:text-brand dark:group-hover:text-[#D4A373] transition-colors">
            {listing.title}
          </h3>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-[#B8A798] line-clamp-2 leading-relaxed">
            {listing.summary}
          </p>
        </div>
      </div>

      {/* Footer / Kind-specific stats */}
      <div className="mt-5 pt-3.5 border-t border-border/60 dark:border-white/[0.08] flex items-center justify-between text-xs text-ink-muted dark:text-[#A8988B]">
        {listing.kind === 'community' && (
          <span className="flex items-center gap-1.5 font-medium text-ink-muted dark:text-[#C4B5A5]">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" strokeWidth={1.5} aria-hidden="true" />
            <span>{listing.star_count ?? 0} stars</span>
          </span>
        )}
        {listing.kind === 'event' && (
          <span className="font-semibold text-xs sm:text-sm text-brand dark:text-[#D4A373] flex items-center gap-1.5 group-hover:gap-2 transition-all">
            <span>View event details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" strokeWidth={1.75} aria-hidden="true" />
          </span>
        )}
        {listing.kind === 'opportunity' && (
          <span className="font-semibold text-xs sm:text-sm text-brand dark:text-[#D4A373] flex items-center gap-1.5 group-hover:gap-2 transition-all">
            <span>View application</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" strokeWidth={1.75} aria-hidden="true" />
          </span>
        )}
        {listing.kind === 'community' && (
          <span className="font-semibold text-xs sm:text-sm text-brand dark:text-[#D4A373] flex items-center gap-1.5 group-hover:gap-2 transition-all">
            <span>Explore society</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" strokeWidth={1.75} aria-hidden="true" />
          </span>
        )}
      </div>
    </CardShell>
  );
}
