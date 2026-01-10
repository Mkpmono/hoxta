import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Check, Globe, Zap, Shield, Headphones } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: 2.99,
    features: ["1 Website", "5GB SSD Storage", "Unlimited Bandwidth", "Free SSL Certificate", "24/7 Support"],
    popular: false,
  },
  {
    name: "Professional",
    price: 6.99,
    features: ["Unlimited Websites", "25GB NVMe Storage", "Unlimited Bandwidth", "Free SSL & CDN", "Daily Backups", "Priority Support"],
    popular: true,
  },
  {
    name: "Business",
    price: 12.99,
    features: ["Unlimited Websites", "100GB NVMe Storage", "Unlimited Bandwidth", "Free SSL & CDN", "Daily Backups", "Dedicated IP", "White-label"],
    popular: false,
  },
];

export default function WebHosting() {
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
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">Web Hosting</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Fast & Reliable <span className="text-gradient">Web Hosting</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Launch your website with lightning-fast NVMe storage, free SSL, and enterprise-grade security.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
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
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-xl font-semibold text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className={`block w-full py-3 text-center rounded-lg font-medium transition-colors ${
                    plan.popular ? "btn-glow" : "btn-outline"
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: "Instant Setup", desc: "Your site live in minutes" },
              { icon: Shield, title: "DDoS Protection", desc: "Enterprise-grade security" },
              { icon: Globe, title: "Free SSL", desc: "Secure all your domains" },
              { icon: Headphones, title: "24/7 Support", desc: "Expert help anytime" },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
