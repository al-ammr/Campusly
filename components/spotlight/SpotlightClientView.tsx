'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  SlidersHorizontal,
  PlusCircle,
  ArrowRight,
  X,
  Filter,
  Check,
  Store,
  Tag,
  Award,
  ShieldCheck,
  CheckCircle2,
  Landmark,
  Layers,
  AlertCircle,
  UtensilsCrossed,
  Laptop,
  ShoppingBag,
} from 'lucide-react';
import { PublicSpotlightItem } from '@/lib/api/public-queries';
import { SpotlightCard } from '@/components/cards/spotlight-card';
import { CampusBusinessCarousel } from './CampusBusinessCarousel';

export interface SpotlightCategoryItem {
  id: string;
  slug: string;
  name: string;
  icon_key?: string;
}

interface SpotlightClientViewProps {
  initialFeatured: PublicSpotlightItem[];
  initialItems: PublicSpotlightItem[];
  categories: SpotlightCategoryItem[];
  initialCategory?: string;
  nextCursor?: string | null;
}

const SPOTLIGHT_FILTER_PILLS = [
  { key: 'all', label: 'All Ventures', icon: Layers },
  { key: 'featured', label: 'Featured Priority', icon: Award },
  { key: 'food', label: 'Food & Dining', icon: UtensilsCrossed },
  { key: 'tech', label: 'Tech & Gadgets', icon: Laptop },
  { key: 'fashion', label: 'Fashion & Beauty', icon: ShoppingBag },
];

export function SpotlightClientView({
  initialFeatured,
  initialItems,
  categories,
  initialCategory = '',
  nextCursor,
}: SpotlightClientViewProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activePill, setActivePill] = React.useState('all');
  const [selectedCategory, setSelectedCategory] = React.useState(initialCategory);
  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState(false);

  // Combine items for client filtering
  const allListings = React.useMemo(() => {
    const map = new Map<string, PublicSpotlightItem>();
    initialFeatured.forEach((item) => map.set(item.id, item));
    initialItems.forEach((item) => {
      if (!map.has(item.id)) map.set(item.id, item);
    });
    return Array.from(map.values());
  }, [initialFeatured, initialItems]);

  // Client-side instant filter and search
  const filteredItems = React.useMemo(() => {
    let list = [...allListings];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.business_name.toLowerCase().includes(q) ||
          item.offer.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.name.toLowerCase().includes(q)
      );
    }

    // Pill filter
    if (activePill === 'featured') {
      list = list.filter((item) => item.plan === 'featured');
    } else if (activePill !== 'all') {
      list = list.filter((item) => {
        const catSlug = (item.category.slug || item.category.name).toLowerCase();
        return catSlug.includes(activePill);
      });
    }

    // Category dropdown filter
    if (selectedCategory && selectedCategory !== 'all') {
      list = list.filter(
        (item) =>
          item.category.slug === selectedCategory ||
          item.category.id === selectedCategory
      );
    }

    return list;
  }, [allListings, searchQuery, activePill, selectedCategory]);

  const activeFiltersCount =
    (activePill !== 'all' ? 1 : 0) +
    (selectedCategory && selectedCategory !== 'all' ? 1 : 0);

  const resetFilters = () => {
    setActivePill('all');
    setSelectedCategory('all');
    setSearchQuery('');
    setIsFilterModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-6 sm:gap-8">
      {/* ========================================================
          1. SPOTLIGHT HERO SHOWCASE BANNER
             - Video background: 'spotlight_hero_video.mp4'
             - Text anchored at the TOP
             - Small action buttons positioned at the BOTTOM
             - No overhead badges
         ======================================================== */}
      <section
        aria-label="Spotlight Hero Showcase"
        className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-black/20 dark:border-white/10 shadow-xl min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] flex flex-col justify-between bg-black group transition-all duration-300 hover:shadow-2xl hover:border-brand/40"
      >
        {/* Full Background Hero Video ('spotlight_hero_video.mp4' from public directory) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out"
        >
          <source src="/spotlight_hero_video.mp4" type="video/mp4" />
        </video>

        {/* Cinematic Lightweight Contrast Overlays */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/60 pointer-events-none" />

        {/* Top Text Content (Spacious, bold, professional typography) */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-14 flex flex-col gap-3.5 sm:gap-4 max-w-xl text-white">
          <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-[1.2] drop-shadow-md">
            Campus Spotlight
          </h1>

          <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-md drop-shadow-sm font-normal">
            The student businesses and campus ventures working across Samaru and Kongo every day. Each listing is paid for and reviewed by the GDGOC team before it goes live, and students decide the ranking by starring the ones they use.
          </p>
        </div>

        {/* Bottom Small Action Buttons with Rich Hover Effects */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-14 pt-0 sm:pt-0 lg:pt-0 flex items-center gap-3 flex-wrap">
          <Link
            href="/spotlight/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-brand hover:bg-brand-strong text-white font-bold text-xs tracking-wide shadow-md transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
          >
            <Award className="w-3.5 h-3.5 text-amber-300" strokeWidth={2.2} />
            <span>Book Spotlight • &#8358;5,000</span>
          </Link>

          <Link
            href="/submit?kind=business"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white font-bold text-xs tracking-wide shadow-sm transition-all duration-200 hover:scale-105 hover:border-white/50 active:scale-95 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <PlusCircle className="w-3.5 h-3.5" strokeWidth={2} />
            <span>List Business (Free)</span>
          </Link>

          <a
            href="#campus-businesses"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur-md border border-white/20 text-white/95 hover:text-white font-semibold text-xs tracking-wide shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Store className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Campus Businesses</span>
          </a>
        </div>
      </section>

      {/* ========================================================
          2. SEARCH & INTERACTIVE FILTER CONTROLS BAR
         ======================================================== */}
      <section
        id="spotlight-directory"
        aria-label="Spotlight Search and Filters"
        className="flex flex-col gap-3.5 w-full"
      >
        <div className="flex items-center gap-2.5 sm:gap-3 w-full">
          <div className="relative flex-1 group">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search featured ventures, student offers, or campus services..."
              aria-label="Search spotlight directory"
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
            aria-label="Open spotlight filters"
            className={`w-12 h-12 sm:w-13 sm:h-13 rounded-2xl border flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer active:scale-95 shadow-2xs relative ${
              activeFiltersCount > 0
                ? 'bg-brand text-white border-brand shadow-sm'
                : 'bg-[#FFFFF0] dark:bg-surface-raised-dark border-border dark:border-border-dark text-ink dark:text-ink-dark hover:text-brand dark:hover:text-brand-dark hover:border-brand/60 hover:shadow-md hover:scale-105'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" strokeWidth={1.8} aria-hidden="true" />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-accent-fg text-[10px] font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Horizontal Category / Plan Pills Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none scroll-smooth">
          {SPOTLIGHT_FILTER_PILLS.map((pill) => {
            const Icon = pill.icon;
            const isActive = activePill === pill.key;
            return (
              <button
                key={pill.key}
                type="button"
                onClick={() => setActivePill(pill.key)}
                className={`shrink-0 h-9 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                  isActive
                    ? 'bg-brand text-white shadow-xs hover:bg-brand-strong hover:shadow-md'
                    : 'bg-[#FFFFF0] dark:bg-surface-raised-dark border border-border dark:border-border-dark text-ink dark:text-ink-dark hover:border-brand/50 hover:text-brand hover:shadow-xs'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-ink-muted'}`} strokeWidth={2} />
                <span>{pill.label}</span>
              </button>
            );
          })}

          {categories && categories.length > 0 && (
            <div className="flex items-center gap-1.5 pl-1 border-l border-border/80">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`shrink-0 h-9 px-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                  selectedCategory === 'all' || !selectedCategory
                    ? 'bg-brand/15 text-brand dark:text-brand-dark font-bold'
                    : 'text-ink-muted hover:text-ink dark:hover:text-ink-dark'
                }`}
              >
                All Sectors
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
          3. SPOTLIGHT DIRECTORY RESULTS
         ======================================================== */}
      <section aria-label="Spotlight Directory Listings" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand/10 dark:bg-brand-dark/15 flex items-center justify-center text-brand dark:text-brand-dark shadow-xs">
              <Award className="w-4.5 h-4.5" strokeWidth={2} />
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-ink dark:text-ink-dark tracking-tight">
              Featured Ventures
            </h2>
          </div>

          {filteredItems.length > 0 && (
            <span className="text-xs font-semibold text-ink-muted dark:text-ink-muted-dark px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-border/60">
              {filteredItems.length} Ventures
            </span>
          )}
        </div>

        {/* Empty State vs Populated Grid */}
        {filteredItems.length === 0 ? (
          <div className="p-10 sm:p-14 rounded-2xl sm:rounded-3xl bg-[#FFFFF0] dark:bg-surface-raised-dark border border-border dark:border-border-dark text-center flex flex-col items-center justify-center gap-5 shadow-sm hover:shadow-xl hover:border-brand/40 hover:-translate-y-1.5 transition-all duration-300 group">
            {/* Pure Borderless Icon Emblem */}
            <div className="relative flex items-center justify-center mb-1">
              <div className="absolute w-24 h-24 rounded-full bg-brand/10 dark:bg-brand-dark/15 blur-xl pointer-events-none group-hover:bg-brand/20 transition-all duration-300" />
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-brand/10 dark:bg-brand-dark/15 flex items-center justify-center text-brand dark:text-brand-dark group-hover:scale-110 transition-transform duration-300">
                <Store className="w-8 h-8 sm:w-10 sm:h-10 text-brand dark:text-brand-dark" strokeWidth={1.75} aria-hidden="true" />
              </div>
            </div>

            <div className="space-y-1.5 max-w-md">
              <h3 className="font-display font-bold text-lg sm:text-xl text-ink dark:text-ink-dark group-hover:text-brand transition-colors">
                No Spotlight Ventures Active
              </h3>
              <p className="text-sm text-ink-muted dark:text-ink-muted-dark leading-relaxed">
                There are currently no featured commercial listings for this category. Want top visibility? Book a Spotlight placement for &#8358;5,000, or list your venture in the directory for Free.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap justify-center">
              <Link
                href="/spotlight/new"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-brand hover:bg-brand-strong text-white text-xs sm:text-sm font-bold shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
              >
                <Award className="w-4 h-4 text-amber-300" strokeWidth={2.2} />
                <span>Book Spotlight • &#8358;5,000</span>
              </Link>
              <Link
                href="/submit?kind=business"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-border dark:border-border-dark hover:bg-black/5 dark:hover:bg-white/10 text-ink dark:text-ink-dark text-xs sm:text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>List Business (Free)</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item) => (
              <SpotlightCard key={item.id} item={item} variant={item.plan === 'featured' ? 'strip' : 'ranked'} />
            ))}
          </div>
        )}
      </section>

      {/* ========================================================
          4. MONETIZATION PROMO BANNER FOR ENTERPRISES
             - Enforces business rule: List Business is Free, Spotlight is ₦5,000
         ======================================================== */}
      <section
        aria-label="Spotlight Enterprise Promotion Banner"
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#7B2E10] via-[#8C3313] to-[#5C1D08] text-white p-6 sm:p-8 lg:p-10 shadow-lg border border-[#A8431F]/80 hover:shadow-2xl hover:border-[#E8B53D]/50 hover:-translate-y-1.5 transition-all duration-300 group"
      >
        <div
          className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-white/5 pointer-events-none blur-2xl"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-[#E8B53D]/10 pointer-events-none blur-3xl"
          aria-hidden="true"
        />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 flex flex-col gap-3.5">
            <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight">
              Promote Your Venture on Spotlight
            </h2>
            <p className="text-sm sm:text-base text-white/90 max-w-xl leading-relaxed">
              Listing your student business in the Campusly directory is 100% Free. Want top priority spotlight placement and verified reach across 12,000+ students? Feature on Spotlight for only &#8358;5,000.
            </p>

            <div className="pt-2 flex items-center gap-3 flex-wrap">
              <Link
                href="/spotlight/new"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E8B53D] hover:bg-[#F2A900] text-[#1F1C18] font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                <Award className="w-4 h-4 text-[#1F1C18]" strokeWidth={2.2} />
                <span>Book Spotlight • &#8358;5,000</span>
              </Link>

              <Link
                href="/submit?kind=business"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-sm transition-all duration-200 hover:scale-105 hover:border-white/50 active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>List Business for Free</span>
              </Link>
            </div>
          </div>

          <div className="hidden md:flex md:col-span-4 justify-end">
            <div className="relative w-44 h-44 lg:w-48 lg:h-48 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl shrink-0 group-hover:scale-105 group-hover:rotate-1 transition-all duration-300">
              <Image
                src="/business.jpg"
                alt="Student commerce preview"
                fill
                sizes="200px"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/25 pointer-events-none" />
              <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xs text-[11px] font-semibold text-white/95 text-center">
                List Free • Spotlight &#8358;5,000
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. REGULATORY TRANSPARENCY NOTICE
         ======================================================== */}
      <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200 shadow-2xs">
        <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold">Free Directory &amp; Paid Spotlight Notice: </strong>
          Listing a campus business in the directory is completely Free. Spotlight features verified commercial placements (&#8358;5,000) sponsored by student entrepreneurs and local campus ventures, vetted by GDGOC before publication.
        </div>
      </div>

      {/* ========================================================
          6. CAMPUS BUSINESSES SECTION (PLACED UNDER SPOTLIGHT SECTION)
         ======================================================== */}
      <div id="campus-businesses">
        <CampusBusinessCarousel />
      </div>

      {/* ========================================================
          6. ADVANCED FILTER MODAL
         ======================================================== */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-dropdown-intro">
          <div className="w-full max-w-md rounded-3xl bg-[#FFFFF0] dark:bg-surface-raised-dark border border-border dark:border-border-dark p-6 shadow-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-brand" />
                <h3 className="font-display font-bold text-lg text-ink dark:text-ink-dark">
                  Filter Spotlight Directory
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-ink-muted hover:text-ink dark:hover:text-ink-dark hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark">
                Venture Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SPOTLIGHT_FILTER_PILLS.map((tp) => (
                  <button
                    key={tp.key}
                    type="button"
                    onClick={() => setActivePill(tp.key)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all text-left ${
                      activePill === tp.key
                        ? 'bg-brand text-white shadow-xs font-bold'
                        : 'bg-black/5 dark:bg-white/5 text-ink dark:text-ink-dark hover:bg-black/10 dark:hover:bg-white/10'
                    }`}
                  >
                    <tp.icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{tp.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {categories && categories.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark">
                  Commercial Sector
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-surface-container dark:bg-canvas-dark border border-border dark:border-border-dark text-xs sm:text-sm font-semibold text-ink dark:text-ink-dark focus:outline-none focus:ring-2 focus:ring-brand"
                >
                  <option value="all">All Commercial Sectors</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center gap-3 pt-3 border-t border-border/80">
              <button
                type="button"
                onClick={resetFilters}
                className="flex-1 py-2.5 rounded-full border border-border dark:border-border-dark text-xs font-bold text-ink-muted hover:text-ink dark:hover:text-ink-dark transition-colors cursor-pointer"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="flex-1 py-2.5 rounded-full bg-brand hover:bg-brand-strong text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
