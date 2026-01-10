import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Check, Server, Users, DollarSign, Headphones } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Bronze",
    price: 9.99,
    accounts: 25,
    storage: "50GB NVMe",
    features: ["WHM/cPanel", "Free SSL", "Softaculous", "White-label", "24/7 Support"],
  },
  {
    name: "Silver",
    price: 19.99,
    accounts: 75,
    storage: "100GB NVMe",
    features: ["WHM/cPanel", "Free SSL", "Softaculous", "White-label", "Priority Support", "Free WHMCS"],
    popular: true,
  },
  {
    name: "Gold",
    price: 39.99,
    accounts: "Unlimited",
    storage: "200GB NVMe",
    features: ["WHM/cPanel", "Free SSL", "Softaculous", "White-label", "Dedicated Support", "Free WHMCS", "Dedicated IP"],
  },
];

export default function ResellerHosting() {
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
              <span className="text-sm font-medium">Reseller Hosting</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Start Your <span className="text-gradient">Hosting Business</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create and manage your own hosting company with our white-label reseller plans.
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
                    BEST VALUE
                  </div>
                )}
                <h3 className="text-xl font-semibold text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                  <span><Users className="w-4 h-4 inline mr-1" />{plan.accounts} accounts</span>
                  <span>{plan.storage}</span>
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

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: DollarSign, title: "Set Your Prices", desc: "Full control over pricing" },
              { icon: Users, title: "Manage Clients", desc: "Easy client management" },
              { icon: Headphones, title: "We Handle Support", desc: "Optional white-label support" },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="glass-card p-6 text-center"
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
