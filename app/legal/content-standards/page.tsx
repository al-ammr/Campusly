import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldAlert, BookOpen, CheckCircle, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Content Standards & Moderation Policy | Campusly ABU Zaria',
  description:
    'Authoritative community guidelines, listing restrictions, and academic integrity policies on Campusly.',
};

export default function ContentStandardsPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-10 space-y-8 text-ink dark:text-ink-dark">
      <header className="border-b border-border/80 dark:border-border-dark/80 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-ink-muted">
          <span>ABU Zaria Campus Almanac</span>
          <span>•</span>
          <span>Version 1.0 (Academic Session 2026)</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-ink dark:text-ink-dark">
          Content Standards &amp; Moderation
        </h1>
        <p className="text-sm text-ink-muted leading-relaxed">
          Standardized guidelines governing student society registrations, campus bulletins, and opportunity listings.
        </p>
      </header>

      <section className="space-y-4 text-xs sm:text-sm leading-relaxed text-ink-muted dark:text-ink-muted-dark">
        <h2 className="font-serif text-lg font-bold text-ink dark:text-ink-dark">1. Academic &amp; Community Integrity</h2>
        <p>
          Campusly is a dedicated collegiate registry serving Ahmadu Bello University (Samaru and Kongo campuses).
          All public listings must reflect genuine university societies, departmental associations, registered clubs,
          or verified academic initiatives. Impersonation of university faculties, senate organs, or unauthorized entities is strictly prohibited.
        </p>

        <h2 className="font-serif text-lg font-bold text-ink dark:text-ink-dark">2. Commercial Content Restrictions</h2>
        <p>
          Student organization and event submissions must not contain commercial advertisements, retail product sales,
          or fee-for-service solicitations. Commercial enterprises and student entrepreneurs wishing to reach the campus
          community must use the designated{' '}
          <Link href="/spotlight/new" className="text-accent underline font-semibold">
            Spotlight Enterprise Directory
          </Link>{' '}
          governed by commercial advertising standards.
        </p>

        <h2 className="font-serif text-lg font-bold text-ink dark:text-ink-dark">3. Prohibited Submissions</h2>
        <p>The following categories of content are strictly refused and will trigger immediate moderation action:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Political party campaigns, partisan propaganda, or sectarian promotions.</li>
          <li>Academic dishonesty, exam malpractice facilitation, or unauthorized term paper sales.</li>
          <li>Defamatory, offensive, discriminatory, or sexually explicit content.</li>
          <li>Ponzi schemes, crypto investment solicitations, or unverified financial networks.</li>
          <li>Secret cult activities or non-accredited clandestine student groups.</li>
        </ul>

        <h2 className="font-serif text-lg font-bold text-ink dark:text-ink-dark">4. Moderation &amp; Auto-Hide Protocol (D07 BR-040)</h2>
        <p>
          To maintain peer safety without algorithmic bias, Campusly implements a community-driven reporting protocol.
          If three (3) distinct student devices flag a listing for safety violations within seven (7) days, the listing is
          automatically quarantined from public discovery and routed to the Administrative Review Console for human inspection.
        </p>

        <h2 className="font-serif text-lg font-bold text-ink dark:text-ink-dark">5. Takedowns &amp; Appeals</h2>
        <p>
          If you believe a listing violates your intellectual property, faculty rights, or privacy, you may submit a formal
          notice through our{' '}
          <Link href="/contact" className="text-accent underline font-semibold">
            Contact &amp; Takedown Form
          </Link>
          .
        </p>
      </section>
    </article>
  );
}
