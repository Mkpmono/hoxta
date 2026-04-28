import { motion } from "framer-motion";
import { Gauge, Layers, Server } from "lucide-react";
import intelLogo from "@/assets/cpu/intel.png";
import amdLogo from "@/assets/cpu/amd.png";

/**
 * Professional CPU performance comparison.
 * Shows relative performance across three real workload categories,
 * normalized so the user sees instantly what each platform is best at.
 *
 * Values reflect public benchmark patterns (Geekbench / Cinebench / SPEC):
 * - Single-thread: Xeon E-2388G (~3.2 GHz, 5.1 GHz boost) wins on per-core speed
 * - Multi-thread: EPYC 9454 (48C/96T) dominates on aggregate throughput
 * - Virtualization: EPYC scales VMs / containers far better
 */
export function ProcessorVisual() {
  const workloads = [
    {
      label: "Single-thread",
      sub: "Web apps, game logic",
      icon: Gauge,
      intel: 95,
      amd: 78,
    },
    {
      label: "Multi-thread",
      sub: "Builds, rendering, DB",
      icon: Layers,
      intel: 32,
      amd: 100,
    },
    {
      label: "Virtualization",
      sub: "Containers, VMs",
      icon: Server,
      intel: 28,
      amd: 100,
    },
  ];

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border/40 bg-card/60 backdrop-blur-sm p-5">
      <div className="absolute -top-20 -right-20 w-56 h-56 bg-primary/10 rounded-full blur-3xl" />

      <div className="relative h-full flex flex-col gap-4">
        {/* Header — legend */}
        <div className="flex items-center justify-between">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
            Relative Performance
          </div>
          <div className="flex items-center gap-3">
            <LegendItem logo={intelLogo} label="Intel Xeon" colorClass="bg-primary" />
            <LegendItem logo={amdLogo} label="AMD EPYC" colorClass="bg-foreground/70" />
          </div>
        </div>

        {/* Workload comparison rows */}
        <div className="flex-1 flex flex-col justify-around gap-3">
          {workloads.map((w, idx) => {
            const Icon = w.icon;
            const intelWins = w.intel >= w.amd;
            const amdWins = w.amd > w.intel;
            return (
              <motion.div
                key={w.label}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + idx * 0.12, duration: 0.4 }}
                className="space-y-1.5"
              >
                {/* Workload label */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-semibold text-foreground">
                      {w.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      · {w.sub}
                    </span>
                  </div>
                </div>

                {/* Intel bar */}
                <PerfBar
                  value={w.intel}
                  delay={0.25 + idx * 0.12}
                  isWinner={intelWins}
                  variant="primary"
                />
                {/* AMD bar */}
                <PerfBar
                  value={w.amd}
                  delay={0.3 + idx * 0.12}
                  isWinner={amdWins}
                  variant="muted"
                />
              </motion.div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="text-[9px] text-muted-foreground/70 text-center pt-1 border-t border-border/30">
          Indexed scores based on public benchmark data · Intel E-2388G vs AMD EPYC 9454
        </div>
      </div>
    </div>
  );
}

function LegendItem({
  logo,
  label,
  colorClass,
}: {
  logo: string;
  label: string;
  colorClass: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-sm ${colorClass}`} />
      <img
        src={logo}
        alt={label}
        className="h-3 w-auto object-contain [filter:brightness(0)_invert(1)] opacity-90"
      />
    </div>
  );
}

function PerfBar({
  value,
  delay,
  isWinner,
  variant,
}: {
  value: number;
  delay: number;
  isWinner: boolean;
  variant: "primary" | "muted";
}) {
  const fillClass =
    variant === "primary"
      ? isWinner
        ? "bg-primary"
        : "bg-primary/40"
      : isWinner
      ? "bg-foreground/80"
      : "bg-foreground/30";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-muted/40 overflow-hidden relative">
        <motion.div
          className={`h-full rounded-full ${fillClass}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ delay, duration: 0.7, ease: "easeOut" }}
        />
      </div>
      <span
        className={`text-[10px] font-semibold tabular-nums w-9 text-right ${
          isWinner ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
