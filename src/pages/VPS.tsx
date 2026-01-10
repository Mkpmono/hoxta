import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Check, Server, Cpu, HardDrive, Wifi } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "VPS Starter",
    price: 5.99,
    specs: { cpu: "1 vCPU", ram: "2 GB", storage: "30GB NVMe", bandwidth: "1 TB" },
    features: ["Full Root Access", "DDoS Protection", "99.9% Uptime", "24/7 Support"],
  },
  {
    name: "VPS Standard",
    price: 12.99,
    specs: { cpu: "2 vCPU", ram: "4 GB", storage: "60GB NVMe", bandwidth: "2 TB" },
    features: ["Full Root Access", "DDoS Protection", "99.9% Uptime", "Priority Support", "Daily Backups"],
    popular: true,
  },
  {
    name: "VPS Pro",
    price: 24.99,
    specs: { cpu: "4 vCPU", ram: "8 GB", storage: "120GB NVMe", bandwidth: "4 TB" },
    features: ["Full Root Access", "DDoS Protection", "99.9% Uptime", "Dedicated Support", "Daily Backups", "Dedicated IP"],
  },
  {
    name: "VPS Enterprise",
    price: 49.99,
    specs: { cpu: "8 vCPU", ram: "16 GB", storage: "250GB NVMe", bandwidth: "Unlimited" },
    features: ["Full Root Access", "DDoS Protection", "99.99% Uptime", "Dedicated Support", "Hourly Backups", "Multiple IPs"],
  },
];

export default function VPS() {
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
              <span className="text-sm font-medium">VPS Hosting</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              <span className="text-gradient">VPS</span> Hosting
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Virtual private servers with full root access, NVMe storage, and enterprise-grade infrastructure.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`glass-card p-6 relative ${plan.popular ? "border-primary/50 shadow-glow" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                    POPULAR
                  </div>
                )}
                <h3 className="text-lg font-semibold text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold text-foreground">${plan.price}</span>
                  <span className="text-muted-foreground text-sm">/month</span>
                </div>

                <div className="space-y-2 mb-4 pb-4 border-b border-border/50">
                  <div className="flex items-center gap-2 text-sm">
                    <Cpu className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">{plan.specs.cpu}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Server className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">{plan.specs.ram} RAM</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <HardDrive className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">{plan.specs.storage}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Wifi className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">{plan.specs.bandwidth}</span>
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className={`block w-full py-2.5 text-center rounded-lg font-medium text-sm transition-colors ${
                    plan.popular ? "btn-glow" : "btn-outline"
                  }`}
                >
                  Order Now
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
