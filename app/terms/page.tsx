export default function TermsPage() {
  return (
    <article className="max-w-[70ch] mx-auto px-4 py-12 flex flex-col gap-6 text-ink dark:text-ink-dark leading-relaxed">
      <h1 className="font-display font-bold text-3xl sm:text-4xl">
        Terms of Use
      </h1>

      <p className="text-sm text-ink-muted dark:text-ink-muted-dark">
        Last updated: November 2026
      </p>

      <p className="text-base">
        Welcome to Campusly. By accessing or using Campusly, you agree to comply with these Terms of Use and our Community Guidelines.
      </p>

      <h2 className="font-display font-bold text-xl mt-4">1. Use of the Service</h2>
      <p className="text-base">
        Campusly is provided free of charge for students and student organizations at Ahmadu Bello University. You agree to use the platform in good faith and not to submit fraudulent, abusive, or infringing content.
      </p>

      <h2 className="font-display font-bold text-xl mt-4">2. Submissions and Moderation</h2>
      <p className="text-base">
        All public submissions (communities, events, opportunities) undergo review by student administrators before publication. We reserve the right to decline or remove any listing that violates campus rules or community safety policies.
      </p>
    </article>
  );
}
