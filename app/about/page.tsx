import { PageHero } from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import { EditableImage } from "@/components/EditableImage";

const FACTORY_IMAGES = [
  "/images/mandirs/workshop-wood-selection.webp",
  "/images/mandirs/workshop-seasoning.webp",
  "/images/mandirs/close-up-carving.webp",
  "/images/mandirs/vaikuntha-front.webp",
  "/images/mandirs/hero-dark-mahogany.webp",
  "/images/mandirs/shreeji-front.webp",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Giriraj"
        title="Where Devotion Meets Craftsmanship"
        subtitle="A family of woodworkers, three generations deep."
      />

      <Section className="bg-bg pt-0">
        <div className="grid items-center gap-14 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-warm-sm">
            <EditableImage
              id="about-story-photo"
              src="/images/mandirs/workshop-wood-selection.webp"
              alt="Inside the Giriraj workshop"
              className="object-cover"
            />
          </div>
          <div>
            <SectionHeading
              align="left"
              eyebrow="Our Story"
              title="Three Generations of Sacred Woodwork"
              subtitle="What began as a single workshop has grown into a home for artisans who carry forward a craft passed down through families, not classrooms."
            />
          </div>
        </div>
      </Section>

      <Section className="bg-bg-secondary">
        <SectionHeading eyebrow="Values" title="What We Stand For" />
        <div className="mt-16 grid gap-10 sm:grid-cols-3">
          {["Authenticity", "Patience", "Reverence"].map((value) => (
            <div key={value} className="text-center">
              <h3 className="font-heading text-2xl text-text">{value}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                Detail on this value coming soon.
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-bg">
        <SectionHeading eyebrow="The Workshop" title="Where It All Comes Together" />
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
