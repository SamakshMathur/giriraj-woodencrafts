import Link from "next/link";
import { Section, SectionHeading } from "@/components/Section";
import { TempleBackground } from "@/components/TempleBackground";
import { TempleAura } from "@/components/TempleAura";
import { TempleSpire } from "@/components/TempleSpire";
import { EditableImage } from "@/components/EditableImage";
import { PRODUCTS } from "@/lib/products";
import { CRAFT_STAGES, GALLERY_IMAGES } from "@/lib/craft";

const CATEGORIES = [
  { slug: "traditional", name: "Traditional Collection", image: "/images/mandirs/traditional-collection.webp" },
  { slug: "royal", name: "Royal Collection", image: "/images/mandirs/vaikuntha-front.webp" },
  { slug: "modern", name: "Modern Collection", image: "/images/mandirs/ananta-front.webp" },
  { slug: "compact", name: "Compact Apartments", image: "/images/mandirs/shreeji-front.webp" },
  { slug: "wall-mounted", name: "Wall Mounted", image: "/images/mandirs/suvarna-front.webp" },
  { slug: "maharaja", name: "Luxury Maharaja Series", image: "/images/mandirs/close-up-carving.webp" },
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
            <p className="mb-5 font-display text-xs uppercase tracking-widest2 text-accent">
              Handcrafted Divine Spaces
            </p>
            <h1 className="font-heading text-5xl font-medium leading-[1.1] md:text-7xl">
              Every Home Deserves Its Own Temple.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
              Handcrafted wooden mandirs made with generations of craftsmanship.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="rounded-full bg-accent px-7 py-3.5 text-sm text-brand-secondary transition-transform duration-300 ease-reverent hover:scale-[1.02]"
              >
                Explore Collection
              </Link>
              <Link
                href="/customization"
                className="rounded-full border border-white/40 px-7 py-3.5 text-sm text-white transition-colors duration-300 hover:bg-white/10"
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
          eyebrow="Why Giriraj"
          title="Built on What Cannot Be Rushed"
        />
        <div className="mt-16 grid gap-12 md:grid-cols-3">
          {[
            {
              title: "Premium Wood",
              copy: "Only selected teak and premium hardwood, sourced with care.",
            },
            {
              title: "Hand Carved",
              copy: "Every design carved by skilled artisans, never machine-stamped.",
            },
            {
              title: "Sacred Design",
              copy: "Built according to traditional aesthetics and proportion.",
            },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <h3 className="font-heading text-2xl text-text">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {item.copy}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Luxury Showcase */}
      <Section className="bg-bg-secondary">
        <SectionHeading
          eyebrow="The Collection"
          title="Luxury Showcase"
          align="left"
        />
        <div className="mt-14 flex gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {PRODUCTS.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group relative aspect-[3/4] w-[280px] shrink-0 overflow-hidden rounded-2xl bg-card shadow-warm-sm md:w-[360px]"
            >
              <EditableImage
                id={`home-showcase-${product.slug}`}
                src={product.image}
                alt={product.name}
                className="object-cover transition-transform duration-700 ease-reverent group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                <p className="font-heading text-xl">{product.name}</p>
                <p className="mt-1 text-xs text-white/70">{product.wood} &middot; Made to order</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Categories */}
      <Section className="bg-bg">
        <SectionHeading eyebrow="Explore" title="Our Collections" />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => (
            <div
              key={category.name}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-card shadow-warm-sm"
            >
              <EditableImage
                id={`home-category-${category.slug}`}
                src={category.image}
                alt={category.name}
                className="object-cover transition-transform duration-500 ease-reverent group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="font-heading text-lg text-white">{category.name}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Customization teaser */}
      <Section className="bg-brand-secondary text-white">
        <SectionHeading
          eyebrow="Configure"
          title="Design a Mandir That Is Only Yours"
          subtitle="Choose your polishing, storage and lighting — like configuring a work of art."
        />
        <div className="mt-14 flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-widest2 text-white/70">
          {["Size", "Polishing", "Storage", "Lighting"].map(
            (step, i, arr) => (
              <span key={step} className="flex items-center gap-3">
                <span className="rounded-full border border-white/30 px-4 py-2">
                  {step}
                </span>
                {i < arr.length - 1 && <span className="text-accent">&darr;</span>}
              </span>
            )
          )}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/customization"
            className="inline-block rounded-full bg-accent px-8 py-3.5 text-sm text-brand-secondary transition-transform duration-300 ease-reverent hover:scale-[1.02]"
          >
            Start Customizing
          </Link>
        </div>
      </Section>

      {/* Craftsmanship journey */}
      <Section className="bg-bg">
        <SectionHeading eyebrow="Process" title="Craftsmanship Journey" />
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
              <p className="w-32 text-sm text-text-secondary">{stage.name}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Gallery preview */}
      <Section className="bg-bg-secondary">
        <SectionHeading eyebrow="Moments" title="Gallery" />
        <div className="mt-14 columns-2 gap-4 md:columns-3">
          {GALLERY_IMAGES.slice(0, 6).map((item, i) => (
            <div
              key={item.src}
              className="relative mb-4 overflow-hidden break-inside-avoid rounded-2xl bg-card shadow-warm-sm"
              style={{ aspectRatio: i % 2 === 0 ? "4/5" : "1/1" }}
            >
              <EditableImage
                id={`gallery-${i}`}
                src={item.src}
                alt={item.label}
                className="object-cover"
              />
            </div>
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

      {/* Video */}
      <Section className="bg-bg">
        <div className="relative mx-auto aspect-video max-w-4xl overflow-hidden rounded-2xl bg-brand-secondary shadow-warm">
          <div className="flex h-full items-center justify-center text-white/70">
            <span className="font-display text-xs uppercase tracking-widest2">
              Cinematic Film &middot; 60s
            </span>
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section className="bg-bg-secondary">
        <SectionHeading eyebrow="Stories" title="Customer Stories" />
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl bg-card p-8 shadow-warm-sm">
              <p className="text-sm leading-relaxed text-text-secondary">
                &ldquo;The mandir feels like it has always belonged in our home.
                The craftsmanship is beyond anything we imagined.&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-brand-secondary/20" />
                <div>
                  <p className="text-sm font-medium text-text">Customer Name</p>
                  <p className="text-xs text-muted">City &middot; Royal Collection</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Promise */}
      <Section className="bg-bg">
        <SectionHeading eyebrow="Our Promise" title="What You Can Count On" />
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Lifetime craftsmanship support",
            "Premium wood",
            "Safe packaging",
            "Nationwide delivery",
          ].map((item) => (
            <div key={item} className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full border border-accent/40" />
              <p className="text-sm text-text-secondary">{item}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section className="bg-bg-secondary">
        <SectionHeading eyebrow="Questions" title="Frequently Asked" />
        <div className="mx-auto mt-14 max-w-2xl divide-y divide-border">
          {[
            "How long does a custom mandir take to craft?",
            "What wood options are available?",
            "Do you deliver and install nationwide?",
          ].map((q) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm text-text">
                {q}
                <span className="ml-4 text-accent transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                Answer coming soon.
              </p>
            </details>
          ))}
        </div>
      </Section>

      {/* Contact CTA */}
      <Section className="bg-bg text-center">
        <SectionHeading
          eyebrow="Get in Touch"
          title="Begin Your Mandir's Story"
          subtitle="Speak with our design experts or book a showroom visit."
        />
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="rounded-full bg-brand px-8 py-3.5 text-sm text-white transition-colors duration-300 hover:bg-brand-secondary"
          >
            Talk to Our Expert
          </Link>
          <Link
            href="/customization"
            className="rounded-full border border-accent px-8 py-3.5 text-sm text-text transition-colors duration-300 hover:bg-accent hover:text-brand-secondary"
          >
            Request Quote
          </Link>
        </div>
      </Section>
    </>
  );
}
