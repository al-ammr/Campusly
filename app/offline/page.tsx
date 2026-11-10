'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { WifiOff, RefreshCw, Home, Compass, Shield } from 'lucide-react';

export default function OfflinePage() {
  const [reconnecting, setReconnecting] = React.useState(false);

  const handleRetry = () => {
    setReconnecting(true);
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 text-center space-y-6">
      <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-border/80 shadow-md mx-auto bg-surface">
        <Image
          src="/main_logo.jpg"
          alt="Campusly Logo"
          width={80}
          height={80}
          className="w-full h-full object-cover dark:hidden"
          priority
        />
        <Image
          src="/inverted_logo.jpg"
          alt="Campusly Logo"
          width={80}
          height={80}
          className="w-full h-full object-cover hidden dark:block"
          priority
        />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-[10px] uppercase font-mono tracking-widest text-ink-muted">
          Offline Mode • Cached Pages Available
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-ink dark:text-ink-dark">
          Campus Network Unavailable
        </h1>
        <p className="text-xs text-ink-muted dark:text-ink-muted-dark leading-relaxed">
          You are currently offline or experiencing campus Wi-Fi interruption at ABU Zaria.
          Pages you have previously visited remain accessible offline from your local cache.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleRetry}
          disabled={reconnecting}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cypress-green text-white font-semibold text-xs hover:opacity-90 transition-opacity cursor-pointer shadow-sm flex items-center justify-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${reconnecting ? 'animate-spin' : ''}`} />
          <span>Try Reconnecting</span>
        </button>

        <Link
          href="/"
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-border text-xs text-ink hover:bg-surface-raised flex items-center justify-center gap-1.5"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Open Cached Registry</span>
        </Link>
      </div>

      <div className="pt-8 border-t border-border/60 max-w-sm mx-auto text-[11px] text-ink-muted">
        <p>New submissions, live votes, and receipt uploads will sync automatically once reconnected.</p>
      </div>
    </div>
  );
}
