import { motion } from "framer-motion";
import { Server, Wifi, Battery, Thermometer } from "lucide-react";

export function InfrastructureVisual() {
  const systems = [
    { icon: Battery, label: "UPS Battery", status: "100%", ok: true },
    { icon: Wifi, label: "Network Uplink", status: "10 Gbps", ok: true },
    { icon: Thermometer, label: "Cooling", status: "21°C", ok: true },
    { icon: Server, label: "Generators", status: "Standby", ok: true },
  ];

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border/40 bg-card/60 backdrop-blur-sm p-6">
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />

      <div className="relative h-full flex flex-col gap-4">
        {/* Uptime badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4"
        >
          <div>
            <div className="text-sm font-semibold text-foreground">Datacenter Status</div>
            <div className="text-xs text-primary">N+1 Redundancy Active</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary tabular-nums">99.99%</div>
            <div className="text-[10px] text-muted-foreground">Uptime SLA</div>
          </div>
        </motion.div>

        {/* System grid */}
        <div className="flex-1 grid grid-cols-2 gap-3">
          {systems.map((sys, i) => {
            const Icon = sys.icon;
            return (
              <motion.div
                key={sys.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.12 }}
                className="rounded-xl border border-border/40 bg-background/60 p-3 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-4 h-4 text-primary" />
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{sys.label}</div>
                  <div className="text-sm font-semibold text-foreground">{sys.status}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
