import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, X, Shield, Zap, Crown } from "lucide-react";

interface DdosPlan {
  id: string;
  name: string;
  icon: React.ReactNode;
  price: number;
  description: string;
  limits: {
    gbps: string;
    pps: string;
    ips: string;
  };
  features: { label: string; included: boolean }[];
  popular?: boolean;
}

const plans: DdosPlan[] = [
  {
    id: "ddos-standard",
    name: "Standard",
    icon: <Shield className="w-6 h-6" />,
    price: 49,
    description: "Solid protection for smaller projects",
    limits: { gbps: "50 Gbps", pps: "10M pps", ips: "1 IP" },
    features: [
      { label: "L3/L4 Protection", included: true },
      { label: "Always-On Mitigation", included: true },
      { label: "Real-time Dashboard", included: true },
      { label: "Email Alerts", included: true },
      { label: "L7 Protection", included: false },
      { label: "Custom Rules", included: false },
      { label: "24/7 SOC Support", included: false },
      { label: "Dedicated Engineer", included: false },
    ],
  },
  {
    id: "ddos-advanced",
    name: "Advanced",
    icon: <Zap className="w-6 h-6" />,
    price: 149,
    description: "Complete protection for growing businesses",
    limits: { gbps: "200 Gbps", pps: "50M pps", ips: "5 IPs" },
    features: [
      { label: "L3/L4 Protection", included: true },
      { label: "Always-On Mitigation", included: true },
      { label: "Real-time Dashboard", included: true },
      { label: "Email + SMS Alerts", included: true },
      { label: "L7 Protection", included: true },
      { label: "Custom Rules", included: true },
      { label: "24/7 SOC Support", included: false },
      { label: "Dedicated Engineer", included: false },
    ],
    popular: true,
  },
  {
    id: "ddos-enterprise",
    name: "Enterprise",
    icon: <Crown className="w-6 h-6" />,
    price: 499,
    description: "Maximum protection for mission-critical systems",
    limits: { gbps: "500+ Gbps", pps: "100M+ pps", ips: "Unlimited" },
    features: [
      { label: "L3/L4 Protection", included: true },
      { label: "Always-On Mitigation", included: true },
      { label: "Real-time Dashboard", included: true },
      { label: "All Alert Channels", included: true },
      { label: "L7 Protection", included: true },
      { label: "Custom Rules", included: true },
      { label: "24/7 SOC Support", included: true },
      { label: "Dedicated Engineer", included: true },
    ],
  },
];

const comparisonRows = [
  { label: "Mitigation Capacity", values: ["50 Gbps", "200 Gbps", "500+ Gbps"] },
  { label: "Protected IPs", values: ["1", "5", "Unlimited"] },
  { label: "L3/L4 Protection", values: [true, true, true] },
  { label: "L7 Protection", values: [false, true, true] },
  { label: "Custom WAF Rules", values: [false, true, true] },
  { label: "24/7 SOC", values: [false, false, true] },
  { label: "SLA Uptime", values: ["99.9%", "99.95%", "99.99%"] },
  { label: "Response Time", values: ["< 1 hour", "< 15 min", "Instant"] },
];

export function DdosPlans() {
  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Protection Plans
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pick the protection level that fits your needs. Upgrade anytime.
          </p>
        </motion.div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card p-6 relative ${
                plan.popular ? "ring-2 ring-primary" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                  Most Popular
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  {plan.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                <span className="text-muted-foreground">/mo</span>
              </div>

              {/* Limits */}
              <div className="grid grid-cols-3 gap-2 mb-6 p-3 rounded-xl bg-card/50 border border-border/30">
                <div className="text-center">
                  <div className="text-sm font-bold text-foreground">{plan.limits.gbps}</div>
                  <div className="text-xs text-muted-foreground">Capacity</div>
                </div>
                <div className="text-center border-x border-border/30">
                  <div className="text-sm font-bold text-foreground">{plan.limits.pps}</div>
                  <div className="text-xs text-muted-foreground">PPS</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-foreground">{plan.limits.ips}</div>
                  <div className="text-xs text-muted-foreground">IPs</div>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    {feature.included ? (
                      <Check className="w-4 h-4 text-primary" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground/40" />
                    )}
                    <span className={feature.included ? "text-foreground" : "text-muted-foreground/60"}>
                      {feature.label}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to={`/checkout?category=security&product=ddos-protection&plan=${plan.id}&billing=monthly`}
                className={`w-full py-3 rounded-xl font-semibold text-center block transition-all ${
                  plan.popular
                    ? "btn-glow"
                    : "bg-card border border-border hover:border-primary text-foreground"
                }`}
              >
                Get Started
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-6 max-w-4xl mx-auto overflow-x-auto"
        >
          <h3 className="text-xl font-bold text-foreground mb-6 text-center">Compare Plans</h3>
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Feature</th>
                {plans.map((plan) => (
                  <th key={plan.id} className="py-3 px-4 text-center text-foreground font-semibold">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr key={i} className="border-b border-border/20 hover:bg-card/30 transition-colors">
                  <td className="py-3 px-4 text-muted-foreground">{row.label}</td>
                  {row.values.map((val, j) => (
                    <td key={j} className="py-3 px-4 text-center">
                      {typeof val === "boolean" ? (
                        val ? (
                          <Check className="w-5 h-5 text-primary mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground/40 mx-auto" />
                        )
                      ) : (
                        <span className="text-foreground font-medium">{val}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
