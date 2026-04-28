import { motion } from "framer-motion";
import { Gauge, Layers } from "lucide-react";
import intelLogo from "@/assets/cpu/intel.png";
import amdLogo from "@/assets/cpu/amd.png";

/**
 * Conceptual side-by-side comparison of the two CPU platforms we offer.
 * No fake live metrics — just the actual specs and what each is best for.
 */
export function ProcessorVisual() {
  const platforms = [
    {
      name: "Intel Xeon",
      model: "E-2388G",
      logo: intelLogo,
      cores: 8,
      threads: 16,
      ghz: "3.2 GHz",
      bestFor: "Single-thread performance",
      icon: Gauge,
    },
    {
      name: "AMD EPYC",
      model: "9454",
      logo: amdLogo,
      cores: 48,
      threads: 96,
      ghz: "2.75 GHz",
      bestFor: "Massive parallelism",
      icon: Layers,
    },
  ];

  // Visual ratio: how many "core blocks" each platform has, capped for layout.
  const maxCores = 48;

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border/40 bg-card/60 backdrop-blur-sm p-6">
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />

      <div className="relative h-full flex flex-col gap-4">
        {platforms.map((p, idx) => {
          const Icon = p.icon;
          const blocks = Array.from({ length: p.cores });
          const widthPct = (p.cores / maxCores) * 100;

          return (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + idx * 0.15 }}
              className="flex-1 rounded-xl border border-border/40 bg-background/60 p-4 flex flex-col gap-3"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={p.logo}
                    alt={p.name}
                    className="h-4 w-auto object-contain [filter:brightness(0)_invert(1)] opacity-90"
                  />
                  <span className="text-xs font-semibold text-foreground">{p.name}</span>
                  <span className="text-[10px] text-muted-foreground">{p.model}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <Icon className="w-3 h-3 text-primary" />
                  <span>{p.bestFor}</span>
                </div>
              </div>

              {/* Core visualization — one tiny block per physical core */}
              <div
                className="flex flex-wrap gap-1 content-start"
                style={{ width: `${widthPct}%` }}
              >
                {blocks.map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + idx * 0.15 + i * 0.005, duration: 0.2 }}
                    className="w-2 h-2 rounded-sm bg-primary/70"
                  />
                ))}
              </div>

              {/* Specs row */}
              <div className="flex items-center gap-4 text-[10px] text-muted-foreground mt-auto pt-2 border-t border-border/30">
                <span><span className="text-foreground font-semibold">{p.cores}</span> cores</span>
                <span><span className="text-foreground font-semibold">{p.threads}</span> threads</span>
                <span><span className="text-foreground font-semibold">{p.ghz}</span> base</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
