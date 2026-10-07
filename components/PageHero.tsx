import { EditableText } from "@/components/EditableText";
import { EditableImage } from "@/components/EditableImage";
import { Ornament } from "@/components/Ornament";

// No scroll-reveal here on purpose — PageHero is always the first thing
// visible on page load (no scrolling required), so a whileInView animation
// would risk a flash of invisible/dim text on the page's main heading
// while JS hydrates, on slower connections. Reveal is reserved for
// below-the-fold content where that risk doesn't apply.
//
// With an `image`, the page opens on a photo of the work (darkened so the
// heading stays readable), replaceable in admin mode via `${id}-image`.
export function PageHero({
  id,
  eyebrow,
  title,
  subtitle,
  image,
  imagePosition = "center",
}: {
  id: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  image?: string;
  /** CSS object-position for the photo, e.g. "center 30%". */
  imagePosition?: string;
}) {
  if (!image) {
    return (
      <section className="page-hero-gradient pb-20 pt-40 md:pb-28 md:pt-48">
        <div className="mx-auto max-w-content px-6 text-center md:px-10">
          <HeroText id={id} eyebrow={eyebrow} title={title} subtitle={subtitle} light={false} />
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-brand-secondary pb-20 pt-40 md:pb-28 md:pt-52">
      <div className="absolute inset-0" style={{ ["--hero-pos" as string]: imagePosition }}>
        <EditableImage
          id={`${id}-image`}
          src={image}
          alt=""
          className="object-cover [object-position:var(--hero-pos)]"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/75" />
      <div className="relative z-30 mx-auto max-w-content px-6 text-center md:px-10">
        <HeroText id={id} eyebrow={eyebrow} title={title} subtitle={subtitle} light />
      </div>
    </section>
  );
}

function HeroText({
  id,
  eyebrow,
  title,
  subtitle,
  light,
}: {
  id: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  light: boolean;
}) {
  return (
    <>
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
        className={`font-heading text-4xl font-medium leading-tight md:text-6xl ${light ? "text-white" : "text-text"}`}
      />
      <Ornament className="mx-auto mt-5" />
      {subtitle && (
        <EditableText
          id={`${id}-subtitle`}
          defaultValue={subtitle}
          as="p"
          multiline
          className={`mx-auto mt-5 max-w-xl text-base leading-relaxed md:text-lg ${
            light ? "text-white/80" : "text-text-secondary"
          }`}
        />
      )}
    </>
  );
}
