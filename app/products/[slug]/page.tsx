import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/Section";
import { EditableImage } from "@/components/EditableImage";
import { EditableText } from "@/components/EditableText";
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

const IMAGE_LABELS = [
  "Front",
  "45°",
  "Side",
  "Close-up Carving",
  "Drawer",
  "Marble",
  "Lighting",
  "Inside Shelf",
  "Dimensions",
  "Lifestyle",
];

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

  return (
    <>
      <section className="pt-32 pb-4 md:pt-40">
        <div className="mx-auto max-w-content px-6 md:px-10">
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
            className="mt-3 font-heading text-4xl text-text md:text-6xl"
          />
        </div>
      </section>

      {/* Hero image */}
      <div className="relative mx-auto mt-8 aspect-[16/9] max-w-content overflow-hidden px-6 md:mx-10 md:rounded-2xl">
        <EditableImage
          id={`product-hero-${product.slug}`}
          src={product.image}
          alt={product.name}
          className="object-cover"
        />
      </div>

      {/* Image gallery */}
      <Section className="bg-bg">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {IMAGE_LABELS.map((label, i) => (
            <div
              key={label}
              className="relative aspect-square overflow-hidden rounded-xl bg-card shadow-warm-sm"
            >
              <EditableImage
                id={`product-gallery-${product.slug}-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                src={GALLERY_IMAGES[i % GALLERY_IMAGES.length].src}
                alt={`${product.name} — ${label}`}
                className="object-cover"
              />
              <span className="absolute bottom-2 left-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] uppercase tracking-widest2 text-white">
                {label}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Specifications */}
      <Section className="bg-bg-secondary">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <EditableText
              id="product-specifications-heading"
              defaultValue="Specifications"
              as="h2"
              className="font-heading text-3xl text-text"
            />
            <dl className="mt-8 divide-y divide-border">
              {specs.map(([label, value]) => (
                <div key={label} className="flex justify-between py-3 text-sm">
                  <dt className="text-text-secondary">{label}</dt>
                  <dd className="font-medium text-text">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex flex-col justify-center gap-4 rounded-2xl bg-card p-10 shadow-warm-sm">
            <EditableText
              id="product-cta-title"
              defaultValue="A High-Ticket Piece, Considered Fully"
              as="h3"
              className="font-heading text-2xl text-text"
            />
            <EditableText
              id="product-cta-copy"
              defaultValue="Every mandir is made to order. Speak with our experts or book a showroom visit before you decide."
              as="p"
              multiline
              className="text-sm leading-relaxed text-text-secondary"
            />
            <div className="mt-4 flex flex-wrap gap-3">
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
      </Section>
    </>
  );
}
