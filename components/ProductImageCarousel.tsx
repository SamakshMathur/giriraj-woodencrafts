"use client";

import { useState } from "react";
import { EditableImage } from "@/components/EditableImage";
import { useOverrides } from "@/components/OverridesProvider";

export type CarouselSlide = {
  id: string;
  src?: string;
  alt: string;
  label?: string;
};

/**
 * The product gallery: one large framed photo with ‹ › arrows, plus a row
 * of thumbnails underneath to jump straight to any shot.
 *
 * The product photos range from very tall (≈0.46) to wide (≈1.5), so the
 * main frame shows each one whole (object-contain) over a blurred copy of
 * itself, instead of cropping them all into the same portrait box.
 *
 * Every slide is still a real EditableImage with its own stable id, so
 * admin click-to-replace keeps working per slide. All slides render at once
 * (opacity-toggled) so each keeps its own upload state while you browse.
 * Thumbnails are read-only previews that resolve the same admin overrides.
 */
export function ProductImageCarousel({ slides }: { slides: CarouselSlide[] }) {
  const [index, setIndex] = useState(0);
  const { images } = useOverrides();
  const count = slides.length;

  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);

  const thumbSrc = (slide: CarouselSlide) => {
    const override = images[slide.id];
    if (override === null) return undefined;
    return override ?? slide.src;
  };

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden border border-border bg-brand-secondary">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ease-reverent ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <EditableImage
              id={slide.id}
              src={slide.src}
              alt={slide.alt}
              backdrop
              className="object-contain p-4 md:p-6"
            />
          </div>
        ))}

        {slides[index]?.label && (
          <span className="pointer-events-none absolute left-0 top-0 z-30 bg-black/60 px-3 py-1.5 text-[10px] uppercase tracking-widest2 text-white">
            {slides[index].label}
          </span>
        )}

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-0 top-1/2 z-30 flex h-12 w-10 -translate-y-1/2 items-center justify-center bg-black/55 text-2xl text-white transition-colors hover:bg-black/80"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next photo"
              className="absolute right-0 top-1/2 z-30 flex h-12 w-10 -translate-y-1/2 items-center justify-center bg-black/55 text-2xl text-white transition-colors hover:bg-black/80"
            >
              ›
            </button>
            <span className="pointer-events-none absolute bottom-0 right-0 z-30 bg-black/60 px-3 py-1.5 text-[10px] tracking-widest2 text-white">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-3 grid grid-cols-6 gap-2">
          {slides.map((slide, i) => {
            const src = thumbSrc(slide);
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show ${slide.label ?? "main"} photo`}
                aria-current={i === index}
                className={`relative aspect-square overflow-hidden border bg-brand-secondary transition-all ${
                  i === index
                    ? "border-accent ring-1 ring-accent"
                    : "border-border opacity-70 hover:opacity-100"
                }`}
              >
                {src && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
