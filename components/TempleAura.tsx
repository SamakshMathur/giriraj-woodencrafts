/**
 * Warm glow layers meant to be placed inside the same positioned wrapper as
 * TempleSpire (not the full-bleed background) so they're centered on the
 * actual temple regardless of viewport width, instead of guessing a
 * percentage offset against the whole section.
 */
export function TempleAura({
  sweepClassName = "h-[620px] w-[620px]",
  glowClassName = "h-[420px] w-[420px]",
}: {
  sweepClassName?: string;
  glowClassName?: string;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      {/* Continuous ring of warm tones — no transparent gaps, so it wraps the
          whole temple at every moment; the slow rotation just drifts the
          pattern for a living quality instead of sweeping through empty space. */}
      <div
        className={`aura-sweep absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen ${sweepClassName}`}
        style={{
          background:
            "conic-gradient(from 0deg, rgba(212,175,55,0.22), rgba(243,213,138,0.42), rgba(196,156,69,0.2), rgba(212,175,55,0.38), rgba(243,213,138,0.3), rgba(212,175,55,0.22))",
          filter: "blur(50px)",
        }}
      />

      {/* Inner warm glow, centered lower near the sanctum doorway and diya */}
      <div
        className={`ambient-glow absolute left-1/2 top-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full ${glowClassName}`}
        style={{
          background:
            "radial-gradient(circle, rgba(212,175,55,0.28) 0%, rgba(212,175,55,0.12) 35%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
    </div>
  );
}
