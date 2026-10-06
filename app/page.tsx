import Link from "next/link";
import { Section, SectionHeading } from "@/components/Section";
import { TempleBackground } from "@/components/TempleBackground";
import { TempleAura } from "@/components/TempleAura";
import { TempleSpire } from "@/components/TempleSpire";
import { EditableImage } from "@/components/EditableImage";
import { EditableText } from "@/components/EditableText";
import { Reveal } from "@/components/Reveal";
import { PRODUCTS } from "@/lib/products";
import { CRAFT_STAGES, GALLERY_IMAGES } from "@/lib/craft";
import { whatsAppLink } from "@/lib/whatsapp";

// See app/about/page.tsx for why this is explicit here rather than relied
// on cascading from app/template.tsx.
export const dynamic = "force-dynamic";

// PRODUCTS[].image is now these same showcase photos directly (the earlier
// scoped-override approach was superseded — the homepage card and the
// product's own detail-page hero are meant to show the identical photo,
// not diverge, per explicit request), so no override map is needed here.

// Scoped to the homepage's Gallery preview only, same reasoning as
// SHOWCASE_IMAGE_OVERRIDES above — GALLERY_IMAGES (lib/craft.ts) is
// shared with the full /gallery page via the same gallery-{i} ids, and
// this replacement was scoped to just the homepage section.
const GALLERY_PREVIEW_IMAGE_OVERRIDES: Record<number, string> = {
  0: "/images/mandirs/compact-apartments-mandir.webp",
  1: "/images/mandirs/maharaja-gold-frame.webp",
  2: "/images/mandirs/wall-mounted-frame.webp",
  3: "/images/mandirs/traditional-collection-deity-altar.webp",
  4: "/images/mandirs/gallery-dark-dome-frame.webp",
  5: "/images/mandirs/gallery-elephant-mandir-v2.webp",
};

const CATEGORIES = [
  { slug: "traditional", name: "Traditional Collection", image: "/images/mandirs/traditional-collection-deity-altar.webp" },
  { slug: "royal", name: "Royal Collection", image: "/images/mandirs/royal-collection-arch-mandir.webp" },
  { slug: "modern", name: "Modern Collection", image: "/images/mandirs/compact-apartments-mandir.webp" },
  { slug: "compact", name: "Compact Apartments", image: "/images/mandirs/modern-carved-pedestal-table.webp" },
  { slug: "wall-mounted", name: "Wall Mounted", image: "/images/mandirs/wall-mounted-peacock-legs.webp" },
  { slug: "maharaja", name: "Luxury Maharaja Series", image: "/images/mandirs/maharaja-gold-frame.webp" },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex h-screen min-h-[720px] w-full overflow-hidden bg-brand-secondary text-white">
        <TempleBackground />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Text sits in its own column; the spire in the other. Structurally
            separate, so they can never overlap regardless of viewport width. */}
        <div className="relative z-10 mx-auto grid w-full max-w-content grid-cols-1 md:grid-cols-2">
          <div className="relative flex items-center justify-center pt-28 md:hidden">
            <TempleAura sweepClassName="h-[420px] w-[420px]" glowClassName="h-[300px] w-[300px]" />
            <TempleSpire className="h-[300px] w-auto" />
          </div>

          <div className="flex flex-col justify-end px-6 pb-16 md:px-10 md:pb-32">
            <EditableText
              id="home-hero-eyebrow"
              defaultValue="Handcrafted Divine Spaces"
              as="p"
              className="mb-5 font-display text-xs uppercase tracking-widest2 text-accent"
            />
            <EditableText
              id="home-hero-title"
              defaultValue="Every Home Deserves Its Own Temple."
              as="h1"
              className="font-heading text-5xl font-medium leading-[1.1] md:text-7xl"
            />
            <EditableText
              id="home-hero-subtitle"
              defaultValue="Handcrafted wooden mandirs made with generations of craftsmanship."
              as="p"
              multiline
              className="mt-6 max-w-xl text-base leading-relaxed text-white/80 md:text-lg"
            />
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="rounded-md bg-accent px-7 py-3.5 text-sm text-brand-secondary transition-all duration-300 ease-reverent hover:scale-[1.02] hover:shadow-[0_0_28px_rgba(198,156,69,0.5)]"
              >
                Explore Collection
              </Link>
              <Link
                href="/customization"
                className="rounded-md border border-white/40 px-7 py-3.5 text-sm text-white transition-all duration-300 hover:bg-white/10 hover:shadow-[0_0_24px_rgba(198,156,69,0.35)]"
              >
                Customize Yours
              </Link>
            </div>
          </div>

          <div className="relative hidden items-end justify-center md:flex">
            <TempleAura sweepClassName="h-[920px] w-[920px]" glowClassName="h-[600px] w-[600px]" />
            <TempleSpire className="h-[88%] max-h-[860px] w-auto" />
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 z-10 h-10 w-6 -translate-x-1/2 rounded-full border border-white/40">
          <div className="mx-auto mt-2 h-2 w-1 animate-pulse rounded-full bg-white/70" />
        </div>
      </section>

      {/* Why Giriraj — Trust */}
      <Section className="bg-bg">
        <SectionHeading
          id="home-why"
          eyebrow="Why Giriraj Woodencrafts"
          title="Built on What Cannot Be Rushed"
        />
        <div className="mt-16 grid gap-12 md:grid-cols-3">
          {[
            {
              slug: "premium-wood",
              title: "Premium Wood",
              copy: "Only selected teak and premium hardwood, sourced with care.",
            },
            {
              slug: "hand-carved",
              title: "Hand Carved",
              copy: "Every design carved by skilled artisans, never machine-stamped.",
            },
            {
              slug: "sacred-design",
              title: "Sacred Design",
              copy: "Built according to traditional aesthetics and proportion.",
            },
          ].map((item, i) => (
            <Reveal key={item.title} className="text-center" delay={i * 0.1}>
              <EditableText
                id={`home-why-${item.slug}-title`}
                defaultValue={item.title}
                as="h3"
                className="font-heading text-2xl text-text"
              />
              <EditableText
                id={`home-why-${item.slug}-copy`}
                defaultValue={item.copy}
                as="p"
                multiline
                className="mt-3 text-sm leading-relaxed text-text-secondary"
              />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Luxury Showcase */}
      <Section className="bg-bg-secondary">
        <SectionHeading
          id="home-showcase"
          eyebrow="The Collection"
          title="Luxury Showcase"
          align="left"
        />
        <div className="mt-14 flex gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {PRODUCTS.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group relative aspect-[3/4] w-[280px] shrink-0 overflow-hidden rounded-md bg-card shadow-warm-sm md:w-[360px]"
            >
              <EditableImage
                id={`home-showcase-${product.slug}`}
                src={product.image}
                alt={product.name}
                className="object-cover transition-transform duration-700 ease-reverent group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-reverent group-hover:translate-x-full" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                <EditableText
                  id={`product-${product.slug}-name`}
                  defaultValue={product.name}
                  as="p"
                  className="font-heading text-xl"
                />
                <p className="mt-1 text-xs text-white/70">{product.wood} &middot; Made to order</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Categories */}
      <Section className="bg-bg">
        <SectionHeading id="home-categories" eyebrow="Explore" title="Our Collections" />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category, i) => (
            <Reveal
              key={category.name}
              className="group relative aspect-[4/5] overflow-hidden rounded-md bg-card shadow-warm-sm"
              delay={i * 0.08}
            >
              <EditableImage
                id={`home-category-${category.slug}`}
                src={category.image}
                alt={category.name}
                className="object-cover object-top transition-transform duration-500 ease-reverent group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-16 text-white">
                <EditableText
                  id={`home-category-${category.slug}-name`}
                  defaultValue={category.name}
                  as="h3"
                  className="pointer-events-auto font-heading text-2xl leading-tight"
                />
                <span aria-hidden className="shrink-0 text-accent transition-transform duration-300 group-hover:translate-x-1">→</span>
              </div>
              <Link
                href="/products"
                aria-label={`View ${category.name}`}
                className="absolute inset-0 z-[5]"
              />
              {/* Polish-sweep: a soft light band passing over the photo on
                  hover, clipped by the card's own overflow-hidden — it can
                  never bleed past this card's edges. */}
              <div className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-reverent group-hover:translate-x-full" />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Customization teaser */}
      <Section className="bg-brand-secondary text-white">
        <SectionHeading
          id="home-customize"
          eyebrow="Configure"
          title="Design a Mandir That Is Only Yours"
          tone="light"
        />
        <div className="mt-14 flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-widest2 text-white/70">
          {["Size", "Polishing", "Storage"].map(
            (step, i, arr) => (
              <span key={step} className="flex items-center gap-3">
                <span className="rounded-md border border-white/30 px-4 py-2">
                  {step}
                </span>
                {i < arr.length - 1 && <span className="text-accent">&rarr;</span>}
              </span>
            )
          )}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/customization"
            className="inline-block rounded-md bg-accent px-8 py-3.5 text-sm text-brand-secondary transition-all duration-300 ease-reverent hover:scale-[1.02] hover:shadow-[0_0_28px_rgba(198,156,69,0.5)]"
          >
            Start Customizing
          </Link>
        </div>
      </Section>

      {/* Craftsmanship journey */}
      <Section className="bg-bg">
        <SectionHeading id="home-craft" eyebrow="Process" title="Craftsmanship Journey" />
        <div className="mt-16 flex justify-center gap-8 overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {CRAFT_STAGES.map((stage, i) => (
            <div key={stage.name} className="flex shrink-0 flex-col items-center gap-4 text-center">
              <div className="relative h-20 w-20 overflow-hidden rounded-full border border-border shadow-warm-sm">
                <EditableImage
                  id={`craft-stage-${stage.slug}`}
                  src={stage.image}
                  alt={stage.name}
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm font-heading text-white">
                  {String(i + 1).padStart(2, "0")}
                </div>
              </div>
              <EditableText
                id={`craft-stage-${stage.slug}-name`}
                defaultValue={stage.name}
                as="p"
                className="w-32 text-sm text-text-secondary"
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Gallery preview */}
      <Section className="bg-bg-secondary">
        <SectionHeading id="home-gallery" eyebrow="Moments" title="Gallery" />
        <div className="mt-14 columns-2 gap-4 md:columns-3">
          {GALLERY_IMAGES.slice(0, 6).map((item, i) => (
            <Reveal
              key={item.src}
              className="relative mb-4 overflow-hidden break-inside-avoid rounded-md bg-card shadow-warm-sm"
              style={{ aspectRatio: i % 2 === 0 ? "4/5" : "1/1" }}
              delay={i * 0.06}
            >
              <EditableImage
                id={`gallery-${i}`}
                src={GALLERY_PREVIEW_IMAGE_OVERRIDES[i] ?? item.src}
                alt={item.label}
                className="object-cover"
              />
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/gallery"
            className="text-sm text-accent underline-offset-4 hover:underline"
          >
            View Full Gallery
          </Link>
        </div>
      </Section>

      {/* Testimonials */}
      <Section className="bg-bg-secondary">
        <SectionHeading id="home-testimonials" eyebrow="Testimonials" title="Customer Stories" />
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {[
            {
              quote:
                "The mandir feels like it has always belonged in our home. The craftsmanship is beyond anything we imagined.",
              name: "Samaksh Mathur",
              location: "Royal Collection",
            },
            {
              quote:
                "Every detail was handled with such care, from the first sketch to the final polish. It truly feels like a piece of our heritage.",
              name: "Aryan Goyal",
              location: "Traditional Collection",
            },
            {
              quote:
                "We wanted something authentic, not mass-produced. Giriraj Woodencrafts delivered exactly that, and more.",
              name: "Saksham Singhal",
              location: "Modern Collection",
            },
          ].map((testimonial, idx) => {
            const i = idx + 1;
            return (
              <Reveal key={i} className="flex flex-col rounded-md border border-border bg-card p-8" delay={(i - 1) * 0.1}>
                <span aria-hidden className="mb-3 font-heading text-5xl leading-none text-accent">&ldquo;</span>
                <EditableText
                  id={`home-testimonial-${i}-quote`}
                  defaultValue={testimonial.quote}
                  as="p"
                  multiline
                  className="mb-6 text-sm leading-relaxed text-text-secondary"
                />
                <div className="mt-auto flex items-center gap-3 border-t border-border pt-6">
                  <div
                    aria-hidden
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 font-heading text-base text-accent"
                  >
                    {testimonial.name
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <EditableText
                      id={`home-testimonial-${i}-name`}
                      defaultValue={testimonial.name}
                      as="p"
                      className="text-sm font-medium text-text"
                    />
                    <EditableText
                      id={`home-testimonial-${i}-location`}
                      defaultValue={testimonial.location}
                      as="p"
                      className="text-xs text-muted"
                    />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* Promise */}
      <Section className="bg-bg">
        <SectionHeading id="home-promise" eyebrow="Our Promise" title="What You Can Count On" />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Lifetime craftsmanship support", icon: "M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z M9 12l2 2 4-4" },
            { label: "Premium wood", icon: "M12 21V9 M12 9c0-3 2-6 6-6 0 4-3 6-6 6z M12 13c0-3-2-5-6-5 0 4 3 5 6 5z" },
            { label: "Safe packaging", icon: "M3 7l9-4 9 4-9 4-9-4z M3 7v10l9 4 9-4V7 M12 11v10" },
            { label: "Nationwide delivery", icon: "M3 6h11v9H3z M14 9h4l3 3v3h-7 M7 18a1.5 1.5 0 1 0 0 .01 M17 18a1.5 1.5 0 1 0 0 .01" },
          ].map(({ label: item, icon }, i) => (
            <Reveal key={item} className="rounded-md border border-border bg-card px-6 py-8 text-center" delay={i * 0.08}>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-accent/40 text-accent">
                <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={icon} />
                </svg>
              </div>
              <EditableText
                id={`home-promise-${i}`}
                defaultValue={item}
                as="p"
                className="text-sm text-text-secondary"
              />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section className="bg-bg-secondary">
        <SectionHeading id="home-faq" eyebrow="Questions" title="Frequently Asked" />
        <div className="mx-auto mt-14 max-w-2xl divide-y divide-border">
          {[
            {
              q: "How long does a custom mandir take to craft?",
              a: "Every mandir is made to order. Most designs take 8–10 weeks from the confirmed design to dispatch, depending on size and how much carving is involved.",
            },
            {
              q: "What wood options are available?",
              a: "We mainly work in Burma Teak, Sheesham and Oak, with finishes from natural satin and matte walnut to antique gold trim and hand-gilded gold leaf. Tell us your preference and we'll guide you.",
            },
            {
              q: "Do you deliver and install nationwide?",
              a: "Yes, we deliver across India with protective packaging. Message us on WhatsApp with your city and we'll confirm the delivery timeline and installation for your location.",
            },
          ].map(({ q, a }, i) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm text-text">
                {q}
                <span className="ml-4 text-accent transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <EditableText
                id={`home-faq-${i}-answer`}
                defaultValue={a}
                as="p"
                multiline
                className="mt-3 text-sm leading-relaxed text-text-secondary"
              />
            </details>
          ))}
        </div>
      </Section>

      {/* Contact CTA */}
      <Section className="bg-bg text-center">
        <SectionHeading
          id="home-contact"
          eyebrow="Get in Touch"
          title="Begin Your Mandir's Story"
          subtitle="Speak with our design experts or book a showroom visit."
        />
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href={whatsAppLink("Hi Giriraj, I'd like to talk to an expert about a mandir.")}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-brand px-8 py-3.5 text-sm text-white transition-all duration-300 hover:bg-brand-secondary hover:shadow-[0_0_28px_rgba(198,156,69,0.4)]"
          >
            Talk to Our Expert
          </a>
          <Link
            href="/customization"
            className="rounded-md border border-accent px-8 py-3.5 text-sm text-text transition-all duration-300 hover:bg-accent hover:text-brand-secondary hover:shadow-[0_0_28px_rgba(198,156,69,0.4)]"
          >
            Request Quote
          </Link>
        </div>
      </Section>
    </>
  );
}
