'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  PlusCircle,
  ArrowRight,
  Check,
  X,
  Filter,
  Ticket,
  CalendarDays,
  Layers,
  GraduationCap,
  Store,
  Users,
} from 'lucide-react';
import { PublicListingSummary } from '@/lib/api/public-queries';
import { ListingCard } from '@/components/cards/listing-card';

export interface EventCategoryItem {
  id: string;
  slug: string;
  name: string;
  icon_key?: string;
}

interface EventsClientViewProps {
  initialEvents: PublicListingSummary[];
  categories: EventCategoryItem[];
  initialWhen?: string;
  initialFree?: boolean;
  initialCategory?: string;
  nextCursor?: string | null;
}

const WHEN_TABS = [
  { key: 'upcoming', label: 'All Upcoming' },
  { key: 'week', label: 'This Week' },
  { key: 'past', label: 'Past Events' },
];

export function EventsClientView({
  initialEvents,
  categories,
  initialWhen = 'upcoming',
  initialFree = false,
  initialCategory = '',
  nextCursor,
}: EventsClientViewProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeWhen, setActiveWhen] = React.useState(initialWhen);
  const [freeOnly, setFreeOnly] = React.useState(initialFree);
  const [selectedCategory, setSelectedCategory] = React.useState(initialCategory);
  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState(false);

  // Client-side instant filter and search
  const filteredEvents = React.useMemo(() => {
    let list = [...initialEvents];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (ev) =>
          ev.title.toLowerCase().includes(q) ||
          ev.summary.toLowerCase().includes(q) ||
          (ev.category?.name && ev.category.name.toLowerCase().includes(q))
      );
    }

    if (freeOnly) {
      // If event has is_free indicator
      list = list.filter((ev) => (ev as any).is_free !== false);
    }

    if (selectedCategory && selectedCategory !== 'all') {
      list = list.filter(
        (ev) =>
          ev.category?.slug === selectedCategory ||
          ev.category?.id === selectedCategory
      );
    }

    return list;
  }, [initialEvents, searchQuery, freeOnly, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-6 sm:gap-8">
      {/* ========================================================
          1. EVENTS HERO SHOWCASE BANNER
         ======================================================== */}
      <section
        aria-label="Events Hero Banner"
        className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-black/20 dark:border-white/10 shadow-xl min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] flex flex-col justify-between bg-black group transition-all duration-300 hover:shadow-2xl hover:border-brand/40"
      >
        {/* Full Background Hero Video ('event_hero_image.mp4' from public directory) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out"
        >
          <source src="/event_hero_video.mp4" type="video/mp4" />
        </video>

        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/60 pointer-events-none" />

        {/* Top Text Content (Overhead badge removed, spacious typography) */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-14 flex flex-col gap-3.5 sm:gap-4 max-w-xl text-white">
          <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-[1.2] drop-shadow-md">
            Conferences, Workshops &amp; Campus Gatherings
          </h1>

          <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-md drop-shadow-sm font-normal">
            Discover departmental symposiums, engineering hackathons, career fairs, and student summits curated across Samaru &amp; Kongo campuses.
          </p>
        </div>

        {/* Bottom Hero Action Buttons with Hover Effects */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-14 pt-0 sm:pt-0 lg:pt-0 flex items-center gap-2.5 flex-wrap">
          <a
            href="#events-directory"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-4.5 sm:py-2 rounded-full bg-brand hover:bg-brand-strong text-white font-semibold text-xs tracking-wide shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
          >
            <Search className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Explore Events</span>
          </a>

          <Link
            href="/submit"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-4.5 sm:py-2 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-semibold text-xs tracking-wide shadow-sm transition-all duration-200 hover:scale-105 hover:border-white/50 active:scale-95 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <PlusCircle className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Submit an Event</span>
          </Link>
        </div>
      </section>

      {/* ========================================================
          2. SEARCH & FILTER CONTROLS BAR
         ======================================================== */}
      <section id="events-directory" aria-label="Event Search and Filters" className="flex flex-col gap-3.5 w-full">
        {/* Search Bar + Filter Modal Trigger */}
        <div className="flex items-center gap-2.5 sm:gap-3 w-full">
          <div className="relative flex-1 group">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events by title, organizer, or venue..."
              aria-label="Search events"
              className="w-full h-12 sm:h-13 pl-11 pr-4 rounded-2xl bg-[#FFFFF0] dark:bg-surface-raised-dark border border-border dark:border-border-dark text-ink dark:text-ink-dark placeholder:text-ink-muted/70 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-brand hover:border-brand/50 hover:shadow-xs shadow-2xs transition-all"
            />
            <Search
              className="w-5 h-5 absolute left-3.5 top-3.5 sm:top-4 text-ink-muted pointer-events-none group-focus-within:text-brand group-hover:text-brand transition-colors"
              strokeWidth={1.8}
              aria-hidden="true"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3.5 sm:top-4 text-ink-muted hover:text-ink dark:hover:text-ink-dark p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            aria-label="Filter events"
            className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-[#FFFFF0] dark:bg-surface-raised-dark border border-border dark:border-border-dark flex items-center justify-center text-ink dark:text-ink-dark hover:text-brand dark:hover:text-brand-dark hover:border-brand/60 hover:shadow-md hover:scale-105 shadow-2xs transition-all duration-200 shrink-0 cursor-pointer active:scale-95"
          >
            <SlidersHorizontal className="w-5 h-5" strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>

        {/* Timeline Pills Strip + Free Toggle */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none scroll-smooth">
          {/* Time Tabs */}
          {WHEN_TABS.map((tab) => {
            const isActive = activeWhen === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveWhen(tab.key)}
                className={`shrink-0 h-9 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                  isActive
                    ? 'bg-brand text-white shadow-xs hover:bg-brand-strong hover:shadow-md'
                    : 'bg-[#FFFFF0] dark:bg-surface-raised-dark border border-border dark:border-border-dark text-ink dark:text-ink-dark hover:border-brand/50 hover:text-brand hover:shadow-xs'
                }`}
              >
                <Clock className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-ink-muted'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}

          {/* Free Only Toggle Button */}
          <button
            type="button"
            onClick={() => setFreeOnly((prev) => !prev)}
            className={`shrink-0 h-9 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
              freeOnly
                ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700 hover:shadow-md'
                : 'bg-[#FFFFF0] dark:bg-surface-raised-dark border border-border dark:border-border-dark text-ink dark:text-ink-dark hover:border-brand/50 hover:text-brand hover:shadow-xs'
            }`}
          >
            <Ticket className={`w-3.5 h-3.5 ${freeOnly ? 'text-white' : 'text-ink-muted'}`} />
            <span>Free Only</span>
            {freeOnly && <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />}
          </button>

          {/* Category Quick Filter Dropdown/Pills */}
          {categories && categories.length > 0 && (
            <div className="flex items-center gap-1.5 pl-1 border-l border-border/80">
              <button
                type="button"
                onClick={() => setSelectedCategory('')}
                className={`shrink-0 h-9 px-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                  !selectedCategory
                    ? 'bg-brand/15 text-brand dark:text-brand-dark font-bold'
                    : 'text-ink-muted hover:text-ink dark:hover:text-ink-dark'
                }`}
              >
                All Categories
              </button>
              {categories.slice(0, 5).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`shrink-0 h-9 px-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                    selectedCategory === cat.slug
                      ? 'bg-brand/15 text-brand dark:text-brand-dark font-bold'
                      : 'text-ink-muted hover:text-ink dark:hover:text-ink-dark'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          3. EVENTS CATALOG LISTING
         ======================================================== */}
      <section aria-label="Event Directory Results" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand/10 dark:bg-brand-dark/15 flex items-center justify-center text-brand dark:text-brand-dark shadow-xs">
              <Calendar className="w-4.5 h-4.5" strokeWidth={2} />
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-ink dark:text-ink-dark tracking-tight">
              Upcoming Listings
            </h2>
          </div>

          {filteredEvents.length > 0 && (
            <span className="text-xs font-semibold text-ink-muted dark:text-ink-muted-dark px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-border/60">
              {filteredEvents.length} Events
            </span>
          )}
        </div>

        {/* Empty State vs. Populated Grid */}
        {filteredEvents.length === 0 ? (
          /* REFINED PURE BORDERLESS EMPTY STATE */
          <div className="p-10 sm:p-14 rounded-2xl sm:rounded-3xl bg-[#FFFFF0] dark:bg-surface-raised-dark border border-border dark:border-border-dark text-center flex flex-col items-center justify-center gap-5 shadow-sm hover:shadow-xl hover:border-brand/40 hover:-translate-y-1.5 transition-all duration-300 group">
            {/* Pure Borderless Icon Emblem */}
            <div className="relative flex items-center justify-center mb-1">
              <div className="absolute w-24 h-24 rounded-full bg-brand/10 dark:bg-brand-dark/15 blur-xl pointer-events-none group-hover:bg-brand/20 transition-all duration-300" />
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-brand/10 dark:bg-brand-dark/15 flex items-center justify-center text-brand dark:text-brand-dark group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-brand dark:text-brand-dark" strokeWidth={1.75} aria-hidden="true" />
              </div>
            </div>

            <div className="space-y-1.5 max-w-md">
              <h3 className="font-display font-bold text-lg sm:text-xl text-ink dark:text-ink-dark group-hover:text-brand transition-colors">
                No Events Listed Yet
              </h3>
              <p className="text-sm text-ink-muted dark:text-ink-muted-dark leading-relaxed">
                There are currently no events registered for this filter. Run an academic society, department, or student group? Submit your event to get listed.
              </p>
            </div>

            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand hover:bg-brand-strong text-white text-xs sm:text-sm font-bold shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
            >
              <span>Submit an Event</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : (
          /* POPULATED EVENTS GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEvents.map((event) => (
              <ListingCard key={event.id} listing={event} />
            ))}
          </div>
        )}
      </section>

      {/* ========================================================
          4. FILTER MODAL
         ======================================================== */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-dropdown-intro">
          <div className="w-full max-w-md rounded-3xl bg-[#FFFFF0] dark:bg-surface-raised-dark border border-border dark:border-border-dark p-6 shadow-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-brand" />
                <h3 className="font-display font-bold text-lg text-ink dark:text-ink-dark">
                  Filter Events
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-ink-muted hover:text-ink hover:scale-110 active:scale-95 transition-all cursor-pointer"
                aria-label="Close filters"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Time Filter */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                Timeline
              </span>
              <div className="grid grid-cols-3 gap-2">
                {WHEN_TABS.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveWhen(tab.key)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold uppercase transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                      activeWhen === tab.key
                        ? 'bg-brand text-white shadow-xs hover:bg-brand-strong'
                        : 'bg-black/5 dark:bg-white/5 text-ink hover:bg-black/10'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                Cost
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFreeOnly(false)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold uppercase transition-all duration-200 cursor-pointer ${
                    !freeOnly
                      ? 'bg-brand text-white shadow-xs'
                      : 'bg-black/5 dark:bg-white/5 text-ink hover:bg-black/10'
                  }`}
                >
                  All Events
                </button>
                <button
                  type="button"
                  onClick={() => setFreeOnly(true)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold uppercase transition-all duration-200 cursor-pointer ${
                    freeOnly
                      ? 'bg-brand text-white shadow-xs'
                      : 'bg-black/5 dark:bg-white/5 text-ink hover:bg-black/10'
                  }`}
                >
                  Free Only
                </button>
              </div>
            </div>

            {/* Apply Button */}
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(false)}
              className="w-full py-3 rounded-xl bg-brand hover:bg-brand-strong text-white font-bold text-sm shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
