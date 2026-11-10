import type { Metadata } from 'next';
import Link from 'next/link';
import { Eye, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Accessibility Statement | Campusly ABU Zaria',
  description:
    'Our commitment to digital accessibility, WCAG 2.1 Level AA conformance, and universal campus usability.',
};

export default function AccessibilityStatementPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-10 space-y-8 text-ink dark:text-ink-dark">
      <header className="border-b border-border/80 dark:border-border-dark/80 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-ink-muted">
          <span>ABU Zaria Universal Access Initiative</span>
          <span>•</span>
          <span>WCAG 2.1 Level AA Conformance</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-ink dark:text-ink-dark">
          Accessibility Statement
        </h1>
        <p className="text-sm text-ink-muted leading-relaxed">
          Ensuring equitable access to student society registries, campus schedules, and collegiate opportunities for every student.
        </p>
      </header>

      <section className="space-y-4 text-xs sm:text-sm leading-relaxed text-ink-muted dark:text-ink-muted-dark">
        <h2 className="font-serif text-lg font-bold text-ink dark:text-ink-dark">1. Our Accessibility Standards</h2>
        <p>
          Campusly is engineered to adhere strictly to the World Wide Web Consortium (W3C) Web Content Accessibility Guidelines (WCAG) 2.1
          Level AA standards. We believe university tools should be effortlessly usable by all students, regardless of physical, visual,
          cognitive, or technological abilities.
        </p>

        <h2 className="font-serif text-lg font-bold text-ink dark:text-ink-dark">2. Concrete Measures Implemented</h2>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Keyboard Navigation &amp; Focus Rings:</strong> Every interactive element is fully operable via keyboard with prominent, high-visibility 3px focus rings.</li>
          <li><strong>Skip to Content Link:</strong> A primary bypass mechanism allows keyboard and screen reader users to skip directly to main content.</li>
          <li><strong>Minimum Touch Targets:</strong> All buttons, tabs, and interactive controls maintain at least a 44&times;44 CSS pixel tap area for mobile accessibility.</li>
          <li><strong>Color Contrast &amp; Semantic Theming:</strong> Text elements maintain contrast ratios well exceeding 4.5:1 against surfaces in both Light, Dark, and High Contrast themes.</li>
          <li><strong>Zero Emoji-Only Information:</strong> In compliance with collegiate registry standard COP-11, no status, category, or interaction relies solely on emoji characters.</li>
          <li><strong>Screen Reader Optimization:</strong> Proper ARIA roles, live regions for alerts, and descriptive labels are maintained across all dialogs and modals.</li>
        </ul>

        <h2 className="font-serif text-lg font-bold text-ink dark:text-ink-dark">3. Feedback &amp; Accessibility Assistance</h2>
        <p>
          If you encounter any accessibility barrier while browsing Campusly or require content in an alternative format,
          please contact our accessibility team via our{' '}
          <Link href="/contact" className="text-accent underline font-semibold">
            Contact &amp; Assistance Desk
          </Link>
          . We treat accessibility reports with priority.
        </p>
      </section>
    </article>
  );
}
