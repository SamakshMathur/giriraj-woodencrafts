"use client";

import { useState } from "react";
import { EditableImage } from "@/components/EditableImage";
import { Reveal } from "@/components/Reveal";

export type GalleryItem = {
  /** Stable admin id for this slot (e.g. "gallery-3"). */
  id: string;
  src: string;
  label: string;
};

const ASPECTS = ["4/5", "1/1", "3/4"];

/**
 * Gallery with working category chips. Categories come from the photos'
 * own labels, so every chip shows at least one photo. Filtering hides
 * photos rather than unmounting them, so each keeps its admin upload state.
 */
export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const categories = Array.from(new Set(items.map((item) => item.label)));
  const [active, setActive] = useState<string>("All");

  return (
    <>
      <div className="mb-10 flex flex-wrap gap-2" role="toolbar" aria-label="Filter photos">
        {["All", ...categories].map((cat) => {
          const count = cat === "All" ? items.length : items.filter((i) => i.label === cat).length;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              aria-pressed={active === cat}
              className={`rounded-md border px-4 py-2 text-xs uppercase tracking-widest2 transition-colors duration-300 ${
                active === cat
                  ? "border-accent bg-accent text-brand-secondary"
                  : "border-border text-muted hover:border-accent hover:text-text"
              }`}
            >
              {cat} <span className="opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      <div className="columns-2 gap-4 md:columns-3">
        {items.map((item, i) => (
          <Reveal
            key={item.id}
            className={`relative mb-4 overflow-hidden break-inside-avoid rounded-md bg-card shadow-warm-sm ${
              active === "All" || active === item.label ? "" : "hidden"
            }`}
            style={{ aspectRatio: ASPECTS[i % ASPECTS.length] }}
            delay={(i % 6) * 0.06}
          >
            <EditableImage id={item.id} src={item.src} alt={item.label} className="object-cover" />
            <span className="pointer-events-none absolute bottom-0 left-0 z-10 bg-black/55 px-3 py-1.5 text-[10px] uppercase tracking-widest2 text-white">
              {item.label}
            </span>
          </Reveal>
        ))}
      </div>
    </>
  );
}
