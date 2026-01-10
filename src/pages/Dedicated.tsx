import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Check, Server, Cpu, HardDrive, Wifi, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const servers = [
  {
    name: "Intel Xeon E3",
    price: 89,
    specs: { cpu: "Intel Xeon E3-1230v6", cores: "4 Cores / 8 Threads", ram: "32 GB DDR4", storage: "2x 500GB NVMe", bandwidth: "10 TB" },
  },
  {
    name: "Intel Xeon E5",
    price: 149,
    specs: { cpu: "Intel Xeon E5-2680v4", cores: "14 Cores / 28 Threads", ram: "64 GB DDR4", storage: "2x 1TB NVMe", bandwidth: "20 TB" },
    popular: true,
  },
  {
    name: "AMD EPYC",
    price: 249,
    specs: { cpu: "AMD EPYC 7302P", cores: "16 Cores / 32 Threads", ram: "128 GB DDR4", storage: "2x 2TB NVMe", bandwidth: "Unlimited" },
  },
];

export default function Dedicated() {
  return (
    <Layout>
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Server className="w-4 h-4" />
              <span className="text-sm font-medium">Dedicated Servers</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              <span className="text-gradient">Dedicated</span> Servers
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enterprise-grade bare metal servers with full hardware control and maximum performance.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {servers.map((server, index) => (
              <motion.div
                key={server.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`glass-card p-6 relative ${server.popular ? "border-primary/50 shadow-glow" : ""}`}
              >
                {server.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                    BEST VALUE
                  </div>
                )}
                <h3 className="text-xl font-semibold text-foreground mb-2">{server.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-foreground">${server.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <Cpu className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-foreground">{server.specs.cpu}</div>
                      <div className="text-xs text-muted-foreground">{server.specs.cores}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Server className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">{server.specs.ram} ECC RAM</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <HardDrive className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">{server.specs.storage} RAID</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Wifi className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">{server.specs.bandwidth} @ 1Gbps</span>
                  </div>
                </div>

                <div className="space-y-2 mb-6 pt-4 border-t border-border/50">
                  {["DDoS Protection", "IPMI Access", "99.99% Uptime SLA", "24/7 Expert Support"].map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      {feature}
                    </div>
                  ))}
                </div>

                <Link
                  to="/contact"
                  className={`block w-full py-3 text-center rounded-lg font-medium transition-colors ${
                    server.popular ? "btn-glow" : "btn-outline"
                  }`}
                >
                  Configure Server
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <Zap className="w-8 h-8 text-primary" />
              <div>
                <h4 className="font-semibold text-foreground">Need a custom configuration?</h4>
                <p className="text-sm text-muted-foreground">Contact us for custom builds and enterprise solutions.</p>
              </div>
            </div>
            <Link to="/contact" className="btn-outline whitespace-nowrap">
              Contact Sales
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
