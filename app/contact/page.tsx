export default function ContactPage() {
  return (
    <article className="max-w-[70ch] mx-auto px-4 py-12 flex flex-col gap-6 text-ink dark:text-ink-dark leading-relaxed">
      <h1 className="font-display font-bold text-3xl sm:text-4xl">
        Contact Us
      </h1>

      <p className="text-base text-ink-muted dark:text-ink-muted-dark leading-relaxed">
        Have feedback, questions about community verification, or inquiries about advertising on Spotlight? Reach out to the GDGOC ABU Zaria team.
      </p>

      <div className="p-6 rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark flex flex-col gap-3">
        <h2 className="text-base font-bold">Community Support & Operations</h2>
        <p className="text-sm">
          Email:{' '}
          <a
            href="mailto:contact@campusly.ng"
            className="text-brand dark:text-brand-dark underline font-medium"
          >
            contact@campusly.ng
          </a>
        </p>
        <p className="text-xs text-ink-muted dark:text-ink-muted-dark">
          Responses are typically provided within 48 hours during academic semesters.
        </p>
      </div>
    </article>
  );
}
