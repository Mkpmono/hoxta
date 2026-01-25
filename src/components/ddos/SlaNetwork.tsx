import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Globe, Gauge, Zap } from "lucide-react";

interface SlaNetworkProps {
  /** Disable the infrastructure map rendering */
  disabled?: boolean;
  /** Show only KPIs without the map */
  showMapOnly?: boolean;
}

const kpis = [
  { icon: <Clock className="w-6 h-6" />, value: "99.99%", label: "Uptime SLA", suffix: "" },
  { icon: <Globe className="w-6 h-6" />, value: 28, label: "Anycast POPs", suffix: "+" },
  { icon: <Gauge className="w-6 h-6" />, value: "<1", label: "Latency Impact", suffix: "ms" },
  { icon: <Zap className="w-6 h-6" />, value: "<10", label: "Time to Mitigate", suffix: "s" },
];

// Real datacenter/scrubbing center locations
const datacenters = [
  { id: "ams", name: "Amsterdam", capacity: "400 Gbps", type: "scrubbing", x: 48, y: 32, features: "L3/L4/L7" },
  { id: "fra", name: "Frankfurt", capacity: "350 Gbps", type: "scrubbing", x: 52, y: 38, features: "L3/L4/L7" },
  { id: "lon", name: "London", capacity: "300 Gbps", type: "datacenter", x: 42, y: 35, features: "L3/L4" },
  { id: "par", name: "Paris", capacity: "250 Gbps", type: "datacenter", x: 45, y: 42, features: "L3/L4" },
  { id: "nyc", name: "New York", capacity: "500 Gbps", type: "scrubbing", x: 22, y: 40, features: "L3/L4/L7" },
  { id: "lax", name: "Los Angeles", capacity: "350 Gbps", type: "datacenter", x: 12, y: 45, features: "L3/L4" },
  { id: "sgp", name: "Singapore", capacity: "300 Gbps", type: "scrubbing", x: 78, y: 58, features: "L3/L4/L7" },
  { id: "syd", name: "Sydney", capacity: "200 Gbps", type: "datacenter", x: 88, y: 75, features: "L3/L4" },
  { id: "tok", name: "Tokyo", capacity: "400 Gbps", type: "scrubbing", x: 85, y: 38, features: "L3/L4/L7" },
  { id: "mia", name: "Miami", capacity: "200 Gbps", type: "datacenter", x: 24, y: 52, features: "L3/L4" },
];

// Traffic routes between datacenters
const routes = [
  { from: "ams", to: "fra" },
  { from: "ams", to: "lon" },
  { from: "lon", to: "par" },
  { from: "fra", to: "par" },
  { from: "lon", to: "nyc" },
  { from: "nyc", to: "lax" },
  { from: "nyc", to: "mia" },
  { from: "fra", to: "sgp" },
  { from: "sgp", to: "tok" },
  { from: "sgp", to: "syd" },
  { from: "tok", to: "lax" },
];

function InfrastructureMap({ onUnmount }: { onUnmount?: () => void }) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(true);

  // Cleanup on unmount
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
      onUnmount?.();
    };
  }, [onUnmount]);

  // Don't render if unmounted
  if (!isMounted) return null;

  const getNode = (id: string) => datacenters.find((d) => d.id === id);

  const handleMouseEnter = (dc: typeof datacenters[0], e: React.MouseEvent) => {
    setHoveredNode(dc.id);
    const rect = e.currentTarget.getBoundingClientRect();
    const container = e.currentTarget.closest('.infrastructure-map')?.getBoundingClientRect();
    if (container) {
      setTooltipPos({
        x: rect.left - container.left + rect.width / 2,
        y: rect.top - container.top - 10,
      });
    }
  };

  return (
    <div className="infrastructure-map relative w-full h-64 md:h-80 rounded-2xl overflow-hidden bg-card/30 border border-border/30">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />

      {/* Grid pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
        <defs>
          <pattern id="infra-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/30" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#infra-grid)" />
      </svg>

      {/* SVG for routes and nodes */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          {/* Animated gradient for traffic routes */}
          <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Traffic routes - animated thick lines */}
        {routes.map((route, i) => {
          const from = getNode(route.from);
          const to = getNode(route.to);
          if (!from || !to) return null;

          return (
            <motion.line
              key={`${route.from}-${route.to}`}
              x1={`${from.x}%`}
              y1={`${from.y}%`}
              x2={`${to.x}%`}
              y2={`${to.y}%`}
              stroke="url(#route-gradient)"
              strokeWidth="0.4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: i * 0.1, ease: "easeOut" }}
            />
          );
        })}
      </svg>

      {/* Datacenter nodes */}
      {datacenters.map((dc, index) => (
        <motion.div
          key={dc.id}
          className="absolute cursor-pointer group"
          style={{ left: `${dc.x}%`, top: `${dc.y}%`, transform: "translate(-50%, -50%)" }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
          onMouseEnter={(e) => handleMouseEnter(dc, e)}
          onMouseLeave={() => setHoveredNode(null)}
        >
          {/* Outer pulse ring for scrubbing centers */}
          {dc.type === "scrubbing" && (
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/30"
              style={{ width: 24, height: 24, margin: -6 }}
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.4, 0, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.2,
              }}
            />
          )}

          {/* Main node */}
          <div
            className={`relative rounded-full transition-all duration-300 ${
              dc.type === "scrubbing"
                ? "w-3 h-3 md:w-4 md:h-4 bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.6)]"
                : "w-2 h-2 md:w-3 md:h-3 bg-primary/70 shadow-[0_0_8px_hsl(var(--primary)/0.4)]"
            } ${hoveredNode === dc.id ? "scale-150" : ""}`}
          />
        </motion.div>
      ))}

      {/* Tooltip */}
      {hoveredNode && (
        <motion.div
          className="absolute z-20 pointer-events-none"
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
        >
          <div className="glass-card px-3 py-2 -translate-x-1/2 -translate-y-full mb-2 text-center whitespace-nowrap">
            <div className="text-sm font-semibold text-foreground">
              {getNode(hoveredNode)?.name}
            </div>
            <div className="text-xs text-primary font-medium">
              {getNode(hoveredNode)?.capacity}
            </div>
            <div className="text-xs text-muted-foreground">
              {getNode(hoveredNode)?.features}
            </div>
            {/* Arrow */}
            <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 rotate-45 bg-card border-r border-b border-border/30" />
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.5)]" />
          <span>Scrubbing Center</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-primary/70" />
          <span>Datacenter</span>
        </div>
      </div>

      {/* Region labels */}
      <div className="absolute top-3 left-[15%] text-[10px] text-muted-foreground/50 uppercase tracking-wider">
        Americas
      </div>
      <div className="absolute top-3 left-[45%] text-[10px] text-muted-foreground/50 uppercase tracking-wider">
        Europe
      </div>
      <div className="absolute top-3 left-[80%] text-[10px] text-muted-foreground/50 uppercase tracking-wider">
        Asia Pacific
      </div>
    </div>
  );
}

export function SlaNetwork({ disabled = false, showMapOnly = false }: SlaNetworkProps = {}) {
  const [mapMounted, setMapMounted] = useState(!disabled);

  // Handle disabled prop changes
  useEffect(() => {
    setMapMounted(!disabled);
  }, [disabled]);

  // If completely disabled, don't render
  if (disabled && showMapOnly) return null;

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
            Global Network & SLA
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enterprise-grade infrastructure with guaranteed performance and reliability.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* KPI blocks */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {kpis.map((kpi, index) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {kpi.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground">
                  {typeof kpi.value === "number" ? kpi.value : kpi.value}
                  {kpi.suffix}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{kpi.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Infrastructure map - only rendered when enabled */}
          {mapMounted && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <InfrastructureMap onUnmount={() => setMapMounted(false)} />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
