'use client';

import * as React from 'react';
import { Check, X } from 'lucide-react';
import {
  CategoryKey,
  CATEGORY_ICONS,
  CATEGORY_META,
  resolveCategoryKey,
} from './category-meta';

export {
  type CategoryKey,
  CATEGORY_ICONS,
  CATEGORY_META,
  resolveCategoryKey,
};

export interface CategoryChipProps {
  category?: CategoryKey | string;
  name?: string;
  label?: string;
  icon?: string;
  count?: number;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  category,
  name,
  label,
  icon,
  count,
  selected = false,
  onClick,
  className = '',
}) => {
  const resolvedKey = resolveCategoryKey(category || icon || name || label);
  const meta = CATEGORY_META[resolvedKey] || CATEGORY_META.academic;
  const Icon = CATEGORY_ICONS[resolvedKey] || CATEGORY_ICONS.academic;
  const text = name || label || meta.label;

  const content = (
    <div
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
        h-7 sm:h-8 transition-colors duration-fast select-none border border-black/5 dark:border-white/10 shadow-2xs
        ${selected ? 'ring-2 ring-terracotta dark:ring-terracotta-dark' : ''}
        ${meta.tintClass} ${meta.inkClass}
        ${className}
      `}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />}
      <span className="truncate">{text}</span>
      {count !== undefined && count > 0 && (
        <span className="ml-0.5 opacity-80 font-mono text-[11px]">({count})</span>
      )}
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="min-h-[44px] inline-flex items-center p-0 bg-transparent border-0 cursor-pointer focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focusRing rounded-full"
      >
        {content}
      </button>
    );
  }

  return content;
};

export interface FilterChipProps {
  label: string;
  isSelected?: boolean;
  selected?: boolean;
  onToggle?: (selected: boolean) => void;
  onRemove?: () => void;
  disabled?: boolean;
  className?: string;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  isSelected = false,
  selected = false,
  onToggle,
  onRemove,
  disabled = false,
  className = '',
}) => {
  const active = isSelected || selected;
  const isInteractive = Boolean(onToggle || onRemove);

  const innerContent = (
    <div
      className={`
        inline-flex items-center gap-1.5 px-3.5 h-8 rounded-full text-xs font-medium border
        transition-colors duration-fast select-none
        ${
          active
            ? 'bg-brand dark:bg-brand-dark text-surface dark:text-ink border-brand dark:border-brand-dark'
            : 'bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark border-border dark:border-border-dark hover:border-brand'
        }
        ${className}
      `}
    >
      {active && !onRemove && <Check className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" aria-hidden="true" />}
      <span>{label}</span>
      {onRemove && (
        <span
          role="button"
          tabIndex={0}
          aria-label={`Remove filter ${label}`}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:opacity-75 cursor-pointer ml-0.5"
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
        </span>
      )}
    </div>
  );

  if (!isInteractive) {
    return <div className="inline-flex items-center justify-center min-h-[44px]">{innerContent}</div>;
  }

  return (
    <button
      type="button"
      role="button"
      aria-pressed={active}
      disabled={disabled}
      onClick={() => onToggle?.(!active)}
      className={`
        min-h-[44px] inline-flex items-center justify-center p-0 bg-transparent border-0 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focusRing rounded-full
      `}
    >
      {innerContent}
    </button>
  );
};
