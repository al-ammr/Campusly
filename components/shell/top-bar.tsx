'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/lib/theme/theme-provider';

export interface TopBarProps {
  onOpenMoreMenu: () => void;
  moreMenuButtonRef?: React.RefObject<HTMLButtonElement>;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenMoreMenu,
  moreMenuButtonRef,
}) => {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Explore', href: '/explore' },
    { label: 'Events', href: '/events' },
    { label: 'Opportunities', href: '/opportunities' },
    { label: 'Spotlight', href: '/spotlight' },
  ];

  return (
    <header className="sticky top-0 z-sticky w-full bg-surface/95 dark:bg-surface-dark/95 backdrop-blur-sm border-b border-border dark:border-border-dark transition-colors duration-fast">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-focusRing"
        >
          <div className="w-8 h-8 rounded-md bg-brand dark:bg-brand-dark flex items-center justify-center text-surface dark:text-ink font-bold font-display text-lg shadow-sm">
            C
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-xl tracking-tight text-ink dark:text-ink-dark leading-none">
              Campusly
            </span>
            <span className="text-[10px] font-medium tracking-wide uppercase text-ink-muted dark:text-ink-muted-dark">
              ABU Zaria
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (UI-210: on lg tab bar becomes top navigation row) */}
        <nav
          aria-label="Desktop primary"
          className="hidden lg:flex items-center gap-1"
        >
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={`
                  px-3.5 py-2 rounded-md text-sm font-semibold transition-colors duration-fast
                  focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-focusRing
                  ${
                    isActive
                      ? 'text-brand dark:text-brand-dark bg-brand/10 dark:bg-brand-dark/15'
                      : 'text-ink-muted hover:text-ink dark:text-ink-muted-dark dark:hover:text-ink-dark'
                  }
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Icons: Search, Theme Toggle, More Menu */}
        <div className="flex items-center gap-1">
          <Link
            href="/search"
            aria-label="Search Campusly"
            className="w-11 h-11 flex items-center justify-center text-ink-muted hover:text-ink dark:text-ink-muted-dark dark:hover:text-ink-dark rounded-full transition-colors duration-fast focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-focusRing"
          >
            <Search className="w-5 h-5" aria-hidden="true" />
          </Link>

          {/* Quick Theme Toggle */}
          <button
            type="button"
            onClick={cycleTheme}
            aria-label={`Current theme is ${theme}. Click to change.`}
            className="w-11 h-11 flex items-center justify-center text-ink-muted hover:text-ink dark:text-ink-muted-dark dark:hover:text-ink-dark rounded-full transition-colors duration-fast focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-focusRing"
          >
            {theme === 'system' ? (
              <Monitor className="w-5 h-5" aria-hidden="true" />
            ) : resolvedTheme === 'dark' ? (
              <Moon className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Sun className="w-5 h-5" aria-hidden="true" />
            )}
          </button>

          {/* More Menu Trigger */}
          <button
            ref={moreMenuButtonRef}
            type="button"
            onClick={onOpenMoreMenu}
            aria-label="Open navigation menu"
            className="w-11 h-11 flex items-center justify-center text-ink-muted hover:text-ink dark:text-ink-muted-dark dark:hover:text-ink-dark rounded-full transition-colors duration-fast focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-focusRing"
          >
            <Menu className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
};
