import * as React from 'react';
import Link from 'next/link';
import { CardShell } from '@/components/ui/card-shell';
import { Badge, VerifiedBadge, PaidBadge, ClosingSoonBadge } from '@/components/ui/badge';
import { CategoryChip } from '@/components/ui/chip';
import { PublicListingSummary } from '@/lib/api/public-queries';
import { t } from '@/lib/copy/strings';

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
    <CardShell href={href} className="flex flex-col justify-between h-full">
      <div className="flex flex-col gap-2.5">
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
              <Badge variant="neutral" size="sm">
                {formattedDate}
              </Badge>
            )}
            {listing.kind === 'opportunity' && (
              <Badge variant="terracotta" size="sm">
                {listing.is_rolling ? 'Rolling' : formattedDeadline ? `Due ${formattedDeadline}` : 'Opportunity'}
              </Badge>
            )}
          </div>
        </div>

        {/* Title & Summary */}
        <div className="flex flex-col gap-1">
          <h3 className="font-display font-semibold text-lg text-ink dark:text-ink-dark line-clamp-2 leading-snug">
            {listing.title}
          </h3>
          <p className="text-sm text-ink-muted dark:text-ink-muted-dark line-clamp-2 leading-relaxed">
            {listing.summary}
          </p>
        </div>
      </div>

      {/* Footer / Kind-specific stats */}
      <div className="mt-4 pt-3 border-t border-sand-dark dark:border-sand-dark-dark flex items-center justify-between text-xs text-ink-muted dark:text-ink-muted-dark">
        {listing.kind === 'community' && (
          <span className="flex items-center gap-1 font-medium">
            <svg
              className="w-4 h-4 text-warm-ochre fill-current"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{listing.star_count ?? 0} stars</span>
          </span>
        )}
        {listing.kind === 'event' && (
          <span className="font-medium text-cypress-green dark:text-cypress-green-dark">
            View event details &rarr;
          </span>
        )}
        {listing.kind === 'opportunity' && (
          <span className="font-medium text-terracotta dark:text-terracotta-dark">
            View application &rarr;
          </span>
        )}
      </div>
    </CardShell>
  );
}
