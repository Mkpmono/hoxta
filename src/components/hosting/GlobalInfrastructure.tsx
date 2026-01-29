import { motion } from "framer-motion";
import { MapPin, Zap, Globe, Shield } from "lucide-react";

interface DataCenter {
  name: string;
  location: string;
  flag?: string;
}

interface GlobalInfrastructureProps {
  title?: string;
  subtitle?: string;
  dataCenters?: DataCenter[];
}

const defaultDataCenters: DataCenter[] = [
  { name: "New York", location: "United States", flag: "🇺🇸" },
  { name: "Amsterdam", location: "Netherlands", flag: "🇳🇱" },
  { name: "Frankfurt", location: "Germany", flag: "🇩🇪" },
  { name: "London", location: "United Kingdom", flag: "🇬🇧" },
  { name: "Singapore", location: "Singapore", flag: "🇸🇬" },
  { name: "Sydney", location: "Australia", flag: "🇦🇺" },
];

export function GlobalInfrastructure({
  title = "Global Infrastructure",
  subtitle = "Deploy closer to your users with our worldwide network of enterprise-grade data centers.",
  dataCenters = defaultDataCenters,
}: GlobalInfrastructureProps) {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-card/30 via-transparent to-card/30 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Static World Map Illustration - NO animated dots/lines */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative aspect-video"
          >
            {/* Clean background */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-primary/5 border border-border/50" />
            
            {/* Simple grid pattern - NO animated dots */}
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" viewBox="0 0 400 200">
                <defs>
                  <pattern id="staticGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-primary/20" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#staticGrid)" />
              </svg>
            </div>

            {/* Static datacenter indicators - NO animation loop, just simple markers */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full max-w-md">
                {/* Static location markers */}
                {[
                  { x: "20%", y: "40%", label: "NYC" },
                  { x: "45%", y: "32%", label: "LON" },
                  { x: "50%", y: "35%", label: "AMS" },
                  { x: "55%", y: "38%", label: "FRA" },
                  { x: "80%", y: "48%", label: "SIN" },
                  { x: "88%", y: "68%", label: "SYD" },
                ].map((pos, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{ left: pos.x, top: pos.y }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                  >
                    <div className="relative group">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      {/* Tooltip on hover - NOT animated continuously */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 bg-card border border-border rounded text-xs whitespace-nowrap">
                        {pos.label}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Info Cards */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: MapPin, value: "6+", label: "Data Centers" },
                { icon: Zap, value: "<30ms", label: "Avg Latency" },
                { icon: Globe, value: "99.99%", label: "Network Uptime" },
                { icon: Shield, value: "10 Tbps", label: "DDoS Protection" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="glass-card p-4 text-center"
                >
                  <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Locations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">Available Locations</h3>
              <div className="grid grid-cols-2 gap-3">
                {dataCenters.map((dc, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-lg">{dc.flag}</span>
                    <div>
                      <div className="font-medium text-foreground">{dc.name}</div>
                      <div className="text-xs text-muted-foreground">{dc.location}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
