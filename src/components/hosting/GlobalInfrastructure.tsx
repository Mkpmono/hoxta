import { motion } from "framer-motion";
import { MapPin, Zap, Globe, Shield, Server, Cpu, Network, RefreshCw, Activity } from "lucide-react";
import { NetworkMap } from "./NetworkMap";

interface GlobalInfrastructureProps {
  title?: string;
  subtitle?: string;
}

const networkHighlights = [
  { icon: Network, text: "Anycast Network Architecture" },
  { icon: Cpu, text: "Enterprise-grade NVMe nodes" },
  { icon: RefreshCw, text: "Automated failover & redundancy" },
  { icon: Server, text: "Tier III+ datacenter standards" },
  { icon: Activity, text: "Instant provisioning" },
  { icon: Zap, text: "Low latency by design" },
  { icon: Shield, text: "Built-in DDoS protection" },
  { icon: Globe, text: "Scalable on demand" },
];

export function GlobalInfrastructure({
  title = "Global Infrastructure",
  subtitle = "Enterprise-grade infrastructure built for performance, reliability, and scale.",
}: GlobalInfrastructureProps) {
  const stats = [
    { icon: MapPin, value: "6+", label: "Data Centers" },
    { icon: Zap, value: "<30ms", label: "Avg Latency" },
    { icon: Globe, value: "99.99%", label: "Network Uptime" },
    { icon: Shield, value: "10 Tbps", label: "DDoS Protection" },
  ];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-card/30 via-transparent to-card/30 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {/* Animated Network Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="glass-card p-4 md:p-6 overflow-hidden">
            <NetworkMap />
          </div>
        </motion.div>

        {/* Stats + Features Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: 2x2 KPI Grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="glass-card p-5 text-center"
              >
                <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Right: Network Highlights Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Infrastructure Capabilities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {networkHighlights.map((item, index) => (
              <div
                  key={index}
                  className="flex items-center gap-3 text-sm text-muted-foreground"
                >
                  <item.icon className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{item.text}</span>
              </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
