import { EditableText } from "@/components/EditableText";
import { Reveal } from "@/components/Reveal";
import { Ornament } from "@/components/Ornament";

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
  tone = "default",
}: {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  /** "light" for headings placed on a dark background band. */
  tone?: "default" | "light";
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
        className={`font-heading text-4xl font-medium leading-tight md:text-5xl ${
          tone === "light" ? "text-white" : "text-text"
        }`}
      />
      <Ornament className={`mt-5 ${align === "center" ? "mx-auto" : ""}`} />
      {subtitle && (
        <EditableText
          id={`${id}-subtitle`}
          defaultValue={subtitle}
          as="p"
          multiline
          className={`mt-5 text-base leading-relaxed md:text-lg ${
            tone === "light" ? "text-white/70" : "text-text-secondary"
          }`}
        />
      )}
    </Reveal>
  );
}
