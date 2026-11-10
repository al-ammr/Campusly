import * as React from 'react';
import Link from 'next/link';
import { ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';

export interface MetricCardProps {
  label: string;
  value: string | number;
  description?: string;
  delta?: {
    value: string;
    positive?: boolean;
  };
  icon?: React.ElementType;
  variant?: 'default' | 'featured' | 'muted';
  href?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  description,
  delta,
  icon: Icon,
  variant = 'default',
  href,
  className = '',
}) => {
  const isFeatured = variant === 'featured';
  const CardWrapper = href ? Link : 'div';

  if (isFeatured) {
    return (
      <CardWrapper
        href={href || '#'}
        className={`group relative flex flex-col justify-between p-6 rounded-lg bg-brand text-white border border-brand-strong/60 shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${className}`}
      >
        <div className="space-y-4">
          {/* Top Row: Icon container + external link / trend */}
          <div className="flex items-center justify-between">
            {Icon && (
              <div className="w-10 h-10 rounded-md bg-white/20 flex items-center justify-center text-white shrink-0">
                <Icon className="w-5 h-5 text-white" strokeWidth={1.5} aria-hidden="true" />
              </div>
            )}
            {href && (
              <div className="p-1 rounded-sm text-white/70 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
              </div>
            )}
          </div>

          {/* Metric Value & Label */}
          <div>
            <div className="text-display font-bold text-white tracking-tight tabular-nums">
              {value}
            </div>
            <p className="mt-1 text-label font-medium tracking-[0.01em] text-white/90">
              {label}
            </p>
          </div>

          {/* Description */}
          {description && (
            <p className="text-body-sm font-normal text-white/80 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Delta / Indicator at footer */}
        {delta && (
          <div className="mt-5 pt-3 border-t border-white/15 flex items-center gap-1.5 text-caption font-medium tracking-[0.02em] text-white/90 tabular-nums">
            {delta.positive ? (
              <TrendingUp className="w-3.5 h-3.5 text-white shrink-0" strokeWidth={1.5} aria-hidden="true" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-white shrink-0" strokeWidth={1.5} aria-hidden="true" />
            )}
            <span>{delta.value}</span>
          </div>
        )}
      </CardWrapper>
    );
  }

  // Standard Default Card
  return (
    <CardWrapper
      href={href || '#'}
      className={`group relative flex flex-col justify-between p-6 rounded-lg bg-surface dark:bg-surface-raised-dark border border-border dark:border-border-dark shadow-xs hover:border-brand/40 dark:hover:border-brand-dark/40 hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.99] transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${className}`}
    >
      <div className="space-y-4">
        {/* Top Row: Icon Container + external link */}
        <div className="flex items-center justify-between">
          {Icon && (
            <div className="w-10 h-10 rounded-md bg-surface-container dark:bg-surface-container-dark flex items-center justify-center text-ink dark:text-ink-dark group-hover:text-brand dark:group-hover:text-brand-dark transition-colors shrink-0">
              <Icon className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
            </div>
          )}
          {href && (
            <div className="p-1 text-ink-muted/50 dark:text-ink-muted-dark/50 group-hover:text-brand dark:group-hover:text-brand-dark group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
              <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Metric Value & Label */}
        <div>
          <div className="text-display font-bold text-ink dark:text-ink-dark tracking-tight tabular-nums group-hover:text-brand dark:group-hover:text-brand-dark transition-colors">
            {value}
          </div>
          <p className="mt-1 text-label font-medium tracking-[0.01em] text-ink dark:text-ink-dark">
            {label}
          </p>
        </div>

        {/* Description */}
        {description && (
          <p className="text-body-sm font-normal text-ink-muted dark:text-ink-muted-dark leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Delta / Indicator at footer */}
      {delta && (
        <div className="mt-5 pt-3 border-t border-border/60 dark:border-border-dark/60 flex items-center gap-1.5 text-caption font-medium tracking-[0.02em] tabular-nums">
          {delta.positive ? (
            <>
              <TrendingUp className="w-3.5 h-3.5 text-success dark:text-success-dark shrink-0" strokeWidth={1.5} aria-hidden="true" />
              <span className="text-success dark:text-success-dark">{delta.value}</span>
            </>
          ) : (
            <>
              <TrendingDown className="w-3.5 h-3.5 text-danger dark:text-danger-dark shrink-0" strokeWidth={1.5} aria-hidden="true" />
              <span className="text-danger dark:text-danger-dark">{delta.value}</span>
            </>
          )}
        </div>
      )}
    </CardWrapper>
  );
};
