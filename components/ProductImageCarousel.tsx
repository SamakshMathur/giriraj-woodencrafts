"use client";

import { useState } from "react";
import { EditableImage } from "@/components/EditableImage";

export type CarouselSlide = {
  id: string;
  src?: string;
  alt: string;
  label?: string;
};

/**
 * The product hero, but cycling through several photos via </> arrows
 * instead of one static image — replaces the separate thumbnail grid that
 * used to sit further down the page (same photos, no longer duplicated,
 * and no longer adding extra page height).
 *
 * Every slide is still a real EditableImage with its own stable id, so
 * admin click-to-replace keeps working exactly as before, per slide — this
 * only changes how they're displayed, not the underlying content model.
 * All slides render simultaneously (stacked, opacity-toggled) rather than
 * conditionally mounting one at a time, so each one keeps its own
 * upload/remove state instead of losing it when you swipe away and back.
 */
export function ProductImageCarousel({ slides }: { slides: CarouselSlide[] }) {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);

  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-warm-sm">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-500 ease-reverent ${
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <EditableImage id={slide.id} src={slide.src} alt={slide.alt} className="object-cover" />
        </div>
      ))}

      {slides[index]?.label && (
        <span className="pointer-events-none absolute bottom-3 left-3 z-30 rounded-full bg-black/50 px-2.5 py-1 text-[10px] uppercase tracking-widest2 text-white">
          {slides[index].label}
        </span>
      )}

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-lg text-white transition-colors hover:bg-black/75"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-lg text-white transition-colors hover:bg-black/75"
          >
            ›
          </button>
          <span className="pointer-events-none absolute bottom-3 right-3 z-30 rounded-full bg-black/50 px-2.5 py-1 text-[10px] tracking-widest2 text-white">
            {index + 1} / {count}
          </span>
        </>
      )}
    </div>
  );
}
