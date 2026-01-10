import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

const consoleLines = [
  { text: "> Configuring firewall...", delay: 0 },
  { text: "> Deploying Minecraft server files...", delay: 600 },
  { text: "> Initiating DDoS protection...", delay: 1200 },
  { text: "> Deploying Node.js modules...", delay: 1800 },
  { text: "> Allocating VPS cluster resources...", delay: 2400 },
  { text: "> Setting up SSL certificates...", delay: 3000 },
  { text: "> Optimizing kernel parameters...", delay: 3600 },
  { text: "> Launching control panel...", delay: 4200 },
  { text: "> Deployment completed successfully!", delay: 4800, success: true },
];

export function HeroConsole() {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const startAnimation = useCallback(() => {
    setVisibleLines(0);
    setProgress(0);
    setAnimationKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    consoleLines.forEach((line, index) => {
      const timer = setTimeout(() => {
        setVisibleLines(index + 1);
        setProgress(((index + 1) / consoleLines.length) * 100);
      }, line.delay);
      timers.push(timer);
    });

    // Loop animation
    const resetTimer = setTimeout(() => {
      startAnimation();
    }, 6500);
    timers.push(resetTimer);

    return () => timers.forEach(clearTimeout);
  }, [animationKey, startAnimation]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [visibleLines]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      className="relative w-full max-w-md lg:max-w-lg"
    >
      <div className="relative rounded-2xl overflow-hidden bg-[#0a1520]/90 backdrop-blur-xl border border-primary/20 shadow-[0_0_60px_rgba(25,195,255,0.1)]">
        {/* Console Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0d1a28]/80 border-b border-white/5">
          <span className="text-sm text-muted-foreground font-medium">Hosting Console</span>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
          </div>
        </div>

        {/* Console Content */}
        <div
          ref={scrollRef}
          className="console-scroll-hide p-4 h-52 overflow-y-auto font-mono text-sm space-y-2"
        >
          {consoleLines.slice(0, visibleLines).map((line, index) => (
            <motion.div
              key={`${animationKey}-${index}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={`${line.success ? "text-green-400" : "text-primary"} leading-relaxed`}
            >
              {line.text}
              {index === visibleLines - 1 && !line.success && (
                <motion.span 
                  className="inline-block ml-0.5 w-2 h-4 bg-primary"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="px-4 py-3 border-t border-white/5 bg-[#0d1a28]/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Deployment Progress</span>
            <span className="text-xs text-primary font-semibold tabular-nums">{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, hsl(195, 100%, 55%), hsl(195, 100%, 45%))",
                boxShadow: "0 0 10px hsl(195, 100%, 55%)"
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Glow Effect */}
      <div className="absolute -inset-6 bg-primary/5 rounded-3xl blur-2xl -z-10" />
    </motion.div>
  );
}
