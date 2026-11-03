import * as React from 'react';
import Link from 'next/link';
import { Button } from './button';
import { AlertCircle } from 'lucide-react';

export interface ErrorStateProps {
  title?: string;
  message: string;
  errorCode?: string;
  onRetry?: () => void;
  homeHref?: string;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  errorCode,
  onRetry,
  homeHref = '/',
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={`
        flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto
        ${className}
      `}
    >
      <div className="w-14 h-14 rounded-full bg-danger/10 dark:bg-danger-dark/20 flex items-center justify-center text-danger dark:text-danger-dark mb-4 shrink-0">
        <AlertCircle className="w-7 h-7" aria-hidden="true" />
      </div>

      <h2 className="text-xl font-bold font-display text-ink dark:text-ink-dark mb-2">
        {title}
      </h2>

      <p className="text-sm text-ink-muted dark:text-ink-muted-dark mb-2 leading-relaxed">
        {message}
      </p>

      {errorCode && (
        <span className="text-[11px] font-mono text-ink-muted/70 dark:text-ink-muted-dark/70 mb-6">
          Reference: {errorCode}
        </span>
      )}

      <div className="flex items-center gap-3 mt-4">
        {onRetry && (
          <Button variant="primary" onClick={onRetry}>
            Try again
          </Button>
        )}

        <Link
          href={homeHref}
          className="inline-flex items-center justify-center px-4 h-12 text-sm font-semibold text-brand dark:text-brand-dark hover:underline rounded-md focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-focusRing"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};
