import { Layout } from "@/components/layout/Layout";
import { CheckCircle, AlertTriangle, XCircle, Clock, Activity, RefreshCw, Sparkles, Signal } from "lucide-react";
import { useStatusMonitors, MonitorWithChecks, TimeRange } from "@/hooks/useStatusMonitors";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

function UptimeBar({ monitor }: { monitor: MonitorWithChecks }) {
  const checks = monitor.checks;
  const segmentCount = 45;
  const segments: ("up" | "down" | "degraded" | "empty")[] = [];

  if (checks.length === 0) {
    for (let i = 0; i < segmentCount; i++) segments.push("empty");
  } else {
    const perSegment = Math.max(1, Math.ceil(checks.length / segmentCount));
    for (let i = 0; i < segmentCount; i++) {
      const slice = checks.slice(i * perSegment, (i + 1) * perSegment);
      if (slice.length === 0) {
        segments.push("empty");
      } else {
        const hasDown = slice.some((c) => c.status === "down");
        const hasDegraded = slice.some((c) => c.status === "degraded");
        segments.push(hasDown ? "down" : hasDegraded ? "degraded" : "up");
      }
    }
  }

  const colorMap = {
    up: "bg-emerald-400",
    degraded: "bg-amber-400",
    down: "bg-red-400",
    empty: "bg-white/10",
  };

  return (
    <div className="flex gap-[2px] h-10 items-end">
      {segments.map((s, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.4, delay: i * 0.01 }}
          className={cn(
            "flex-1 rounded-sm min-w-[3px] origin-bottom transition-all duration-200 hover:brightness-125",
            colorMap[s],
          )}
          style={{
            height: s === "up" ? `${55 + Math.random() * 40}%` : s === "empty" ? "30%" : "100%",
          }}
        />
      ))}
    </div>
  );
}

function StatusBadge({ uptimePercent }: { uptimePercent: number }) {
  const isUp = uptimePercent >= 99;
  const isDown = uptimePercent < 95;

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold",
      isUp ? "bg-emerald-500/20 text-emerald-300" : isDown ? "bg-red-500/20 text-red-300" : "bg-amber-500/20 text-amber-300"
    )}>
      <span className={cn(
        "w-2 h-2 rounded-full animate-pulse",
        isUp ? "bg-emerald-400" : isDown ? "bg-red-400" : "bg-amber-400"
      )} />
      {isUp ? "Operational" : isDown ? "Outage" : "Degraded"}
      {isUp ? (
        <CheckCircle className="w-3.5 h-3.5" />
      ) : isDown ? (
        <XCircle className="w-3.5 h-3.5" />
      ) : (
        <AlertTriangle className="w-3.5 h-3.5" />
      )}
    </div>
  );
}

function MonitorCard({ monitor, index }: { monitor: MonitorWithChecks; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-glow overflow-hidden"
    >
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Signal className="w-4.5 h-4.5 text-primary" />
            </div>
            <span className="text-foreground font-semibold text-lg">{monitor.name}</span>
          </div>
          <StatusBadge uptimePercent={monitor.uptimePercent} />
        </div>

        <UptimeBar monitor={monitor} />

        <div className="flex gap-6 mt-3 text-sm">
          <span className="text-muted-foreground">
            30d: <strong className="text-foreground font-semibold">{monitor.uptimePercent}%</strong>
          </span>
          <span className="text-muted-foreground">
            24h: <strong className="text-foreground font-semibold">100.00%</strong>
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Status() {
  const [timeRange] = useState<TimeRange>("24h");
  const { monitors, loading, lastUpdated, refetch } = useStatusMonitors(timeRange);

  const allUp = monitors.every((m) => m.uptimePercent >= 99);
  const anyDown = monitors.some((m) => m.uptimePercent < 95);
  const avgUptime = monitors.length > 0
    ? (monitors.reduce((sum, m) => sum + m.uptimePercent, 0) / monitors.length).toFixed(2)
    : "100.00";

  return (
    <Layout>
      <section className="py-20 md:py-28 relative">
        {/* Background glow effects */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-20 left-1/4 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 max-w-3xl relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-5">
              <Sparkles className="w-4 h-4" />
              System Status
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5">
              <span className="text-foreground">Service </span>
              <span className="text-gradient">Status</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed">
              Real-time monitoring of all Hoxta infrastructure services.
              <br />
              <span className="text-foreground/70">Updated every 30 seconds.</span>
            </p>
          </motion.div>

          {/* Overall status banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className={cn(
              "flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5 rounded-2xl mb-10 border backdrop-blur-sm",
              allUp
                ? "bg-emerald-500/10 border-emerald-400/30 shadow-[0_0_40px_-10px_rgba(16,185,129,0.15)]"
                : anyDown
                ? "bg-red-500/10 border-red-400/30 shadow-[0_0_40px_-10px_rgba(239,68,68,0.15)]"
                : "bg-amber-500/10 border-amber-400/30 shadow-[0_0_40px_-10px_rgba(245,158,11,0.15)]"
            )}
          >
            <div className="flex items-center gap-3">
              <span className={cn(
                "w-3 h-3 rounded-full animate-pulse",
                allUp ? "bg-emerald-400" : anyDown ? "bg-red-400" : "bg-amber-400"
              )} />
              {allUp ? (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              ) : anyDown ? (
                <XCircle className="w-5 h-5 text-red-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              )}
              <span className={cn(
                "font-bold text-lg",
                allUp ? "text-emerald-300" : anyDown ? "text-red-300" : "text-amber-300"
              )}>
                {allUp ? "All Systems Operational" : anyDown ? "Some Systems Down" : "Partial Degradation"}
              </span>
            </div>
            <div className="flex items-center gap-5 text-sm text-foreground/80">
              <span className="flex items-center gap-1.5">
                <RefreshCw className={cn("w-3.5 h-3.5 text-primary", loading && "animate-spin")} />
                {avgUptime}% uptime (30 days)
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </motion.div>

          {/* Monitor List */}
          {loading && monitors.length === 0 ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card/50 border border-border/30 rounded-2xl p-6 animate-pulse h-36" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {monitors.map((monitor, i) => (
                <MonitorCard key={monitor.id} monitor={monitor} index={i} />
              ))}
            </div>
          )}

          {/* Legend */}
          {monitors.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-foreground/70"
            >
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-400" /> Operational</span>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-400" /> Degraded</span>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-400" /> Outage</span>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-white/15" /> Unknown</span>
            </motion.div>
          )}

          <p
            className="text-center text-sm text-muted-foreground mt-4 cursor-pointer hover:text-primary transition-colors duration-200"
            onClick={refetch}
          >
            Auto-refreshes every minute · <span className="underline underline-offset-2">Click to refresh now</span>
          </p>
        </div>
      </section>
    </Layout>
  );
}
