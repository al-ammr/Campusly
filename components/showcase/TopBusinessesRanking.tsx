'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TopBusinessItem } from '@/lib/showcase/types';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  CheckCircle2,
  MapPin,
  ExternalLink,
  Store,
} from 'lucide-react';

interface TopBusinessesRankingProps {
  businesses: TopBusinessItem[];
  compact?: boolean;
}

export function TopBusinessesRanking({ businesses }: TopBusinessesRankingProps) {
  const displayList = businesses && businesses.length > 0 ? businesses.slice(0, 10) : [];
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const firstCard = container.firstElementChild as HTMLElement;
    const step = firstCard ? firstCard.offsetWidth + 20 : 320;
    container.scrollBy({
      left: direction === 'left' ? -step : step,
      behavior: 'smooth',
    });
  };

  // Automatic sideways scrolling by itself with pause-on-hover
  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || displayList.length <= 1) return;

    let isPaused = false;
    const onMouseEnter = () => { isPaused = true; };
    const onMouseLeave = () => { isPaused = false; };
    const onTouchStart = () => { isPaused = true; };
    const onTouchEnd = () => { isPaused = false; };

    container.addEventListener('mouseenter', onMouseEnter);
    container.addEventListener('mouseleave', onMouseLeave);
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchend', onTouchEnd, { passive: true });

    const interval = setInterval(() => {
      if (isPaused || !container) return;
      const firstCard = container.firstElementChild as HTMLElement;
      const step = firstCard ? firstCard.offsetWidth + 20 : 320;
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (container.scrollLeft >= maxScroll - 15) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 3500);

    return () => {
      clearInterval(interval);
      container.removeEventListener('mouseenter', onMouseEnter);
      container.removeEventListener('mouseleave', onMouseLeave);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchend', onTouchEnd);
    };
  }, [displayList.length]);

  if (displayList.length === 0) {
    return (
      <div className="p-8 text-center rounded-lg bg-surface-container dark:bg-surface-container-dark border border-[#EAE3D9] shadow-inner">
        <Store className="w-8 h-8 text-brand/50 mx-auto mb-2" strokeWidth={1.5} aria-hidden="true" />
        <p className="text-body-sm font-normal text-ink-muted dark:text-ink-muted-dark">No ranked campus businesses registered yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="max-w-2xl space-y-1.5">
          <h3 className="text-h2 font-bold text-white tracking-tight">
            Explore Businesses
          </h3>
          <p className="text-body-sm font-normal text-white/95 leading-relaxed">
            Student businesses at ABU Zaria do real work. They print, they cook, they repair, they design, they deliver, and they serve both campuses every day. Most of them spread entirely by word of mouth, which means the ones you need are often the ones you have never heard of.
          </p>
        </div>

        {/* Horizontal Scroll Controls */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-md bg-[#16120F] hover:bg-[#7B2E10] border border-white/20 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all shadow-xs cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-md bg-[#16120F] hover:bg-[#7B2E10] border border-white/20 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all shadow-xs cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Sideways Sliding 3D Cards Track */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1  scrollbar-none scroll-smooth"
      >
        {displayList.map((biz) => {
          // Format 2-digit rank: '01', '02', '03' ...
          const formattedRank = String(biz.rank).padStart(2, '0');

          return (
            <div
              key={biz.id}
              className="w-[280px] sm:w-[310px] shrink-0 flex flex-col justify-between p-5 rounded-xl bg-[#FFFFF0] hover:bg-[#FFFFF0] border-2 border-[#E8DFD5] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.25),0_8px_10px_-6px_rgba(0,0,0,0.15)] hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_35px_-8px_rgba(0,0,0,0.4),0_0_24px_rgba(255,138,76,0.35)] transform-gpu transition-all duration-300 ease-out group relative overflow-hidden"
            >
              {/* Corner Black Ink Splash Accent */}
              <div
                className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-gradient-to-br from-black/10 to-transparent pointer-events-none blur-sm"
                aria-hidden="true"
              />

              <div className="relative z-10">
                {/* Header: Two-digit Rank Number & Black Splash Rating Pod */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-display font-bold text-[#1F1C18] tracking-tight leading-none block tabular-nums">
                      {formattedRank}
                    </span>
                    <div className="w-8 h-1 bg-[#7B2E10] rounded-full mt-2 mb-3" />
                  </div>

                  {/* Rating Pod */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#16120F] text-white text-caption font-mono font-bold shadow-xs tabular-nums border border-black/30">
                    <Star className="w-3.5 h-3.5 text-accent fill-current" strokeWidth={1.5} aria-hidden="true" />
                    <span>{biz.score}</span>
                  </div>
                </div>

                {/* Business Name and Category */}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-h3 font-bold text-[#1F1C18] leading-snug line-clamp-1 group-hover:text-[#7B2E10] transition-colors">
                      {biz.name}
                    </h4>
                    {biz.verified && (
                      <CheckCircle2
                        className="w-4 h-4 text-success dark:text-success-dark shrink-0"
                        strokeWidth={2}
                        aria-label="Verified Campus Business"
                      />
                    )}
                  </div>
                  <span className="text-label font-semibold text-[#7B2E10] block">
                    {biz.category}
                  </span>
                </div>

                {/* Artwork / Photo Container */}
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-white my-3.5">
                  <Image
                    src={biz.logoUrl || 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80'}
                    alt={biz.name}
                    fill
                    sizes="(max-width: 768px) 280px, 320px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Description */}
                <p className="text-body-sm font-normal text-[#4A453E] leading-relaxed line-clamp-2">
                  {biz.description}
                </p>

                {/* Location */}
                <div className="flex items-center gap-1 text-caption font-medium text-[#4A453E] mt-2.5">
                  <MapPin className="w-3 h-3 text-[#7B2E10] shrink-0" strokeWidth={1.5} aria-hidden="true" />
                  <span className="truncate">{biz.location}</span>
                </div>
              </div>

              {/* Action Button with Hover Glow & Animation */}
              <div className="mt-4 pt-3.5 border-t border-[#EAE3D9] relative z-10">
                <a
                  href={biz.actionButton.link}
                  target={biz.actionButton.behavior || '_blank'}
                  rel={biz.actionButton.behavior === '_blank' ? 'noopener noreferrer' : undefined}
                  className="w-full py-2.5 px-4 rounded-md bg-[#16120F] hover:bg-[#7B2E10] text-white text-label font-bold flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.3),0_0_15px_rgba(255,138,76,0.4)] active:scale-[0.98] shadow-xs"
                >
                  <span>{biz.actionButton.label || 'Contact / Visit'}</span>
                  <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer link to businesses directory */}
      <div className="flex justify-end">
        <Link
          href="/businesses"
          className="text-body-sm font-bold text-white/95 hover:text-white underline underline-offset-4 flex items-center gap-1.5 transition-colors"
        >
          <span>View all campus businesses directory</span>
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
