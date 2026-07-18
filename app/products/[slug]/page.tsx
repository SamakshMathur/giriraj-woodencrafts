import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/Section";
import { PRODUCTS, getProductBySlug } from "@/lib/products";
import { GALLERY_IMAGES } from "@/lib/craft";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

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
          <p className="text-xs uppercase tracking-widest2 text-accent">
            {product.collection}
          </p>
          <h1 className="mt-3 font-heading text-4xl text-text md:text-6xl">
            {product.name}
          </h1>
        </div>
      </section>

      {/* Hero image */}
      <div className="relative mx-auto mt-8 aspect-[16/9] max-w-content overflow-hidden px-6 md:mx-10 md:rounded-2xl">
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority
          sizes="100vw"
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
              <Image
                src={GALLERY_IMAGES[i % GALLERY_IMAGES.length].src}
                alt={`${product.name} — ${label}`}
                fill
                sizes="(min-width: 768px) 20vw, 50vw"
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
            <h2 className="font-heading text-3xl text-text">Specifications</h2>
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
            <h3 className="font-heading text-2xl text-text">
              A High-Ticket Piece, Considered Fully
            </h3>
            <p className="text-sm leading-relaxed text-text-secondary">
              Every mandir is made to order. Speak with our experts or book a
              showroom visit before you decide.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-full bg-brand px-6 py-3 text-sm text-white transition-colors hover:bg-brand-secondary"
              >
                Request Quote
              </Link>
              <a
                href="https://wa.me/918290583377"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-accent px-6 py-3 text-sm text-text transition-colors hover:bg-accent hover:text-brand-secondary"
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
