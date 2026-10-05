import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { EditableImage } from "@/components/EditableImage";
import { EditableText } from "@/components/EditableText";
import { Reveal } from "@/components/Reveal";

// See app/about/page.tsx for why this is explicit here rather than relied
// on cascading from app/template.tsx.
export const dynamic = "force-dynamic";
import { PRODUCTS } from "@/lib/products";

const FILTERS = [
  { label: "Style", options: ["Wall Mounted", "Floor Mounted", "Tulsi", "Arti Table"] },
  { label: "Finishing", options: ["Antique", "Dark Wooden", "Light Wooden"] },
];

// Scoped to this page only (see app/about/page.tsx comment pattern for
// why — PRODUCTS[].image is shared with the product's own detail-page
// hero photo). Each product is matched to the homepage "Our Collections"
// photo for the collection it belongs to.
const PRODUCTS_CARD_IMAGE_OVERRIDES: Record<string, string> = {
  shreeji: "/images/mandirs/traditional-collection-deity-altar.webp", // Traditional Collection
  vaikuntha: "/images/mandirs/royal-collection-arch-mandir.webp", // Royal Collection
  ananta: "/images/mandirs/compact-apartments-mandir.webp", // Modern Collection
  suvarna: "/images/mandirs/maharaja-gold-frame.webp", // Luxury Maharaja Series
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        id="products-hero"
        eyebrow="Collection"
        title="Every Mandir, a Work of Art"
        subtitle="Browse our handcrafted collections, or configure one entirely your own."
      />

      <Section className="bg-bg pt-0">
        <div className="flex flex-wrap gap-3 border-b border-border pb-10">
          {FILTERS.map((filter) => (
            <div key={filter.label} className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest2 text-muted">
                {filter.label}
              </span>
              <select className="border border-border bg-card px-4 py-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-accent">
                <option>All</option>
                {filter.options.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product, i) => (
            <Reveal key={product.slug} delay={i * 0.08}>
              <Link
                href={`/products/${product.slug}`}
                className="group flex h-full flex-col border border-border bg-card transition-all duration-500 ease-reverent hover:-translate-y-1 hover:border-accent hover:shadow-warm"
              >
                <div className="relative aspect-[4/5] overflow-hidden border-b border-border bg-brand-secondary">
                  <EditableImage
                    id={`products-card-${product.slug}`}
                    src={PRODUCTS_CARD_IMAGE_OVERRIDES[product.slug] ?? product.image}
                    alt={product.name}
                    backdrop
                    className="object-contain p-4 transition-transform duration-500 ease-reverent group-hover:scale-[1.03]"
                  />
                  <div className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-reverent group-hover:translate-x-full" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                <EditableText
                  id={`product-${product.slug}-collection`}
                  defaultValue={product.collection}
                  as="p"
                  className="text-xs uppercase tracking-widest2 text-accent"
                />
                <EditableText
                  id={`product-${product.slug}-name`}
                  defaultValue={product.name}
                  as="h3"
                  className="mt-2 font-heading text-2xl text-text"
                />
                  <EditableText
                    id={`product-${product.slug}-dimensions`}
                    defaultValue={product.dimensions}
                    as="p"
                    className="mt-1 text-sm text-text-secondary"
                  />
                  <span className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs uppercase tracking-widest2 text-text">
                    View details
                    <span aria-hidden className="text-accent transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
