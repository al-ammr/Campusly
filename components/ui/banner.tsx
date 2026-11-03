import * as React from 'react';
import { AlertTriangle, WifiOff, Bell, Info, X } from 'lucide-react';

export type BannerVariant = 'offline' | 'announcement' | 'warning' | 'info';

export interface BannerProps {
  id?: string;
  variant: BannerVariant;
  title?: string;
  description?: string;
  message?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  className?: string;
}

export const Banner: React.FC<BannerProps> = ({
  id,
  variant,
  title,
  description,
  message,
  action,
  onDismiss,
  className = '',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'offline':
        return {
          container: 'bg-stone dark:bg-stone-dark border-border dark:border-border-dark text-ink dark:text-ink-dark',
          icon: <WifiOff className="w-5 h-5 text-ink-muted dark:text-ink-muted-dark shrink-0" aria-hidden="true" />,
        };
      case 'announcement':
        return {
          container: 'bg-secondary/10 dark:bg-secondary-dark/20 border-secondary/30 dark:border-secondary-dark/30 text-ink dark:text-ink-dark',
          icon: <Bell className="w-5 h-5 text-secondary dark:text-secondary-dark shrink-0" aria-hidden="true" />,
        };
      case 'warning':
        return {
          container: 'bg-accent/15 dark:bg-accent-dark/20 border-accent/40 dark:border-accent-dark/40 text-ink dark:text-ink-dark',
          icon: <AlertTriangle className="w-5 h-5 text-ink shrink-0" aria-hidden="true" />,
        };
      case 'info':
      default:
        return {
          container: 'bg-info/10 dark:bg-info-dark/15 border-info/30 dark:border-info-dark/30 text-ink dark:text-ink-dark',
          icon: <Info className="w-5 h-5 text-info dark:text-info-dark shrink-0" aria-hidden="true" />,
        };
    }
  };

  const { container, icon } = getVariantStyles();

  return (
    <aside
      id={id}
      aria-label="Notification banner"
      className={`
        w-full px-4 py-2.5 border-b text-sm font-medium
        flex items-center justify-between gap-3 transition-colors duration-fast
        ${container}
        ${className}
      `}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {icon}
        <div className="leading-snug">
          {message || (
            <div className="flex flex-col">
              {title && <span className="font-semibold">{title}</span>}
              {description && <span className="text-xs opacity-90">{description}</span>}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="px-2.5 py-1 text-xs font-bold text-brand dark:text-brand-dark hover:underline rounded focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-focusRing"
          >
            {action.label}
          </button>
        )}

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss banner"
            className="w-9 h-9 flex items-center justify-center text-ink-muted hover:text-ink dark:text-ink-muted-dark dark:hover:text-ink-dark rounded-full focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-focusRing"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </aside>
  );
};
