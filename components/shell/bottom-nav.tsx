'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Calendar, Sparkles, Megaphone } from 'lucide-react';

interface TabItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; ariaHidden?: boolean }>;
}

const TABS: TabItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Explore', href: '/explore', icon: Compass },
  { label: 'Events', href: '/events', icon: Calendar },
  { label: 'Opportunities', href: '/opportunities', icon: Sparkles },
  { label: 'Spotlight', href: '/spotlight', icon: Megaphone },
];

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile primary"
      className="fixed bottom-0 left-0 right-0 z-sticky lg:hidden bg-surface/95 dark:bg-surface-dark/95 backdrop-blur-md border-t border-border dark:border-border-dark transition-colors duration-fast pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto items-center">
        {TABS.map((tab) => {
          const isActive =
            tab.href === '/'
              ? pathname === '/'
              : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? 'page' : undefined}
              className={`
                relative flex flex-col items-center justify-center h-full min-h-[48px] py-1 select-none transition-colors duration-fast
                focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-focusRing
                ${
                  isActive
                    ? 'text-brand dark:text-brand-dark font-bold'
                    : 'text-ink-muted hover:text-ink dark:text-ink-muted-dark dark:hover:text-ink-dark font-medium'
                }
              `}
            >
              {/* Active tab top indicator pip */}
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 rounded-full bg-brand dark:bg-brand-dark" />
              )}

              <Icon
                className={`w-5 h-5 mb-1 transition-transform duration-fast ${
                  isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'
                }`}
              />

              <span className="text-[11px] leading-none tracking-tight truncate max-w-[64px]">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
