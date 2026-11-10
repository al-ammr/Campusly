import Link from 'next/link';
import {
  Compass,
  Users,
  ShieldCheck,
  Zap,
  MapPin,
  Heart,
  GraduationCap,
  ArrowRight,
  Lock,
  Wifi,
  Sparkles,
  Building,
} from 'lucide-react';

export const metadata = {
  title: 'About Campusly | Ahmadu Bello University',
  description:
    'Learn about Campusly, a fast, free, no-login campus directory unifying clubs, events, and student businesses across ABU Zaria.',
};

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-10 sm:gap-14">
      {/* Header - Clean, Bold, Simple English, NO overhead badges */}
      <section className="flex flex-col gap-4 max-w-3xl">
        <h1 className="font-display font-bold text-3xl sm:text-5xl text-ink dark:text-ink-dark tracking-tight leading-tight">
          About Campusly
        </h1>
        <p className="text-base sm:text-lg text-ink-muted dark:text-ink-muted-dark leading-relaxed">
          Campusly is a fast, free, and lightweight platform built by students for students at Ahmadu Bello University. We connect campus clubs, events, student businesses, and opportunities in one easy place.
        </p>

        <div className="pt-2 flex items-center gap-3 flex-wrap">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand hover:bg-brand-strong text-white text-xs sm:text-sm font-bold shadow-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Explore Directory</span>
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </Link>
          <Link
            href="/submit"
            className="px-6 py-3 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-ink dark:text-ink-dark text-xs sm:text-sm font-semibold hover:bg-surface-container transition-colors shadow-xs"
          >
            List Your Club or Business
          </Link>
        </div>
      </section>

      {/* Quick Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-5 rounded-2xl bg-[#FFFFF0] dark:bg-canvas-dark border border-border dark:border-border-dark shadow-xs flex flex-col gap-1">
          <span className="font-display font-bold text-2xl sm:text-3xl text-rich-brown dark:text-brand-dark">
            10+
          </span>
          <span className="text-xs sm:text-sm font-bold text-black dark:text-ink-dark">
            Faculties &amp; Colleges
          </span>
          <span className="text-[11px] font-normal text-black dark:text-ink-dark">
            Across Samaru &amp; Kongo
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#FFFFF0] dark:bg-canvas-dark border border-border dark:border-border-dark shadow-xs flex flex-col gap-1">
          <span className="font-display font-bold text-2xl sm:text-3xl text-rich-brown dark:text-brand-dark">
            35,000+
          </span>
          <span className="text-xs sm:text-sm font-bold text-black dark:text-ink-dark">
            ABU Students
          </span>
          <span className="text-[11px] font-normal text-black dark:text-ink-dark">
            Undergraduate &amp; Postgrad
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#FFFFF0] dark:bg-canvas-dark border border-border dark:border-border-dark shadow-xs flex flex-col gap-1">
          <span className="font-display font-bold text-2xl sm:text-3xl text-rich-brown dark:text-brand-dark">
            No Account
          </span>
          <span className="text-xs sm:text-sm font-bold text-black dark:text-ink-dark">
            Zero Passwords
          </span>
          <span className="text-[11px] font-normal text-black dark:text-ink-dark">
            Open access for everyone
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#FFFFF0] dark:bg-canvas-dark border border-border dark:border-border-dark shadow-xs flex flex-col gap-1">
          <span className="font-display font-bold text-2xl sm:text-3xl text-rich-brown dark:text-brand-dark">
            Light &amp; Fast
          </span>
          <span className="text-xs sm:text-sm font-bold text-black dark:text-ink-dark">
            Saves Mobile Data
          </span>
          <span className="text-[11px] font-normal text-black dark:text-ink-dark">
            Opens instantly on phone
          </span>
        </div>
      </section>

      {/* The Story in Simple English */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFFF0] dark:bg-canvas-dark border border-border dark:border-border-dark shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand/10 dark:bg-brand-dark/15 flex items-center justify-center text-brand dark:text-brand-dark">
            <Users className="w-5 h-5" strokeWidth={2} />
          </div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-ink dark:text-ink-dark">
            Why We Built Campusly
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-muted-dark leading-relaxed">
            Ahmadu Bello University is huge, with students divided between Samaru Main Campus and Kongo Campus ten kilometers away. For years, finding out what was happening on campus meant scrolling through hundreds of chaotic WhatsApp groups or squinting at torn paper flyers on faculty walls. Important academic summits, club meetups, and student businesses were easily missed.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFFF0] dark:bg-canvas-dark border border-border dark:border-border-dark shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand/10 dark:bg-brand-dark/15 flex items-center justify-center text-brand dark:text-brand-dark">
            <Zap className="w-5 h-5" strokeWidth={2} />
          </div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-ink dark:text-ink-dark">
            How Campusly Helps
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-muted-dark leading-relaxed">
            Campusly brings everything together into a clean, searchable directory. It opens in less than a second, uses very little mobile data, and works smoothly even when cellular signal is weak. Best of all, you never need to sign up or remember a password—just open the website and start exploring.
          </p>
        </div>
      </section>

      {/* What Makes Campusly Different */}
      <section className="space-y-5">
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink dark:text-ink-dark">
          What Makes Campusly Different
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="p-6 rounded-2xl bg-[#FFFFF0] dark:bg-canvas-dark border border-border dark:border-border-dark shadow-xs space-y-2">
            <div className="flex items-center gap-2.5 text-brand dark:text-brand-dark">
              <Lock className="w-5 h-5" strokeWidth={2} />
              <h3 className="font-display font-bold text-lg text-ink dark:text-ink-dark">
                No Login Needed
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-muted-dark leading-relaxed">
              You do not need to create an account, provide an email, or remember passwords. Browse, search, and vote freely.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFFF0] dark:bg-canvas-dark border border-border dark:border-border-dark shadow-xs space-y-2">
            <div className="flex items-center gap-2.5 text-brand dark:text-brand-dark">
              <Wifi className="w-5 h-5" strokeWidth={2} />
              <h3 className="font-display font-bold text-lg text-ink dark:text-ink-dark">
                Works on Weak Data
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-muted-dark leading-relaxed">
              Designed to be lightweight and fast. It caches key info on your device so you can view contacts and venue directions even when data drops.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFFF0] dark:bg-canvas-dark border border-border dark:border-border-dark shadow-xs space-y-2">
            <div className="flex items-center gap-2.5 text-brand dark:text-brand-dark">
              <ShieldCheck className="w-5 h-5" strokeWidth={2} />
              <h3 className="font-display font-bold text-lg text-ink dark:text-ink-dark">
                Verified by Students
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-muted-dark leading-relaxed">
              Every listing is reviewed by fellow students from GDGOC before it goes live, keeping the platform safe and free of spam.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFFF0] dark:bg-canvas-dark border border-border dark:border-border-dark shadow-xs space-y-2">
            <div className="flex items-center gap-2.5 text-brand dark:text-brand-dark">
              <Heart className="w-5 h-5" strokeWidth={2} />
              <h3 className="font-display font-bold text-lg text-ink dark:text-ink-dark">
                Free for Everyone
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-muted-dark leading-relaxed">
              Free to browse, free to search, and free to list your student society, project, or business.
            </p>
          </div>
        </div>
      </section>

      {/* The Two Campuses */}
      <section className="space-y-5">
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink dark:text-ink-dark">
          Connecting Both Campuses
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="p-6 rounded-2xl bg-[#FFFFF0] dark:bg-canvas-dark border border-border dark:border-border-dark shadow-xs space-y-2">
            <div className="flex items-center gap-2 font-display font-bold text-lg text-ink dark:text-ink-dark">
              <MapPin className="w-5 h-5 text-brand dark:text-brand-dark" strokeWidth={2} />
              <span>Samaru Main Campus</span>
            </div>
            <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-muted-dark leading-relaxed">
              Faculty of Physical Sciences, Life Sciences, Engineering, Environmental Design, Agriculture, Arts, Veterinary Medicine, Pharmaceutical Sciences, Education, and Kashim Ibrahim Library.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFFF0] dark:bg-canvas-dark border border-border dark:border-border-dark shadow-xs space-y-2">
            <div className="flex items-center gap-2 font-display font-bold text-lg text-ink dark:text-ink-dark">
              <MapPin className="w-5 h-5 text-brand dark:text-brand-dark" strokeWidth={2} />
              <span>Kongo Campus</span>
            </div>
            <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-muted-dark leading-relaxed">
              Faculty of Administration (Accounting, Business Administration, Public Administration), Faculty of Law, Institute of Administration Library, and Chike Obi Hall.
            </p>
          </div>
        </div>
      </section>

      {/* Who Builds It */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[#FFFFF0] dark:bg-canvas-dark border border-border dark:border-border-dark shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-secondary-light dark:text-secondary">
            <GraduationCap className="w-4 h-4" strokeWidth={2} />
            <span>Built by Students</span>
          </div>
          <h3 className="font-display font-bold text-xl sm:text-2xl text-ink dark:text-ink-dark">
            Made by GDGOC ABU Zaria
          </h3>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-muted-dark max-w-2xl leading-relaxed">
            Campusly is built and maintained as a public student project by student developers at the Google Developer Groups on Campus (GDGOC) chapter at Ahmadu Bello University.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-strong text-white text-xs sm:text-sm font-semibold transition-all shadow-xs"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
