import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { EditableImage } from "@/components/EditableImage";
import { EditableText } from "@/components/EditableText";
import { Reveal } from "@/components/Reveal";
import { PRODUCTS } from "@/lib/products";

const FILTERS = [
  { label: "Wood", options: ["Teak", "Sheesham", "Oak"] },
  { label: "Style", options: ["Wall Mounted", "Floor Mounted"] },
  { label: "Finishing", options: ["Antique", "Dark Wooden", "Light Wooden"] },
];

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
              <select className="rounded-full border border-border bg-card px-4 py-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-accent">
                <option>All</option>
                {filter.options.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product, i) => (
            <Reveal key={product.slug} delay={i * 0.08}>
              <Link
                href={`/products/${product.slug}`}
                className="group block overflow-hidden rounded-2xl bg-card shadow-warm-sm transition-transform duration-500 ease-reverent hover:-translate-y-1"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <EditableImage
                    id={`products-card-${product.slug}`}
                    src={product.image}
                    alt={product.name}
                    className="object-cover transition-transform duration-500 ease-reverent group-hover:scale-[1.03]"
                  />
                  <div className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-reverent group-hover:translate-x-full" />
                </div>
                <div className="p-6">
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
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
