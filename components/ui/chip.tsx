import * as React from 'react';
import {
  Cpu,
  Briefcase,
  Leaf,
  GraduationCap,
  HeartHandshake,
  Palette,
  Trophy,
  FlaskConical,
  Activity,
  Users,
  Check,
  X,
  LucideIcon,
} from 'lucide-react';

export type CategoryKey =
  | 'technology'
  | 'business'
  | 'sustainability'
  | 'academic'
  | 'leadership'
  | 'creative'
  | 'sports'
  | 'science'
  | 'health'
  | 'culture';

export const CATEGORY_ICONS: Record<CategoryKey, LucideIcon> = {
  technology: Cpu,
  business: Briefcase,
  sustainability: Leaf,
  academic: GraduationCap,
  leadership: HeartHandshake,
  creative: Palette,
  sports: Trophy,
  science: FlaskConical,
  health: Activity,
  culture: Users,
};

export const CATEGORY_META: Record<
  CategoryKey,
  { label: string; tintClass: string; inkClass: string; darkBgClass: string }
> = {
  technology: {
    label: 'Technology & Digital Skills',
    tintClass: 'bg-cat-tech-tint dark:bg-cat-tech-darkBg',
    inkClass: 'text-cat-tech-ink dark:text-cat-tech-tint',
    darkBgClass: 'bg-cat-tech-darkBg',
  },
  business: {
    label: 'Entrepreneurship & Business',
    tintClass: 'bg-cat-business-tint dark:bg-cat-business-darkBg',
    inkClass: 'text-cat-business-ink dark:text-cat-business-tint',
    darkBgClass: 'bg-cat-business-darkBg',
  },
  sustainability: {
    label: 'Sustainability & Environment',
    tintClass: 'bg-cat-sustain-tint dark:bg-cat-sustain-darkBg',
    inkClass: 'text-cat-sustain-ink dark:text-cat-sustain-tint',
    darkBgClass: 'bg-cat-sustain-darkBg',
  },
  academic: {
    label: 'Academic & Professional Development',
    tintClass: 'bg-cat-academic-tint dark:bg-cat-academic-darkBg',
    inkClass: 'text-cat-academic-ink dark:text-cat-academic-tint',
    darkBgClass: 'bg-cat-academic-darkBg',
  },
  leadership: {
    label: 'Leadership & Volunteering',
    tintClass: 'bg-cat-lead-tint dark:bg-cat-lead-darkBg',
    inkClass: 'text-cat-lead-ink dark:text-cat-lead-tint',
    darkBgClass: 'bg-cat-lead-darkBg',
  },
  creative: {
    label: 'Creative Arts & Media',
    tintClass: 'bg-cat-creative-tint dark:bg-cat-creative-darkBg',
    inkClass: 'text-cat-creative-ink dark:text-cat-creative-tint',
    darkBgClass: 'bg-cat-creative-darkBg',
  },
  sports: {
    label: 'Sports & Recreation',
    tintClass: 'bg-cat-sports-tint dark:bg-cat-sports-darkBg',
    inkClass: 'text-cat-sports-ink dark:text-cat-sports-tint',
    darkBgClass: 'bg-cat-sports-darkBg',
  },
  science: {
    label: 'Science & Research',
    tintClass: 'bg-cat-science-tint dark:bg-cat-science-darkBg',
    inkClass: 'text-cat-science-ink dark:text-cat-science-tint',
    darkBgClass: 'bg-cat-science-darkBg',
  },
  health: {
    label: 'Health & Wellbeing',
    tintClass: 'bg-cat-health-tint dark:bg-cat-health-darkBg',
    inkClass: 'text-cat-health-ink dark:text-cat-health-tint',
    darkBgClass: 'bg-cat-health-darkBg',
  },
  culture: {
    label: 'Culture & Community',
    tintClass: 'bg-cat-culture-tint dark:bg-cat-culture-darkBg',
    inkClass: 'text-cat-culture-ink dark:text-cat-culture-tint',
    darkBgClass: 'bg-cat-culture-darkBg',
  },
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
  count,
  selected = false,
  onClick,
  className = '',
}) => {
  const resolvedKey = (
    category && category in CATEGORY_META ? category : 'academic'
  ) as CategoryKey;
  const meta = CATEGORY_META[resolvedKey] || CATEGORY_META.academic;
  const Icon = CATEGORY_ICONS[resolvedKey] || CATEGORY_ICONS.academic;
  const text = name || label || meta.label;

  const content = (
    <div
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
        h-8 transition-colors duration-fast select-none
        ${selected ? 'ring-2 ring-terracotta dark:ring-terracotta-dark' : ''}
        ${meta.tintClass} ${meta.inkClass}
        ${className}
      `}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
      <span className="truncate">{text}</span>
      {count !== undefined && count > 0 && (
        <span className="ml-1 opacity-75 font-normal">({count})</span>
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
        {isSelected && !onRemove && <Check className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" aria-hidden="true" />}
        <span>{label}</span>
        {onRemove && (
          <span
            role="button"
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
    </button>
  );
};
