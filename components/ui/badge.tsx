import * as React from 'react';
import {
  ShieldCheck,
  Clock,
  Tag,
  Check,
  MessageSquare,
  X,
  Pause,
  Wallet,
} from 'lucide-react';

export type BadgeVariant =
  | 'verified'
  | 'closing-soon'
  | 'paid-listing'
  | 'new'
  | 'pending'
  | 'receipt-submitted'
  | 'needs-info'
  | 'approved'
  | 'active'
  | 'rejected'
  | 'removed'
  | 'cancelled'
  | 'hidden'
  | 'paused'
  | 'expired'
  | 'awaiting-payment'
  | 'terracotta'
  | 'neutral'
  | 'danger'
  | 'warning';

export interface BadgeProps {
  variant?: BadgeVariant;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', label, children, size = 'md', className = '' }) => {
  const content = children || label;
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-[11px]';

  switch (variant) {
    case 'terracotta':
      return (
        <span
          className={`
            inline-flex items-center gap-1 ${sizeClasses} rounded font-bold
            bg-brand text-white select-none
            ${className}
          `}
        >
          <span>{content || 'Pinned'}</span>
        </span>
      );

    case 'neutral':
      return (
        <span
          className={`
            inline-flex items-center gap-1 ${sizeClasses} rounded font-medium
            bg-stone-border/40 text-ink dark:text-ink-light select-none
            ${className}
          `}
        >
          <span>{content}</span>
        </span>
      );

    case 'verified':
      return (
        <span
          className={`
            inline-flex items-center gap-1 ${sizeClasses} rounded font-bold
            bg-success dark:bg-success-dark text-surface dark:text-ink select-none
            ${className}
          `}
        >
          <ShieldCheck className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" aria-hidden="true" />
          <span>{content || 'Verified'}</span>
        </span>
      );

    case 'closing-soon':
      return (
        <span
          className={`
            inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold
            bg-accent dark:bg-accent-dark text-ink select-none
            ${className}
          `}
        >
          <Clock className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" aria-hidden="true" />
          <span>{label || 'Closing soon'}</span>
        </span>
      );

    case 'paid-listing':
      return (
        <span
          className={`
            inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold
            border border-border dark:border-border-dark text-ink-muted dark:text-ink-muted-dark bg-surface dark:bg-surface-dark select-none
            ${className}
          `}
        >
          <Tag className="w-3 h-3 shrink-0" aria-hidden="true" />
          <span>{label || 'Paid listing'}</span>
        </span>
      );

    case 'new':
      return (
        <span
          className={`
            inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold
            bg-brand/10 dark:bg-brand-dark/15 text-brand dark:text-brand-dark select-none
            ${className}
          `}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand dark:bg-brand-dark" />
          <span>{label || 'New'}</span>
        </span>
      );

    // Administrative & Owner Status Badges (UI-309 / D07)
    case 'pending':
    case 'receipt-submitted':
      return (
        <span
          className={`
            inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold
            bg-info/10 dark:bg-info-dark/20 text-info dark:text-info-dark select-none
            ${className}
          `}
        >
          <Clock className="w-3 h-3 shrink-0" aria-hidden="true" />
          <span>{label || (variant === 'pending' ? 'Pending' : 'Receipt submitted')}</span>
        </span>
      );

    case 'needs-info':
    case 'warning':
      return (
        <span
          className={`
            inline-flex items-center gap-1 ${sizeClasses} rounded font-semibold
            bg-accent dark:bg-accent-dark text-ink select-none
            ${className}
          `}
        >
          <MessageSquare className="w-3 h-3 shrink-0" aria-hidden="true" />
          <span>{content || (variant === 'warning' ? 'Warning' : 'Needs info')}</span>
        </span>
      );

    case 'approved':
    case 'active':
      return (
        <span
          className={`
            inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold
            bg-success/15 dark:bg-success-dark/20 text-success dark:text-success-dark select-none
            ${className}
          `}
        >
          <Check className="w-3 h-3 shrink-0 stroke-[2.5]" aria-hidden="true" />
          <span>{label || (variant === 'approved' ? 'Approved' : 'Active')}</span>
        </span>
      );

    case 'rejected':
    case 'removed':
    case 'cancelled':
    case 'danger':
      return (
        <span
          className={`
            inline-flex items-center gap-1 ${sizeClasses} rounded font-semibold
            bg-danger/10 dark:bg-danger-dark/20 text-danger dark:text-danger-dark select-none
            ${className}
          `}
        >
          <X className="w-3 h-3 shrink-0 stroke-[2.5]" aria-hidden="true" />
          <span>
            {content ||
              (variant === 'rejected'
                ? 'Rejected'
                : variant === 'removed'
                  ? 'Removed'
                  : variant === 'danger'
                    ? 'Attention'
                    : 'Cancelled')}
          </span>
        </span>
      );

    case 'hidden':
    case 'paused':
    case 'expired':
      return (
        <span
          className={`
            inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold
            bg-border dark:bg-border-dark text-ink-muted dark:text-ink-muted-dark select-none
            ${className}
          `}
        >
          <Pause className="w-3 h-3 shrink-0" aria-hidden="true" />
          <span>
            {label ||
              (variant === 'hidden'
                ? 'Hidden'
                : variant === 'paused'
                  ? 'Paused'
                  : 'Expired')}
          </span>
        </span>
      );

    case 'awaiting-payment':
      return (
        <span
          className={`
            inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold
            bg-accent dark:bg-accent-dark text-ink select-none
            ${className}
          `}
        >
          <Wallet className="w-3 h-3 shrink-0" aria-hidden="true" />
          <span>{label || 'Awaiting payment'}</span>
        </span>
      );

    default:
      return null;
  }
};

export const VerifiedBadge: React.FC<{ label?: string; className?: string }> = ({ label, className }) => (
  <Badge variant="verified" label={label} className={className} />
);

export const ClosingSoonBadge: React.FC<{ label?: string; className?: string }> = ({ label, className }) => (
  <Badge variant="closing-soon" label={label} className={className} />
);

export const PaidBadge: React.FC<{ label?: string; className?: string }> = ({ label, className }) => (
  <Badge variant="paid-listing" label={label} className={className} />
);
