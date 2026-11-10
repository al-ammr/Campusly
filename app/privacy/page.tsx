import Link from 'next/link';
import { Lock, ArrowLeft, ShieldCheck, Database, EyeOff } from 'lucide-react';

export const metadata = {
  title: 'Privacy Notice | Campusly - Ahmadu Bello University',
  description:
    'Campusly zero-login privacy notice and NDPR data protection policy for ABU Zaria students.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-brand dark:text-brand-dark hover:underline transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
          <span>Back to Home</span>
        </Link>
      </nav>

      {/* Main Container */}
      <article className="rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark p-6 sm:p-10 shadow-xs flex flex-col gap-6 text-ink dark:text-ink-dark">
        <header className="border-b border-border/70 dark:border-border-dark/70 pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-surface-container dark:bg-canvas-dark border border-border dark:border-border-dark text-xs font-semibold">
            <Lock className="w-4 h-4 text-brand dark:text-brand-dark" strokeWidth={1.5} />
            <span className="uppercase tracking-wider font-mono text-secondary-light dark:text-secondary text-[11px] font-bold">
              Privacy &amp; Data Rights
            </span>
            <span className="text-border dark:text-border-dark">•</span>
            <span className="text-ink-muted dark:text-ink-muted-dark text-[11px] font-mono">
              NDPR Compliant
            </span>
          </div>

          <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink dark:text-ink-dark">
            Privacy Policy &amp; Data Commitment
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-muted-dark">
            How Campusly protects student privacy through zero-login architecture and strict minimal data collection.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-ink dark:text-ink-dark">
            1. Zero-Login Architecture
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-muted-dark leading-relaxed">
            Campusly is intentionally engineered to require NO user registration, NO accounts, and NO passwords. You can browse all community records, view event locations, search opportunities, and rate campus businesses without handing over your personal phone number or email address.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-ink dark:text-ink-dark">
            2. Local Device Storage
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-muted-dark leading-relaxed">
            Personal preferences—including your Light/Dark color scheme, starred listings, and in-progress submission drafts—are stored strictly on your local browser via localStorage and indexedDB. This data remains on your physical device and is never sent to our servers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-ink dark:text-ink-dark">
            3. Submission Information &amp; Public Transparency
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-muted-dark leading-relaxed">
            When you voluntarily submit a club, event, or business, the contact numbers, handles, and venue details provided are published for public campus discovery. Do not submit sensitive personal information (such as private bank details or national identification numbers).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-ink dark:text-ink-dark">
            4. Nigeria Data Protection Regulation (NDPR)
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-muted-dark leading-relaxed">
            In compliance with the Nigeria Data Protection Act and NDPR directives, any student whose details or contact numbers appear on Campusly has the right to request immediate correction or permanent erasure. Submit an erasure request anytime via our{' '}
            <Link href="/contact" className="text-brand dark:text-brand-dark underline font-semibold">
              Data Subject Rights Desk
            </Link>
            .
          </p>
        </section>
      </article>
    </div>
  );
}
