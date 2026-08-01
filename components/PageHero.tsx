import { EditableText } from "@/components/EditableText";

export function PageHero({
  id,
  eyebrow,
  title,
  subtitle,
}: {
  id: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="page-hero-gradient pt-40 pb-20 md:pt-48 md:pb-28">
      <div className="mx-auto max-w-content px-6 text-center md:px-10">
        <EditableText
          id={`${id}-eyebrow`}
          defaultValue={eyebrow}
          as="p"
          className="mb-4 font-display text-xs uppercase tracking-widest2 text-accent"
        />
        <EditableText
          id={`${id}-title`}
          defaultValue={title}
          as="h1"
          className="font-heading text-4xl font-medium leading-tight text-text md:text-6xl"
        />
        {subtitle && (
          <EditableText
            id={`${id}-subtitle`}
            defaultValue={subtitle}
            as="p"
            multiline
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-text-secondary md:text-lg"
          />
        )}
      </div>
    </section>
  );
}
