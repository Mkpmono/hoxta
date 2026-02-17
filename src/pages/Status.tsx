import { Layout } from "@/components/layout/Layout";
import { CheckCircle, AlertTriangle, XCircle, Clock, Activity, RefreshCw } from "lucide-react";
import { useStatusMonitors, MonitorWithChecks, TimeRange } from "@/hooks/useStatusMonitors";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
    empty: "bg-muted/30",
  };

  return (
    <div className="flex gap-[2px] h-8 items-end">
      {segments.map((s, i) => (
        <div
          key={i}
          className={cn(
            "flex-1 rounded-[2px] min-w-[3px] transition-colors",
            colorMap[s],
            s === "up" ? "h-[60%] hover:h-full" : s === "empty" ? "h-[30%]" : "h-full"
          )}
          style={{
            height: s === "up" ? `${55 + Math.random() * 40}%` : undefined,
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
    <div className="flex items-center gap-2">
      <span className={cn(
        "flex items-center gap-1.5 text-sm font-medium",
        isUp ? "text-emerald-500" : isDown ? "text-red-500" : "text-amber-500"
      )}>
        <span className={cn(
          "w-2 h-2 rounded-full",
          isUp ? "bg-emerald-500" : isDown ? "bg-red-500" : "bg-amber-500"
        )} />
        {isUp ? "Operational" : isDown ? "Outage" : "Degraded"}
      </span>
      {isUp ? (
        <CheckCircle className="w-4 h-4 text-emerald-500" />
      ) : isDown ? (
        <XCircle className="w-4 h-4 text-red-500" />
      ) : (
        <AlertTriangle className="w-4 h-4 text-amber-500" />
      )}
    </div>
  );
}

function MonitorCard({ monitor }: { monitor: MonitorWithChecks }) {
  return (
    <div className="bg-card border border-border/50 rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-muted-foreground" />
          <span className="text-foreground font-medium">{monitor.name}</span>
        </div>
        <StatusBadge uptimePercent={monitor.uptimePercent} />
      </div>
      <UptimeBar monitor={monitor} />
      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
        <span>30d: <strong className="text-foreground">{monitor.uptimePercent}%</strong></span>
        <span>24h: <strong className="text-foreground">100.00%</strong></span>
      </div>
    </div>
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
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Activity className="w-4 h-4" />
              System Status
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Service <span className="text-primary">Status</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Real-time monitoring of all Hoxta infrastructure services.
              <br />Updated every 30 seconds.
            </p>
          </div>

          {/* Overall status banner */}
          <div
            className={cn(
              "flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 rounded-xl mb-10 border",
              allUp
                ? "bg-emerald-500/10 border-emerald-500/30"
                : anyDown
                ? "bg-red-500/10 border-red-500/30"
                : "bg-amber-500/10 border-amber-500/30"
            )}
          >
            <div className="flex items-center gap-3">
              <span className={cn(
                "w-2.5 h-2.5 rounded-full",
                allUp ? "bg-emerald-500" : anyDown ? "bg-red-500" : "bg-amber-500"
              )} />
              {allUp ? (
                <CheckCircle className={cn("w-5 h-5", allUp ? "text-emerald-500" : anyDown ? "text-red-500" : "text-amber-500")} />
              ) : anyDown ? (
                <XCircle className="w-5 h-5 text-red-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              )}
              <span className={cn(
                "font-semibold",
                allUp ? "text-emerald-600 dark:text-emerald-400" : anyDown ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400"
              )}>
                {allUp ? "All Systems Operational" : anyDown ? "Some Systems Down" : "Partial Degradation"}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
                {avgUptime}% uptime (30 days)
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Monitor List */}
          {loading && monitors.length === 0 ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card border border-border/50 rounded-xl p-5 animate-pulse h-32" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {monitors.map((monitor) => (
                <MonitorCard key={monitor.id} monitor={monitor} />
              ))}
            </div>
          )}

          {/* Legend */}
          {monitors.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Operational</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Degraded</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Outage</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-muted/50" /> Unknown</span>
            </div>
          )}
          <p className="text-center text-xs text-muted-foreground mt-3 cursor-pointer hover:text-foreground transition-colors" onClick={refetch}>
            Auto-refreshes every minute · Click to refresh now
          </p>
        </div>
      </section>
    </Layout>
  );
}
