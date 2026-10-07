/**
 * A small carved-style divider: two fine rules meeting a lotus-bud diamond.
 * Sits under section headings so they feel crafted rather than plain.
 */
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 16"
      aria-hidden
      className={`block h-4 w-28 text-accent ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path d="M2 8h40" opacity="0.6" />
      <path d="M78 8h40" opacity="0.6" />
      <path d="M48 8l6-6 6 6-6 6z" fill="currentColor" fillOpacity="0.15" />
      <path d="M60 8l6-6 6 6-6 6z" fill="currentColor" fillOpacity="0.15" />
      <circle cx="44" cy="8" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="76" cy="8" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
