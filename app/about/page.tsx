import { PageHero } from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import { EditableImage } from "@/components/EditableImage";
import { EditableText } from "@/components/EditableText";

// Explicit per-page, not just relying on app/template.tsx's
// dynamic = "force-dynamic": that alone was NOT reliably cascading once
// the data layer moved off Vercel Blob's fetch()-based SDK to MongoDB's
// raw TCP driver — Next.js's static analyzer previously also picked up
// the uncached fetch() calls as its own independent dynamic-rendering
// signal, which masked the fact the template-level setting alone wasn't
// enough. Confirmed directly (same pattern as the /products/[slug] fix):
// without this, `next build` prerenders this page once at build time and
// freezes it, so admin edits never appear until the next deploy.
export const dynamic = "force-dynamic";

// Matches the homepage's "Our Collections" 6 photos exactly (this array
// is local to this page only, not shared elsewhere, so no scoped-override
// pattern is needed here).
const FACTORY_IMAGES = [
  "/images/mandirs/traditional-collection-deity-altar.webp",
  "/images/mandirs/royal-collection-arch-mandir.webp",
  "/images/mandirs/compact-apartments-mandir.webp",
  "/images/mandirs/modern-carved-pedestal-table.webp",
  "/images/mandirs/wall-mounted-peacock-legs.webp",
  "/images/mandirs/maharaja-gold-frame.webp",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        id="about-hero"
        eyebrow="About Giriraj"
        title="Where Devotion Meets Craftsmanship"
        subtitle="A family of woodworkers, three generations deep."
      />

      <Section className="bg-bg pt-0">
        <div className="grid items-center gap-14 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#150d07] shadow-warm-sm">
            {/* object-contain, not object-cover: this is a square logo
                with text and icons all the way to its edges, and the
                container is a wide 4:3 box — cover would crop the crest
                or the tagline. Contain fits the whole mark, letterboxed
                on a background matched to the logo's own dark backdrop
                so the bars are invisible rather than looking like empty
                space. */}
            <EditableImage
              id="about-story-photo"
              src="/images/logo/giriraj-woodencrafts-full-logo.webp"
              alt="Giriraj Woodencrafts — crafted with devotion, made to last generations"
              className="object-contain"
            />
          </div>
          <div>
            <SectionHeading
              id="about-story"
              align="left"
              eyebrow="Our Story"
              title="Three Generations of Sacred Woodwork"
              subtitle="What began as a single workshop has grown into a home for artisans who carry forward a craft passed down through families, not classrooms."
            />
          </div>
        </div>
      </Section>

      <Section className="bg-bg-secondary">
        <SectionHeading id="about-values" eyebrow="Values" title="What We Stand For" />
        <div className="mt-16 grid gap-10 sm:grid-cols-3">
          {[
            { name: "Authenticity", image: "/images/mandirs/value-authenticity-lotus-panel.webp" },
            { name: "Patience", image: "/images/mandirs/value-patience-floral-panel.webp" },
            { name: "Reverence", image: "/images/mandirs/value-reverence-deity-panel.webp" },
          ].map(({ name: value, image }) => (
            <div key={value} className="text-center">
              <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-2xl shadow-warm-sm">
                <EditableImage
                  id={`about-value-${value.toLowerCase()}-image`}
                  src={image}
                  alt={`${value} — hand-carved detail`}
                  className="object-cover"
                />
              </div>
              <EditableText
                id={`about-value-${value.toLowerCase()}-title`}
                defaultValue={value}
                as="h3"
                className="mt-6 font-heading text-2xl text-text"
              />
              <EditableText
                id={`about-value-${value.toLowerCase()}-detail`}
                defaultValue="Detail on this value coming soon."
                as="p"
                multiline
                className="mt-3 text-sm leading-relaxed text-text-secondary"
              />
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-bg">
        <SectionHeading id="about-workshop" eyebrow="The Workshop" title="Where It All Comes Together" />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FACTORY_IMAGES.map((src, i) => (
            <div
              key={src}
              className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-warm-sm"
            >
              <EditableImage
                id={`about-factory-${i}`}
                src={src}
                alt="Giriraj workshop"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
