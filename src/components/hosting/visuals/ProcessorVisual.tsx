import { motion } from "framer-motion";
import { Cpu, Layers, Gauge, Zap } from "lucide-react";
import intelLogo from "@/assets/cpu/intel.png";
import amdLogo from "@/assets/cpu/amd.png";

/**
 * Professional CPU comparison datasheet — dual-platform layout with
 * real-world specs, performance gauges, and workload benchmarks.
 * Themed with the dark glassmorphism aesthetic.
 */
export function ProcessorVisual() {
  const platforms = [
    {
      name: "Intel Xeon",
      tier: "Gold 6248R",
      logo: intelLogo,
      specs: [
        { label: "Cores", value: "24" },
        { label: "Threads", value: "48" },
        { label: "Base", value: "3.0 GHz" },
        { label: "Boost", value: "4.0 GHz" },
      ],
      strength: "Single-thread",
      score: 95,
    },
    {
      name: "AMD EPYC",
      tier: "7443P",
      logo: amdLogo,
      specs: [
        { label: "Cores", value: "24" },
        { label: "Threads", value: "48" },
        { label: "Base", value: "2.85 GHz" },
        { label: "Boost", value: "4.0 GHz" },
      ],
      strength: "Multi-thread",
      score: 100,
    },
  ];

  const workloads = [
    { icon: Gauge, label: "Single-thread", intel: 95, amd: 78 },
    { icon: Layers, label: "Multi-thread", intel: 72, amd: 100 },
    { icon: Zap, label: "Virtualization", intel: 68, amd: 96 },
  ];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-border/50 bg-card/40 backdrop-blur-md">
      {/* Ambient glows */}
      <div className="absolute -top-32 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center justify-between px-5 py-3.5 border-b border-border/50 bg-background/30">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
            CPU Platform Comparison
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3 h-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground tabular-nums">
            v2026.04
          </span>
        </div>
      </div>

      {/* Platform cards */}
      <div className="relative grid grid-cols-2 gap-px bg-border/40">
        {platforms.map((p, idx) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            className="bg-card/60 p-5 space-y-4"
          >
            {/* Logo + tier */}
            <div className="flex items-start justify-between">
              <div>
                <img
                  src={p.logo}
                  alt={p.name}
                  className="h-4 w-auto object-contain [filter:brightness(0)_invert(1)] opacity-90 mb-2"
                />
                <div className="text-sm font-semibold text-foreground">
                  {p.name}
                </div>
                <div className="text-[11px] text-muted-foreground tabular-nums">
                  {p.tier}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
                  Best for
                </div>
                <div className="text-[11px] font-medium text-primary mt-0.5">
                  {p.strength}
                </div>
              </div>
            </div>

            {/* Spec grid */}
            <div className="grid grid-cols-4 gap-2">
              {p.specs.map((s) => (
                <div
                  key={s.label}
                  className="rounded-md bg-background/40 border border-border/40 px-2 py-1.5"
                >
                  <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </div>
                  <div className="text-[11px] font-semibold text-foreground tabular-nums mt-0.5">
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Workload benchmarks */}
      <div className="relative px-5 py-4 space-y-3 bg-background/20 border-t border-border/50">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
            Workload Benchmarks
          </span>
          <div className="flex items-center gap-3 text-[9px] text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="w-2 h-0.5 bg-primary" />
              <span>Intel</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-0.5 bg-primary/40" />
              <span>AMD</span>
            </div>
          </div>
        </div>

        {workloads.map((w, idx) => {
          const Icon = w.icon;
          const intelWins = w.intel > w.amd;
          return (
            <motion.div
              key={w.label}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + idx * 0.08, duration: 0.4 }}
              className="space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[11px] font-medium text-foreground">
                    {w.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] tabular-nums">
                  <span
                    className={
                      intelWins ? "text-primary font-semibold" : "text-muted-foreground"
                    }
                  >
                    {w.intel}
                  </span>
                  <span className="text-border">/</span>
                  <span
                    className={
                      !intelWins ? "text-primary font-semibold" : "text-muted-foreground"
                    }
                  >
                    {w.amd}
                  </span>
                </div>
              </div>

              {/* Stacked bar */}
              <div className="grid grid-cols-2 gap-1">
                <div className="h-1 rounded-full bg-muted/30 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${w.intel}%` }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.4 + idx * 0.08,
                      duration: 0.7,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  />
                </div>
                <div className="h-1 rounded-full bg-muted/30 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-primary/40"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${w.amd}%` }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.45 + idx * 0.08,
                      duration: 0.7,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}

        <div className="pt-2 mt-2 border-t border-border/40 flex items-center justify-between">
          <span className="text-[9px] text-muted-foreground/70">
            Relative performance index · higher = better
          </span>
          <span className="text-[9px] text-muted-foreground/70 tabular-nums">
            Source: public benchmarks
          </span>
        </div>
      </div>
    </div>
  );
}
