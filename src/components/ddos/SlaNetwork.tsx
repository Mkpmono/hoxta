import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Globe, Gauge, Zap } from "lucide-react";

const kpis = [
  { icon: <Clock className="w-6 h-6" />, value: "99.99%", label: "Uptime SLA", suffix: "" },
  { icon: <Globe className="w-6 h-6" />, value: 28, label: "Anycast POPs", suffix: "+" },
  { icon: <Gauge className="w-6 h-6" />, value: "<1", label: "Latency Impact", suffix: "ms" },
  { icon: <Zap className="w-6 h-6" />, value: "<10", label: "Time to Mitigate", suffix: "s" },
];

// Abstract network map visualization
function NetworkMap() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate random points for network nodes
  const nodes = Array.from({ length: 28 }, (_, i) => ({
    x: 10 + Math.random() * 80,
    y: 15 + Math.random() * 70,
    delay: i * 0.05,
  }));

  // Generate connections between nearby nodes
  const connections: { x1: number; y1: number; x2: number; y2: number }[] = [];
  nodes.forEach((node, i) => {
    nodes.slice(i + 1, i + 4).forEach((other) => {
      const distance = Math.sqrt(Math.pow(node.x - other.x, 2) + Math.pow(node.y - other.y, 2));
      if (distance < 25) {
        connections.push({ x1: node.x, y1: node.y, x2: other.x, y2: other.y });
      }
    });
  });

  return (
    <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden bg-card/30 border border-border/30">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />

      {/* SVG network */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Connections */}
        {mounted &&
          connections.map((conn, i) => (
            <motion.line
              key={i}
              x1={`${conn.x1}%`}
              y1={`${conn.y1}%`}
              x2={`${conn.x2}%`}
              y2={`${conn.y2}%`}
              stroke="currentColor"
              strokeWidth="0.2"
              className="text-primary/30"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, delay: i * 0.02 }}
            />
          ))}

        {/* Nodes */}
        {mounted &&
          nodes.map((node, i) => (
            <motion.circle
              key={i}
              cx={`${node.x}%`}
              cy={`${node.y}%`}
              r="1"
              className="fill-primary"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: node.delay }}
            />
          ))}
      </svg>

      {/* Animated pulse on a random node */}
      <motion.div
        className="absolute w-4 h-4 rounded-full bg-primary/50"
        style={{ left: "45%", top: "35%" }}
        animate={{
          scale: [1, 2, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-muted-foreground">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <span>Scrubbing Centers</span>
      </div>
    </div>
  );
}

export function SlaNetwork() {
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

          {/* Network map */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <NetworkMap />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
