'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';

export function ScrollRevealInit() {
  const pathname = usePathname();

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    // Immediately reveal all elements if IntersectionObserver is not supported
    const revealAll = () => {
      document.querySelectorAll('.scroll-reveal').forEach((el) => {
        el.classList.add('revealed');
      });
    };

    if (!('IntersectionObserver' in window)) {
      revealAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '50px 0px 50px 0px',
      }
    );

    const observeElements = () => {
      const elements = document.querySelectorAll('.scroll-reveal');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // If element is already in or near viewport, reveal immediately
        if (rect.top < window.innerHeight + 150) {
          el.classList.add('revealed');
        } else {
          observer.observe(el);
        }
      });
    };

    // Trigger immediately on route transition
    observeElements();
    const raf = requestAnimationFrame(observeElements);
    const timer1 = setTimeout(observeElements, 100);
    const timer2 = setTimeout(revealAll, 500); // Failsafe: guarantee all elements are visible

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [pathname]);

  return null;
}
