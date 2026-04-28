import { motion } from "framer-motion";
import intelLogo from "@/assets/cpu/intel.png";
import amdLogo from "@/assets/cpu/amd.png";

export function ProcessorVisual() {
  const cores = Array.from({ length: 12 }, (_, i) => ({
    load: Math.floor(Math.random() * 40) + 15,
    delay: 0.3 + i * 0.05,
  }));

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border/40 bg-card/60 backdrop-blur-sm p-6">
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />

      <div className="relative h-full flex flex-col gap-4">
        {/* CPU selector */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: "Intel Xeon", model: "E-2388G", cores: "8C/16T", ghz: "3.2 GHz", logo: intelLogo, alt: "Intel" },
            { name: "AMD EPYC", model: "9454", cores: "48C/96T", ghz: "2.75 GHz", logo: amdLogo, alt: "AMD" },
          ].map((cpu, i) => (
            <motion.div
              key={cpu.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.15 }}
              className={`rounded-xl border p-3 ${i === 0 ? "border-primary/30 bg-primary/5" : "border-border/40 bg-background/60"}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <img src={cpu.logo} alt={cpu.alt} className="h-4 w-auto object-contain opacity-90" draggable={false} />
                <span className="text-xs font-semibold text-foreground">{cpu.name}</span>
              </div>
              <div className="text-[10px] text-muted-foreground">{cpu.model}</div>
              <div className="text-[10px] text-muted-foreground">{cpu.cores} • {cpu.ghz}</div>
            </motion.div>
          ))}
        </div>

        {/* Core usage grid */}
        <div className="flex-1 rounded-xl border border-border/40 bg-background/60 p-4">
          <div className="text-xs text-muted-foreground mb-3">Core Utilization</div>
          <div className="grid grid-cols-4 gap-2">
            {cores.map((core, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: core.delay }}
                className="rounded-lg border border-border/30 bg-card/50 p-2 text-center"
              >
                <div className="text-[10px] text-muted-foreground mb-1">C{i}</div>
                <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${core.load}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: core.delay + 0.2, duration: 0.4 }}
                  />
                </div>
                <div className="text-[9px] text-primary mt-1 tabular-nums">{core.load}%</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
