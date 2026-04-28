import { motion } from "framer-motion";
import intelLogo from "@/assets/cpu/intel.png";
import amdLogo from "@/assets/cpu/amd.png";
import cpuHero from "@/assets/cpu/cpu-hero.jpg";

/**
 * Premium CPU platform showcase.
 * Real CPU photography as backdrop, with elegant glass spec panels overlaid.
 */
export function ProcessorVisual() {
  const platforms = [
    {
      logo: intelLogo,
      name: "Intel Xeon",
      model: "E-2388G",
      cores: "8",
      threads: "16",
      ghz: "3.2 GHz",
      tag: "Single-thread",
    },
    {
      logo: amdLogo,
      name: "AMD EPYC",
      model: "9454",
      cores: "48",
      threads: "96",
      ghz: "2.75 GHz",
      tag: "Multi-core",
    },
  ];

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border/40 bg-card/60">
      {/* Background photo */}
      <img
        src={cpuHero}
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Darkening gradient for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-5 gap-2.5">
        {platforms.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 + i * 0.12, duration: 0.4 }}
            className="rounded-xl border border-border/50 bg-background/70 backdrop-blur-md p-3 flex items-center gap-4"
          >
            {/* Logo + name */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <img
                src={p.logo}
                alt={p.name}
                className="h-5 w-auto object-contain [filter:brightness(0)_invert(1)] opacity-95 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-foreground leading-tight">
                  {p.name}
                </div>
                <div className="text-[10px] text-muted-foreground leading-tight">
                  {p.model}
                </div>
              </div>
            </div>

            {/* Specs inline */}
            <div className="flex items-center gap-4 shrink-0">
              <Spec label="Cores" value={p.cores} />
              <div className="w-px h-7 bg-border/50" />
              <Spec label="Threads" value={p.threads} />
              <div className="w-px h-7 bg-border/50" />
              <Spec label="Base" value={p.ghz} />
            </div>

            {/* Tag */}
            <span className="hidden sm:inline-block text-[10px] font-medium text-primary bg-primary/10 border border-primary/25 rounded-full px-2.5 py-1 whitespace-nowrap shrink-0">
              {p.tag}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground leading-none mb-1">
        {label}
      </div>
      <div className="text-sm font-bold text-foreground tabular-nums leading-none">
        {value}
      </div>
    </div>
  );
}
