import Link from "next/link";
import { notFound } from "next/navigation";
import { EditableText } from "@/components/EditableText";
import { ProductImageCarousel, type CarouselSlide } from "@/components/ProductImageCarousel";
import { getProductBySlug } from "@/lib/products";
import { GALLERY_IMAGES } from "@/lib/craft";
import { whatsAppLink } from "@/lib/whatsapp";

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
  // Side (index 2) and Drawer (index 4) not provided yet for Ananta —
  // those two slides fall through to the generic GALLERY_IMAGES default
  // until real photos are added, same as before this product had any
  // overrides at all.
  ananta: {
    0: "/images/mandirs/ananta-gallery-front.webp",
    1: "/images/mandirs/ananta-gallery-45.webp",
    3: "/images/mandirs/ananta-gallery-carving.webp",
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
  //
  // Once a product has ANY real per-angle photos, slides without one are
  // dropped entirely rather than filled in with GALLERY_IMAGES' generic
  // filler — that filler is an unrelated other product's photo, which
  // read as flat-out wrong sitting in this product's own gallery (e.g.
  // Ananta's "Side" slide showing Vaikuntha's front). Products with no
  // real photos at all yet keep the generic filler across every slide,
  // same as before any of this existed.
  const productOverrides = PRODUCT_GALLERY_IMAGE_OVERRIDES[product.slug];
  const gallerySlides: CarouselSlide[] = IMAGE_LABELS.map((label, i) => ({
    id: `product-gallery-${product.slug}-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    src: productOverrides?.[i] ?? (productOverrides ? undefined : GALLERY_IMAGES[i % GALLERY_IMAGES.length].src),
    alt: `${product.name} — ${label}`,
    label,
  })).filter((slide) => slide.src);

  const slides: CarouselSlide[] = [
    { id: `product-hero-${product.slug}`, src: product.image, alt: product.name },
    ...gallerySlides,
  ];

  return (
    <>
      {/* Product detail: framed gallery on the left, a boxed info panel on
          the right that stays in view while the gallery scrolls on desktop.
          Square edges and bordered cells throughout for a cleaner,
          catalogue-style look. */}
      <section className="pb-16 pt-28 md:pb-24 md:pt-32">
        <div className="mx-auto max-w-content px-6 md:px-10">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs uppercase tracking-widest2 text-muted">
            <Link href="/" className="transition-colors hover:text-accent">Home</Link>
            <span aria-hidden>/</span>
            <Link href="/products" className="transition-colors hover:text-accent">Products</Link>
            <span aria-hidden>/</span>
            <span className="text-text">{product.name}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
            <div className="lg:col-span-7">
              <ProductImageCarousel slides={slides} />
            </div>

            <div className="border border-border bg-card lg:sticky lg:top-28 lg:col-span-5">
              <div className="border-b border-border p-6 md:p-8">
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
                  className="mt-3 font-heading text-4xl leading-tight text-text md:text-5xl"
                />
                <p className="mt-3 text-sm text-text-secondary">
                  Handcrafted in {product.wood} · {product.dimensions}
                </p>
              </div>

              <div className="p-6 md:p-8">
                <h2 className="text-xs uppercase tracking-widest2 text-muted">Specifications</h2>
                <dl className="mt-4 grid grid-cols-2 border-l border-t border-border">
                  {specs.map(([label, value]) => (
                    <div key={label} className="border-b border-r border-border p-4">
                      <dt className="text-[10px] uppercase tracking-widest2 text-muted">{label}</dt>
                      <dd className="mt-1.5 text-sm font-medium text-text">{value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Link
                    href="/contact"
                    className="flex items-center justify-center bg-brand px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-brand-secondary"
                  >
                    Request Quote
                  </Link>
                  <a
                    href={whatsAppLink(`Hi Giriraj, I'm interested in the ${product.name} mandir (${product.dimensions}). Could you share the price and details?`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center border border-text/20 px-6 py-3.5 text-sm font-medium text-text transition-colors hover:border-accent hover:bg-accent hover:text-brand-secondary"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA, as a boxed panel inside the page width rather than a
          full-bleed band. */}
      <section className="px-6 pb-24 md:px-10 md:pb-32">
        <div className="mx-auto grid max-w-content items-center gap-8 bg-brand-secondary p-8 md:grid-cols-[1fr_auto] md:p-12">
          <div className="max-w-2xl">
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
              className="mt-3 text-sm leading-relaxed text-white/70"
            />
          </div>
          <div className="grid gap-3 sm:flex">
            <Link
              href="/contact"
              className="text-center bg-accent px-8 py-3.5 text-sm font-medium text-brand-secondary transition-opacity hover:opacity-90"
            >
              Request Quote
            </Link>
            <a
              href={whatsAppLink(`Hi Giriraj, I'm interested in the ${product.name} mandir (${product.dimensions}). Could you share the price and details?`)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center border border-white/30 px-8 py-3.5 text-sm font-medium text-white transition-colors hover:border-white hover:bg-white/10"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
