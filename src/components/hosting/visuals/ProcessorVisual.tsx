import { motion } from "framer-motion";
import intelLogo from "@/assets/cpu/intel.png";
import amdLogo from "@/assets/cpu/amd.png";

/**
 * Professional CPU platform comparison.
 * Each card shows a stylized die layout (grid of cores) + key specs.
 * No fake live data — pure spec-driven visual.
 */

interface PlatformCardProps {
  logo: string;
  name: string;
  model: string;
  cores: number;
  threads: number;
  ghz: string;
  bestFor: string;
  gridCols: number;
  gridRows: number;
  delay: number;
}

function PlatformCard({
  logo,
  name,
  model,
  cores,
  threads,
  ghz,
  bestFor,
  gridCols,
  gridRows,
  delay,
}: PlatformCardProps) {
  const totalCells = gridCols * gridRows;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className="flex-1 rounded-xl border border-border/50 bg-background/40 p-4 flex gap-4"
    >
      {/* Stylized CPU die */}
      <div className="shrink-0 relative">
        <div className="w-[110px] h-[110px] rounded-lg bg-gradient-to-br from-muted/40 to-background border border-border/60 p-2 relative overflow-hidden">
          {/* Substrate hint */}
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(45deg,transparent_46%,hsl(var(--border))_47%,hsl(var(--border))_53%,transparent_54%)] [background-size:8px_8px]" />
          {/* Core grid */}
          <div
            className="relative w-full h-full grid gap-[2px]"
            style={{
              gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
              gridTemplateRows: `repeat(${gridRows}, 1fr)`,
            }}
          >
            {Array.from({ length: totalCells }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: delay + 0.2 + i * 0.008, duration: 0.15 }}
                className="rounded-[1px] bg-primary/60"
              />
            ))}
          </div>
          {/* Notch dot — like the orientation marker on a real CPU */}
          <div className="absolute top-1.5 left-1.5 w-1 h-1 rounded-full bg-primary/80" />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={logo}
              alt={name}
              className="h-4 w-auto object-contain [filter:brightness(0)_invert(1)] opacity-90 shrink-0"
            />
            <div className="min-w-0">
              <div className="text-sm font-semibold text-foreground leading-tight truncate">
                {name}
              </div>
              <div className="text-[10px] text-muted-foreground leading-tight truncate">
                {model}
              </div>
            </div>
          </div>
          <span className="text-[10px] font-medium text-primary bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5 whitespace-nowrap">
            {bestFor}
          </span>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-2 mt-auto">
          {[
            { label: "Cores", value: cores },
            { label: "Threads", value: threads },
            { label: "Base", value: ghz },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-md bg-muted/30 border border-border/40 px-2 py-1.5"
            >
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground leading-none mb-1">
                {s.label}
              </div>
              <div className="text-sm font-bold text-foreground tabular-nums leading-none">
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function ProcessorVisual() {
  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border/40 bg-card/60 backdrop-blur-sm p-5">
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative h-full flex flex-col gap-3">
        <PlatformCard
          logo={intelLogo}
          name="Intel Xeon"
          model="E-2388G"
          cores={8}
          threads={16}
          ghz="3.2 GHz"
          bestFor="Single-thread"
          gridCols={4}
          gridRows={2}
          delay={0.15}
        />
        <PlatformCard
          logo={amdLogo}
          name="AMD EPYC"
          model="9454"
          cores={48}
          threads={96}
          ghz="2.75 GHz"
          bestFor="Multi-core"
          gridCols={8}
          gridRows={6}
          delay={0.3}
        />
      </div>
    </div>
  );
}
