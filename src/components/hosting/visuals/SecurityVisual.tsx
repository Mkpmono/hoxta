import { motion } from "framer-motion";
import { Check } from "lucide-react";

export function SecurityVisual() {
  const checks = [
    { label: "SSL Certificate", status: "Active" },
    { label: "DDoS Shield", status: "Protected" },
    { label: "Malware Scan", status: "Clean" },
    { label: "Firewall", status: "Enabled" },
    { label: "Backup", status: "Today 03:00" },
  ];

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border/40 bg-card/60 backdrop-blur-sm p-6">
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl" />

      <div className="relative h-full flex flex-col gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/5 p-4"
        >
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">All Systems Secure</div>
            <div className="text-xs text-green-400">5/5 checks passed</div>
          </div>
        </motion.div>

        <div className="flex-1 rounded-xl border border-border/40 bg-background/60 p-4 space-y-3 overflow-hidden">
          {checks.map((check, i) => (
            <motion.div
              key={check.label}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.12 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-green-400" />
                </div>
                <span className="text-sm text-foreground">{check.label}</span>
              </div>
              <span className="text-xs text-green-400 font-medium">{check.status}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
