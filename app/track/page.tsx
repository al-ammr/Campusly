'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, ShieldCheck, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function TrackPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [code, setCode] = React.useState('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();

    if (!cleanCode.startsWith('CY-') || cleanCode.length < 10) {
      showToast({
        type: 'error',
        message: 'Please enter a valid tracking code in CY-XXXX-XXXX format.',
      });
      return;
    }

    router.push(`/track/${cleanCode}`);
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-14 flex flex-col gap-6 sm:gap-8">
      {/* Header - Simple English, NO overhead badges */}
      <div className="flex flex-col gap-2 text-center items-center">
        <div className="w-10 h-10 rounded-2xl bg-brand/10 dark:bg-brand-dark/15 flex items-center justify-center text-brand dark:text-brand-dark mb-1">
          <Clock className="w-5 h-5" strokeWidth={2} />
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink dark:text-ink-dark tracking-tight">
          Track Your Submission
        </h1>
        <p className="text-sm text-ink-muted dark:text-ink-muted-dark leading-relaxed max-w-md">
          Check the review status of your community, event, or business listing in real time.
        </p>
      </div>

      {/* Main Track Form Card */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#FFFFF0] dark:bg-canvas-dark border border-border dark:border-border-dark p-6 sm:p-8 shadow-xs space-y-5">
        <form onSubmit={handleTrack} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-ink dark:text-ink-dark">
              Tracking Code *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. CY-7K3M-9QXP"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-sm font-mono uppercase text-ink dark:text-ink-dark placeholder:text-ink-muted focus:outline-hidden focus:ring-2 focus:ring-brand"
              />
              <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-3.5 pointer-events-none" strokeWidth={2} />
            </div>
            <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark">
              Format: CY-XXXX-XXXX (issued on screen when you submitted)
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-brand hover:bg-brand-strong text-white font-bold text-xs sm:text-sm shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Check Status</span>
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </button>
        </form>

        {/* Info Box */}
        <div className="pt-4 border-t border-border/70 dark:border-border-dark/70 space-y-2 text-xs text-ink-muted dark:text-ink-muted-dark">
          <strong className="block font-bold text-ink dark:text-ink-dark">
            Where do I find my code?
          </strong>
          <p className="leading-relaxed">
            When you submit a club, event, or business on Campusly, a unique tracking code starting with CY- is generated automatically. You can enter it here at any time to see if your listing is approved or if the review team requested changes.
          </p>
          <div className="pt-2">
            <Link
              href="/submit"
              className="inline-flex items-center gap-1.5 text-brand dark:text-brand-dark font-bold hover:underline"
            >
              <span>Submit a new listing</span>
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
