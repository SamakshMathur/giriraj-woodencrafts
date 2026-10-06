"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EditableImage } from "@/components/EditableImage";
import { EditableText } from "@/components/EditableText";
import { Reveal } from "@/components/Reveal";
import type { Product } from "@/lib/products";

type FilterKey = "style" | "finishing";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "style", label: "Style" },
  { key: "finishing", label: "Finishing" },
];

/**
 * The products listing with working Style / Finishing filters. The options
 * come from the products themselves, so a filter never offers a choice that
 * would show an empty grid.
 */
export function ProductGrid({
  products,
  cardImages,
}: {
  products: Product[];
  /** Per-slug card photo overrides for this page. */
  cardImages: Record<string, string>;
}) {
  const [selected, setSelected] = useState<Record<FilterKey, string>>({ style: "", finishing: "" });

  const options = useMemo(
    () =>
      Object.fromEntries(
        FILTERS.map(({ key }) => [key, Array.from(new Set(products.map((p) => p[key]))).sort()])
      ) as Record<FilterKey, string[]>,
    [products]
  );

  const visible = products.filter(
    (p) => (!selected.style || p.style === selected.style) && (!selected.finishing || p.finishing === selected.finishing)
  );
  const filtering = Boolean(selected.style || selected.finishing);

  return (
    <>
      <div className="flex flex-col gap-4 border-b border-border pb-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          {FILTERS.map((filter) => (
            <label key={filter.key} className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest2 text-muted">{filter.label}</span>
              <select
                value={selected[filter.key]}
                onChange={(e) => setSelected((prev) => ({ ...prev, [filter.key]: e.target.value }))}
                className="rounded-md border border-border bg-card px-4 py-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="">All</option>
                {options[filter.key].map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs uppercase tracking-widest2 text-muted">
          <span>
            {visible.length} {visible.length === 1 ? "design" : "designs"}
          </span>
          {filtering && (
            <button
              type="button"
              onClick={() => setSelected({ style: "", finishing: "" })}
              className="text-accent hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="mt-12 border border-dashed border-border p-10 text-center text-sm text-text-secondary">
          No designs match these filters yet.{" "}
          <Link href="/customization" className="text-accent hover:underline">
            Design your own instead
          </Link>
          .
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product, i) => (
            <Reveal key={product.slug} delay={i * 0.08}>
              <Link
                href={`/products/${product.slug}`}
                className="group flex h-full flex-col border border-border bg-card transition-all duration-500 ease-reverent hover:-translate-y-1 hover:border-accent hover:shadow-warm"
              >
                <div className="relative aspect-[4/5] overflow-hidden border-b border-border bg-brand-secondary">
                  <EditableImage
                    id={`products-card-${product.slug}`}
                    src={cardImages[product.slug] ?? product.image}
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
                    className="mb-5 mt-1 text-sm text-text-secondary"
                  />
                  <span className="mt-auto flex items-center justify-between border-t border-border pt-4 text-xs uppercase tracking-widest2 text-text">
                    View details
                    <span aria-hidden className="text-accent transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </>
  );
}
