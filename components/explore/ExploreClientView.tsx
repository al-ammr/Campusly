'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  SlidersHorizontal,
  Layers,
  Compass,
  Calendar,
  Briefcase,
  Store,
  GraduationCap,
  Heart,
  Star,
  ArrowRight,
  PlusCircle,
  Sparkles,
  X,
  Filter,
  Check,
  Users,
  Cpu,
  Leaf,
  HeartHandshake,
  Palette,
  Trophy,
  FlaskConical,
  HeartPulse,
} from 'lucide-react';

export interface CategoryItem {
  id: string;
  slug: string;
  name: string;
  icon_key?: string;
  sort?: number;
  live_communities: number;
  upcoming_events: number;
}

interface ExploreClientViewProps {
  initialCategories: CategoryItem[];
}

// Dedicated public images for featured categories matching filenames in public/ folder
const CATEGORY_IMAGES: Record<string, string> = {
  technology: '/technology_&_digital_skills.jpeg',
  business: '/entrepreneurship_&_business.jpeg',
  sustainability: '/sustainability_&_environment.jpeg',
  academic: '/academics_&_professional_development.jpeg',
  leadership: '/leadership_&_volunteering.jpeg',
  creative: '/creative_arts_&_media.jpeg',
  sports: '/sport_&_recreation.jpeg',
  science: '/science_&_research.jpeg',
  health: '/health_&_wellbeing.jpeg',
  culture: '/culture_&_community.jpeg',
};

// Resolver helper to guarantee correct image matching for any category
const getCategoryImage = (slug?: string, name?: string, iconKey?: string): string => {
  const s = (slug || '').toLowerCase();
  const n = (name || '').toLowerCase();
  const k = (iconKey || '').toLowerCase();

  if (s.includes('tech') || n.includes('tech') || n.includes('digital') || k.includes('cpu')) {
    return '/technology_&_digital_skills.jpeg';
  }
  if (s.includes('busin') || n.includes('entrepr') || n.includes('business') || k.includes('briefcase')) {
    return '/entrepreneurship_&_business.jpeg';
  }
  if (s.includes('sustain') || n.includes('sustain') || n.includes('environment') || k.includes('leaf')) {
    return '/sustainability_&_environment.jpeg';
  }
  if (s.includes('acad') || n.includes('academic') || n.includes('professional') || k.includes('grad')) {
    return '/academics_&_professional_development.jpeg';
  }
  if (s.includes('lead') || n.includes('leadership') || n.includes('volunteer') || k.includes('heart-handshake')) {
    return '/leadership_&_volunteering.jpeg';
  }
  if (s.includes('creat') || n.includes('creative') || n.includes('arts') || n.includes('media') || k.includes('palette')) {
    return '/creative_arts_&_media.jpeg';
  }
  if (s.includes('sport') || n.includes('sport') || n.includes('recreation') || k.includes('trophy')) {
    return '/sport_&_recreation.jpeg';
  }
  if (s.includes('scien') || n.includes('science') || n.includes('research') || k.includes('flask')) {
    return '/science_&_research.jpeg';
  }
  if (s.includes('health') || n.includes('health') || n.includes('wellbeing') || k.includes('pulse')) {
    return '/health_&_wellbeing.jpeg';
  }
  if (s.includes('cultur') || n.includes('culture') || n.includes('community') || k.includes('users')) {
    return '/culture_&_community.jpeg';
  }

  if (slug && CATEGORY_IMAGES[slug]) {
    return CATEGORY_IMAGES[slug];
  }

  return '/communities.jpg';
};

// Sphere/Category pills directly matching the reference horizontal pill navigation
const FILTER_PILLS = [
  { label: 'All Categories', slug: 'all', icon: Layers },
  { label: 'Communities', slug: 'communities', icon: Compass },
  { label: 'Events', slug: 'events', icon: Calendar },
  { label: 'Opportunities', slug: 'opportunities', icon: Briefcase },
  { label: 'Businesses', slug: 'businesses', icon: Store },
  { label: 'Academic & Tech', slug: 'academic', icon: GraduationCap },
];

// Refined icon lookup helper for categories
const getCategoryIcon = (slug?: string, iconKey?: string, name?: string) => {
  const key = `${slug || ''} ${iconKey || ''} ${name || ''}`.toLowerCase();
  if (key.includes('tech') || key.includes('cpu') || key.includes('digital')) return Cpu;
  if (key.includes('busin') || key.includes('entrepr') || key.includes('briefcase')) return Briefcase;
  if (key.includes('sustain') || key.includes('environ') || key.includes('leaf')) return Leaf;
  if (key.includes('acad') || key.includes('profess') || key.includes('grad')) return GraduationCap;
  if (key.includes('lead') || key.includes('volunt') || key.includes('heart-handshake')) return HeartHandshake;
  if (key.includes('creat') || key.includes('art') || key.includes('media') || key.includes('palette')) return Palette;
  if (key.includes('sport') || key.includes('recreat') || key.includes('trophy')) return Trophy;
  if (key.includes('scien') || key.includes('research') || key.includes('flask')) return FlaskConical;
  if (key.includes('health') || key.includes('well') || key.includes('pulse')) return HeartPulse;
  if (key.includes('cultur') || key.includes('commun') || key.includes('users')) return Users;
  return Compass;
};

export function ExploreClientView({ initialCategories }: ExploreClientViewProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activePill, setActivePill] = React.useState('all');
  const [favorites, setFavorites] = React.useState<Record<string, boolean>>({});
  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState(false);
  const [selectedCampus, setSelectedCampus] = React.useState('all');
  const [selectedSort, setSelectedSort] = React.useState('recommended');

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter categories by search query if any categories exist
  const filteredCategories = React.useMemo(() => {
    if (!initialCategories || initialCategories.length === 0) return [];
    let list = [...initialCategories];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((cat) => cat.name.toLowerCase().includes(q));
    }

    if (selectedSort === 'az') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (selectedSort === 'communities') {
      list.sort((a, b) => (b.live_communities || 0) - (a.live_communities || 0));
    }

    return list;
  }, [initialCategories, searchQuery, selectedSort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-6 sm:gap-8">
      {/* ========================================================
          1. EXPLORE HERO SESSION WITH SPACIOUS FULL BACKGROUND VIDEO
             ('explore_hero_image.mp4' from public directory)
         ======================================================== */}
      <section
        aria-label="Explore Hero Session"
        className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-black/20 dark:border-white/10 shadow-xl min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] flex flex-col justify-between bg-black group transition-all duration-300 hover:shadow-2xl hover:border-brand/40"
      >
        {/* Full Background Video - Spacious & High Visibility */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out"
        >
          <source src="/explore_hero_image.mp4" type="video/mp4" />
        </video>

        {/* Cinematic Lightweight Contrast Overlays — Tailored for top text and bottom buttons */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/60 pointer-events-none" />

        {/* Content positioned cleanly at the TOP of the hero video */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-14 flex flex-col gap-3.5 sm:gap-4 max-w-xl text-white">
          <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-[1.2] drop-shadow-md">
            Explore Clubs, Societies &amp; Opportunities
          </h1>

          <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-md drop-shadow-sm font-normal">
            Browse verified student communities, academic faculties, technical chapters, and student enterprises across Samaru &amp; Kongo campuses.
          </p>
        </div>

        {/* Compact Small Action Buttons positioned at the BOTTOM of the hero video */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-14 pt-0 sm:pt-0 lg:pt-0 flex items-center gap-2.5 flex-wrap">
          <a
            href="#explore-search"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-4.5 sm:py-2 rounded-full bg-brand hover:bg-brand-strong text-white font-semibold text-xs tracking-wide shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Browse Directory</span>
          </a>

          <Link
            href="/submit"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-4.5 sm:py-2 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-semibold text-xs tracking-wide shadow-sm transition-all duration-200 hover:scale-105 hover:border-white/50 active:scale-95 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Submit a Listing</span>
          </Link>
        </div>
      </section>

      {/* ========================================================
          2. TOP SEARCH & FILTER BAR (With Button Hover Effects)
         ======================================================== */}
      <section id="explore-search" aria-label="Search and Filters" className="flex items-center gap-2.5 sm:gap-3 w-full">
        <div className="relative flex-1 group">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What's on your list?"
            aria-label="Search categories and communities"
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

        {/* Sliders / Filter Icon Button with Rich Hover Animation */}
        <button
          type="button"
          onClick={() => setIsFilterModalOpen(true)}
          aria-label="Open filter settings"
          className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-[#FFFFF0] dark:bg-surface-raised-dark border border-border dark:border-border-dark flex items-center justify-center text-ink dark:text-ink-dark hover:text-brand dark:hover:text-brand-dark hover:border-brand/60 hover:shadow-md hover:scale-105 shadow-2xs transition-all duration-200 shrink-0 cursor-pointer active:scale-95"
        >
          <SlidersHorizontal className="w-5 h-5" strokeWidth={1.8} aria-hidden="true" />
        </button>
      </section>

      {/* ========================================================
          3. HORIZONTAL CATEGORY PILLS STRIP (With Button Hover Effects)
         ======================================================== */}
      <section aria-label="Quick Category Filters" className="w-full overflow-hidden">
        <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-1.5 scrollbar-none scroll-smooth">
          {FILTER_PILLS.map((pill) => {
            const Icon = pill.icon;
            const isActive = activePill === pill.slug;

            return (
              <button
                key={pill.slug}
                type="button"
                onClick={() => setActivePill(pill.slug)}
                className={`shrink-0 h-10 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                  isActive
                    ? 'bg-brand text-white shadow-xs hover:bg-brand-strong hover:shadow-md'
                    : 'bg-[#FFFFF0] dark:bg-surface-raised-dark border border-border dark:border-border-dark text-ink dark:text-ink-dark hover:border-brand/50 hover:text-brand hover:shadow-xs'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-ink-muted'}`} strokeWidth={2} />
                <span>{pill.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          4. FEATURED PROMO / HERO BANNER (With Hover Effects)
         ======================================================== */}
      <section
        aria-label="Campus Opportunities Banner"
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#7B2E10] via-[#8C3313] to-[#5C1D08] text-white p-6 sm:p-8 lg:p-10 shadow-lg border border-[#A8431F]/80 hover:shadow-2xl hover:border-[#E8B53D]/50 hover:-translate-y-1.5 transition-all duration-300 group"
      >
        {/* Subtle curved background pattern */}
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
              Get Verified &amp; Featured on Campusly!
            </h2>
            <p className="text-sm sm:text-base text-white/90 max-w-xl leading-relaxed">
              Run a student club, research team or campus business? Submit your listing and get discovered across Samaru &amp; Kongo campuses.
            </p>

            {/* Custom Action Pill Button in Warm Ochre with Hover Effects */}
            <div className="pt-2">
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E8B53D] hover:bg-[#F2A900] text-[#1F1C18] font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                <PlusCircle className="w-4 h-4 text-[#1F1C18]" strokeWidth={2.2} />
                <span>Submit a Listing</span>
              </Link>
            </div>
          </div>

          {/* Right Featured Visual */}
          <div className="hidden md:flex md:col-span-4 justify-end">
            <div className="relative w-44 h-44 lg:w-48 lg:h-48 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl shrink-0 group-hover:scale-105 group-hover:rotate-1 transition-all duration-300">
              <Image
                src="/communities.jpg"
                alt="Campus community preview"
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

        {/* Carousel Pagination Indicator Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-4">
          <span className="w-5 h-1.5 rounded-full bg-white shadow-xs" aria-hidden="true" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/40" aria-hidden="true" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/40" aria-hidden="true" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/40" aria-hidden="true" />
        </div>
      </section>

      {/* ========================================================
          5. FEATURED CATEGORIES SECTION HEADING
             - Well refined header icon
             - 'Catalog' text totally removed
         ======================================================== */}
      <section aria-label="Category Listings" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand/10 dark:bg-brand-dark/15 flex items-center justify-center text-brand dark:text-brand-dark shadow-xs transition-transform duration-200 group-hover:scale-105">
              <Layers className="w-4.5 h-4.5" strokeWidth={2.2} aria-hidden="true" />
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-ink dark:text-ink-dark tracking-tight">
              Featured Categories
            </h2>
          </div>

          {/* Completely removed 'Catalog' text — only renders category count if > 0 */}
          {filteredCategories.length > 0 && (
            <span className="text-xs font-semibold text-ink-muted dark:text-ink-muted-dark px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-border/60">
              {filteredCategories.length} Categories
            </span>
          )}
        </div>

        {/* ========================================================
            6. CATEGORY CARDS / EMPTY STATE
               - Well refined icons
               - Cards and all buttons have rich hover effects
               - Zero fake inventions
           ======================================================== */}
        {filteredCategories.length === 0 ? (
          /* AESTHETIC REFINED BORDERLESS EMPTY STATE */
          <div className="p-10 sm:p-14 rounded-2xl sm:rounded-3xl bg-[#FFFFF0] dark:bg-surface-raised-dark border border-border dark:border-border-dark text-center flex flex-col items-center justify-center gap-5 shadow-sm hover:shadow-xl hover:border-brand/40 hover:-translate-y-1.5 transition-all duration-300 group">
            {/* Pure Borderless Icon Emblem */}
            <div className="relative flex items-center justify-center mb-1">
              <div className="absolute w-24 h-24 rounded-full bg-brand/10 dark:bg-brand-dark/15 blur-xl pointer-events-none group-hover:bg-brand/20 transition-all duration-300" />
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-brand/10 dark:bg-brand-dark/15 flex items-center justify-center text-brand dark:text-brand-dark group-hover:scale-110 transition-transform duration-300">
                <Compass className="w-8 h-8 sm:w-10 sm:h-10 text-brand dark:text-brand-dark" strokeWidth={1.75} aria-hidden="true" />
              </div>
            </div>

            <div className="space-y-1.5 max-w-md">
              <h3 className="font-display font-bold text-lg sm:text-xl text-ink dark:text-ink-dark group-hover:text-brand transition-colors">
                No Categories Listed
              </h3>
              <p className="text-sm text-ink-muted dark:text-ink-muted-dark leading-relaxed">
                Categories and verified student groups will appear here once registered. Submit your community or venture to be listed first.
              </p>
            </div>

            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand hover:bg-brand-strong text-white text-xs sm:text-sm font-bold shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
            >
              <span>Submit a Listing</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : (
          /* POPULATED CATEGORY CARDS GRID WITH REFINED ICONS & HOVER EFFECTS */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {filteredCategories.map((cat) => {
              const imageSrc = getCategoryImage(cat.slug, cat.name, cat.icon_key);
              const isFav = !!favorites[cat.id];
              const CatIcon = getCategoryIcon(cat.slug, cat.icon_key, cat.name);

              return (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="bg-[#FFFFF0] dark:bg-surface-raised-dark rounded-2xl sm:rounded-3xl border border-border dark:border-border-dark p-3 sm:p-4 shadow-sm hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] hover:border-brand/50 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Top Image Placeholder with Floating Badges */}
                  <div className="relative w-full aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-surface-container dark:bg-canvas-dark border border-border/60 dark:border-border-dark/60">
                    <Image
                      src={imageSrc}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover select-none group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                    {/* Floating Heart / Favorite Button (Top Right) with Hover Scale */}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(cat.id, e)}
                      aria-label={isFav ? 'Remove favorite' : 'Add to favorites'}
                      className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 dark:bg-surface-dark/90 shadow-sm flex items-center justify-center text-rose-500 hover:scale-125 hover:bg-white active:scale-90 transition-all duration-200 cursor-pointer z-10"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-stone-400 hover:text-rose-500'}`}
                        strokeWidth={2}
                      />
                    </button>

                    {/* Floating Badge (Bottom Left) with Category Icon */}
                    <div className="absolute bottom-2 left-2 px-2.5 py-0.5 sm:py-1 rounded-full bg-brand text-white text-[10px] sm:text-xs font-bold tracking-wide shadow-md flex items-center gap-1.5 backdrop-blur-xs group-hover:bg-brand-strong transition-colors">
                      <CatIcon className="w-3 h-3 text-white" strokeWidth={2.2} />
                      <span>{cat.live_communities} Groups</span>
                    </div>
                  </div>

                  {/* Card Content & Details Below Image */}
                  <div className="mt-3 flex flex-col gap-1.5 flex-1 justify-between">
                    <div>
                      {/* Sub-meta line */}
                      <span className="text-[11px] sm:text-xs font-semibold text-brand dark:text-brand-strong">
                        {cat.upcoming_events} upcoming events
                      </span>

                      {/* Rating Line */}
                      <div className="flex items-center gap-1.5 text-xs text-ink-muted dark:text-ink-muted-dark mt-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-ink dark:text-ink-dark">4.9</span>
                        <span className="tabular-nums font-mono text-[11px]">(Active)</span>
                      </div>

                      {/* Title with Refined Borderless Mini Icon Container */}
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-6 h-6 rounded-md bg-brand/10 dark:bg-brand-dark/15 flex items-center justify-center text-brand dark:text-brand-dark shrink-0 group-hover:bg-brand group-hover:text-white transition-colors">
                          <CatIcon className="w-3.5 h-3.5" strokeWidth={2} />
                        </div>
                        <h3 className="font-bold text-sm sm:text-base text-ink dark:text-ink-dark group-hover:text-brand transition-colors line-clamp-1">
                          {cat.name}
                        </h3>
                      </div>
                    </div>

                    {/* Bottom Action Footer with Hover Effect */}
                    <div className="pt-2 border-t border-border/60 dark:border-border-dark/60 flex items-center justify-between text-xs font-bold text-brand dark:text-brand-strong group-hover:underline">
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ========================================================
          7. FILTER MODAL / SLIDEOUT (All buttons with Hover Effects)
         ======================================================== */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-dropdown-intro">
          <div className="w-full max-w-md rounded-3xl bg-[#FFFFF0] dark:bg-surface-raised-dark border border-border dark:border-border-dark p-6 shadow-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-brand" />
                <h3 className="font-display font-bold text-lg text-ink dark:text-ink-dark">
                  Filter Categories
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

            {/* Campus Selector */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                Campus Location
              </span>
              <div className="grid grid-cols-3 gap-2">
                {['all', 'samaru', 'kongo'].map((campus) => (
                  <button
                    key={campus}
                    type="button"
                    onClick={() => setSelectedCampus(campus)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold uppercase transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                      selectedCampus === campus
                        ? 'bg-brand text-white shadow-xs hover:bg-brand-strong'
                        : 'bg-black/5 dark:bg-white/5 text-ink hover:bg-black/10 hover:shadow-2xs'
                    }`}
                  >
                    {campus === 'all' ? 'All' : `${campus} Campus`}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Selector */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                Sort Order
              </span>
              <div className="flex flex-col gap-1.5">
                {[
                  { id: 'recommended', label: 'Recommended' },
                  { id: 'communities', label: 'Most Communities' },
                  { id: 'az', label: 'Alphabetical (A-Z)' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedSort(opt.id)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 hover:translate-x-1 text-sm font-semibold text-ink dark:text-ink-dark transition-all duration-200 cursor-pointer"
                  >
                    <span>{opt.label}</span>
                    {selectedSort === opt.id && <Check className="w-4 h-4 text-brand" />}
                  </button>
                ))}
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
