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
          {/* Abstract visual (NO dots/lines/canvas/svg-map) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative aspect-video rounded-2xl border border-border/50 overflow-hidden bg-gradient-to-br from-primary/10 via-transparent to-primary/5"
          >
            {/* Soft glows */}
            <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-primary/10 blur-[80px]" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-primary/10 blur-[90px]" />

            {/* Subtle layered panels */}
            <div className="absolute inset-6 rounded-xl bg-card/20 border border-border/30" />
            <div className="absolute inset-10 rounded-xl bg-card/10 border border-border/20" />

            {/* Minimal text badge */}
            <div className="absolute bottom-6 left-6 px-3 py-1.5 rounded-full bg-background/40 border border-border/40 text-xs text-muted-foreground">
              Global coverage • low latency
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
