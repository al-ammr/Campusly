'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('[Campusly Global Error]:', error.message);
  }, [error]);

  return (
    <html lang="en">
      <body className="font-sans bg-sand dark:bg-sand-dark text-ink dark:text-ink-dark">
        <div className="max-w-2xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center gap-4 min-h-screen">
          <h1 className="font-display font-bold text-3xl">
            Could not load content
          </h1>
          <p className="text-sm text-ink-muted dark:text-ink-muted-dark max-w-md">
            Something went wrong while connecting to Campusly servers.
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
      </body>
    </html>
  );
}
