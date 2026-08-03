import { EditableText } from "@/components/EditableText";
import { Reveal } from "@/components/Reveal";

export function Section({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`px-6 py-24 md:px-10 md:py-32 ${className}`}>
      <div className="mx-auto max-w-content">{children}</div>
    </section>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <EditableText
          id={`${id}-eyebrow`}
          defaultValue={eyebrow}
          as="p"
          className="mb-4 font-display text-xs uppercase tracking-widest2 text-accent"
        />
      )}
      <EditableText
        id={`${id}-title`}
        defaultValue={title}
        as="h2"
        className="font-heading text-4xl font-medium leading-tight text-text md:text-5xl"
      />
      {subtitle && (
        <EditableText
          id={`${id}-subtitle`}
          defaultValue={subtitle}
          as="p"
          multiline
          className="mt-5 text-base leading-relaxed text-text-secondary md:text-lg"
        />
      )}
    </Reveal>
  );
}
