'use client';

import * as React from 'react';
import { Users, GraduationCap, Briefcase, ShieldCheck } from 'lucide-react';
import { MetricCard } from '@/components/ui/metric-card';

interface MetricItem {
  id: string;
  targetValue: number;
  suffix: string;
  isDecimal?: boolean;
  staticValue: string;
  label: string;
  description: string;
  icon: React.ElementType;
  trend?: {
    value: string;
    positive: boolean;
  };
  isFeatured?: boolean;
  href?: string;
}

const METRICS: MetricItem[] = [
  {
    id: 'communities',
    targetValue: 150,
    suffix: '+',
    staticValue: '150+',
    label: 'Campus Communities',
    description: 'Registered departmental societies, technical clubs, and faculty chapters across Samaru & Kongo.',
    icon: Users,
    trend: { value: '+14 this semester', positive: true },
    href: '/communities',
  },
  {
    id: 'scholars',
    targetValue: 2500,
    suffix: '+',
    staticValue: '2,500+',
    label: 'Active Scholars',
    description: 'Undergraduate and postgraduate students discovering academic opportunities weekly.',
    icon: GraduationCap,
    trend: { value: '+22% discovery rate', positive: true },
    isFeatured: true,
    href: '/explore',
  },
  {
    id: 'opportunities',
    targetValue: 400,
    suffix: '+',
    staticValue: '400+',
    label: 'Verified Opportunities',
    description: 'Vetted research fellowships, SIWES internships, and grants with zero stale deadlines.',
    icon: Briefcase,
    trend: { value: 'Active & verified', positive: true },
    href: '/opportunities',
  },
  {
    id: 'accuracy',
    targetValue: 99.4,
    suffix: '%',
    isDecimal: true,
    staticValue: '99.4%',
    label: 'Directory Accuracy',
    description: 'Peer-reviewed campus records ensuring authentic contact channels and meeting schedules.',
    icon: ShieldCheck,
    trend: { value: 'Verified directory', positive: true },
    href: '/explore',
  },
];

export function MetricBar() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = React.useState(false);
  const [counts, setCounts] = React.useState<number[]>([0, 0, 0, 0]);

  // Trigger ONLY when user scrolls to the section
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  // Rolling counter animation from 0 up to target numbers
  React.useEffect(() => {
    if (!hasStarted) return;

    let startTimestamp: number | null = null;
    const duration = 1600; // ms
    let frameId: number;

    const step = (now: number) => {
      if (!startTimestamp) startTimestamp = now;
      const elapsed = now - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease-out exponential curve
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setCounts(
        METRICS.map((m) => {
          if (m.isDecimal) {
            return parseFloat((m.targetValue * ease).toFixed(1));
          }
          return Math.floor(m.targetValue * ease);
        })
      );

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setCounts(METRICS.map((m) => m.targetValue));
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [hasStarted]);

  return (
    <section
      ref={containerRef}
      aria-label="Campus Key Metrics"
      className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8"
    >
      {/* Outer Enclosure */}
      <div className="rounded-lg bg-surface-container dark:bg-surface-container-dark border border-border dark:border-border-dark p-6 sm:p-8 lg:p-10 shadow-xs">
        {/* Header with Drop-down animation */}
        <div
          className={`max-w-2xl mb-6 sm:mb-8 space-y-1.5 transition-all duration-700 ease-out ${
            hasStarted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          <h2 className="text-h2 font-semibold text-ink dark:text-ink-dark tracking-tight">
            Campus Reach &amp; Activity
          </h2>
          <p className="text-body-sm font-normal text-ink-muted dark:text-ink-muted-dark leading-relaxed">
            Live participation numbers across ABU Zaria&apos;s faculties, research groups and student chapters.
          </p>
        </div>

        {/* 4-Card Strip Grid with Staggered Drop Down Animation Intro */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {METRICS.map((metric, idx) => {
            const currentNum = counts[idx] ?? 0;
            const formattedVal = metric.isDecimal
              ? currentNum.toFixed(1) + metric.suffix
              : currentNum.toLocaleString() + metric.suffix;

            return (
              <div
                key={metric.id}
                style={{ transitionDelay: `${idx * 100}ms` }}
                className={`transition-all duration-700 ease-out transform ${
                  hasStarted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
                }`}
              >
                <MetricCard
                  value={formattedVal}
                  label={metric.label}
                  description={metric.description}
                  icon={metric.icon}
                  delta={metric.trend}
                  variant={metric.isFeatured ? 'featured' : 'default'}
                  href={metric.href}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
