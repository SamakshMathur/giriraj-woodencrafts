import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { EditableImage } from "@/components/EditableImage";
import { Reveal } from "@/components/Reveal";
import { GALLERY_IMAGES } from "@/lib/craft";

// See app/about/page.tsx for why this is explicit here rather than relied
// on cascading from app/template.tsx.
export const dynamic = "force-dynamic";

const CATEGORIES = [
  "Customer Homes",
  "Temple Lighting",
  "Close-up Details",
  "Royal Collection",
  "Behind the Scenes",
  "Workshop",
];

// Scoped to this page only, same reasoning as the homepage's override
// maps — GALLERY_IMAGES (lib/craft.ts) is also read by each product's
// detail-page gallery as a fallback default, so replacing entries there
// directly would silently change those pages too. This only replaces
// what's rendered here.
const GALLERY_PAGE_IMAGE_OVERRIDES: Record<number, { src: string; label: string }> = {
  0: { src: "/images/mandirs/gallery-small-standing-mandir.webp", label: "Customer Homes" },
  1: { src: "/images/mandirs/gallery-peacock-medallion-arch.webp", label: "Royal Collection" },
  2: { src: "/images/mandirs/gallery-carved-drawer-detail.webp", label: "Close-up Details" },
  3: { src: "/images/mandirs/gallery-pillar-corner-detail.webp", label: "Close-up Details" },
  4: { src: "/images/mandirs/gallery-peacock-corner-detail.webp", label: "Close-up Details" },
  5: { src: "/images/mandirs/gallery-carved-mandala-disc.webp", label: "Behind the Scenes" },
  6: { src: "/images/mandirs/gallery-gold-arch-corner.webp", label: "Royal Collection" },
  7: { src: "/images/mandirs/gallery-peacock-wheel-crown.webp", label: "Close-up Details" },
  8: { src: "/images/mandirs/gallery-swan-carving-detail.webp", label: "Close-up Details" },
};

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
          {GALLERY_IMAGES.map((item, i) => {
            const override = GALLERY_PAGE_IMAGE_OVERRIDES[i];
            return (
              <Reveal
                key={item.src}
                className="relative mb-4 overflow-hidden break-inside-avoid rounded-2xl bg-card shadow-warm-sm"
                style={{ aspectRatio: ["4/5", "1/1", "3/4"][i % 3] }}
                delay={(i % 6) * 0.06}
              >
                <EditableImage
                  id={`gallery-${i}`}
                  src={override?.src ?? item.src}
                  alt={override?.label ?? item.label}
                  className="object-cover"
                />
              </Reveal>
            );
          })}
        </div>
      </Section>
    </>
  );
}
