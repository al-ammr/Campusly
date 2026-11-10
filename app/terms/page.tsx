import Link from 'next/link';
import { ShieldAlert, ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Terms of Use | Campusly - Ahmadu Bello University',
  description:
    'Terms of service, community guidelines, and listing moderation standards for Campusly.',
};

export default function TermsPage() {
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
            <FileText className="w-4 h-4 text-brand dark:text-brand-dark" strokeWidth={1.5} />
            <span className="uppercase tracking-wider font-mono text-secondary-light dark:text-secondary text-[11px] font-bold">
              User Agreement
            </span>
            <span className="text-border dark:text-border-dark">•</span>
            <span className="text-ink-muted dark:text-ink-muted-dark text-[11px] font-mono">
              Effective November 2026
            </span>
          </div>

          <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink dark:text-ink-dark">
            Terms of Use &amp; Community Guidelines
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-muted-dark">
            Governing rules for accessing, submitting, and engaging on the Campusly platform at Ahmadu Bello University.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-ink dark:text-ink-dark">
            1. Purpose and Good-Faith Use
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-muted-dark leading-relaxed">
            Campusly is provided free of charge for students, faculty associations, and campus organizations at Ahmadu Bello University, Zaria. By using or submitting information to Campusly, you agree to act in good faith and refrain from submitting fraudulent, misleading, or unauthorized notices.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-ink dark:text-ink-dark">
            2. Submission Screening and Peer Moderation
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-muted-dark leading-relaxed">
            Every submission (community profile, event announcement, opportunity notice, or business listing) is subject to manual verification by student administrators from GDGOC ABU Zaria before public indexing. We reserve the right to decline, edit for typographical clarity, or revoke listings that fail safety, legality, or institutional conduct standards.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-ink dark:text-ink-dark">
            3. Business and Commercial Listings
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-muted-dark leading-relaxed">
            Free business listings are provided for student entrepreneurs. Commercial spotlights and promotional slots are non-exclusive and subject to periodic verification. In the event of substantiated customer complaints or deceptive trade practices, listings will be delisted immediately without refund.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-ink dark:text-ink-dark">
            4. Intellectual Property and Content Ownership
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-muted-dark leading-relaxed">
            Student groups retain full copyright in their original creative logos and promotional media. By submitting content, you grant Campusly a royalty-free license to display and distribute the material across the platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-ink dark:text-ink-dark">
            5. Takedowns and Violations
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-muted-dark leading-relaxed">
            To report copyright infringements, unauthorized student club impersonation, or defamatory entries, please file an immediate request via our{' '}
            <Link href="/contact" className="text-brand dark:text-brand-dark underline font-semibold">
              Contact &amp; Assistance Desk
            </Link>
            . Notices are reviewed within 48 business hours.
          </p>
        </section>
      </article>
    </div>
  );
}
