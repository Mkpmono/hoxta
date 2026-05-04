import { motion } from "framer-motion";
import { Globe, FileCode, Database, Lock } from "lucide-react";

export function WebHostVisual() {
  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border/40 bg-card/60 backdrop-blur-sm p-6">
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-primary/10 rounded-full blur-3xl" />

      <div className="relative h-full flex flex-col gap-3">
        {/* Browser mockup */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border/50 bg-background/80 overflow-hidden"
        >
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border/40 bg-card/60">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            <div className="ml-2 flex-1 flex items-center gap-1.5 px-2 py-1 rounded-md bg-background/80 border border-border/40">
              <Lock className="w-3 h-3 text-green-400" />
              <span className="text-[10px] font-mono text-muted-foreground">https://yoursite.com</span>
            </div>
          </div>
          <div className="p-3 space-y-2">
            <div className="h-3 w-2/3 rounded bg-primary/30" />
            <div className="h-2 w-full rounded bg-muted/50" />
            <div className="h-2 w-5/6 rounded bg-muted/50" />
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="h-10 rounded bg-primary/10 border border-primary/20" />
              <div className="h-10 rounded bg-muted/30" />
              <div className="h-10 rounded bg-muted/30" />
            </div>
          </div>
        </motion.div>

        {/* Stack */}
        <div className="flex-1 grid grid-cols-3 gap-2">
          {[
            { icon: Globe, label: "DNS", sub: "Routing" },
            { icon: FileCode, label: "Files", sub: "NVMe SSD" },
            { icon: Database, label: "Database", sub: "MySQL" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="rounded-lg border border-border/40 bg-background/60 p-2.5 flex flex-col items-center justify-center text-center"
            >
              <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center mb-1">
                <s.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="text-[11px] font-semibold text-foreground">{s.label}</div>
              <div className="text-[9px] text-muted-foreground">{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
