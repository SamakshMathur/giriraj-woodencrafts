"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A sideways-scrolling row with ‹ › buttons, so visitors on desktop can tell
 * there is more to see. Buttons hide at either end; touch users just swipe.
 */
export function HorizontalScroller({
  children,
  label,
  className = "",
}: {
  children: React.ReactNode;
  /** Accessible name for the row, e.g. "Craftsmanship stages". */
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  };

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const button =
    "absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-xl text-text shadow-warm transition-opacity hover:border-accent md:flex";

  return (
    <div className={`relative ${className}`}>
      <div
        ref={ref}
        onScroll={update}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] focus:outline-none [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      <button
        type="button"
        onClick={() => scrollBy(-1)}
        aria-label="Scroll left"
        className={`${button} -left-5 ${atStart ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => scrollBy(1)}
        aria-label="Scroll right"
        className={`${button} -right-5 ${atEnd ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        ›
      </button>
    </div>
  );
}
