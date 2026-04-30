import { motion } from "framer-motion";
import intelLogo from "@/assets/cpu/intel.png";
import amdLogo from "@/assets/cpu/amd.png";
import chipPcb from "@/assets/cpu/chip-pcb.png";

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
      <div className="absolute w-16 h-16 bg-primary/30 rounded-full blur-2xl" />
      <img
        src={chipPcb}
        alt="CPU"
        loading="lazy"
        width={1024}
        height={1024}
        className="relative w-16 h-16 object-contain drop-shadow-[0_0_8px_hsl(var(--primary)/0.4)]"
      />
    </div>
  );
}
