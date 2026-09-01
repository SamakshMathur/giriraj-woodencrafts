import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/Section";
import { EditableText } from "@/components/EditableText";
import { ProductImageCarousel, type CarouselSlide } from "@/components/ProductImageCarousel";
import { getProductBySlug } from "@/lib/products";
import { GALLERY_IMAGES } from "@/lib/craft";

// No generateStaticParams here on purpose. This page has 44 EditableImage
// slots across the 4 products (hero + 10 gallery labels each) — the exact
// pages a screenshot showed still serving stale images from. With
// generateStaticParams, Next.js prerenders these routes once at *build*
// time and freezes that HTML on the CDN; app/template.tsx's
// `dynamic = "force-dynamic"` does not reliably override that for a page
// that opts into static params itself (confirmed directly: the build
// output kept marking this route "● (SSG)" despite the parent template's
// setting). Admin edits made after a deploy would never appear here until
// the next full redeploy. `force-dynamic` below forces this route to
// render fresh on every request, same as every other content page.
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

// Second row (Marble, Lighting, Inside Shelf, Dimensions, Lifestyle) removed
// per request — just the first row of five now.
const IMAGE_LABELS = ["Front", "45°", "Side", "Close-up Carving", "Drawer"];

// Real photos for specific products' gallery slots, keyed by slug then the
// IMAGE_LABELS index (0=Front, 1=45°, 2=Side, 3=Close-up Carving,
// 4=Drawer). Falls back to the generic GALLERY_IMAGES default for any
// product/index not listed here — deliberately per-product, not written
// into the shared GALLERY_IMAGES array, since these are actual photos of
// one specific product, not generic filler.
const PRODUCT_GALLERY_IMAGE_OVERRIDES: Record<string, Record<number, string>> = {
  shreeji: {
    0: "/images/mandirs/shreeji-gallery-front.webp",
    1: "/images/mandirs/shreeji-gallery-45.webp",
    2: "/images/mandirs/shreeji-gallery-side.webp",
    3: "/images/mandirs/shreeji-gallery-carving.webp",
    4: "/images/mandirs/shreeji-gallery-drawer.webp",
  },
  vaikuntha: {
    0: "/images/mandirs/vaikuntha-gallery-front.webp",
    1: "/images/mandirs/vaikuntha-gallery-45.webp",
    2: "/images/mandirs/vaikuntha-gallery-side.webp",
    3: "/images/mandirs/vaikuntha-gallery-carving.webp",
    4: "/images/mandirs/vaikuntha-gallery-drawer.webp",
  },
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const specs: [string, string][] = [
    ["Dimensions", product.dimensions],
    ["Wood", product.wood],
    ["Finish", product.finish],
    ["Storage", product.storage ? "Included" : "Not included"],
    ["Lighting", product.lighting ? "Integrated LED" : "Not included"],
    ["Marble", product.marble ? "Included" : "Not included"],
    ["Finishing", product.finishing],
    ["Availability", "Made to order · 8–10 weeks"],
  ];

  // Hero + the same five shots that used to live in a separate thumbnail
  // grid further down the page — now reachable via the carousel's </>
  // arrows instead, so the same photos aren't shown twice and the page
  // doesn't carry the extra height of a whole second image section.
  const slides: CarouselSlide[] = [
    { id: `product-hero-${product.slug}`, src: product.image, alt: product.name },
    ...IMAGE_LABELS.map((label, i) => ({
      id: `product-gallery-${product.slug}-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      src: PRODUCT_GALLERY_IMAGE_OVERRIDES[product.slug]?.[i] ?? GALLERY_IMAGES[i % GALLERY_IMAGES.length].src,
      alt: `${product.name} — ${label}`,
      label,
    })),
  ];

  return (
    <>
      {/* Hero — image and details side by side, not stacked full-width.
          The photos here are portrait (ratio ~0.63-1.00); at full page
          width that made the hero absurdly tall (a real UX problem,
          flagged directly). Same aspect-[3/4] + object-cover as the
          homepage card — still the identical crop — just constrained to
          a proper column width instead of spanning the whole page, which
          is what actually fixes the height, not another ratio change.
          The image side is now a carousel (</> arrows) cycling through
          all 6 shots instead of one static photo — see the thumbnail
          grid this replaced, removed below. */}
      <section className="pt-32 pb-4 md:pt-40">
        <div className="mx-auto max-w-content px-6 md:px-10">
          <div className="grid gap-10 md:grid-cols-2 md:items-center lg:gap-16">
            <ProductImageCarousel slides={slides} />

            <div>
              <EditableText
                id={`product-${product.slug}-collection`}
                defaultValue={product.collection}
                as="p"
                className="text-xs uppercase tracking-widest2 text-accent"
              />
              <EditableText
                id={`product-${product.slug}-name`}
                defaultValue={product.name}
                as="h1"
                className="mt-3 font-heading text-4xl text-text md:text-5xl"
              />

              <dl className="mt-8 divide-y divide-border border-t border-border">
                {specs.map(([label, value]) => (
                  <div key={label} className="flex justify-between py-3 text-sm">
                    <dt className="text-text-secondary">{label}</dt>
                    <dd className="font-medium text-text">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="rounded-full bg-brand px-6 py-3 text-sm text-white transition-all hover:bg-brand-secondary hover:shadow-[0_0_24px_rgba(198,156,69,0.4)]"
                >
                  Request Quote
                </Link>
                <a
                  href="https://wa.me/918290583377"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-accent px-6 py-3 text-sm text-text transition-all hover:bg-accent hover:text-brand-secondary hover:shadow-[0_0_24px_rgba(198,156,69,0.4)]"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — specs now live in the hero above, so this is just the
          considered-purchase nudge, as a single centered banner instead
          of a half-empty two-column row. */}
      <Section className="bg-brand-secondary text-white">
        <div className="mx-auto max-w-2xl text-center">
          <EditableText
            id="product-cta-title"
            defaultValue="A High-Ticket Piece, Considered Fully"
            as="h3"
            className="font-heading text-3xl text-white"
          />
          <EditableText
            id="product-cta-copy"
            defaultValue="Every mandir is made to order. Speak with our experts or book a showroom visit before you decide."
            as="p"
            multiline
            className="mt-4 text-sm leading-relaxed text-white/70"
          />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-accent px-8 py-3.5 text-sm text-brand-secondary transition-all duration-300 ease-reverent hover:scale-[1.02] hover:shadow-[0_0_28px_rgba(198,156,69,0.5)]"
            >
              Request Quote
            </Link>
            <a
              href="https://wa.me/918290583377"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/30 px-8 py-3.5 text-sm text-white transition-all duration-300 ease-reverent hover:border-white hover:bg-white/10"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
