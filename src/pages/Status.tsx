import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle, RefreshCw } from "lucide-react";
import { useStatusMonitors, MonitorWithChecks, TimeRange } from "@/hooks/useStatusMonitors";
import { useState } from "react";
import { cn } from "@/lib/utils";

const TIME_RANGES = [
  { key: "1m", label: "1m" },
  { key: "5m", label: "5m" },
  { key: "15m", label: "15m" },
  { key: "30m", label: "30m" },
  { key: "1h", label: "1h" },
  { key: "6h", label: "6h" },
  { key: "24h", label: "24h" },
  { key: "7d", label: "7d" },
  { key: "30d", label: "30d" },
] as const;

function UptimeBar({ monitor }: { monitor: MonitorWithChecks }) {
  const checks = monitor.checks;
  // Group checks into ~30 segments
  const segmentCount = 30;
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
    up: "bg-green-500",
    degraded: "bg-amber-500",
    down: "bg-red-500",
    empty: "bg-muted/40",
  };

  return (
    <div className="flex gap-[2px] h-8 items-end">
      {segments.map((s, i) => (
        <div
          key={i}
          className={cn("flex-1 rounded-sm min-w-[4px] h-full transition-colors", colorMap[s])}
        />
      ))}
    </div>
  );
}

function MonitorCard({ monitor, timeRange }: { monitor: MonitorWithChecks; timeRange: string }) {
  const isAllUp = monitor.uptimePercent >= 99.9;
  const isDown = monitor.uptimePercent < 95;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 rounded-xl border border-border/50"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-foreground font-medium">{monitor.name}</span>
        <span
          className={cn(
            "text-sm font-bold",
            isAllUp ? "text-green-400" : isDown ? "text-red-400" : "text-amber-400"
          )}
        >
          {monitor.uptimePercent}%
        </span>
      </div>
      <UptimeBar monitor={monitor} />
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>{timeRange}</span>
        <span>now</span>
      </div>
    </motion.div>
  );
}

export default function Status() {
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");
  const { monitors, loading, lastUpdated, refetch } = useStatusMonitors(timeRange);

  // Group by category
  const categories = new Map<string, MonitorWithChecks[]>();
  for (const m of monitors) {
    if (!categories.has(m.category)) categories.set(m.category, []);
    categories.get(m.category)!.push(m);
  }

  const allUp = monitors.every((m) => m.uptimePercent >= 99);
  const anyDown = monitors.some((m) => m.uptimePercent < 95);

  return (
    <Layout>
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl font-bold text-foreground mb-6">System Status</h1>

            {/* Overall status banner */}
            <div
              className={cn(
                "inline-flex items-center gap-3 px-6 py-3 rounded-xl w-full max-w-lg justify-center",
                allUp
                  ? "bg-green-500/15 border border-green-500/30"
                  : anyDown
                  ? "bg-red-500/15 border border-red-500/30"
                  : "bg-amber-500/15 border border-amber-500/30"
              )}
            >
              {allUp ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : anyDown ? (
                <XCircle className="w-5 h-5 text-red-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              )}
              <span
                className={cn(
                  "font-semibold",
                  allUp ? "text-green-400" : anyDown ? "text-red-400" : "text-amber-400"
                )}
              >
                {allUp
                  ? "All Systems Operational"
                  : anyDown
                  ? "Some Systems Experiencing Issues"
                  : "Partial Degradation"}
              </span>
            </div>
          </motion.div>

          {/* Controls */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-1 bg-card/50 rounded-lg p-1 border border-border/50">
              {TIME_RANGES.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setTimeRange(r.key)}
                  className={cn(
                    "px-3 py-1.5 text-xs rounded-md font-medium transition-colors",
                    timeRange === r.key
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <button
              onClick={refetch}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
              <span className="hidden sm:inline">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            </button>
          </div>

          {/* Monitor Groups */}
          {loading && monitors.length === 0 ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card p-5 rounded-xl animate-pulse h-28" />
              ))}
            </div>
          ) : (
            Array.from(categories.entries()).map(([category, categoryMonitors]) => (
              <div key={category} className="mb-10">
                <h2 className="text-lg font-semibold text-foreground mb-4">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryMonitors.map((monitor) => (
                    <MonitorCard
                      key={monitor.id}
                      monitor={monitor}
                      timeRange={timeRange}
                    />
                  ))}
                </div>
              </div>
            ))
          )}

          {/* No data message */}
          {!loading && monitors.length > 0 && monitors.every((m) => m.checks.length === 0) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-muted-foreground"
            >
              <p>No monitoring data yet. Checks will appear after the first health check runs.</p>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
}
