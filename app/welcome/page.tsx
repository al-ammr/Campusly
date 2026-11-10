'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function WelcomeLandingPage() {
  const router = useRouter();

  // Enter the home page and record onboarding/welcomed state
  const handleGetStarted = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    // 1-year persistent cookie for new user / new device tracking
    document.cookie = 'campusly_welcomed=1; path=/; max-age=31536000; SameSite=Lax';
    try {
      localStorage.setItem('campusly_welcomed', '1');
    } catch {
      // Ignore storage errors in private browsing
    }
    router.push('/?home=1');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#1A0D07] text-[#FFFFF0] font-sans flex flex-col justify-between select-none">
      {/* ========================================================
          1. HERO VIDEO BACKGROUND (Full-width wide overlay)
         ======================================================== */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-105"
        >
          <source src="/landing_hero.mp4" type="video/mp4" />
        </video>

        {/* Brand Color Gradient Overlay (Warm Chocolate / Espresso) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(45,24,16,0.82) 0%, rgba(61,34,20,0.65) 45%, rgba(26,13,7,0.92) 100%)',
          }}
        />

        {/* Ambient Radial Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 40%, transparent 25%, rgba(26,13,7,0.85) 100%)',
          }}
        />
      </div>

      {/* ========================================================
          2. ATMOSPHERIC CELESTIAL ELEMENTS (Inspired by uploaded image)
         ======================================================== */}
      <div className="absolute inset-0 z-1 pointer-events-none overflow-hidden">
        {/* Glowing Moon / Orb in Top Right */}
        <div
          className="absolute top-12 sm:top-16 right-8 sm:right-24 w-24 h-24 sm:w-36 sm:h-36 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,240,0.95) 0%, rgba(255,255,240,0.7) 35%, rgba(212,163,115,0.3) 70%, transparent 100%)',
            boxShadow: '0 0 80px 24px rgba(212,163,115,0.35)',
          }}
        />

        {/* Shooting Star #1 (Top Left streak) */}
        <div
          className="absolute top-20 left-10 sm:left-32 w-36 sm:w-56 h-[2px] opacity-75"
          style={{
            transform: 'rotate(28deg)',
            background:
              'linear-gradient(90deg, rgba(255,255,240,0) 0%, rgba(255,255,240,0.4) 60%, rgba(255,255,240,1) 100%)',
            boxShadow: '0 0 8px 2px rgba(255,255,240,0.8)',
          }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#FFFFF0] shadow-[0_0_12px_3px_#FFFFF0]" />
        </div>

        {/* Shooting Star #2 (Right Center streak) */}
        <div
          className="absolute top-80 sm:top-72 right-12 sm:right-48 w-28 sm:w-44 h-[2px] opacity-60"
          style={{
            transform: 'rotate(-24deg)',
            background:
              'linear-gradient(270deg, rgba(255,255,240,0) 0%, rgba(212,163,115,0.4) 60%, rgba(255,255,240,1) 100%)',
            boxShadow: '0 0 6px 1px rgba(212,163,115,0.6)',
          }}
        >
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#FFFFF0] shadow-[0_0_8px_2px_#FFFFF0]" />
        </div>

        {/* Starlight Sparkles */}
        <div className="absolute top-24 left-1/4 w-1.5 h-1.5 rounded-full bg-[#FFFFF0] opacity-80 shadow-[0_0_6px_#FFFFF0]" />
        <div className="absolute top-44 left-1/3 w-1 h-1 rounded-full bg-[#FFFFF0] opacity-60" />
        <div className="absolute top-36 right-1/3 w-1.5 h-1.5 rounded-full bg-[#FFFFF0] opacity-75 shadow-[0_0_4px_#FFFFF0]" />
        <div className="absolute top-64 right-1/4 w-1 h-1 rounded-full bg-[#D4A373] opacity-80" />
        <div className="absolute top-80 left-20 w-1 h-1 rounded-full bg-[#FFFFF0] opacity-50" />

        {/* Bottom Silhouette Mountain Layer (Inspiration Aesthetic in Brand Tones) */}
        <div className="absolute -bottom-1 left-0 right-0 w-full pointer-events-none opacity-45">
          <svg
            viewBox="0 0 1440 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto object-cover"
            preserveAspectRatio="none"
          >
            {/* Distant Ridge */}
            <path
              d="M0 160L80 140C160 120 320 80 480 100C640 120 800 200 960 190C1120 180 1280 80 1360 30L1440 0V280H0Z"
              fill="#3D2214"
              fillOpacity="0.6"
            />
            {/* Foreground Mesa Hills */}
            <path
              d="M0 210L60 190C120 170 240 130 360 135C480 140 600 190 720 185C840 180 960 120 1080 115C1200 110 1320 160 1380 185L1440 210V280H0Z"
              fill="#2D1810"
              fillOpacity="0.8"
            />
            {/* Front Silhouette */}
            <path
              d="M0 250L120 235C240 220 480 190 720 205C960 220 1200 240 1320 250L1440 260V280H0Z"
              fill="#1A0D07"
            />
          </svg>
        </div>
      </div>

      {/* ========================================================
          3. HEADER NAVIGATION (Matching Inspiration Layout)
         ======================================================== */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 pt-8 pb-4 flex items-center justify-between">
        {/* Brand Logo & Title - Visible only on mobile view; disappears strictly on web view */}
        <Link
          href="/"
          onClick={handleGetStarted}
          className="flex sm:hidden items-center gap-2.5 group cursor-pointer"
          aria-label="Campusly Home"
        >
          <div className="w-7 h-7 rounded-lg overflow-hidden relative shadow-md border border-[#D4A373]/30 bg-[#2D1810] shrink-0">
            <Image
              src="/inverted_logo.jpg"
              alt="Campusly"
              fill
              className="object-cover"
              sizes="28px"
              priority
            />
          </div>
          <span className="font-bold text-base tracking-tight text-[#FFFFF0] group-hover:text-[#D4A373] transition-colors">
            Campusly
          </span>
        </Link>

        {/* Navigation Links - Pushed to right on web view */}
        <nav className="flex items-center gap-5 sm:gap-9 text-xs sm:text-sm font-medium ml-auto">
          {/* Active Home Link with Bottom Bar */}
          <button
            type="button"
            onClick={handleGetStarted}
            className="relative py-1 text-[#FFFFF0] font-bold cursor-pointer transition-colors"
          >
            <span>Home</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FFFFF0] rounded-full" />
          </button>

          <Link
            href="/about"
            className="py-1 text-[#E0D7C6] hover:text-[#FFFFF0] transition-colors"
          >
            About us
          </Link>

          <Link
            href="/explore"
            className="py-1 text-[#E0D7C6] hover:text-[#FFFFF0] transition-colors"
          >
            Explore
          </Link>

          <Link
            href="/contact"
            className="py-1 text-[#E0D7C6] hover:text-[#FFFFF0] transition-colors"
          >
            Contact
          </Link>
        </nav>
      </header>

      {/* ========================================================
          4. HERO CENTER CONTENT (WELCOME + DESCRIPTION + CTAs)
         ======================================================== */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center my-auto py-12 flex flex-col items-center justify-center">
        {/* University Sub-badge */}
        <span className="text-[11px] sm:text-xs font-semibold tracking-widest text-[#D4A373] uppercase mb-3 drop-shadow-sm">
          Ahmadu Bello University
        </span>

        {/* Big Bold WELCOME Title (Exact Inspiration Design) */}
        <h1 className="font-display font-extrabold text-5xl sm:text-7xl md:text-8xl tracking-wider text-[#FFFFF0] uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
          WELCOME
        </h1>

        {/* Brief Explanation of What We Are */}
        <p className="text-sm sm:text-base md:text-lg text-[#E0D7C6] max-w-2xl mx-auto leading-relaxed mt-4 sm:mt-5 font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
          Everything happening at ABU Zaria, in one place. Browse communities, events, and verified opportunities.
        </p>

        {/* Invitation Question (Matching "Do You Wanna Join Us?") */}
        <p className="text-xs sm:text-sm font-semibold tracking-wide text-[#D4A373] uppercase mt-10 sm:mt-14 mb-5 drop-shadow-sm">
          Ready to explore campus life?
        </p>

        {/* Two Pill CTA Buttons Side-by-Side (Reduced size on mobile view only) */}
        <div className="flex flex-row flex-wrap items-center justify-center gap-3 sm:gap-5 w-auto">
          {/* Primary Pill: Get Started Now */}
          <button
            type="button"
            onClick={handleGetStarted}
            className="inline-flex items-center justify-center px-5 sm:px-10 py-2 sm:py-3.5 rounded-full border-2 border-transparent bg-[#FFFFF0] text-[#2D1810] font-semibold sm:font-bold text-xs sm:text-sm tracking-wide shadow-xl hover:bg-white hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer text-center"
          >
            Get Started Now
          </button>

          {/* Secondary Pill: Learn More */}
          <Link
            href="/about"
            className="inline-flex items-center justify-center px-5 sm:px-10 py-2 sm:py-3.5 rounded-full border-2 border-[#FFFFF0] text-[#FFFFF0] font-semibold text-xs sm:text-sm tracking-wide hover:bg-[#FFFFF0]/15 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer text-center backdrop-blur-xs"
          >
            Learn More
          </Link>
        </div>
      </main>

      {/* ========================================================
          5. BOTTOM WATERMARK / FOOTER
         ======================================================== */}
      <footer className="relative z-10 w-full text-center py-6 px-4">
        <p className="text-[11px] text-[#E0D7C6]/60 tracking-wider">
          Campusly • Connected by GDGOC ABU
        </p>
      </footer>
    </div>
  );
}
