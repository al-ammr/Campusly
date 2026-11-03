export default function LicencesPage() {
  return (
    <article className="max-w-[70ch] mx-auto px-4 py-12 flex flex-col gap-6 text-ink dark:text-ink-dark leading-relaxed">
      <h1 className="font-display font-bold text-3xl sm:text-4xl">
        Open Source Licences
      </h1>

      <p className="text-base text-ink-muted dark:text-ink-muted-dark leading-relaxed">
        Campusly is crafted with open-source software and open-licensed design assets.
      </p>

      <div className="flex flex-col gap-4 mt-2">
        <div className="p-4 rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark">
          <h2 className="text-sm font-bold">Lucide Icons</h2>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-1">
            ISC Licence · Copyright (c) Lucide Contributors
          </p>
        </div>

        <div className="p-4 rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark">
          <h2 className="text-sm font-bold">Playfair Display & Plus Jakarta Sans</h2>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-1">
            SIL Open Font License 1.1 · Claus Eggers Sørensen & Tokotype
          </p>
        </div>

        <div className="p-4 rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark">
          <h2 className="text-sm font-bold">Next.js & React</h2>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-1">
            MIT Licence · Copyright (c) Vercel, Inc. & Meta Platforms, Inc.
          </p>
        </div>
      </div>
    </article>
  );
}
