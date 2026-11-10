'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Briefcase,
  GraduationCap,
  Award,
  Trophy,
  Coins,
  Clock,
  SlidersHorizontal,
  Search,
  X,
  Filter,
  Check,
  PlusCircle,
  ArrowRight,
  Sparkles,
  Building2,
  Calendar,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { PublicListingSummary } from '@/lib/api/public-queries';
import { ListingCard } from '@/components/cards/listing-card';

export interface OpportunityCategoryItem {
  id: string;
  slug: string;
  name: string;
  icon_key?: string;
}

interface OpportunitiesClientViewProps {
  initialOpportunities: PublicListingSummary[];
  categories: OpportunityCategoryItem[];
  initialType?: string;
  initialCategory?: string;
  initialClosingSoon?: boolean;
  nextCursor?: string | null;
}

// Quick filter pills for opportunity types
const OPPORTUNITY_TYPE_PILLS = [
  { key: 'all', label: 'All Opportunities', icon: Briefcase },
  { key: 'internship', label: 'Internships & SIWES', icon: GraduationCap },
  { key: 'scholarship', label: 'Scholarships', icon: Award },
  { key: 'competition', label: 'Competitions & Hackathons', icon: Trophy },
  { key: 'grant', label: 'Grants & Fellowships', icon: Coins },
];

export function OpportunitiesClientView({
  initialOpportunities,
  categories,
  initialType = 'all',
  initialCategory = '',
  initialClosingSoon = false,
  nextCursor,
}: OpportunitiesClientViewProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeType, setActiveType] = React.useState(initialType);
  const [selectedCategory, setSelectedCategory] = React.useState(initialCategory);
  const [closingSoonOnly, setClosingSoonOnly] = React.useState(initialClosingSoon);
  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState(false);

  // Client-side instant filter and search
  const filteredOpportunities = React.useMemo(() => {
    let list = [...initialOpportunities];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (opp) =>
          opp.title.toLowerCase().includes(q) ||
          opp.summary.toLowerCase().includes(q) ||
          (opp.category?.name && opp.category.name.toLowerCase().includes(q))
      );
    }

    // Opportunity type filter
    if (activeType && activeType !== 'all') {
      list = list.filter((opp) => {
        const anyOpp = opp as any;
        const typeStr = (anyOpp.opportunity_type || anyOpp.type || '').toLowerCase();
        return typeStr.includes(activeType.toLowerCase());
      });
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      list = list.filter(
        (opp) =>
          opp.category?.slug === selectedCategory ||
          opp.category?.id === selectedCategory
      );
    }

    // Closing soon filter (within 7 days)
    if (closingSoonOnly) {
      const now = new Date().getTime();
      const sevenDaysLater = now + 7 * 24 * 60 * 60 * 1000;
      list = list.filter((opp) => {
        const anyOpp = opp as any;
        if (!anyOpp.deadline_at) return false;
        const deadline = new Date(anyOpp.deadline_at).getTime();
        return deadline >= now && deadline <= sevenDaysLater;
      });
    }

    return list;
  }, [initialOpportunities, searchQuery, activeType, selectedCategory, closingSoonOnly]);

  const activeFiltersCount =
    (activeType !== 'all' ? 1 : 0) +
    (selectedCategory && selectedCategory !== 'all' ? 1 : 0) +
    (closingSoonOnly ? 1 : 0);

  const resetFilters = () => {
    setActiveType('all');
    setSelectedCategory('all');
    setClosingSoonOnly(false);
    setSearchQuery('');
    setIsFilterModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-6 sm:gap-8">
      {/* ========================================================
          1. HERO SHOWCASE BANNER
             - Spacious visual background (opportunities.jpg)
             - Text anchored at the TOP
             - Small action buttons positioned at the BOTTOM
             - No overhead badges
         ======================================================== */}
      <section
        aria-label="Opportunities Hero Showcase"
        className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-black/20 dark:border-white/10 shadow-xl min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] flex flex-col justify-between bg-black group transition-all duration-300 hover:shadow-2xl hover:border-brand/40"
      >
        {/* Full Background Hero Video ('opportunities_hero_video.mp4' from public directory) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out"
        >
          <source src="/opportunities_hero_video.mp4" type="video/mp4" />
        </video>

        {/* Cinematic Lightweight Contrast Overlays */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/60 pointer-events-none" />

        {/* Top Text Content (Spacious, bold, professional typography) */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-14 flex flex-col gap-3.5 sm:gap-4 max-w-xl text-white">
          <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-[1.2] drop-shadow-md">
            Scholarships, Internships &amp; Student Grants
          </h1>

          <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-md drop-shadow-sm font-normal">
            Discover verified industrial attachments, international scholarships, undergraduate research grants, and global competitions for Ahmadu Bello University students.
          </p>
        </div>

        {/* Bottom Small Action Buttons with Rich Hover Effects */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-14 pt-0 sm:pt-0 lg:pt-0 flex items-center gap-2.5 flex-wrap">
          <a
            href="#opportunities-directory"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-4.5 sm:py-2 rounded-full bg-brand hover:bg-brand-strong text-white font-semibold text-xs tracking-wide shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
          >
            <Search className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Browse Opportunities</span>
          </a>

          <Link
            href="/submit"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-4.5 sm:py-2 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-semibold text-xs tracking-wide shadow-sm transition-all duration-200 hover:scale-105 hover:border-white/50 active:scale-95 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <PlusCircle className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Submit an Opportunity</span>
          </Link>
        </div>
      </section>

      {/* ========================================================
          2. SEARCH & INTERACTIVE FILTER CONTROLS BAR
         ======================================================== */}
      <section
        id="opportunities-directory"
        aria-label="Opportunities Search and Filters"
        className="flex flex-col gap-3.5 w-full"
      >
        {/* Search Input Bar + Filter Trigger Button */}
        <div className="flex items-center gap-2.5 sm:gap-3 w-full">
          <div className="relative flex-1 group">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role, company, institution, or field of study..."
              aria-label="Search opportunities"
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

          {/* Filter Modal Trigger with Active Indicator */}
          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            aria-label="Open opportunity filters"
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

        {/* Horizontal Opportunity Type Pills Strip + Closing Soon Toggle */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none scroll-smooth">
          {/* Opportunity Type Pills */}
          {OPPORTUNITY_TYPE_PILLS.map((pill) => {
            const Icon = pill.icon;
            const isActive = activeType === pill.key;
            return (
              <button
                key={pill.key}
                type="button"
                onClick={() => setActiveType(pill.key)}
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

          {/* Closing Soon Toggle */}
          <button
            type="button"
            onClick={() => setClosingSoonOnly((prev) => !prev)}
            className={`shrink-0 h-9 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
              closingSoonOnly
                ? 'bg-amber-600 text-white shadow-xs hover:bg-amber-700 hover:shadow-md'
                : 'bg-[#FFFFF0] dark:bg-surface-raised-dark border border-border dark:border-border-dark text-ink dark:text-ink-dark hover:border-brand/50 hover:text-brand hover:shadow-xs'
            }`}
          >
            <Clock className={`w-3.5 h-3.5 ${closingSoonOnly ? 'text-white' : 'text-ink-muted'}`} strokeWidth={2} />
            <span>Closing Soon</span>
            {closingSoonOnly && <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />}
          </button>

          {/* Categories Quick Filter Pills */}
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
                All Fields
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
          3. CURATED PROMO BANNER FOR OPPORTUNITIES
             (Like the reference on Explore page)
         ======================================================== */}
      <section
        aria-label="Opportunity Submission Banner"
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
              Recruit Top Campus Talent &amp; Scholars
            </h2>
            <p className="text-sm sm:text-base text-white/90 max-w-xl leading-relaxed">
              Are you an organization, tech firm, research institute, or alumni foundation? Post your internship, fellowship, or student grant to reach students across Samaru &amp; Kongo campuses.
            </p>

            <div className="pt-2">
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E8B53D] hover:bg-[#F2A900] text-[#1F1C18] font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                <PlusCircle className="w-4 h-4 text-[#1F1C18]" strokeWidth={2.2} />
                <span>Post an Opportunity</span>
              </Link>
            </div>
          </div>

          <div className="hidden md:flex md:col-span-4 justify-end">
            <div className="relative w-44 h-44 lg:w-48 lg:h-48 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl shrink-0 group-hover:scale-105 group-hover:rotate-1 transition-all duration-300">
              <Image
                src="/opportunities.jpg"
                alt="Student career opportunities preview"
                fill
                sizes="200px"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/25 pointer-events-none" />
              <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xs text-[11px] font-semibold text-white/95 text-center">
                100% Student-Verified
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. OPPORTUNITIES DIRECTORY LISTING
         ======================================================== */}
      <section aria-label="Opportunities Directory Results" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Refined Borderless Icon Emblem */}
            <div className="w-8 h-8 rounded-xl bg-brand/10 dark:bg-brand-dark/15 flex items-center justify-center text-brand dark:text-brand-dark shadow-xs">
              <Briefcase className="w-4.5 h-4.5" strokeWidth={2} />
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-ink dark:text-ink-dark tracking-tight">
              Available Listings
            </h2>
          </div>

          {filteredOpportunities.length > 0 && (
            <span className="text-xs font-semibold text-ink-muted dark:text-ink-muted-dark px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-border/60">
              {filteredOpportunities.length} Opportunities
            </span>
          )}
        </div>

        {/* Empty State vs. Populated Grid */}
        {filteredOpportunities.length === 0 ? (
          /* AESTHETIC REFINED BORDERLESS EMPTY STATE */
          <div className="p-10 sm:p-14 rounded-2xl sm:rounded-3xl bg-[#FFFFF0] dark:bg-surface-raised-dark border border-border dark:border-border-dark text-center flex flex-col items-center justify-center gap-5 shadow-sm hover:shadow-xl hover:border-brand/40 hover:-translate-y-1.5 transition-all duration-300 group">
            {/* Pure Borderless Icon Emblem */}
            <div className="relative flex items-center justify-center mb-1">
              <div className="absolute w-24 h-24 rounded-full bg-brand/10 dark:bg-brand-dark/15 blur-xl pointer-events-none group-hover:bg-brand/20 transition-all duration-300" />
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-brand/10 dark:bg-brand-dark/15 flex items-center justify-center text-brand dark:text-brand-dark group-hover:scale-110 transition-transform duration-300">
                <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 text-brand dark:text-brand-dark" strokeWidth={1.75} aria-hidden="true" />
              </div>
            </div>

            <div className="space-y-1.5 max-w-md">
              <h3 className="font-display font-bold text-lg sm:text-xl text-ink dark:text-ink-dark group-hover:text-brand transition-colors">
                No Opportunities Listed Yet
              </h3>
              <p className="text-sm text-ink-muted dark:text-ink-muted-dark leading-relaxed">
                There are currently no active listings for this filter. Run an academic foundation, tech venture, or scholarship program? Submit your opportunity to connect with campus talent.
              </p>
            </div>

            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand hover:bg-brand-strong text-white text-xs sm:text-sm font-bold shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
            >
              <span>Submit an Opportunity</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : (
          /* POPULATED OPPORTUNITIES GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOpportunities.map((opp) => (
              <ListingCard key={opp.id} listing={opp} />
            ))}
          </div>
        )}
      </section>

      {/* ========================================================
          5. ADVANCED FILTER MODAL
         ======================================================== */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-dropdown-intro">
          <div className="w-full max-w-md rounded-3xl bg-[#FFFFF0] dark:bg-surface-raised-dark border border-border dark:border-border-dark p-6 shadow-2xl flex flex-col gap-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-brand" />
                <h3 className="font-display font-bold text-lg text-ink dark:text-ink-dark">
                  Filter Opportunities
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

            {/* Filter Section 1: Opportunity Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark">
                Opportunity Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {OPPORTUNITY_TYPE_PILLS.map((tp) => (
                  <button
                    key={tp.key}
                    type="button"
                    onClick={() => setActiveType(tp.key)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all text-left ${
                      activeType === tp.key
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

            {/* Filter Section 2: Deadline Urgency */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark">
                Application Deadline
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setClosingSoonOnly(false)}
                  className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    !closingSoonOnly
                      ? 'bg-brand text-white shadow-xs font-bold'
                      : 'bg-black/5 dark:bg-white/5 text-ink dark:text-ink-dark hover:bg-black/10'
                  }`}
                >
                  All Active
                </button>
                <button
                  type="button"
                  onClick={() => setClosingSoonOnly(true)}
                  className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    closingSoonOnly
                      ? 'bg-amber-600 text-white shadow-xs font-bold'
                      : 'bg-black/5 dark:bg-white/5 text-ink dark:text-ink-dark hover:bg-black/10'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Closing Soon (7d)</span>
                </button>
              </div>
            </div>

            {/* Filter Section 3: Categories */}
            {categories && categories.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark">
                  Academic Field / Discipline
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-surface-container dark:bg-canvas-dark border border-border dark:border-border-dark text-xs sm:text-sm font-semibold text-ink dark:text-ink-dark focus:outline-none focus:ring-2 focus:ring-brand"
                >
                  <option value="all">All Fields &amp; Disciplines</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Modal Actions */}
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
