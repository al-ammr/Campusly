'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if opted out or running in test/SSR
    if (typeof window === 'undefined') return;

    try {
      const isOptedOut = localStorage.getItem('campuslyTelemetryOptOut') === 'true';
      if (isOptedOut) {
        setIsVisible(false);
        return;
      }

      const dismissCount = parseInt(localStorage.getItem('campuslyPwaDismissedCount') || '0', 10);
      if (dismissCount >= 2) {
        setIsVisible(false);
        return;
      }

      // Default visible for first-time prompt or test environments
      setIsVisible(true);

      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setIsVisible(true);
      };

      window.addEventListener('beforeinstallprompt', handler);
      return () => window.removeEventListener('beforeinstallprompt', handler);
    } catch {
      // Fallback if localStorage is inaccessible
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) {
    return null;
  }

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    try {
      const count = parseInt(localStorage.getItem('campuslyPwaDismissedCount') || '0', 10);
      localStorage.setItem('campuslyPwaDismissedCount', (count + 1).toString());
    } catch {
      // Ignore storage errors
    }
    setIsVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-install-title"
      aria-describedby="pwa-install-description"
      className="fixed bottom-20 left-4 right-4 z-40 max-w-md mx-auto p-4 rounded-xl bg-surface border border-border shadow-lg transition-all animate-in fade-in slide-in-from-bottom-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-border shadow-xs shrink-0 bg-surface">
          <Image
            src="/main_logo.jpg"
            alt="Campusly Icon"
            width={44}
            height={44}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h2 id="pwa-install-title" className="text-base font-bold text-ink">
            Install Campusly
          </h2>
          <p id="pwa-install-description" className="text-xs text-ink-muted mt-0.5">
            Access ABU Zaria communities and events offline. Fast, light, no login needed.
          </p>
          <div className="flex items-center gap-2 mt-3">
            <button
              type="button"
              onClick={handleInstall}
              className="px-3 py-1.5 rounded-lg bg-brand text-white text-xs font-semibold hover:bg-brand-strong transition-colors focus:outline-none focus:ring-2 focus:ring-focusRing"
            >
              Add to Home screen
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="px-3 py-1.5 rounded-lg bg-surface-container text-ink-muted hover:text-ink text-xs font-medium transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Close install prompt"
          className="text-ink-muted hover:text-ink p-1 rounded-md transition-colors"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
