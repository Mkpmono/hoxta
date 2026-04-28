import { motion } from "framer-motion";
import { Zap, HardDrive, Globe2, Gauge } from "lucide-react";

export function PerformanceVisual() {
  const features = [
    { icon: HardDrive, label: "NVMe SSD", sub: "Enterprise-grade storage" },
    { icon: Zap, label: "LiteSpeed", sub: "Built-in caching" },
    { icon: Globe2, label: "Global CDN", sub: "Edge delivery" },
    { icon: Gauge, label: "HTTP/3 + QUIC", sub: "Modern protocols" },
  ];

  // Static visual representation — not live measurements
  const stack = [
    { label: "Standard HDD hosting", value: 25, tone: "muted" },
    { label: "Average SSD hosting", value: 55, tone: "muted" },
    { label: "Hoxta NVMe + LiteSpeed", value: 95, tone: "primary" },
  ];

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border/40 bg-card/60 backdrop-blur-sm p-6">
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl" />

      <div className="relative h-full flex flex-col gap-4">
        {/* Feature pills */}
        <div className="grid grid-cols-2 gap-2">
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="rounded-lg border border-border/40 bg-background/60 p-2.5 flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <f.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-foreground truncate">{f.label}</div>
                <div className="text-[10px] text-muted-foreground truncate">{f.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison bars — clearly conceptual */}
        <div className="flex-1 rounded-xl border border-border/40 bg-background/60 p-4 flex flex-col justify-center gap-3">
          {stack.map((row, i) => (
            <div key={row.label} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className={row.tone === "primary" ? "text-foreground font-semibold" : "text-muted-foreground"}>
                  {row.label}
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-muted/40 overflow-hidden">
                <motion.div
                  className={
                    row.tone === "primary"
                      ? "h-full rounded-full bg-gradient-to-r from-primary to-primary/60"
                      : "h-full rounded-full bg-muted-foreground/40"
                  }
                  initial={{ width: 0 }}
                  whileInView={{ width: `${row.value}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.15, duration: 0.7, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="text-[10px] text-muted-foreground text-center">
          Relative page-load comparison · typical workload
        </div>
      </div>
    </div>
  );
}
