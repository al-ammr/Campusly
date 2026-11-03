import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';
import { themeInitScript } from '@/lib/theme';
import { ThemeProvider } from '@/lib/theme/theme-provider';
import { ToastProvider } from '@/components/ui/toast';
import { AppShell } from '@/components/shell';

export const metadata: Metadata = {
  title: 'Campusly | ABU Zaria Campus Discovery',
  description:
    'An installable no-login web app helping students at Ahmadu Bello University discover communities, events, and opportunities.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FCF9F4' },
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
        {/* Theme init script before first paint to prevent flash (UI-205) */}
        <script
          dangerouslySetInnerHTML={{
            __html: themeInitScript,
          }}
        />
      </head>
      <body className="font-sans bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark min-h-screen">
        <ThemeProvider>
          <ToastProvider>
            <AppShell>{children}</AppShell>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
