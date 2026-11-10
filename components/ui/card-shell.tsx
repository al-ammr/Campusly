import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CategoryKey, CATEGORY_ICONS, CATEGORY_META } from './chip';

export interface CardShellProps {
  href: string;
  title?: string;
  category?: CategoryKey;
  imageUrl?: string;
  imageAlt?: string;
  imageAspectRatio?: '16:9' | '1:1';
  isFeatured?: boolean; // Featured Spotlight styling
  children: React.ReactNode;
  headerBadge?: React.ReactNode;
  topRightAction?: React.ReactNode; // e.g. StarControl
  className?: string;
}

export const CardShell: React.FC<CardShellProps> = ({
  href,
  title = '',
  category,
  imageUrl,
  imageAlt = '',
  imageAspectRatio = '16:9',
  isFeatured = false,
  children,
  headerBadge,
  topRightAction,
  className = '',
}) => {
  const categoryMeta = category ? CATEGORY_META[category] : undefined;
  const CategoryIcon = category ? CATEGORY_ICONS[category] : undefined;

  return (
    <div
      className={`
        group relative rounded-2xl border bg-surface dark:bg-surface-dark/95 backdrop-blur-xs
        transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)] active:scale-[0.99] flex flex-col overflow-hidden
        ${
          isFeatured
            ? 'border-brand/50 dark:border-brand-dark/45 bg-gradient-to-b from-brand/[0.03] to-transparent dark:from-surface-container-dark/50 dark:to-surface-dark/90 shadow-sm'
            : 'border-border/80 dark:border-white/[0.08] shadow-xs hover:border-brand/40 dark:hover:border-brand-dark/40'
        }
        ${className}
      `}
    >
      {/* Top subtle hover accent shimmer */}
      <div
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand/40 dark:via-brand-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 pointer-events-none"
        aria-hidden="true"
      />
      {/* Visual media container (16:9 or 1:1) if media or category is present */}
      {(imageUrl || category) && (
        <div
          className={`
            relative w-full overflow-hidden
            ${imageAspectRatio === '1:1' ? 'aspect-square' : 'aspect-video'}
            ${categoryMeta ? categoryMeta.tintClass : 'bg-surface-container'}
          `}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt || title || 'Card visual'}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          ) : (
            /* Category Fallback Placeholder (D04 IMG-02) */
            <div className="w-full h-full flex items-center justify-center">
              {CategoryIcon ? (
                <CategoryIcon
                  className={`w-12 h-12 opacity-80 ${categoryMeta?.inkClass}`}
                  aria-hidden="true"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-border/40" />
              )}
            </div>
          )}

          {/* Optional top-left badge overlay */}
          {headerBadge && (
            <div className="absolute top-3 left-3 z-10 pointer-events-none">
              {headerBadge}
            </div>
          )}

          {/* Optional top-right interactive action (must be at least 44x44px, e.g. StarControl) */}
          {topRightAction && (
            <div className="absolute top-2 right-2 z-10">
              {topRightAction}
            </div>
          )}
        </div>
      )}

      {/* Card Body */}
      <div className="flex flex-col flex-1">
        {title ? (
          <h3 className="text-base font-display font-bold text-ink dark:text-ink-dark line-clamp-1 mb-1">
            <Link
              href={href}
              className="focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-offset-2 focus-visible:outline-brand after:absolute after:inset-0 after:z-0"
            >
              {title}
            </Link>
          </h3>
        ) : (
          <Link
            href={href}
            className="focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-offset-2 focus-visible:outline-brand after:absolute after:inset-0 after:z-0"
            aria-label="View listing details"
          />
        )}

        {/* Content slots */}
        <div className="relative z-10 pointer-events-auto flex-1 flex flex-col justify-between">
          {children}
        </div>
      </div>
    </div>
  );
};
