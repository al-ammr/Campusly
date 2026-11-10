'use client';

import * as React from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export function OfflineBanner() {
  const [isOnline, setIsOnline] = React.useState(true);
  const [wasOffline, setWasOffline] = React.useState(false);

  React.useEffect(() => {
    // 1. Service Worker Registration
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.warn('[SW Registration Error]:', err);
        });
      });
    }

    // 2. Connectivity Listeners
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);

      const handleOnline = () => {
        setIsOnline(true);
        setWasOffline(true);
        setTimeout(() => setWasOffline(false), 3000);
      };

      const handleOffline = () => {
        setIsOnline(false);
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  if (isOnline && !wasOffline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-0 left-0 right-0 z-50 py-1.5 px-4 text-xs font-semibold text-center transition-all ${
        !isOnline
          ? 'bg-amber-600 text-white shadow-md'
          : 'bg-emerald-600 text-white shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        {!isOnline ? (
          <>
            <WifiOff className="w-3.5 h-3.5" />
            <span>Campus Network Offline — Showing cached registry data</span>
          </>
        ) : (
          <>
            <Wifi className="w-3.5 h-3.5" />
            <span>Connected to Campus Network</span>
          </>
        )}
      </div>
    </div>
  );
}
