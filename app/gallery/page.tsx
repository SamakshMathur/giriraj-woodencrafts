import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { EditableImage } from "@/components/EditableImage";
import { Reveal } from "@/components/Reveal";
import { GALLERY_IMAGES } from "@/lib/craft";

const CATEGORIES = [
  "Customer Homes",
  "Temple Lighting",
  "Close-up Details",
  "Royal Collection",
  "Behind the Scenes",
  "Workshop",
];

export default function GalleryPage() {
  return (
    <>
      <PageHero
        id="gallery-hero"
        eyebrow="Gallery"
        title="Moments Carved in Wood"
        subtitle="Customer homes, close-up carvings, and the workshop behind them."
      />

      <Section className="bg-bg pt-0">
        <div className="mb-10 flex flex-wrap gap-3">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-widest2 transition-colors duration-300 ${
                i === 0
                  ? "border-accent bg-accent text-brand-secondary"
                  : "border-border text-muted hover:text-text"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="columns-2 gap-4 md:columns-3">
          {GALLERY_IMAGES.map((item, i) => (
            <Reveal
              key={item.src}
              className="relative mb-4 overflow-hidden break-inside-avoid rounded-2xl bg-card shadow-warm-sm"
              style={{ aspectRatio: ["4/5", "1/1", "3/4"][i % 3] }}
              delay={(i % 6) * 0.06}
            >
              <EditableImage
                id={`gallery-${i}`}
                src={item.src}
                alt={item.label}
                className="object-cover"
              />
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
