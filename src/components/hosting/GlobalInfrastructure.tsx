import { motion } from "framer-motion";
import { MapPin, Zap, Globe, Shield, Server, Cpu, Network } from "lucide-react";

interface DataCenter {
  name: string;
  location: string;
  code: string;
}

interface GlobalInfrastructureProps {
  title?: string;
  subtitle?: string;
  dataCenters?: DataCenter[];
}

const defaultDataCenters: DataCenter[] = [
  { name: "New York", location: "United States", code: "US" },
  { name: "Amsterdam", location: "Netherlands", code: "NL" },
  { name: "Frankfurt", location: "Germany", code: "DE" },
  { name: "London", location: "United Kingdom", code: "GB" },
  { name: "Singapore", location: "Singapore", code: "SG" },
  { name: "Sydney", location: "Australia", code: "AU" },
];

const networkHighlights = [
  { icon: Network, text: "Anycast DNS for instant routing" },
  { icon: Cpu, text: "NVMe SSD storage on all nodes" },
  { icon: Server, text: "Instant provisioning under 60s" },
];

export function GlobalInfrastructure({
  title = "Global Infrastructure",
  subtitle = "Deploy closer to your users with our worldwide network of enterprise-grade data centers.",
  dataCenters = defaultDataCenters,
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>

        {/* Clean 2-column layout: Locations left, KPIs + Highlights right */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Available Locations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-6 md:p-8"
          >
            <h3 className="text-xl font-semibold text-foreground mb-6">Available Locations</h3>
            <div className="grid grid-cols-2 gap-4">
              {dataCenters.map((dc, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-background/30 border border-border/30 hover:border-primary/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {dc.code}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{dc.name}</div>
                    <div className="text-xs text-muted-foreground">{dc.location}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: KPIs + Network Highlights */}
          <div className="space-y-6">
            {/* 2x2 KPI Grid */}
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

            {/* Network Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">Network Highlights</h3>
              <ul className="space-y-3">
                {networkHighlights.map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <item.icon className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
