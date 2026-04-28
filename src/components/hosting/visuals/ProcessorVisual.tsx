import { motion } from "framer-motion";
import intelLogo from "@/assets/cpu/intel.png";
import amdLogo from "@/assets/cpu/amd.png";

/**
 * CPU performance comparison — themed for the dark glassmorphism aesthetic.
 * Uses brand primary color throughout, with opacity to differentiate Intel vs AMD bars.
 */
export function ProcessorVisual() {
  const workloads = [
    {
      label: "Single-thread",
      sub: "Web apps · game logic",
      intel: 95,
      amd: 78,
    },
    {
      label: "Multi-thread",
      sub: "Builds · rendering · DB",
      intel: 32,
      amd: 100,
    },
    {
      label: "Virtualization",
      sub: "Containers · VMs",
      intel: 28,
      amd: 100,
    },
  ];

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border/40 bg-card/60 backdrop-blur-sm p-6">
      {/* Ambient glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative h-full flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Performance Index
            </div>
            <div className="text-sm font-semibold text-foreground mt-0.5">
              Workload comparison
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
              <img
                src={intelLogo}
                alt="Intel"
                className="h-3 w-auto object-contain [filter:brightness(0)_invert(1)] opacity-80"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary/30" />
              <img
                src={amdLogo}
                alt="AMD"
                className="h-3 w-auto object-contain [filter:brightness(0)_invert(1)] opacity-80"
              />
            </div>
          </div>
        </div>

        {/* Bars */}
        <div className="flex-1 flex flex-col justify-around">
          {workloads.map((w, idx) => (
            <motion.div
              key={w.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + idx * 0.1, duration: 0.4 }}
              className="space-y-2"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-medium text-foreground">
                  {w.label}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {w.sub}
                </span>
              </div>

              {/* Intel bar */}
              <Bar
                value={w.intel}
                opacity="strong"
                delay={0.25 + idx * 0.1}
              />
              {/* AMD bar */}
              <Bar value={w.amd} opacity="soft" delay={0.3 + idx * 0.1} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Bar({
  value,
  opacity,
  delay,
}: {
  value: number;
  opacity: "strong" | "soft";
  delay: number;
}) {
  const fill = opacity === "strong" ? "bg-primary" : "bg-primary/35";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 rounded-full bg-muted/30 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${fill}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ delay, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
      <span className="text-[10px] tabular-nums text-muted-foreground w-7 text-right">
        {value}
      </span>
    </div>
  );
}
