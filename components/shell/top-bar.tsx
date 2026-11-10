'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Search,
  Menu,
  X,
  Sun,
  Moon,
  PlusCircle,
  Bell,
  Info,
  Mail,
  FileText,
  Shield,
  Code2,
  ExternalLink,
  Compass,
  Calendar,
  Briefcase,
  Award,
  Store,
} from 'lucide-react';
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
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const menuBtnRef = React.useRef<HTMLButtonElement>(null);

  // Instant one-click toggle between light and dark mode with immediate visual feedback
  const toggleTheme = () => {
    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  // Toggle Dropdown Menu
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Close dropdown on outside click or escape key
  React.useEffect(() => {
    if (!isDropdownOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
        menuBtnRef.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        menuBtnRef.current &&
        !menuBtnRef.current.contains(target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Close dropdown on navigation
  React.useEffect(() => {
    setIsDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Explore', href: '/explore' },
    { label: 'Events', href: '/events' },
    { label: 'Opportunities', href: '/opportunities' },
    { label: 'Spotlight', href: '/spotlight' },
  ];

  return (
    <header className="sticky top-0 z-[100] w-full bg-surface/95 dark:bg-surface-dark/95 backdrop-blur-md border-b border-border dark:border-border-dark shadow-xs transition-colors duration-fast">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 relative">
        {/* Brand Logo & Name */}
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-focusRing group"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-border/80 dark:border-border-dark shadow-xs shrink-0 bg-surface group-hover:scale-105 transition-transform duration-base">
            <Image
              src="/favicon.jfif"
              alt="Campusly Logo"
              width={40}
              height={40}
              className="w-full h-full object-cover dark:hidden"
              priority
            />
            <Image
              src="/inverted_logo.jfif"
              alt="Campusly Logo"
              width={40}
              height={40}
              className="w-full h-full object-cover hidden dark:block"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-xl tracking-tight text-ink dark:text-ink-dark leading-none group-hover:text-brand transition-colors">
              Campusly
            </span>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-ink-muted dark:text-ink-muted-dark">
              ABU Zaria
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Desktop primary"
          className="hidden lg:flex items-center gap-1.5"
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
                  px-3.5 py-2 rounded-md text-sm font-semibold transition-all duration-fast
                  focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-focusRing
                  ${
                    isActive
                      ? 'text-brand dark:text-brand-dark bg-brand/10 dark:bg-brand-dark/15 font-bold shadow-xs'
                      : 'text-ink-muted hover:text-ink dark:text-ink-muted-dark dark:hover:text-ink-dark hover:bg-black/5 dark:hover:bg-white/5'
                  }
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Icons: Search, Theme Toggle, Dropdown Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* 1. Clickable Responsive Search Link */}
          <Link
            href="/search"
            aria-label="Search Campusly"
            className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-ink-muted hover:text-brand dark:text-ink-muted-dark dark:hover:text-brand-dark rounded-full hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all duration-fast cursor-pointer focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-focusRing shadow-xs"
          >
            <Search className="w-5 h-5 transition-transform group-hover:scale-110" aria-hidden="true" />
          </Link>

          {/* 2. Responsive Clickable Theme Toggle Icon */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
            className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-ink-muted hover:text-brand dark:text-ink-muted-dark dark:hover:text-brand-dark rounded-full hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all duration-fast cursor-pointer focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-focusRing shadow-xs"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="w-5 h-5 text-accent transition-transform duration-300 hover:rotate-45" aria-hidden="true" />
            ) : (
              <Moon className="w-5 h-5 transition-transform duration-300 hover:-rotate-12" aria-hidden="true" />
            )}
          </button>

          {/* 3. Responsive Drop Down Menu Trigger */}
          <button
            ref={menuBtnRef}
            type="button"
            onClick={toggleDropdown}
            aria-label={isDropdownOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isDropdownOpen}
            className={`
              w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full transition-all duration-fast cursor-pointer
              focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-focusRing shadow-xs active:scale-95
              ${
                isDropdownOpen
                  ? 'bg-brand text-white dark:bg-brand-dark dark:text-ink shadow-sm'
                  : 'text-ink-muted hover:text-ink dark:text-ink-muted-dark dark:hover:text-ink-dark hover:bg-black/5 dark:hover:bg-white/10'
              }
            `}
          >
            {isDropdownOpen ? (
              <X className="w-5 h-5 transition-transform duration-200" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5 transition-transform duration-200" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* 4. Elegant Header Drop Down Menu (Direct replica of Image 2 reference) */}
        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            role="menu"
            aria-orientation="vertical"
            className="absolute top-[calc(100%+8px)] right-2 sm:right-4 w-[calc(100vw-32px)] max-w-[370px] max-h-[calc(100vh-80px)] overflow-y-auto rounded-2xl bg-surface dark:bg-surface-raised-dark border border-border dark:border-border-dark shadow-2xl p-4 sm:p-5 flex flex-col gap-4 z-[250] animate-dropdown-intro"
          >
            {/* 1. QUICK ACTIONS */}
            <div className="flex flex-col gap-2 pb-3.5 border-b border-border/80 dark:border-border-dark/80">
              <span className="text-xs font-black uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark px-1">
                QUICK ACTIONS
              </span>
              <Link
                href="/submit"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-start gap-3 px-2 py-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all group cursor-pointer"
              >
                <div className="w-5 h-5 shrink-0 flex items-center justify-center text-ink-muted group-hover:text-brand dark:text-ink-muted-dark dark:group-hover:text-brand-dark transition-colors mt-0.5">
                  <PlusCircle className="w-5 h-5" strokeWidth={1.8} aria-hidden="true" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-ink dark:text-ink-dark group-hover:text-brand dark:group-hover:text-brand-dark group-hover:underline underline-offset-4 decoration-2 decoration-brand transition-all">
                    Submit a Listing
                  </span>
                  <span className="text-xs text-ink-muted dark:text-ink-muted-dark">
                    List a club, event, or student venture
                  </span>
                </div>
              </Link>

              <Link
                href="/track"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-start gap-3 px-2 py-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all group cursor-pointer"
              >
                <div className="w-5 h-5 shrink-0 flex items-center justify-center text-ink-muted group-hover:text-brand dark:text-ink-muted-dark dark:group-hover:text-brand-dark transition-colors mt-0.5">
                  <Search className="w-5 h-5" strokeWidth={1.8} aria-hidden="true" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-ink dark:text-ink-dark group-hover:text-brand dark:group-hover:text-brand-dark group-hover:underline underline-offset-4 decoration-2 decoration-brand transition-all">
                    Track Submission
                  </span>
                  <span className="text-xs text-ink-muted dark:text-ink-muted-dark">
                    Check review status with CY-XXXX
                  </span>
                </div>
              </Link>
            </div>

            {/* 2. DIRECTORY */}
            <div className="flex flex-col gap-2 pb-3.5 border-b border-border/80 dark:border-border-dark/80">
              <span className="text-xs font-black uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark px-1">
                DIRECTORY
              </span>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                <Link
                  href="/communities"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all group cursor-pointer"
                >
                  <div className="w-5 h-5 shrink-0 flex items-center justify-center text-ink-muted group-hover:text-brand dark:text-ink-muted-dark dark:group-hover:text-brand-dark transition-colors">
                    <Compass className="w-4.5 h-4.5" strokeWidth={1.8} aria-hidden="true" />
                  </div>
                  <span className="font-bold text-sm text-ink dark:text-ink-dark group-hover:text-brand dark:group-hover:text-brand-dark group-hover:underline underline-offset-4 decoration-2 decoration-brand transition-all">
                    Communities
                  </span>
                </Link>

                <Link
                  href="/events"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all group cursor-pointer"
                >
                  <div className="w-5 h-5 shrink-0 flex items-center justify-center text-ink-muted group-hover:text-brand dark:text-ink-muted-dark dark:group-hover:text-brand-dark transition-colors">
                    <Calendar className="w-4.5 h-4.5" strokeWidth={1.8} aria-hidden="true" />
                  </div>
                  <span className="font-bold text-sm text-ink dark:text-ink-dark group-hover:text-brand dark:group-hover:text-brand-dark group-hover:underline underline-offset-4 decoration-2 decoration-brand transition-all">
                    Events
                  </span>
                </Link>

                <Link
                  href="/opportunities"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all group cursor-pointer"
                >
                  <div className="w-5 h-5 shrink-0 flex items-center justify-center text-ink-muted group-hover:text-brand dark:text-ink-muted-dark dark:group-hover:text-brand-dark transition-colors">
                    <Briefcase className="w-4.5 h-4.5" strokeWidth={1.8} aria-hidden="true" />
                  </div>
                  <span className="font-bold text-sm text-ink dark:text-ink-dark group-hover:text-brand dark:group-hover:text-brand-dark group-hover:underline underline-offset-4 decoration-2 decoration-brand transition-all">
                    Opportunities
                  </span>
                </Link>

                <Link
                  href="/spotlight"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all group cursor-pointer"
                >
                  <div className="w-5 h-5 shrink-0 flex items-center justify-center text-ink-muted group-hover:text-brand dark:text-ink-muted-dark dark:group-hover:text-brand-dark transition-colors">
                    <Award className="w-4.5 h-4.5" strokeWidth={1.8} aria-hidden="true" />
                  </div>
                  <span className="font-bold text-sm text-ink dark:text-ink-dark group-hover:text-brand dark:group-hover:text-brand-dark group-hover:underline underline-offset-4 decoration-2 decoration-brand transition-all">
                    Spotlight
                  </span>
                </Link>

                <Link
                  href="/businesses"
                  onClick={() => setIsDropdownOpen(false)}
                  className="col-span-2 flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all group cursor-pointer"
                >
                  <div className="w-5 h-5 shrink-0 flex items-center justify-center text-ink-muted group-hover:text-brand dark:text-ink-muted-dark dark:group-hover:text-brand-dark transition-colors">
                    <Store className="w-4.5 h-4.5" strokeWidth={1.8} aria-hidden="true" />
                  </div>
                  <span className="font-bold text-sm text-ink dark:text-ink-dark group-hover:text-brand dark:group-hover:text-brand-dark group-hover:underline underline-offset-4 decoration-2 decoration-brand transition-all">
                    Ranked Student Businesses
                  </span>
                </Link>
              </div>
            </div>

            {/* 3. INFORMATION (Direct replica of Image 2: 2-column text links without icons) */}
            <div className="flex flex-col gap-2 pb-3.5 border-b border-border/80 dark:border-border-dark/80">
              <span className="text-xs font-black uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark px-1">
                INFORMATION
              </span>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2 px-1">
                <Link
                  href="/announcements"
                  onClick={() => setIsDropdownOpen(false)}
                  className="text-sm font-semibold text-ink-muted hover:text-ink dark:text-ink-muted-dark dark:hover:text-ink-dark hover:underline underline-offset-4 decoration-2 decoration-brand transition-all cursor-pointer"
                >
                  Announcements
                </Link>

                <Link
                  href="/about"
                  onClick={() => setIsDropdownOpen(false)}
                  className="text-sm font-semibold text-ink-muted hover:text-ink dark:text-ink-muted-dark dark:hover:text-ink-dark hover:underline underline-offset-4 decoration-2 decoration-brand transition-all cursor-pointer"
                >
                  About Campusly
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setIsDropdownOpen(false)}
                  className="text-sm font-semibold text-ink-muted hover:text-ink dark:text-ink-muted-dark dark:hover:text-ink-dark hover:underline underline-offset-4 decoration-2 decoration-brand transition-all cursor-pointer"
                >
                  Contact Us
                </Link>

                <Link
                  href="/licences"
                  onClick={() => setIsDropdownOpen(false)}
                  className="text-sm font-semibold text-ink-muted hover:text-ink dark:text-ink-muted-dark dark:hover:text-ink-dark hover:underline underline-offset-4 decoration-2 decoration-brand transition-all cursor-pointer"
                >
                  Licences
                </Link>
              </div>
            </div>

            {/* 4. THEME SWITCHER (Direct replica of Image 2: Theme: Light [Dark] System) */}
            <div className="pt-0.5 flex items-center justify-between px-1 text-xs">
              <span className="text-xs font-bold text-ink-muted dark:text-ink-muted-dark">
                Theme:
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    theme === 'light'
                      ? 'bg-brand text-white shadow-xs'
                      : 'text-ink-muted hover:text-ink dark:text-ink-muted-dark dark:hover:text-ink-dark'
                  }`}
                >
                  Light
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-brand text-white shadow-xs'
                      : 'text-ink-muted hover:text-ink dark:text-ink-muted-dark dark:hover:text-ink-dark'
                  }`}
                >
                  Dark
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('system')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    theme === 'system'
                      ? 'bg-brand text-white shadow-xs'
                      : 'text-ink-muted hover:text-ink dark:text-ink-muted-dark dark:hover:text-ink-dark'
                  }`}
                >
                  System
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
