import * as React from 'react';
import Link from 'next/link';
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
        group relative rounded-lg border bg-surface dark:bg-surface-dark
        transition-all duration-fast flex flex-col overflow-hidden
        ${
          isFeatured
            ? 'border-2 border-accent dark:border-accent-dark shadow-md'
            : 'border-border dark:border-border-dark shadow-sm hover:shadow-md hover:border-brand/40'
        }
        ${className}
      `}
    >
      {/* Visual media container (16:9 or 1:1) */}
      <div
        className={`
          relative w-full overflow-hidden
          ${imageAspectRatio === '1:1' ? 'aspect-square' : 'aspect-video'}
          ${categoryMeta ? categoryMeta.tintClass : 'bg-stone dark:bg-stone-dark'}
        `}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={imageAlt || title}
            className="w-full h-full object-cover transition-transform duration-base group-hover:scale-[1.02]"
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

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-base font-bold text-ink dark:text-ink-dark line-clamp-1 mb-1">
          {/* Main Card Anchor (Whole card is clickable via stretched link) */}
          <Link
            href={href}
            className="focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focusRing after:absolute after:inset-0 after:z-0"
          >
            {title}
          </Link>
        </h3>

        {/* Content slots */}
        <div className="relative z-10 pointer-events-none mt-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
