import { motion } from "framer-motion";
import intelLogo from "@/assets/cpu/intel.png";
import amdLogo from "@/assets/cpu/amd.png";

/**
 * Professional CPU platform showcase — two stacked cards (Intel + AMD)
 * with stylized SVG chip illustrations and real spec rails.
 * Themed for the dark glassmorphism aesthetic.
 */
export function ProcessorVisual() {
  const platforms = [
    {
      name: "Intel Xeon",
      tier: "Scalable Gen 3",
      logo: intelLogo,
      stats: [
        { label: "Up to", value: "24", unit: "Cores" },
        { label: "Boost", value: "4.0", unit: "GHz" },
        { label: "Cache", value: "35.75", unit: "MB" },
      ],
    },
    {
      name: "AMD EPYC",
      tier: "Milan 7003",
      logo: amdLogo,
      stats: [
        { label: "Up to", value: "64", unit: "Cores" },
        { label: "Boost", value: "4.1", unit: "GHz" },
        { label: "Cache", value: "256", unit: "MB" },
      ],
    },
  ];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-border/50 bg-card/40 backdrop-blur-md p-6 space-y-5">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-64 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
          <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-medium">
            Server-grade Silicon
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground/70 tabular-nums">
          DDR4 ECC · PCIe 4.0
        </span>
      </div>

      {/* Chip cards */}
      <div className="relative space-y-3">
        {platforms.map((p, idx) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.12, duration: 0.45 }}
            className="group relative rounded-xl border border-border/50 bg-background/30 hover:bg-background/40 transition-colors overflow-hidden"
          >
            <div className="flex items-stretch">
              <ChipIcon />

              <div className="flex-1 px-4 py-4 flex flex-col justify-between min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-foreground truncate">
                      {p.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground tabular-nums mt-0.5">
                      {p.tier}
                    </div>
                  </div>
                  <img
                    src={p.logo}
                    alt={p.name}
                    className="h-3.5 w-auto object-contain [filter:brightness(0)_invert(1)] opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-border/40">
                  {p.stats.map((s) => (
                    <div key={s.label}>
                      <div className="text-[9px] uppercase tracking-wider text-muted-foreground/80">
                        {s.label}
                      </div>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-base font-semibold text-foreground tabular-nums leading-none">
                          {s.value}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {s.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>

      {/* Footer chips */}
      <div className="relative flex items-center justify-between text-[10px] text-muted-foreground/70 pt-1">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md border border-border/50 bg-background/40">
            ECC RAM
          </span>
          <span className="px-2 py-0.5 rounded-md border border-border/50 bg-background/40">
            NVMe RAID
          </span>
          <span className="px-2 py-0.5 rounded-md border border-border/50 bg-background/40">
            IPMI
          </span>
        </div>
        <span className="tabular-nums">99.99% SLA</span>
      </div>
    </div>
  );
}

function ChipIcon() {
  return (
    <div className="relative w-24 flex-shrink-0 bg-gradient-to-br from-background/70 to-background/20 border-r border-border/50 flex items-center justify-center overflow-hidden">
      {/* Ambient glow behind chip */}
      <div className="absolute w-12 h-12 bg-primary/25 rounded-full blur-2xl" />

      <svg viewBox="0 0 100 100" className="relative w-16 h-16" fill="none">
        <defs>
          <linearGradient id="chip-body" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity="0.2" />
            <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="chip-die" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        {/* Pins on all four sides */}
        <g stroke="hsl(var(--muted-foreground))" strokeWidth="1.6" strokeLinecap="round" opacity="0.55">
          {[28, 38, 48, 58, 68].map((p) => (
            <g key={p}>
              <line x1={p} y1="10" x2={p} y2="20" />
              <line x1={p} y1="80" x2={p} y2="90" />
              <line x1="10" y1={p} x2="20" y2={p} />
              <line x1="80" y1={p} x2="90" y2={p} />
            </g>
          ))}
        </g>

        {/* Chip substrate */}
        <rect
          x="20" y="20" width="60" height="60" rx="4"
          fill="url(#chip-body)"
          stroke="hsl(var(--border))"
          strokeWidth="1"
        />

        {/* Notch indicator */}
        <circle cx="26" cy="26" r="1.6" fill="hsl(var(--primary))" opacity="0.8" />

        {/* Die / heatspreader */}
        <rect
          x="28" y="28" width="44" height="44" rx="2"
          fill="url(#chip-die)"
          stroke="hsl(var(--primary))"
          strokeOpacity="0.45"
          strokeWidth="0.8"
        />

        {/* Etched traces */}
        <g stroke="hsl(var(--primary))" strokeWidth="0.6" opacity="0.5">
          <line x1="34" y1="36" x2="66" y2="36" />
          <line x1="34" y1="64" x2="66" y2="64" />
          <line x1="36" y1="34" x2="36" y2="66" />
          <line x1="64" y1="34" x2="64" y2="66" />
        </g>

        {/* 4-core grid */}
        <g fill="hsl(var(--primary))">
          <rect x="42" y="42" width="7" height="7" rx="0.5" opacity="0.95" />
          <rect x="51" y="42" width="7" height="7" rx="0.5" opacity="0.7" />
          <rect x="42" y="51" width="7" height="7" rx="0.5" opacity="0.7" />
          <rect x="51" y="51" width="7" height="7" rx="0.5" opacity="0.95" />
        </g>

        {/* Top-edge highlight */}
        <rect
          x="28" y="28" width="44" height="14" rx="2"
          fill="hsl(var(--foreground))"
          opacity="0.05"
        />
      </svg>
    </div>
  );
}
