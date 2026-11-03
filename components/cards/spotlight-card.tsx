import * as React from 'react';
import { CardShell } from '@/components/ui/card-shell';
import { PaidBadge, Badge } from '@/components/ui/badge';
import { PublicSpotlightItem } from '@/lib/api/public-queries';
import { t } from '@/lib/copy/strings';

export interface SpotlightCardProps {
  item: PublicSpotlightItem;
  variant?: 'strip' | 'ranked';
}

export function SpotlightCard({ item, variant = 'ranked' }: SpotlightCardProps) {
  const isFeatured = item.plan === 'featured';

  return (
    <CardShell
      href={`/spotlight/${item.id}`}
      className={`flex flex-col justify-between h-full ${
        isFeatured
          ? 'ring-2 ring-terracotta/40 dark:ring-terracotta-dark/40 shadow-sm'
          : ''
      }`}
    >
      <div className="flex flex-col gap-2.5">
        {/* Badges: Paid listing + Plan */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <PaidBadge />
            {isFeatured && (
              <Badge variant="terracotta" size="sm">
                Featured
              </Badge>
            )}
          </div>
          <span className="text-xs text-ink-muted dark:text-ink-muted-dark font-medium">
            {item.category.name}
          </span>
        </div>

        {/* Business Name & Offer */}
        <div className="flex flex-col gap-1">
          <h3 className="font-display font-semibold text-lg text-ink dark:text-ink-dark line-clamp-1">
            {item.business_name}
          </h3>
          <p className="font-sans font-medium text-sm text-terracotta dark:text-terracotta-dark line-clamp-2">
            {item.offer}
          </p>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      {/* Contact Footer */}
      <div className="mt-4 pt-3 border-t border-sand-dark dark:border-sand-dark-dark flex items-center justify-between text-xs text-ink-muted dark:text-ink-muted-dark">
        <span className="truncate max-w-[180px]">Contact: {item.contact}</span>
        <span className="font-medium text-terracotta dark:text-terracotta-dark">
          Details &rarr;
        </span>
      </div>
    </CardShell>
  );
}
