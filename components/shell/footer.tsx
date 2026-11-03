'use client';

import * as React from 'react';
import Link from 'next/link';
import { useTheme } from '@/lib/theme/theme-provider';

export const Footer: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <footer className="w-full border-t border-border dark:border-border-dark bg-stone/40 dark:bg-stone-dark/40 mt-auto transition-colors duration-fast">
      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          {/* Mission & Attribution */}
          <div className="flex flex-col max-w-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded bg-brand dark:bg-brand-dark flex items-center justify-center text-surface dark:text-ink font-bold font-display text-sm">
                C
              </div>
              <span className="font-display font-bold text-lg text-ink dark:text-ink-dark">
                Campusly
              </span>
            </div>
            <p className="text-xs text-ink-muted dark:text-ink-muted-dark leading-relaxed mb-3">
              An installable campus discovery and opportunities platform for students at Ahmadu Bello University, Zaria.
            </p>
            <p className="text-xs font-medium text-ink dark:text-ink-dark">
              Run with pride by <span className="text-brand dark:text-brand-dark font-semibold">GDGOC ABU Zaria</span>.
            </p>
          </div>

          {/* Links Column 1: Discover & Act */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-ink dark:text-ink-dark">
              Platform
            </span>
            <ul className="flex flex-col gap-2 text-xs text-ink-muted dark:text-ink-muted-dark">
              <li>
                <Link href="/explore" className="hover:text-brand dark:hover:text-brand-dark focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-focusRing rounded">
                  Explore Communities
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-brand dark:hover:text-brand-dark focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-focusRing rounded">
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link href="/opportunities" className="hover:text-brand dark:hover:text-brand-dark focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-focusRing rounded">
                  Opportunities
                </Link>
              </li>
              <li>
                <Link href="/spotlight" className="hover:text-brand dark:hover:text-brand-dark focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-focusRing rounded">
                  Spotlight Listings
                </Link>
              </li>
              <li>
                <Link href="/submit" className="hover:text-brand dark:hover:text-brand-dark focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-focusRing rounded">
                  Submit a Listing
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-brand dark:hover:text-brand-dark focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-focusRing rounded">
                  Track Submission
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Legal & About */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-ink dark:text-ink-dark">
              Information
            </span>
            <ul className="flex flex-col gap-2 text-xs text-ink-muted dark:text-ink-muted-dark">
              <li>
                <Link href="/announcements" className="hover:text-brand dark:hover:text-brand-dark focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-focusRing rounded">
                  Announcements
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand dark:hover:text-brand-dark focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-focusRing rounded">
                  About Campusly
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand dark:hover:text-brand-dark focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-focusRing rounded">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand dark:hover:text-brand-dark focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-focusRing rounded">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-brand dark:hover:text-brand-dark focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-focusRing rounded">
                  Privacy Notice
                </Link>
              </li>
              <li>
                <Link href="/licences" className="hover:text-brand dark:hover:text-brand-dark focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-focusRing rounded">
                  Licences
                </Link>
              </li>
            </ul>
          </div>

          {/* Theme Selector */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-ink dark:text-ink-dark">
              Theme
            </span>
            <div className="inline-flex rounded-md border border-border dark:border-border-dark p-0.5 bg-surface dark:bg-surface-dark">
              {(['light', 'dark', 'system'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  aria-pressed={theme === t}
                  className={`
                    px-2.5 py-1 text-xs font-medium rounded capitalize transition-colors duration-fast
                    focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-focusRing
                    ${
                      theme === t
                        ? 'bg-brand dark:bg-brand-dark text-surface dark:text-ink font-semibold'
                        : 'text-ink-muted hover:text-ink dark:text-ink-muted-dark dark:hover:text-ink-dark'
                    }
                  `}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-6 border-t border-border/50 dark:border-border-dark/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-ink-muted dark:text-ink-muted-dark">
          <p>© {new Date().getFullYear()} Campusly. Ahmadu Bello University, Zaria.</p>
          <p>Built with Next.js & Tailwind CSS for offline resilience.</p>
        </div>
      </div>
    </footer>
  );
};
