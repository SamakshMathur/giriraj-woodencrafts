import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { ProductGrid } from "@/components/ProductGrid";

// See app/about/page.tsx for why this is explicit here rather than relied
// on cascading from app/template.tsx.
export const dynamic = "force-dynamic";
import { PRODUCTS } from "@/lib/products";


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
        image="/images/mandirs/swarna-gallery-carving.webp"
        imagePosition="center 40%"
      />

      <Section className="bg-bg pt-8 md:pt-10">
        <ProductGrid products={PRODUCTS} cardImages={PRODUCTS_CARD_IMAGE_OVERRIDES} />
      </Section>
    </>
  );
}
