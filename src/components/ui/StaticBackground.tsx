/**
 * StaticBackground
 *
 * Site-wide decorative background.
 * - No SVG
 * - No canvas
 * - No animations
 * - Only soft gradients + blurred glows
 */
export function StaticBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* Base vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />

      {/* Soft glows */}
      <div className="absolute -top-24 left-1/4 h-[520px] w-[520px] rounded-full bg-primary/6 blur-[140px]" />
      <div className="absolute top-1/3 -right-24 h-[560px] w-[560px] rounded-full bg-primary/5 blur-[160px]" />
      <div className="absolute -bottom-32 left-1/3 h-[620px] w-[620px] rounded-full bg-primary/4 blur-[180px]" />

      {/* Subtle highlight band (static) */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/6 to-transparent" />
    </div>
  );
}
