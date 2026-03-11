import { motion } from "framer-motion";
import { DollarSign } from "lucide-react";

export function ProfitVisual() {
  const months = [
    { label: "Jan", revenue: 320, cost: 120 },
    { label: "Feb", revenue: 480, cost: 120 },
    { label: "Mar", revenue: 650, cost: 150 },
    { label: "Apr", revenue: 890, cost: 150 },
    { label: "May", revenue: 1120, cost: 180 },
    { label: "Jun", revenue: 1400, cost: 180 },
  ];
  const maxVal = 1500;

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border/40 bg-card/60 backdrop-blur-sm p-6">
      <div className="absolute -top-16 -left-16 w-48 h-48 bg-green-500/10 rounded-full blur-3xl" />

      <div className="relative h-full flex flex-col gap-4">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Revenue", value: "$1,400", color: "text-green-400" },
            { label: "Costs", value: "$180", color: "text-red-400" },
            { label: "Profit", value: "$1,220", color: "text-primary" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="rounded-lg border border-border/40 bg-background/60 p-2.5 text-center"
            >
              <div className={`text-base font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <div className="flex-1 rounded-xl border border-border/40 bg-background/60 p-4 flex items-end gap-3">
          {months.map((m, i) => (
            <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col items-center gap-0.5" style={{ height: '100%', justifyContent: 'flex-end', display: 'flex' }}>
                <motion.div
                  className="w-full rounded-t-sm bg-gradient-to-t from-green-500/70 to-green-400/40"
                  initial={{ height: 0 }}
                  whileInView={{ height: `${(m.revenue / maxVal) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <span className="text-[9px] text-muted-foreground">{m.label}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-green-400" />
            <span>Monthly Revenue Growth</span>
          </div>
          <span className="text-green-400 font-medium">+338%</span>
        </div>
      </div>
    </div>
  );
}
