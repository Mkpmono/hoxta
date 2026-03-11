import { motion } from "framer-motion";

export function HostingVisual() {
  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border/40 bg-card/60 backdrop-blur-sm p-6">
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl" />

      <div className="relative rounded-xl border border-border/50 bg-background/80 overflow-hidden h-full flex flex-col">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-card/50">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
          <span className="text-xs text-muted-foreground ml-2 font-mono">hoxta-server</span>
        </div>
        <div className="flex-1 p-4 font-mono text-xs space-y-2">
          {[
            { delay: 0.2, content: <><span className="text-primary">$</span> deploying website...</> },
            { delay: 0.5, content: <><span className="text-green-400">✓</span> <span className="text-muted-foreground">DNS configured</span></> },
            { delay: 0.8, content: <><span className="text-green-400">✓</span> <span className="text-muted-foreground">SSL certificate issued</span></> },
            { delay: 1.1, content: <><span className="text-green-400">✓</span> <span className="text-muted-foreground">Files uploaded (2.4 MB)</span></> },
            { delay: 1.4, content: <><span className="text-green-400">✓</span> <span className="text-muted-foreground">Database connected</span></> },
            { delay: 1.7, content: <><span className="text-primary">→</span> <span className="text-foreground font-semibold">Site is live!</span> <span className="text-green-400">🟢</span></> },
          ].map((line, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: line.delay }} className="text-muted-foreground">
              {line.content}
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 2 }}
        className="absolute bottom-4 right-4 glass-card px-3 py-2 rounded-lg flex items-center gap-2"
      >
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-xs font-medium text-foreground">Online</span>
      </motion.div>
    </div>
  );
}
