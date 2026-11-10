'use client';

import * as React from 'react';
import Image from 'next/image';
import { ShowcaseGalleryItem } from '@/lib/showcase/types';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

interface SlidingGalleryProps {
  items: ShowcaseGalleryItem[];
  activeCategoryTag?: string;
  onSlideChange?: (item: ShowcaseGalleryItem) => void;
}

export function SlidingGallery({ items, activeCategoryTag, onSlideChange }: SlidingGalleryProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [touchStartX, setTouchStartX] = React.useState<number | null>(null);

  const displayItems = React.useMemo(() => {
    if (!items || items.length === 0) return [];
    return items;
  }, [items]);

  const total = displayItems.length;

  // When user actively clicks a category card above, jump to that slide
  const prevCategoryTagRef = React.useRef<string | undefined>(activeCategoryTag);
  React.useEffect(() => {
    if (!activeCategoryTag || total === 0) return;
    if (prevCategoryTagRef.current !== activeCategoryTag) {
      prevCategoryTagRef.current = activeCategoryTag;
      const matchIdx = displayItems.findIndex((it) => it.categoryTag === activeCategoryTag);
      if (matchIdx !== -1) {
        setCurrentIndex(matchIdx);
      }
    }
  }, [activeCategoryTag, displayItems, total]);

  const nextSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % (total || 1));
  }, [total]);

  const prevSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + (total || 1)) % (total || 1));
  }, [total]);

  // Inform parent when active slide changes
  const prevIndexRef = React.useRef<number>(-1);
  React.useEffect(() => {
    if (displayItems[currentIndex] && prevIndexRef.current !== currentIndex) {
      prevIndexRef.current = currentIndex;
      onSlideChange?.(displayItems[currentIndex]);
    }
  }, [currentIndex, displayItems, onSlideChange]);

  // Auto-slide effect: automatically slides by itself every 3.5 seconds
  React.useEffect(() => {
    if (!isPlaying || total <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 3500);

    return () => clearInterval(timer);
  }, [isPlaying, total]);

  if (total === 0) {
    return null;
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    setTouchStartX(null);
  };

  return (
    <div
      className="relative overflow-hidden rounded-lg bg-surface-container dark:bg-canvas-dark border border-border dark:border-border-dark shadow-xs group"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Campus Exploration Showcase Gallery"
    >
      {/* Aspect Ratio Container with Sideways Sliding Track */}
      <div className="relative w-full h-[280px] sm:h-[380px] lg:h-[460px] overflow-hidden bg-canvas-dark">
        <div
          className="flex h-full w-full transition-transform duration-600 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {displayItems.map((item, idx) => {
            return (
              <div
                key={item.id}
                className="relative w-full h-full shrink-0 grow-0 basis-full"
                aria-hidden={idx !== currentIndex}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title || 'Campus showcase slide'}
                  fill
                  sizes="(max-width: 768px) 100vw, 1200px"
                  className="object-cover select-none"
                  priority={idx === 0}
                />
                {/* Legibility Tint */}
                <div
                  className="absolute inset-0 bg-black/55 pointer-events-none"
                  aria-hidden="true"
                />

                {/* Caption and Meta */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 z-20 text-white space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-sm bg-brand text-white text-[10px] sm:text-xs font-semibold tracking-wider uppercase font-mono">
                      {item.categoryTag}
                    </span>
                    <span className="text-white/70 text-xs font-mono">
                      {idx + 1} / {total}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/90 max-w-2xl leading-relaxed">
                    {item.caption}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls: Clean, solid */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
        {/* Play / Pause Toggle */}
        <button
          type="button"
          onClick={() => setIsPlaying((p) => !p)}
          className="p-2 rounded-md bg-black/75 hover:bg-black/90 text-white border border-white/20 transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
          ) : (
            <Play className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
          )}
        </button>

        {/* Previous Button */}
        <button
          type="button"
          onClick={prevSlide}
          className="p-2 rounded-md bg-black/75 hover:bg-black/90 text-white border border-white/20 transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={nextSlide}
          className="p-2 rounded-md bg-black/75 hover:bg-black/90 text-white border border-white/20 transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          aria-label="Next image"
        >
          <ChevronRight className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      {/* Progress Dots */}
      <div className="absolute bottom-4 right-6 sm:right-10 z-30 flex items-center gap-1.5">
        {displayItems.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
              idx === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
