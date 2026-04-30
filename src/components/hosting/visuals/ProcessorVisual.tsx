import { motion } from "framer-motion";
import { Cpu, MemoryStick, HardDrive, Network } from "lucide-react";
import intelLogo from "@/assets/cpu/intel.png";
import amdLogo from "@/assets/cpu/amd.png";

/**
 * Spec sheet card — matches the pricing card style:
 * vertical list of rows with squircle icon, uppercase label, bold value lines.
 */
export function ProcessorVisual() {
  const rows = [
    {
      icon: Cpu,
      label: "Processor",
      lines: ["Intel Xeon Gold 6248R", "24 cores – 48 threads"],
    },
    {
      icon: MemoryStick,
      label: "Memory",
      lines: ["128GB DDR4 ECC", "2933 MHz Registered"],
    },
    {
      icon: HardDrive,
      label: "Storage",
      lines: ["2x 2TB NVMe SSD", "Hardware RAID-1"],
    },
    {
      icon: Network,
      label: "Network",
      lines: ["1 Gbps Port", "Unlimited bandwidth"],
    },
  ];

  return (
    <div className="relative w-full rounded-2xl border border-border/60 bg-card/50 backdrop-blur-md p-6 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-start justify-between mb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-primary/30 bg-primary/10 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
              Reference Build
            </span>
          </div>
          <h3 className="text-xl font-bold text-foreground leading-tight">
            Intel Xeon &amp; AMD EPYC
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Server-grade silicon, deployed in &lt;1h
          </p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <img
            src={intelLogo}
            alt="Intel"
            className="h-3 w-auto object-contain [filter:brightness(0)_invert(1)] opacity-70"
          />
          <span className="text-muted-foreground/40 text-xs">/</span>
          <img
            src={amdLogo}
            alt="AMD"
            className="h-3 w-auto object-contain [filter:brightness(0)_invert(1)] opacity-70"
          />
        </div>
      </div>

      {/* Spec rows */}
      <div className="relative divide-y divide-border/40">
        {rows.map((row, idx) => {
          const Icon = row.icon;
          return (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.35 }}
              className="flex items-start gap-4 py-3.5 first:pt-0 last:pb-0"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-0.5">
                  {row.label}
                </div>
                <div className="text-sm font-semibold text-foreground leading-snug">
                  {row.lines[0]}
                </div>
                <div className="text-[12px] text-muted-foreground leading-snug">
                  {row.lines[1]}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
