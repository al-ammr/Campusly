import * as React from 'react';
import Link from 'next/link';
import { Button } from './button';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  illustration?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  illustration,
  className = '',
}) => {
  return (
    <div
      className={`
        flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto
        ${className}
      `}
    >
      {/* SVG Illustration Placeholder (D04 ILL-04) */}
      <div className="mb-4 text-brand/60 dark:text-brand-dark/70" aria-hidden="true">
        {illustration || (
          <svg
            className="w-24 h-24 mx-auto"
            viewBox="0 0 96 96"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Minimal architectural / academic crest stylized flame placeholder */}
            <circle cx="48" cy="48" r="44" className="fill-stone dark:fill-stone-dark" />
            <path
              d="M48 24C48 24 34 38 34 52C34 60 40 66 48 66C56 66 62 60 62 52C62 38 48 24 48 24Z"
              className="fill-brand/40 dark:fill-brand-dark/40"
            />
            <path
              d="M48 38C48 38 40 46 40 54C40 58.5 43.5 62 48 62C52.5 62 56 58.5 56 54C56 46 48 38 48 38Z"
              className="fill-accent dark:fill-accent-dark"
            />
          </svg>
        )}
      </div>

      <h3 className="text-lg font-bold font-display text-ink dark:text-ink-dark mb-1">
        {title}
      </h3>

      <p className="text-sm text-ink-muted dark:text-ink-muted-dark mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button variant="primary">
            {actionLabel}
          </Button>
        </Link>
      )}

      {actionLabel && !actionHref && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
