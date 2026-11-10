import Link from 'next/link';
import { getPublicHomeBundle } from '@/lib/api/public-queries';
import { ListingCard } from '@/components/cards/listing-card';
import { SpotlightCard } from '@/components/cards/spotlight-card';
import { CategoryChip } from '@/components/ui/chip';
import { Banner } from '@/components/ui/banner';
import { MetricBar } from '@/components/MetricBar';
import { ShowcaseSection } from '@/components/showcase/ShowcaseSection';
import { getShowcaseBundle } from '@/lib/showcase/service';
import { DEFAULT_SHOWCASE_BUNDLE } from '@/lib/showcase/defaults';
import { t } from '@/lib/copy/strings';
import {
  ArrowRight,
  Compass,
  ShieldCheck,
  Search,
  ChevronRight,
  Cpu,
  Briefcase,
  Leaf,
  GraduationCap,
  HeartHandshake,
  Palette,
  Trophy,
  FlaskConical,
  HeartPulse,
  Users,
} from 'lucide-react';

function getCategoryIcon(key?: string) {
  if (!key) return Compass;
  const s = key.toLowerCase();
  if (s.includes('tech') || s.includes('cpu') || s.includes('digital')) return Cpu;
  if (s.includes('busin') || s.includes('entrepr')) return Briefcase;
  if (s.includes('sustain') || s.includes('environ') || s.includes('leaf')) return Leaf;
  if (s.includes('acad') || s.includes('profess') || s.includes('grad')) return GraduationCap;
  if (s.includes('lead') || s.includes('volunt')) return HeartHandshake;
  if (s.includes('creat') || s.includes('art') || s.includes('media') || s.includes('palette')) return Palette;
  if (s.includes('sport') || s.includes('recreat') || s.includes('trophy')) return Trophy;
  if (s.includes('scien') || s.includes('research') || s.includes('flask')) return FlaskConical;
  if (s.includes('health') || s.includes('well') || s.includes('pulse') || s.includes('medic')) return HeartPulse;
  if (s.includes('cultur') || s.includes('commun') || s.includes('users')) return Users;
  return Compass;
}

export const revalidate = 60; // 60-second cache

const INTENTIONS = [
  { label: 'All', tag: 'all' },
  { label: 'Learn', tag: 'learn' },
  { label: 'Network', tag: 'network' },
  { label: 'Lead', tag: 'lead' },
  { label: 'Volunteer', tag: 'volunteer' },
  { label: 'Build', tag: 'build' },
  { label: 'Compete', tag: 'compete' },
  { label: 'Create', tag: 'create' },
];

const FACULTIES = [
  'Faculty of Engineering',
  'College of Medical Sciences',
  'Faculty of Science',
  'Faculty of Law',
  'Faculty of Arts',
  'Faculty of Social Sciences',
  'Faculty of Agriculture',
  'Faculty of Environmental Design',
  'Faculty of Administration',
  'Faculty of Veterinary Medicine',
  'Faculty of Pharmaceutical Sciences',
  'Faculty of Education',
  'Samaru & Kongo Campuses',
];

export default async function HomePage() {
  let bundle;
  try {
    bundle = await getPublicHomeBundle();
  } catch (error) {
    bundle = {
      pinned_announcement: null,
      this_week: [],
      categories: [],
      spotlight_strip: [],
      closing_soon: [],
      top_communities: [],
    };
  }

  let showcaseBundle;
  try {
    showcaseBundle = await getShowcaseBundle();
  } catch (error) {
    showcaseBundle = DEFAULT_SHOWCASE_BUNDLE;
  }

  const {
    pinned_announcement,
    this_week,
    categories,
    spotlight_strip,
    closing_soon,
    top_communities,
  } = bundle;

  return (
    <div className="flex flex-col gap-10 pb-20">
      {/* Pinned Official Announcement */}
      {pinned_announcement && (
        <section aria-label="Official announcement" className="max-w-7xl mx-auto w-full px-4 pt-4">
          <Banner
            variant="announcement"
            message={
              <span>
                <strong className="font-semibold">{pinned_announcement.title}: </strong>
                {pinned_announcement.body}
              </span>
            }
          />
        </section>
      )}

      {/* Hero Section with Full Background Video */}
      <section className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-2">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-black/20 dark:border-white/10 p-6 sm:p-10 lg:p-14 shadow-xl min-h-[460px] sm:min-h-[520px] flex items-center bg-black">
          {/* Full Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-85"
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>

          {/* Cinematic Contrast Overlays */}
          <div className="absolute inset-0 bg-black/60 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

          {/* Foreground Hero Content */}
          <div className="relative z-10 flex flex-col gap-5 max-w-3xl text-white">
            {/* Clean Editorial Headline */}
            <h1 className="text-display font-bold text-white leading-[1.1] tracking-tight drop-shadow-md">
              Discover More Beyond the Classroom
            </h1>

            <p className="text-body-lg font-normal text-white/95 leading-relaxed max-w-2xl drop-shadow-sm">
              Every club, event, opportunity and student business at ABU Zaria, in one place. Find what you&apos;re looking for and join straight from your phone. No account needed.
            </p>

            {/* Quick Search Form */}
            <form action="/search" method="GET" className="w-full mt-2 flex flex-col sm:flex-row items-stretch gap-2.5">
              <div className="relative flex-1 group">
                <input
                  type="search"
                  name="q"
                  placeholder={t('home.search_placeholder')}
                  className="w-full h-12 pl-11 pr-12 rounded-md border border-white/20 bg-[#FFFFF0] text-ink placeholder:text-ink-muted/70 text-body focus:outline-none focus:ring-2 focus:ring-brand shadow-lg transition-all"
                  required
                />
                <Search
                  className="w-5 h-5 absolute left-3.5 top-3.5 text-ink-muted pointer-events-none group-focus-within:text-brand transition-colors"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <kbd className="hidden sm:inline-flex absolute right-3.5 top-3.5 px-2 py-0.5 text-caption font-mono font-medium tracking-[0.02em] text-ink-muted bg-surface-container border border-border rounded-sm shadow-xs pointer-events-none">
                  /
                </kbd>
              </div>
              <button
                type="submit"
                className="px-6 h-12 rounded-md bg-brand hover:bg-brand-strong text-white text-label font-medium tracking-[0.01em] transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.99] shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
              >
                <span>Search</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
            </form>

            {/* Action CTAs */}
            <div className="mt-2 flex items-center gap-3 flex-wrap">
              <Link
                href="/explore"
                className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-md bg-brand hover:bg-brand-strong text-white text-label font-medium tracking-[0.01em] shadow-md transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
              >
                <span>Explore Communities</span>
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs" aria-hidden="true">
                  &rarr;
                </span>
              </Link>
              <Link
                href="/submit"
                className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-md bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white text-label font-medium tracking-[0.01em] transition-all duration-150 hover:border-white/50 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                <span>List Your Venture</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Metric Bar */}
      <MetricBar />

      {/* Exploration Showcase Section (5 Categories, Write-up, Sliding Gallery, Explore CTA & Top 10 Businesses) */}
      <ShowcaseSection bundle={showcaseBundle} />

      {/* Campus Faculties & Registry Continuous Marquee Animated Strip */}
      <div className="max-w-7xl mx-auto w-full px-4 overflow-hidden border-y border-border/60 dark:border-border-dark/60 py-3 bg-surface-container/40 dark:bg-surface-container-dark/40" aria-label="Campus Faculties and Campuses">
        <div className="animate-marquee items-center gap-8 text-caption uppercase font-mono tracking-widest text-ink-muted select-none">
          {[...FACULTIES, ...FACULTIES].map((faculty, idx) => (
            <span key={idx} className="flex items-center gap-8 shrink-0">
              <span>{faculty}</span>
              <span className="text-brand/50" aria-hidden="true">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Huge Single Card for Discovery Intentions, Categories & Community Action */}
      <section aria-label="Campus Directory Discovery & Community Action" className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-surface-container dark:bg-surface-container-dark border border-border dark:border-border-dark p-6 sm:p-10 shadow-xs flex flex-col gap-8">
          {/* 1. "I want to..." Sliding Intent Filters */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-caption tracking-[0.01em] font-medium text-secondary-light dark:text-secondary font-mono">
                I want to...
              </span>
              <span className="text-caption text-ink-muted dark:text-ink-muted-dark font-medium">Quick filter</span>
            </div>
            {/* Sliding filter track */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none scroll-smooth">
              {INTENTIONS.map((item) => (
                <Link
                  key={item.tag}
                  href={item.tag === 'all' ? '/explore' : `/explore?intent=${item.tag}`}
                  className="shrink-0 px-4 py-2 rounded-full text-label font-medium tracking-[0.01em] bg-surface dark:bg-surface-raised-dark hover:bg-surface-container border border-border dark:border-border-dark text-ink dark:text-ink-dark transition-all duration-200 hover:-translate-y-0.5 shadow-xs flex items-center gap-1.5"
                >
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* 2. Explore Categories Sliding/Grid Chips */}
          <div className="flex flex-col gap-5 pt-6 border-t border-border/70 dark:border-border-dark/70">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h3 className="text-h2 font-bold text-ink dark:text-ink-dark tracking-tight">
                  Explore categories
                </h3>
                <p className="text-body-sm font-normal text-ink-muted dark:text-ink-muted-dark mt-0.5">
                  Browse active groups and societies by interest
                </p>
              </div>
              <Link
                href="/explore"
                className="text-body-sm font-bold text-brand dark:text-brand-dark hover:underline flex items-center gap-1.5 shrink-0 transition-colors duration-150"
              >
                <span>View all</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-3.5">
              {categories.map((cat: any) => {
                const CategoryIcon = getCategoryIcon(cat.slug || cat.icon_key || cat.name);
                const activeCount = Number(cat.live_count || 0);

                return (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className="group relative overflow-hidden rounded-2xl bg-surface dark:bg-[#1A0D07]/60 hover:bg-surface-container dark:hover:bg-[#2A160D]/90 border border-border/70 dark:border-white/[0.08] hover:border-brand/40 dark:hover:border-[#D4A373]/40 p-4 shadow-xs hover:shadow-lg dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-all duration-200 ease-out hover:-translate-y-1 active:scale-[0.98] flex items-center justify-between gap-3.5"
                  >
                    {/* Top ambient highlight line on hover */}
                    <div
                      className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand/40 dark:via-[#D4A373]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      aria-hidden="true"
                    />

                    {/* Left: Icon Vessel & Category Info */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Icon Vessel with dedicated Lucide Icon */}
                      <div className="w-10 h-10 rounded-xl bg-brand/10 dark:bg-[#3D2214] text-brand dark:text-[#E8A87C] border border-brand/15 dark:border-[#D4A373]/20 flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-brand group-hover:text-white dark:group-hover:bg-[#D4A373] dark:group-hover:text-[#1A0D07] group-hover:scale-105 transition-all duration-200">
                        <CategoryIcon className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />
                      </div>

                      {/* Text details */}
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-ink dark:text-[#FFFFF0] group-hover:text-brand dark:group-hover:text-[#D4A373] transition-colors line-clamp-1">
                          {cat.name}
                        </span>
                        <div className="mt-1">
                          {activeCount > 0 ? (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/20 w-fit">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              {activeCount} active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-ink-muted/70 dark:text-[#A8988B] bg-black/[0.03] dark:bg-white/[0.04] px-2 py-0.5 rounded-full border border-border/40 dark:border-white/[0.05] w-fit">
                              0 active
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Subtle Chevron */}
                    <ChevronRight className="w-4 h-4 text-ink-muted/40 dark:text-white/20 group-hover:text-brand dark:group-hover:text-[#D4A373] group-hover:translate-x-0.5 transition-all duration-200 shrink-0" aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 3. Community Call To Action Card */}
          <div className="pt-6 border-t border-border/70 dark:border-border-dark/70">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-surface dark:bg-surface-raised-dark p-6 sm:p-8 rounded-xl border border-border dark:border-border-dark shadow-xs relative overflow-hidden text-ink dark:text-ink-dark">
              {/* Corner Black Ink Splash Accent */}
              <div
                className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-gradient-to-br from-black/10 to-transparent pointer-events-none blur-sm"
                aria-hidden="true"
              />
              <div className="max-w-2xl space-y-2 relative z-10">
                <h3 className="text-h2 font-bold text-ink dark:text-ink-dark tracking-tight">
                  Come See What Your Campus Is Doing
                </h3>
                <p className="text-body-sm font-normal text-ink-muted dark:text-ink-muted-dark leading-relaxed">
                  A simple list of clubs, events, workshops and student businesses at ABU Zaria. Everything is checked before it goes live.
                </p>
                <p className="text-body-sm font-medium text-brand dark:text-brand-dark pt-0.5">
                  Run a club or a business? Submit a listing and get it in front of students.
                </p>
              </div>
              <Link
                href="/submit"
                className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-md bg-brand hover:bg-brand-strong text-white text-label font-medium tracking-[0.01em] shadow-xs transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.98] shrink-0 relative z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
              >
                <span>Submit a Listing</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Discovery Content Sections */}
      <div className="max-w-7xl mx-auto w-full px-4 flex flex-col gap-14">

        {/* Featured Student Spotlight Strip */}
        {spotlight_strip.length > 0 && (
          <section aria-labelledby="spotlight-heading" className="flex flex-col gap-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="text-caption tracking-[0.01em] font-medium text-brand dark:text-brand-strong">
                  {t('common.paid_listing')}
                </span>
                <h2 id="spotlight-heading" className="text-h2 font-semibold text-ink dark:text-ink-dark">
                  {t('home.spotlight.heading')}
                </h2>
                <p className="text-body-sm font-normal text-ink-muted dark:text-ink-muted-dark mt-0.5">
                  {t('home.spotlight.subheading')}
                </p>
              </div>
              <Link
                href="/spotlight"
                className="text-body-sm font-medium text-brand hover:underline flex items-center gap-1"
              >
                <span>{t('home.view_all')}</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {spotlight_strip.map((item) => (
                <SpotlightCard key={item.id} item={item} variant="strip" />
              ))}
            </div>
          </section>
        )}

        {/* This Week Events */}
        {this_week.length > 0 && (
          <section aria-labelledby="this-week-heading" className="flex flex-col gap-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 id="this-week-heading" className="text-h2 font-semibold text-ink dark:text-ink-dark">
                  {t('home.this_week.heading')}
                </h2>
                <p className="text-body-sm font-normal text-ink-muted dark:text-ink-muted-dark mt-0.5">
                  {t('home.this_week.subheading')}
                </p>
              </div>
              <Link
                href="/events?when=week"
                className="text-body-sm font-medium text-brand hover:underline flex items-center gap-1"
              >
                <span>{t('home.view_all')}</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {this_week.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          </section>
        )}

        {/* Top Communities */}
        {top_communities.length > 0 && (
          <section aria-labelledby="top-communities-heading" className="flex flex-col gap-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 id="top-communities-heading" className="text-h2 font-semibold text-ink dark:text-ink-dark">
                  {t('home.top_communities.heading')}
                </h2>
                <p className="text-body-sm font-normal text-ink-muted dark:text-ink-muted-dark mt-0.5">
                  {t('home.top_communities.subheading')}
                </p>
              </div>
              <Link
                href="/explore"
                className="text-body-sm font-medium text-brand hover:underline flex items-center gap-1"
              >
                <span>{t('home.view_all')}</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {top_communities.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          </section>
        )}

        {/* Opportunities Closing Soon */}
        {closing_soon.length > 0 && (
          <section aria-labelledby="closing-soon-heading" className="flex flex-col gap-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 id="closing-soon-heading" className="text-h2 font-semibold text-ink dark:text-ink-dark">
                  {t('home.closing_soon.heading')}
                </h2>
                <p className="text-body-sm font-normal text-ink-muted dark:text-ink-muted-dark mt-0.5">
                  {t('home.closing_soon.subheading')}
                </p>
              </div>
              <Link
                href="/opportunities"
                className="text-body-sm font-medium text-brand hover:underline flex items-center gap-1"
              >
                <span>{t('home.view_all')}</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {closing_soon.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          </section>
        )}

        {/* Living Campus Editorial Section */}
        <section className="relative overflow-hidden rounded-lg bg-[#7B2E10] border border-[#A8431F]/90 p-6 sm:p-10 lg:p-12 shadow-md text-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-display font-bold text-white leading-snug">
                Clubs, events, opportunities and student businesses, all in one place.
              </h2>
              <p className="text-body font-normal text-white/95 leading-relaxed">
                Campusly lists what is actually happening at ABU Zaria. The GDGOC team checks each listing before it goes live, so what you see is real. No account needed, no ads, no algorithm deciding what you see.
              </p>

            </div>

            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="p-6 sm:p-7 rounded-xl bg-[#FBF9F5] text-[#1F1C18] border-2 border-[#E8DFD5] space-y-4 shadow-[0_12px_28px_rgba(0,0,0,0.25)] relative overflow-hidden">
                {/* Corner Black Ink Splash Accent */}
                <div
                  className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-gradient-to-br from-black/10 to-transparent pointer-events-none blur-sm"
                  aria-hidden="true"
                />
                <p className="text-body-sm text-[#1F1C18] font-bold leading-relaxed relative z-10">
                  Run a student club, research team or department? Get listed in the directory in under 2 minutes.
                </p>
                <div className="pt-1 flex items-center gap-3 flex-wrap relative z-10">
                  <Link
                    href="/submit"
                    className="px-5 py-2.5 rounded-md bg-[#16120F] hover:bg-[#7B2E10] text-white text-label font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.3),0_0_15px_rgba(255,138,76,0.4)] active:scale-[0.98] shadow-xs"
                  >
                    List Your Community
                  </Link>
                  <Link
                    href="/spotlight/new"
                    className="px-5 py-2.5 rounded-md border-2 border-[#16120F] hover:bg-[#16120F] hover:text-white text-[#16120F] text-label font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
                  >
                    Book Spotlight &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Collegiate Value Trust Bar */}
        <section className="p-6 sm:p-8 rounded-lg bg-surface-container dark:bg-surface-container-dark border border-border dark:border-border-dark flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <h3 className="text-h3 font-semibold text-ink dark:text-ink-dark">
              Open Campus Discovery
            </h3>
            <p className="text-body-sm font-normal text-ink-muted dark:text-ink-muted-dark max-w-xl">
              Verified contacts and peer-curated campus life for Ahmadu Bello University.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/submit"
              className="py-2.5 px-5 rounded-md bg-brand hover:bg-brand-strong text-white text-label font-medium tracking-[0.01em] shadow-xs transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
            >
              Submit Listing
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
