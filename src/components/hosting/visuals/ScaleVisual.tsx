import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export function ScaleVisual() {
  const resources = [
    { label: "CPU Cores", current: 2, max: 16, unit: "vCPU" },
    { label: "RAM", current: 4, max: 64, unit: "GB" },
    { label: "Storage", current: 80, max: 500, unit: "GB" },
  ];

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border/40 bg-card/60 backdrop-blur-sm p-6">
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />

      <div className="relative h-full flex flex-col gap-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">Auto-Scaling Active</div>
              <div className="text-xs text-primary">Resources adjust in real-time</div>
            </div>
          </div>
        </motion.div>

        {/* Resource Bars */}
        <div className="flex-1 rounded-xl border border-border/40 bg-background/60 p-4 space-y-5">
          {resources.map((res, i) => (
            <motion.div
              key={res.label}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.15 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground font-medium">{res.label}</span>
                <span className="text-primary font-semibold tabular-nums">
                  {res.current} / {res.max} {res.unit}
                </span>
              </div>
              <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(res.current / res.max) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + i * 0.15, duration: 0.6, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Zero-downtime upgrades</span>
          <span className="text-primary font-medium">↑ Scale anytime</span>
        </div>
      </div>
    </div>
  );
}
