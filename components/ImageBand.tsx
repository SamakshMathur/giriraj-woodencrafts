import Link from "next/link";
import { EditableImage } from "@/components/EditableImage";
import { EditableText } from "@/components/EditableText";
import { Ornament } from "@/components/Ornament";

/**
 * A full-width photo band with one short line over it. Breaks up long runs
 * of light sections and puts the craft itself front and centre.
 */
export function ImageBand({
  id,
  image,
  quote,
  caption,
  cta,
}: {
  id: string;
  image: string;
  quote: string;
  caption?: string;
  cta?: { href: string; label: string };
}) {
  return (
    <section className="relative overflow-hidden bg-brand-secondary">
      <div className="absolute inset-0">
        <EditableImage id={`${id}-image`} src={image} alt="" className="object-cover" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
      <div className="relative z-30 mx-auto max-w-content px-6 py-28 md:px-10 md:py-40">
        <div className="max-w-2xl">
          <Ornament className="mb-6" />
          <EditableText
            id={`${id}-quote`}
            defaultValue={quote}
            as="p"
            multiline
            className="font-heading text-3xl leading-snug text-white md:text-5xl"
          />
          {caption && (
            <EditableText
              id={`${id}-caption`}
              defaultValue={caption}
              as="p"
              multiline
              className="mt-5 max-w-lg text-sm leading-relaxed text-white/75 md:text-base"
            />
          )}
          {cta && (
            <Link
              href={cta.href}
              className="mt-8 inline-flex items-center gap-2 rounded-md border border-white/40 px-6 py-3 text-sm text-white transition-colors hover:border-accent hover:bg-accent hover:text-brand-secondary"
            >
              {cta.label}
              <span aria-hidden>→</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
