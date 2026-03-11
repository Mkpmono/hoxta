import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

export function ControlVisual() {
  const commands = [
    { delay: 0.3, cmd: "root@vps:~#", text: "apt update && apt upgrade -y" },
    { delay: 0.6, cmd: "", text: "Reading package lists... Done" },
    { delay: 0.9, cmd: "", text: "147 packages upgraded." },
    { delay: 1.2, cmd: "root@vps:~#", text: "systemctl restart nginx" },
    { delay: 1.5, cmd: "", text: "● nginx.service - Active: active (running)" },
    { delay: 1.8, cmd: "root@vps:~#", text: "ufw enable" },
    { delay: 2.1, cmd: "", text: "Firewall is active and enabled." },
  ];

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border/40 bg-card/60 backdrop-blur-sm p-6">
      <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />

      <div className="relative rounded-xl border border-border/50 bg-background/80 overflow-hidden h-full flex flex-col">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-card/50">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="text-xs text-muted-foreground font-mono">root@vps ~ (SSH)</span>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
        </div>

        {/* Commands */}
        <div className="flex-1 p-4 font-mono text-xs space-y-1.5 overflow-hidden">
          {commands.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: line.delay }}
              className="text-muted-foreground"
            >
              {line.cmd && <span className="text-green-400">{line.cmd} </span>}
              <span className={line.cmd ? "text-foreground" : "text-muted-foreground"}>{line.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Status bar */}
        <div className="px-4 py-2 border-t border-border/40 bg-card/30 flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">SSH • Port 22</span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-[10px] text-green-400">Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
