'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/lib/theme/theme-provider';
import {
  Sun,
  Moon,
  ArrowRight,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  CheckCircle2,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 4000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pb-6 pt-2 mt-auto">
      {/* Compact Floating Card Footer with Smooth Edge Curves and Inward Padding */}
      <footer className="w-full rounded-2xl sm:rounded-3xl bg-footer-brown text-white p-5 sm:p-7 shadow-xl border border-white/10 relative overflow-hidden flex flex-col gap-5 transition-colors duration-fast">
        {/* Top Header Row: Brand Identity & Top-Right Theme Toggle */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 relative z-10">
          {/* Brand Info & Mission */}
          <div className="flex flex-col gap-2 max-w-sm">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/20 shadow-md shrink-0">
                <Image
                  src="/inverted_logo.jpg"
                  alt="Campusly Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white leading-none">
                  Campusly
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
                  ABU Zaria
                </span>
              </div>
            </div>
            <p className="text-body-sm font-normal text-white/85 leading-relaxed">
              Inspire, educate and connect campus innovators at Ahmadu Bello University. Verified directory.
            </p>
          </div>

          {/* Quick Submenu Columns: Side-by-Side (Platform & Information) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 sm:gap-10 w-full lg:w-auto">
            {/* Column 1: Platform (Bold H2) */}
            <div className="flex flex-col gap-2">
              <h2 className="text-h2 font-bold tracking-tight text-white">
                Platform
              </h2>
              <ul className="flex flex-col gap-1 text-body-sm font-normal text-white/80">
                <li>
                  <Link href="/explore" className="footer-link-animated">
                    Explore Communities
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="footer-link-animated">
                    Upcoming Events
                  </Link>
                </li>
                <li>
                  <Link href="/opportunities" className="footer-link-animated">
                    Opportunities
                  </Link>
                </li>
                <li>
                  <Link href="/spotlight" className="footer-link-animated">
                    Spotlight Listings
                  </Link>
                </li>
                <li>
                  <Link href="/businesses" className="footer-link-animated">
                    Top Businesses
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Information (Bold H2) */}
            <div className="flex flex-col gap-2">
              <h2 className="text-h2 font-bold tracking-tight text-white">
                Information
              </h2>
              <ul className="flex flex-col gap-1 text-body-sm font-normal text-white/80">
                <li>
                  <Link href="/announcements" className="footer-link-animated">
                    Announcements
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="footer-link-animated">
                    About Campusly
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="footer-link-animated">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/track" className="footer-link-animated">
                    Track Submission
                  </Link>
                </li>
                <li>
                  <Link href="/licences" className="footer-link-animated">
                    Licences
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Top-Right Theme Toggle Button */}
          <div className="absolute top-0 right-0 lg:static flex flex-col items-end gap-1.5 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
              className="w-9 h-9 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-base hover:scale-105 active:scale-95 shadow-sm cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-accent transition-transform duration-300 hover:rotate-45" strokeWidth={2} />
              ) : (
                <Moon className="w-4 h-4 text-white transition-transform duration-300 hover:-rotate-12" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>

        {/* Middle Row: Compact Cream Newsletter & Action Inset */}
        <div className="w-full rounded-xl bg-footer-cream text-footer-cream-ink p-3.5 sm:p-4 shadow-md border border-black/10 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-black/10 shadow-xs shrink-0">
              <Image
                src="/main_logo.jpg"
                alt="Campusly Logo"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-footer-cream-ink leading-tight">
                Campusly Newsletter
              </span>
              <span className="text-[11px] text-footer-cream-muted">
                100% student-verified updates &amp; opportunities
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap sm:flex-nowrap">
            {subscribed ? (
              <div className="p-1.5 px-3 rounded-full bg-success/20 text-success dark:text-success-dark font-semibold text-caption flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Subscribed! Check your inbox soon.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="w-full sm:w-56 rounded-full bg-footer-pill p-1 pl-3.5 flex items-center justify-between border border-white/10 shadow-inner">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email address"
                  className="bg-transparent text-white placeholder:text-white/50 text-caption font-normal focus:outline-none w-full pr-1.5"
                  required
                  aria-label="Student email address"
                />
                <button
                  type="submit"
                  className="w-6 h-6 rounded-full bg-footer-btn hover:bg-footer-btn text-white flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 transition-all shadow-xs cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                  aria-label="Subscribe to newsletter"
                >
                  <ArrowRight className="w-3 h-3" strokeWidth={2.5} />
                </button>
              </form>
            )}

            <Link
              href="/submit"
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-footer-btn hover:bg-footer-btn text-white text-caption font-bold tracking-wide shadow-xs hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <span>Work together?</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Bottom Row: Attribution, Legal & Socials */}
        <div className="pt-2 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-caption font-medium text-white/75 relative z-10">
          <div className="flex items-center gap-2 font-mono uppercase tracking-widest text-[11px] font-bold text-white/90">
            <span>BY GDGOC ABU ZARIA</span>
            <span aria-hidden="true">•</span>
            <span>© {new Date().getFullYear()} Campusly</span>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-2 text-white/80">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center hover:scale-110 hover:text-white transition-all"
            >
              <Instagram className="w-3 h-3" strokeWidth={2} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center hover:scale-110 hover:text-white transition-all"
            >
              <Linkedin className="w-3 h-3" strokeWidth={2} />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center hover:scale-110 hover:text-white transition-all"
            >
              <Twitter className="w-3 h-3" strokeWidth={2} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center hover:scale-110 hover:text-white transition-all"
            >
              <Youtube className="w-3 h-3" strokeWidth={2} />
            </a>
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-2.5 tabular-nums">
            <Link href="/terms" className="footer-link-animated hover:text-white">
              Terms
            </Link>
            <span aria-hidden="true">•</span>
            <Link href="/privacy" className="footer-link-animated hover:text-white">
              Privacy
            </Link>
            <span aria-hidden="true">•</span>
            <Link href="/licences" className="footer-link-animated hover:text-white">
              Licences
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
