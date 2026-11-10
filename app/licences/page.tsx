import Link from 'next/link';
import {
  FileCode2,
  ExternalLink,
  Code2,
  Database,
  Layers,
  Palette,
  Type,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Settings,
} from 'lucide-react';

export const metadata = {
  title: 'Open Source Licences | Campusly - Ahmadu Bello University',
  description:
    'Open-source software, font, and tool attributions powering Campusly at ABU Zaria.',
};

interface LicenseItem {
  name: string;
  category: string;
  license: string;
  copyright: string;
  url: string;
  description: string;
  icon: any;
}

const LICENSES: LicenseItem[] = [
  {
    name: 'Next.js & React',
    category: 'Web Framework',
    license: 'MIT License',
    copyright: 'Vercel, Inc. & Meta Platforms',
    url: 'https://github.com/vercel/next.js',
    description:
      'Powers the entire web application, making pages open instantly and smoothly on mobile phones.',
    icon: Code2,
  },
  {
    name: 'Tailwind CSS',
    category: 'Design System',
    license: 'MIT License',
    copyright: 'Tailwind Labs, Inc.',
    url: 'https://tailwindcss.com',
    description:
      'Powers the color tokens, spacing, dark mode, and responsive layout across all screen sizes.',
    icon: Palette,
  },
  {
    name: 'Lucide Icons',
    category: 'Icons',
    license: 'ISC License',
    copyright: 'Lucide Contributors',
    url: 'https://lucide.dev',
    description:
      'Provides all the clean, consistent vector icons used throughout Campusly.',
    icon: Sparkles,
  },
  {
    name: 'Plus Jakarta Sans',
    category: 'Primary Font',
    license: 'SIL Open Font License 1.1',
    copyright: 'Tokotype (Gumpita Rahayu)',
    url: 'https://fonts.google.com/specimen/Plus+Jakarta+Sans',
    description:
      'The modern sans-serif font used for body text, designed for easy reading on mobile screens.',
    icon: Type,
  },
  {
    name: 'Playfair Display',
    category: 'Heading Font',
    license: 'SIL Open Font License 1.1',
    copyright: 'Claus Eggers Sørensen',
    url: 'https://fonts.google.com/specimen/Playfair+Display',
    description:
      'The classic serif font used for editorial headings and campus titles.',
    icon: Type,
  },
  {
    name: 'Zod',
    category: 'Data Validation',
    license: 'MIT License',
    copyright: 'Colin McDonnell',
    url: 'https://zod.dev',
    description:
      'Validates all form inputs, preventing bad data and securing submissions.',
    icon: ShieldCheck,
  },
  {
    name: 'node-postgres (pg)',
    category: 'Database Client',
    license: 'MIT License',
    copyright: 'Brian Carlson',
    url: 'https://node-postgres.com',
    description:
      'Connects the app to the campus database for fast directory and search queries.',
    icon: Database,
  },
  {
    name: 'Radix UI Primitives',
    category: 'Accessible UI',
    license: 'MIT License',
    copyright: 'WorkOS',
    url: 'https://www.radix-ui.com',
    description:
      'Provides accessible dialogs, sheet menus, and interactive dropdown controls.',
    icon: Layers,
  },
  {
    name: 'KaTeX',
    category: 'Math Typesetting',
    license: 'MIT License',
    copyright: 'Emily Eisenberg & Sophie Alpert',
    url: 'https://katex.org',
    description:
      'Renders mathematical formulas and technical symbols cleanly for academic notices.',
    icon: FileCode2,
  },
];

export default function LicencesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col gap-6 sm:gap-8">
      {/* Header - Simple English, NO overhead badges */}
      <div className="flex flex-col gap-2 max-w-2xl">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand/10 dark:bg-brand-dark/15 flex items-center justify-center text-brand dark:text-brand-dark shrink-0">
            <Code2 className="w-5 h-5" strokeWidth={2} />
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink dark:text-ink-dark tracking-tight">
            Open Source Licences
          </h1>
        </div>
        <p className="text-sm sm:text-base text-ink-muted dark:text-ink-muted-dark leading-relaxed">
          Campusly is built with open-source software and open fonts. We want to thank the developers and creators whose work makes this platform possible.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {LICENSES.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className="p-6 rounded-2xl bg-[#FFFFF0] dark:bg-canvas-dark border border-border dark:border-border-dark shadow-xs flex flex-col justify-between gap-4 hover:border-brand/40 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-8 h-8 rounded-xl bg-brand/10 dark:bg-brand-dark/15 flex items-center justify-center text-brand dark:text-brand-dark">
                    <Icon className="w-4 h-4" strokeWidth={2} />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container dark:bg-surface-dark border border-border dark:border-border-dark text-[11px] font-semibold text-brand dark:text-brand-dark">
                    {item.license}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-ink-muted dark:text-ink-muted-dark uppercase tracking-wider block">
                    {item.category}
                  </span>
                  <h2 className="font-display font-bold text-lg text-ink dark:text-ink-dark">
                    {item.name}
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-muted-dark leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-border/70 dark:border-border-dark/70 flex items-center justify-between gap-2 text-xs">
                <span className="text-ink-muted dark:text-ink-muted-dark font-medium truncate text-[11px]">
                  © {item.copyright}
                </span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-brand dark:text-brand-dark font-bold hover:underline shrink-0 text-xs"
                >
                  <span>Project</span>
                  <ExternalLink className="w-3 h-3" strokeWidth={2} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* University Name Note in Simple English */}
      <section className="p-6 rounded-2xl bg-[#FFFFF0] dark:bg-canvas-dark border border-border dark:border-border-dark shadow-xs space-y-2">
        <h3 className="font-display font-bold text-base sm:text-lg text-ink dark:text-ink-dark">
          University Name &amp; Community Project Notice
        </h3>
        <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-muted-dark leading-relaxed">
          &quot;Ahmadu Bello University&quot; and &quot;ABU Zaria&quot; are names and trademarks of Ahmadu Bello University. Campusly is an independent student project built and maintained by the student developer community at Google Developer Groups on Campus (GDGOC) ABU Zaria to help students discover campus life.
        </p>
      </section>

      {/* Quick Links */}
      <div className="flex items-center justify-between gap-4 pt-1 flex-wrap text-xs font-semibold">
        <div className="flex items-center gap-3">
          <Link href="/terms" className="text-ink-muted dark:text-ink-muted-dark hover:text-brand transition-colors">
            Terms of Use &rarr;
          </Link>
          <span className="text-border dark:text-border-dark">•</span>
          <Link href="/privacy" className="text-ink-muted dark:text-ink-muted-dark hover:text-brand transition-colors">
            Privacy Policy &rarr;
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/about"
            className="text-brand dark:text-brand-dark hover:underline"
          >
            Read About Campusly &rarr;
          </Link>
          <Link
            href="/admin/login"
            aria-label="Admin Dashboard"
            title="Admin Dashboard"
            className="p-1.5 rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-canvas-dark text-ink-muted dark:text-ink-muted-dark hover:text-brand dark:hover:text-brand-dark hover:border-brand/40 transition-colors shadow-xs"
          >
            <Settings className="w-4 h-4" strokeWidth={1.75} />
          </Link>
        </div>
      </div>
    </div>
  );
}
