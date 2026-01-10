import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const consoleLines = [
  { text: "> Configuring firewall...", delay: 0 },
  { text: "> Deploying Minecraft server files...", delay: 800 },
  { text: "> Initiating DDoS protection...", delay: 1600 },
  { text: "> Deploying Node.js modules...", delay: 2400 },
  { text: "> Allocating VPS cluster resources...", delay: 3200 },
  { text: "> Setting up SSL certificates...", delay: 4000 },
  { text: "> Optimizing kernel parameters...", delay: 4800 },
  { text: "> Launching control panel...", delay: 5600 },
  { text: "> Deployment completed successfully!", delay: 6400, success: true },
];

export function HeroConsole() {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    consoleLines.forEach((line, index) => {
      const timer = setTimeout(() => {
        setVisibleLines(index + 1);
        setProgress(((index + 1) / consoleLines.length) * 100);
      }, line.delay);
      timers.push(timer);
    });

    // Reset and loop
    const resetTimer = setTimeout(() => {
      setVisibleLines(0);
      setProgress(0);
    }, 8000);
    timers.push(resetTimer);

    return () => timers.forEach(clearTimeout);
  }, [visibleLines === 0]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleLines]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative"
    >
      <div className="glass-card overflow-hidden">
        {/* Console Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-card/50">
          <span className="text-sm text-muted-foreground font-medium">Hosting Console</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
        </div>

        {/* Console Content */}
        <div
          ref={scrollRef}
          className="p-4 h-48 overflow-y-auto font-mono text-sm space-y-1.5 bg-background/50"
        >
          {consoleLines.slice(0, visibleLines).map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className={`${line.success ? "text-green-400" : "text-primary"}`}
            >
              {line.text}
              {index === visibleLines - 1 && !line.success && (
                <span className="animate-blink ml-1">_</span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="px-4 py-3 border-t border-border/50 bg-card/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Deployment Progress</span>
            <span className="text-xs text-primary font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Glow Effect */}
      <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl -z-10" />
    </motion.div>
  );
}
