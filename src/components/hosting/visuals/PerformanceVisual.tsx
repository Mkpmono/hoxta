import { motion } from "framer-motion";

export function PerformanceVisual() {
  const bars = [85, 92, 78, 95, 88, 96, 91];

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border/40 bg-card/60 backdrop-blur-sm p-6">
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl" />

      <div className="relative h-full flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "TTFB", value: "42ms", color: "text-green-400" },
            { label: "LCP", value: "0.8s", color: "text-green-400" },
            { label: "Score", value: "98/100", color: "text-primary" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.15 }}
              className="rounded-lg border border-border/40 bg-background/60 p-3 text-center"
            >
              <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="flex-1 rounded-xl border border-border/40 bg-background/60 p-4 flex items-end gap-2">
          {bars.map((height, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t-md bg-gradient-to-t from-primary/80 to-primary/30"
              initial={{ height: 0 }}
              whileInView={{ height: `${height}%` }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: "easeOut" }}
            />
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Server Response Time (7 days)</span>
          <span className="text-green-400 font-medium">↓ 40% faster</span>
        </div>
      </div>
    </div>
  );
}
