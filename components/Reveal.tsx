"use client";

import { motion } from "framer-motion";

/**
 * Scroll-triggered fade-up wrapper. Deliberately conservative:
 * - starts at 40% opacity, not 0 — so even in a worst case (JS slow to
 *   hydrate, IntersectionObserver not yet fired), content is still legible
 *   rather than blank; it just looks like it's mid-animation rather than
 *   missing.
 * - opacity + a small translateY only — never blur, never scale from 0,
 *   so text is never soft/dim beyond that floor.
 * - no overflow-hidden anywhere in this component, so descenders/accents
 *   in headings are never clipped.
 * - the translate is a transform, which doesn't affect layout flow, so it
 *   can never overlap a neighboring element even mid-animation.
 * - `viewport once: true` — animates in a single time per element, never
 *   flickers or re-dims on scrolling back up.
 * - not used on above-the-fold content (see PageHero) — reserved for
 *   content that requires scrolling to reach in the first place.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity: 0.4, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
