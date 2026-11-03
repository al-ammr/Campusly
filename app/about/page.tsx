export default function AboutPage() {
  return (
    <article className="max-w-[70ch] mx-auto px-4 py-12 flex flex-col gap-6 text-ink dark:text-ink-dark leading-relaxed">
      <h1 className="font-display font-bold text-3xl sm:text-4xl">
        About Campusly
      </h1>

      <p className="text-base text-ink-muted dark:text-ink-muted-dark leading-relaxed">
        Campusly is an installable, no-login web application (PWA) built specifically for students, academic societies, and organizations at Ahmadu Bello University, Zaria.
      </p>

      <h2 className="font-display font-bold text-2xl mt-4">Our Purpose</h2>
      <p className="text-base">
        Campus life at ABU Zaria is vibrant, with hundreds of faculty clubs, technical associations, cultural guilds, and professional societies across Samaru and Kongo campuses. However, discovering these communities and staying updated on real opportunities has traditionally relied on fragmented WhatsApp groups and paper flyers.
      </p>

      <p className="text-base">
        Campusly unifies campus discovery into a single, lightning-fast platform designed to work under low-bandwidth network conditions and offline.
      </p>

      <h2 className="font-display font-bold text-2xl mt-4">Run by GDGOC ABU Zaria</h2>
      <p className="text-base">
        Campusly is developed, maintained, and moderated as an open-source community initiative by the Google Developer Groups on Campus (GDGOC) Ahmadu Bello University chapter.
      </p>
    </article>
  );
}
