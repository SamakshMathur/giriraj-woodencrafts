import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { GalleryGrid } from "@/components/GalleryGrid";
import { GALLERY_IMAGES } from "@/lib/craft";

// See app/about/page.tsx for why this is explicit here rather than relied
// on cascading from app/template.tsx.
export const dynamic = "force-dynamic";


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

      <Section className="bg-bg pt-8 md:pt-10">
        <GalleryGrid
          items={GALLERY_IMAGES.map((item, i) => ({
            id: `gallery-${i}`,
            src: GALLERY_PAGE_IMAGE_OVERRIDES[i]?.src ?? item.src,
            label: GALLERY_PAGE_IMAGE_OVERRIDES[i]?.label ?? item.label,
          }))}
        />
      </Section>
    </>
  );
}
