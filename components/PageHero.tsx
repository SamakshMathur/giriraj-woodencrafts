export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="page-hero-gradient pt-40 pb-20 md:pt-48 md:pb-28">
      <div className="mx-auto max-w-content px-6 text-center md:px-10">
        <p className="mb-4 font-display text-xs uppercase tracking-widest2 text-accent">
          {eyebrow}
        </p>
        <h1 className="font-heading text-4xl font-medium leading-tight text-text md:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-text-secondary md:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
