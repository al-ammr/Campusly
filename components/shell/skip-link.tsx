import * as React from 'react';

export const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-toast focus:px-4 focus:py-2.5 focus:bg-brand focus:text-surface focus:rounded-md focus:font-semibold focus:shadow-lg focus:outline focus:outline-[3px] focus:outline-focusRing focus:outline-offset-2"
    >
      Skip to main content
    </a>
  );
};
