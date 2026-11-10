import type { Metadata, Viewport } from 'next';
import PwaInstallPrompt from '@/components/PwaInstallPrompt';
import { OfflineBanner } from '@/components/OfflineBanner';
import { ScrollRevealInit } from '@/components/ScrollRevealInit';
import '../styles/tokens.css';
import '../styles/globals.css';
import { themeInitScript } from '@/lib/theme';
import { ThemeProvider } from '@/lib/theme/theme-provider';
import { ToastProvider } from '@/components/ui/toast';
import { AppShell } from '@/components/shell';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'Campusly | ABU Zaria Campus Discovery',
  description:
    'An installable no-login web app helping students at Ahmadu Bello University discover communities, events, and opportunities.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.jpg', type: 'image/jpeg' },
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      { url: '/favicon.jpg', type: 'image/jpeg' },
    ],
  },
  openGraph: {
    title: 'Campusly | ABU Zaria Campus Discovery',
    description: 'Discover communities, events and opportunities at Ahmadu Bello University.',
    images: [
      {
        url: '/logo.jpg',
        width: 2400,
        height: 1792,
        alt: 'Campusly Official Logo',
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFF0' },
    { media: '(prefers-color-scheme: dark)', color: '#16120F' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-NG"
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.jfif" type="image/jpeg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.jfif" />
        {/* Theme init script before first paint to prevent flash (UI-205) */}
        <script
          dangerouslySetInnerHTML={{
            __html: themeInitScript,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for (var i = 0; i < registrations.length; i++) {
                    registrations[i].unregister();
                  }
                });
                if ('caches' in window) {
                  caches.keys().then(function(keys) {
                    keys.forEach(function(key) { caches.delete(key); });
                  });
                }
              } else {
                navigator.serviceWorker.register('/sw.js');
              }
            });
          }`
          }}
        />
      </head>
      <body className="font-sans bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark min-h-screen">
        <ThemeProvider>
          <ToastProvider>
            <ScrollRevealInit />
            <OfflineBanner />
            <PwaInstallPrompt />
            <AppShell>{children}</AppShell>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
