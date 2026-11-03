export default function PrivacyPage() {
  return (
    <article className="max-w-[70ch] mx-auto px-4 py-12 flex flex-col gap-6 text-ink dark:text-ink-dark leading-relaxed">
      <h1 className="font-display font-bold text-3xl sm:text-4xl">
        Privacy Notice
      </h1>

      <p className="text-sm text-ink-muted dark:text-ink-muted-dark">
        Last updated: November 2026
      </p>

      <p className="text-base">
        Campusly respects your privacy. We are designed from the ground up as a no-login public web application.
      </p>

      <h2 className="font-display font-bold text-xl mt-4">No Personal Accounts</h2>
      <p className="text-base">
        You do not need to create an account, log in, or provide your email address to discover communities, search events, or star listings on Campusly.
      </p>

      <h2 className="font-display font-bold text-xl mt-4">Local Device Storage</h2>
      <p className="text-base">
        Your theme preference (Light/Dark/System) and draft submissions are stored exclusively on your device using browser local storage. They are never transmitted to third parties.
      </p>
    </article>
  );
}
