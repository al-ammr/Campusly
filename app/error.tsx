'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { t } from '@/lib/copy/strings';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log error cleanly without leaking sensitive details
    console.error('[Campusly Application Error]:', error.message);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center gap-4">
      <h1 className="font-display font-bold text-3xl text-ink dark:text-ink-dark">
        {t('state.error.title')}
      </h1>
      <p className="text-sm text-ink-muted dark:text-ink-muted-dark max-w-md">
        {t('state.error.description')}
      </p>
      <div className="flex gap-4 mt-2">
        <Button variant="primary" onClick={() => reset()}>
          Try again
        </Button>
        <a href="/">
          <Button variant="secondary">
            Back to Home
          </Button>
        </a>
      </div>
    </div>
  );
}
