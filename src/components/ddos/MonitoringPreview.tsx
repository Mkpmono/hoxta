import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Globe, Shield, TrendingUp, AlertTriangle } from "lucide-react";

const attackVectors = [
  { name: "SYN Flood", percent: 42 },
  { name: "UDP Amplification", percent: 28 },
  { name: "HTTP Flood", percent: 18 },
  { name: "DNS Reflection", percent: 12 },
];

const topCountries = [
  { code: "CN", name: "China", percent: 32 },
  { code: "RU", name: "Russia", percent: 24 },
  { code: "US", name: "United States", percent: 18 },
  { code: "BR", name: "Brazil", percent: 14 },
  { code: "IN", name: "India", percent: 12 },
];

function AnimatedCounter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

function MiniSparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <div className="flex items-end gap-0.5 h-8">
      {data.map((value, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${((value - min) / range) * 100}%` }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          className="w-1 bg-primary/60 rounded-t min-h-[2px]"
        />
      ))}
    </div>
  );
}

export function MonitoringPreview() {
  const sparklineData = [12, 45, 32, 67, 54, 89, 76, 98, 65, 87, 72, 91, 45, 78, 56];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Live Attack Dashboard
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-time visibility into threats and mitigation status across your protected infrastructure.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-6 md:p-8 max-w-5xl mx-auto"
        >
          {/* Status bar */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-foreground">All Systems Protected</span>
            </div>
            <div className="text-xs text-muted-foreground">Last updated: Just now</div>
          </div>

          {/* Main stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-card/50 border border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">Attacks Mitigated</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                <AnimatedCounter end={12847} />
              </div>
              <div className="text-xs text-primary mt-1">+23% from last week</div>
            </div>

            <div className="p-4 rounded-xl bg-card/50 border border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">Peak Bandwidth</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                <AnimatedCounter end={847} suffix=" Gbps" />
              </div>
              <div className="text-xs text-muted-foreground mt-1">Largest attack today</div>
            </div>

            <div className="p-4 rounded-xl bg-card/50 border border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">Avg Mitigation</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                <AnimatedCounter end={8} suffix="ms" />
              </div>
              <div className="text-xs text-muted-foreground mt-1">Time to mitigate</div>
            </div>

            <div className="p-4 rounded-xl bg-card/50 border border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">Active POPs</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                <AnimatedCounter end={28} />
              </div>
              <div className="text-xs text-muted-foreground mt-1">Scrubbing centers</div>
            </div>
          </div>

          {/* Charts section */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Attack Vectors */}
            <div className="p-4 rounded-xl bg-card/30 border border-border/30">
              <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-primary" />
                Top Attack Vectors
              </h4>
              <div className="space-y-3">
                {attackVectors.map((vector) => (
                  <div key={vector.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{vector.name}</span>
                      <span className="text-foreground font-medium">{vector.percent}%</span>
                    </div>
                    <div className="h-2 bg-card rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${vector.percent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Traffic over time */}
            <div className="p-4 rounded-xl bg-card/30 border border-border/30">
              <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Traffic (Last 24h)
              </h4>
              <div className="mb-4">
                <MiniSparkline data={sparklineData} />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold text-foreground">2.4 TB</div>
                  <div className="text-xs text-muted-foreground">Total Clean</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-primary">847 GB</div>
                  <div className="text-xs text-muted-foreground">Total Blocked</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-primary">99.9%</div>
                  <div className="text-xs text-muted-foreground">Uptime</div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Countries */}
          <div className="mt-6 p-4 rounded-xl bg-card/30 border border-border/30">
            <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              Attack Origins
            </h4>
            <div className="flex flex-wrap gap-3">
              {topCountries.map((country) => (
                <div
                  key={country.code}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card/50 border border-border/30"
                >
                  <span className="text-sm font-medium text-foreground">{country.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/20 text-destructive">
                    {country.percent}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
