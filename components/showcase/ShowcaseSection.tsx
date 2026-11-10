'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ShowcaseBundle,
  ShowcaseGalleryItem,
} from '@/lib/showcase/types';
import { SlidingGallery } from './SlidingGallery';
import { TopBusinessesRanking } from './TopBusinessesRanking';
import {
  Layers,
  Users,
  CalendarDays,
  GraduationCap,
  Store,
  ArrowRight,
  BadgeCheck,
  ShieldCheck,
  Zap,
  Activity,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

// Upgraded Aesthetic Icons Map for Categories
const ICON_MAP: Record<string, React.ElementType> = {
  Grid: Layers,
  Layers,
  Users,
  Calendar: CalendarDays,
  CalendarDays,
  Briefcase: GraduationCap,
  GraduationCap,
  Store,
  BadgeCheck,
  Zap,
  Activity,
  Sparkles,
};

interface ShowcaseSectionProps {
  bundle: ShowcaseBundle;
}

export function ShowcaseSection({ bundle }: ShowcaseSectionProps) {
  const { categories, intro, gallery, cta, topBusinesses } = bundle;

  // Track active category and active gallery slide for synchronized dynamic CTA
  const [activeCategoryId, setActiveCategoryId] = React.useState<string>(
    categories[4]?.id || categories[0]?.id || 'cat-businesses'
  );

  // Active slide category tag from the auto-sliding gallery
  const [activeSlideTag, setActiveSlideTag] = React.useState<string>(
    gallery[0]?.categoryTag || 'communities'
  );

  const activeCategory = React.useMemo(() => {
    return categories.find((c) => c.id === activeCategoryId) || categories[0];
  }, [categories, activeCategoryId]);

  const isBusinessesActive =
    activeCategory?.slug === 'businesses' || activeCategoryId === 'cat-businesses';

  // Dynamic Explore button label and href that changes depending on what is being showcased
  const currentTag = activeSlideTag || activeCategory?.slug || 'categories';
  const dynamicExploreLink = React.useMemo(() => {
    switch (currentTag) {
      case 'communities':
        return '/communities';
      case 'events':
        return '/events';
      case 'opportunities':
        return '/opportunities';
      case 'businesses':
        return '/businesses';
      case 'categories':
      default:
        return '/categories';
    }
  }, [currentTag]);

  const dynamicExploreLabel = React.useMemo(() => {
    switch (currentTag) {
      case 'communities':
        return 'Explore Communities →';
      case 'events':
        return 'Explore Events →';
      case 'opportunities':
        return 'Explore Opportunities →';
      case 'businesses':
        return 'Explore Businesses →';
      case 'categories':
      default:
        return 'Explore Categories →';
    }
  }, [currentTag]);

  const handleSlideChange = React.useCallback((item: ShowcaseGalleryItem) => {
    if (item?.categoryTag) {
      setActiveSlideTag((prev) => (prev === item.categoryTag ? prev : item.categoryTag));
    }
  }, []);

  // Exact writeup from user specifications
  const userIntroTitle = 'Find Your Place at ABU Zaria';
  const userIntroBody =
    'Every club, event, workshop, research opportunity and student business on campus, gathered in one place. Whether you are in Samaru or Kongo, open the site and start browsing straight away. There is no account to create and no login to remember. Everything you see has been checked by the GDGOC team first, so you know it is real. It is simply a clear list of what is happening on campus, made for students who want to get involved.';

  return (
    <section
      aria-label="Campus Exploration Showcase"
      className="animate-dropdown-intro max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col gap-8 sm:gap-10"
    >
      {/* ========================================================
          1. CATEGORY CARDS — Header Center Aligned (IMAGE 3)
         ======================================================== */}
      <div className="rounded-lg bg-[#7B2E10] border border-[#A8431F]/90 p-6 sm:p-8 lg:p-10 shadow-md flex flex-col gap-6 text-white">
        {/* Center-aligned Section Title & Subtitle */}
        <div className="text-center mx-auto max-w-2xl space-y-2">
          <h2 className="text-h2 font-bold text-white tracking-tight">
            Explore Campusly
          </h2>
          <p className="text-body-sm font-normal text-white/95 leading-relaxed">
            Jump into any section to preview it, see live campus media, and open the full page.
          </p>
        </div>

        {/* 5 Highly Interactive 3D Off-white Cards with Black Splash Accents & Hover Glow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 items-stretch">
          {categories.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || Layers;
            const isSelected = cat.id === activeCategoryId;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategoryId(cat.id);
                  setActiveSlideTag(cat.slug);
                }}
                className={`relative group flex flex-col justify-between p-5 rounded-xl border-2 text-left cursor-pointer transform-gpu transition-all duration-300 ease-out overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${
                  isSelected
                    ? 'bg-[#FFFFF0] ring-2 ring-[#FFFFF0] ring-offset-2 ring-offset-[#7B2E10] border-[#FFFFF0] shadow-[0_20px_40px_-5px_rgba(0,0,0,0.45),0_0_28px_rgba(255,255,240,0.45)] -translate-y-2'
                    : 'bg-[#FFFFF0] hover:bg-[#FFFFF0] border-[#E8DFD5] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.25),0_8px_10px_-6px_rgba(0,0,0,0.15)] hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_35px_-8px_rgba(0,0,0,0.4),0_0_24px_rgba(255,138,76,0.35)]'
                }`}
                aria-pressed={isSelected}
              >
                {/* Black Ink Splash Accent in background corner */}
                <div
                  className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-gradient-to-br from-black/10 to-transparent pointer-events-none blur-sm"
                  aria-hidden="true"
                />

                <div className="space-y-3 w-full relative z-10">
                  {/* Top: Black Splash Icon Box + Black Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-300 shadow-md ${
                        isSelected
                          ? 'bg-[#7B2E10] text-white shadow-sm ring-1 ring-[#A8431F]'
                          : 'bg-[#16120F] text-white border border-black/30 group-hover:bg-[#7B2E10] group-hover:scale-105'
                      }`}
                    >
                      <Icon className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />
                    </div>

                    {cat.badge && (
                      <span className="text-caption font-mono font-semibold tracking-wider px-2.5 py-0.5 rounded-sm bg-[#16120F] text-white shadow-xs">
                        {cat.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-h3 font-bold text-[#1F1C18] group-hover:text-[#7B2E10] transition-colors leading-snug">
                      {cat.title}
                    </h3>
                    <p className="text-caption font-semibold tracking-wide text-[#7B2E10] mt-0.5 line-clamp-1">
                      {cat.subtitle}
                    </p>
                  </div>

                  {/* Summary preview */}
                  <p className="text-body-sm font-normal text-[#4A453E] leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                {/* Bottom Custom Interactive Button with Refined Icon */}
                <div className="mt-4 pt-3.5 border-t border-[#EAE3D9] w-full relative z-10">
                  <div
                    className={`w-full py-2.5 px-3.5 rounded-md text-label font-semibold flex items-center justify-between transition-all duration-200 shadow-xs ${
                      isSelected
                        ? 'bg-[#7B2E10] text-white shadow-sm ring-1 ring-[#A8431F]'
                        : 'bg-[#16120F] text-white group-hover:bg-[#7B2E10] group-hover:shadow-sm'
                    }`}
                  >
                    <span className="tracking-wide">
                      {isSelected ? 'Active Preview' : 'Explore Preview'}
                    </span>
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="w-3.5 h-3.5 text-white" strokeWidth={2.5} aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          2. WRITE-UP / INTRO TEXT & 3 REFINED FEATURE CARDS (IMAGE 1)
         ======================================================== */}
      <div className="relative overflow-hidden rounded-lg bg-[#7B2E10] border border-[#A8431F]/90 p-6 sm:p-10 shadow-md text-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Exact User Intro Write-up */}
          <div className="lg:col-span-7 space-y-3.5">
            <h3 className="text-h2 font-bold text-white leading-snug">
              {userIntroTitle}
            </h3>
            <p className="text-body font-normal text-white/95 leading-relaxed">
              {userIntroBody}
            </p>
          </div>

          {/* Three Feature Highlight Cards (Proper Lucide icons with rich hover effects, no color emojis) */}
          <div className="lg:col-span-5 flex flex-col gap-3.5">
            {/* Feature 1 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFF0] text-[#1F1C18] border border-black/10 flex items-start gap-4 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-[#7B2E10]/40 transition-all duration-200 group cursor-default">
              <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-brand group-hover:text-white group-hover:scale-110 transition-all duration-200">
                <ShieldCheck className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" strokeWidth={2.2} aria-hidden="true" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-h3 font-bold text-[#1F1C18] group-hover:text-[#7B2E10] transition-colors">
                  100% Student-Verified
                </h4>
                <p className="text-body-sm font-normal text-[#4A453E] leading-relaxed">
                  Every listing is checked by the GDGOC team before it goes live, ensuring real and trustworthy data.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFF0] text-[#1F1C18] border border-black/10 flex items-start gap-4 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-[#7B2E10]/40 transition-all duration-200 group cursor-default">
              <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-brand group-hover:text-white group-hover:scale-110 transition-all duration-200">
                <Zap className="w-5 h-5 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-12" strokeWidth={2.2} aria-hidden="true" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-h3 font-bold text-[#1F1C18] group-hover:text-[#7B2E10] transition-colors">
                  Direct Instant Access
                </h4>
                <p className="text-body-sm font-normal text-[#4A453E] leading-relaxed">
                  Connect with clubs, organisers, and businesses immediately from your phone without account creation.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFF0] text-[#1F1C18] border border-black/10 flex items-start gap-4 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-[#7B2E10]/40 transition-all duration-200 group cursor-default">
              <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-brand group-hover:text-white group-hover:scale-110 transition-all duration-200">
                <Activity className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" strokeWidth={2.2} aria-hidden="true" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-h3 font-bold text-[#1F1C18] group-hover:text-[#7B2E10] transition-colors">
                  Real-Time Campus Life
                </h4>
                <p className="text-body-sm font-normal text-[#4A453E] leading-relaxed">
                  Up-to-date events, live ratings and fresh opportunities curated across Samaru and Kongo campuses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. IMAGE SLIDING GALLERY — Continuous Sideways Slide
         ======================================================== */}
      <div>
        <SlidingGallery
          items={gallery}
          activeCategoryTag={activeCategory?.slug}
          onSlideChange={handleSlideChange}
        />
      </div>

      {/* ========================================================
          4. "EXPLORE" BUTTON — Prominent Dynamic CTA routing to dedicated page
         ======================================================== */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-1">
        <Link
          href={dynamicExploreLink}
          className="w-full sm:w-auto px-8 py-3.5 rounded-md bg-brand hover:bg-brand-strong text-white text-label font-bold tracking-[0.01em] transition-all duration-200 hover:-translate-y-0.5 shadow-md flex items-center justify-center gap-2.5 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
        >
          <span>{dynamicExploreLabel}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} aria-hidden="true" />
        </Link>

        {cta.secondaryHref && (
          <Link
            href={cta.secondaryHref}
            className="w-full sm:w-auto px-6 py-3.5 rounded-md bg-surface dark:bg-surface-raised-dark hover:bg-surface-container border border-border dark:border-border-dark text-ink dark:text-ink-dark text-label font-bold tracking-[0.01em] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-brand/40 text-center shadow-xs active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
          >
            {cta.secondaryLabel || 'List on Campusly'}
          </Link>
        )}
      </div>

      {/* ========================================================
          SPECIAL REQUIREMENT: EXPLORE BUSINESSES — Top 10 Ranked List
         ======================================================== */}
      <div
        id="top-10-businesses"
        className="p-6 sm:p-8 rounded-lg bg-[#7B2E10] border border-[#A8431F]/90 text-white shadow-md"
      >
        <TopBusinessesRanking businesses={topBusinesses} />
      </div>
    </section>
  );
}
