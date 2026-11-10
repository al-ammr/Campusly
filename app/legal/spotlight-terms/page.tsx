import type { Metadata } from 'next';
import Link from 'next/link';
import { CreditCard, ShieldCheck, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Spotlight Commercial Terms | Campusly ABU Zaria',
  description:
    'Commercial terms of service, payment policies, and refund guidelines for Campusly Spotlight enterprise listings.',
};

export default function SpotlightTermsPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-10 space-y-8 text-ink dark:text-ink-dark">
      <header className="border-b border-border/80 dark:border-border-dark/80 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-ink-muted">
          <span>ABU Enterprise Showcase Registry</span>
          <span>•</span>
          <span>Version 1.0 (LEG-301 to LEG-304)</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-ink dark:text-ink-dark">
          Spotlight Commercial Terms
        </h1>
        <p className="text-sm text-ink-muted leading-relaxed">
          Legal terms governing paid advertisements, commercial promotions, and enterprise showcases on Campusly.
        </p>
      </header>

      <section className="space-y-4 text-xs sm:text-sm leading-relaxed text-ink-muted dark:text-ink-muted-dark">
        <h2 className="font-serif text-lg font-bold text-ink dark:text-ink-dark">1. Scope of Commercial Service</h2>
        <p>
          Spotlight provides student-led businesses, campus ventures, and local enterprises with time-limited promotional
          placement across Ahmadu Bello University discovery channels. What is purchased is a time-limited active listing
          duration (e.g. 3 days for Standard, 4 days for Featured), not a guaranteed sales volume, attendance, or customer conversion rate.
        </p>

        <h2 className="font-serif text-lg font-bold text-ink dark:text-ink-dark">2. Bank Transfer Verification Policy (LEG-304)</h2>
        <p>
          Payment for Spotlight promotions is processed exclusively via Nigerian electronic bank transfer to the official
          university operator account. In strict accordance with security requirement SEC-510, listings are activated only
          after payment has settled and been manually confirmed in the bank account by our finance team.
          Submitting a transfer receipt or screenshot does not constitute immediate activation.
        </p>

        <h2 className="font-serif text-lg font-bold text-ink dark:text-ink-dark">3. Pricing &amp; Order Freezing (BR-105)</h2>
        <p>
          Listing fees (in Nigerian kobo) and duration limits are dynamically read from the authoritative university settings register.
          Once an order reference (e.g. <span className="font-mono font-bold">SPT-ABU-XXXXX</span>) is generated, the price is frozen for forty-eight (48) hours.
          Subsequent adjustments to system pricing do not retroactively alter open or pending orders.
        </p>

        <h2 className="font-serif text-lg font-bold text-ink dark:text-ink-dark">4. Cancellation &amp; Refund Policy</h2>
        <p>
          Refund requests are accommodated if submitted prior to listing activation. Once a commercial showcase has entered
          &ldquo;Active&rdquo; status and begun broadcasting to student viewports, fees are non-refundable. Listings violating
          academic content standards or consumer protection laws will be suspended immediately without refund.
        </p>

        <h2 className="font-serif text-lg font-bold text-ink dark:text-ink-dark">5. Commercial Disclaimer</h2>
        <p>
          Every paid advertisement displays a distinct <strong className="font-semibold text-accent">PAID LISTING</strong> badge
          to differentiate commercial promotions from recognized collegiate societies. Ahmadu Bello University does not endorse,
          warranty, or guarantee products sold through third-party student businesses.
        </p>
      </section>
    </article>
  );
}
