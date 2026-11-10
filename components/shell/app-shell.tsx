'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { SkipLink } from './skip-link';
import { TopBar } from './top-bar';
import { BottomNav } from './bottom-nav';
import { Footer } from './footer';
import { MoreMenuSheet } from './more-menu-sheet';

export interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = React.useState<boolean>(false);
  const moreMenuButtonRef = React.useRef<HTMLButtonElement>(null);

  // Dedicated admin portal and full-screen Welcome Landing have their own independent shells
  if (pathname?.startsWith('/admin') || pathname === '/welcome' || pathname === '/landing') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-background-dark text-ink dark:text-ink-dark transition-colors duration-fast">
      {/* A11y Skip Link */}
      <SkipLink />

      {/* Top Application Bar */}
      <TopBar
        onOpenMoreMenu={() => setIsMoreMenuOpen(true)}
        moreMenuButtonRef={moreMenuButtonRef}
      />

      {/* Main Content Area: padded at bottom so content is never hidden behind mobile bottom tab bar (UI-213) */}
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 flex flex-col w-full pb-20 lg:pb-0 focus:outline-none"
      >
        {children}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile 5-Tab Bottom Navigation (D03 section 4) */}
      <BottomNav />

      {/* More Menu Bottom Sheet / Dialog */}
      <MoreMenuSheet
        isOpen={isMoreMenuOpen}
        onClose={() => setIsMoreMenuOpen(false)}
        triggerRef={moreMenuButtonRef}
      />
    </div>
  );
};
