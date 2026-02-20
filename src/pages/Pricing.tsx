import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo";
import { motion } from "framer-motion";
import { 
  Globe, Gamepad2, Server, HardDrive, Shield, ArrowRight, 
  Check, Zap, Users, Headphones, Clock
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Globe,
    title: "Web Hosting",
    description: "Fast, reliable hosting for websites of all sizes with free SSL and daily backups.",
    from: "$2.99",
    features: ["Free SSL Certificate", "Daily Backups", "cPanel Control", "24/7 Support"],
    href: "/web-hosting",
    gradient: "from-blue-500/20 to-blue-500/5",
    popular: false,
  },
  {
    icon: Gamepad2,
    title: "Game Servers",
    description: "High-performance game servers with instant setup, mod support, and DDoS protection.",
    from: "$3.29",
    features: ["Instant Setup", "DDoS Protection", "Mod Support", "Custom Control Panel"],
    href: "/game-servers",
    gradient: "from-green-500/20 to-green-500/5",
    popular: true,
  },
  {
    icon: Server,
    title: "VPS Hosting",
    description: "Full root access virtual servers with NVMe storage and guaranteed resources.",
    from: "$5.99",
    features: ["Full Root Access", "NVMe Storage", "Dedicated Resources", "Choice of OS"],
    href: "/vps",
    gradient: "from-purple-500/20 to-purple-500/5",
    popular: false,
  },
  {
    icon: HardDrive,
    title: "Dedicated Servers",
    description: "Bare-metal performance for demanding workloads with enterprise-grade hardware.",
    from: "$69.99",
    features: ["EPYC / Xeon CPUs", "Hardware RAID", "Unmetered Bandwidth", "IPMI Access"],
    href: "/dedicated",
    gradient: "from-orange-500/20 to-orange-500/5",
    popular: false,
  },
  {
    icon: Users,
    title: "Reseller Hosting",
    description: "Start your own hosting business with white-label solutions and WHM access.",
    from: "$9.99",
    features: ["WHM Access", "White Label", "Free WHMCS", "Unlimited Domains"],
    href: "/reseller-hosting",
    gradient: "from-cyan-500/20 to-cyan-500/5",
    popular: false,
  },
  {
    icon: Shield,
    title: "DDoS Protection",
    description: "Multi-layered protection included with all services. Keep your infrastructure safe.",
    from: "Included",
    features: ["400+ Gbps Capacity", "L3/L4/L7 Filtering", "Always-On", "Real-time Dashboard"],
    href: "/ddos-protection",
    gradient: "from-red-500/20 to-red-500/5",
    popular: false,
  },
];

const trustPoints = [
  { icon: Shield, label: "DDoS Protection Included" },
  { icon: Clock, label: "99.9% Uptime SLA" },
  { icon: Headphones, label: "24/7/365 Expert Support" },
  { icon: Zap, label: "Instant Activation" },
];

export default function Pricing() {
  return (
    <Layout>
      <SEOHead
        title="Pricing | Hoxta Hosting"
        description="Transparent pricing for web hosting, game servers, VPS, dedicated servers, and more. No hidden fees."
        canonicalUrl="/pricing"
      />

      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Transparent Pricing</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Simple, Fair <span className="text-primary">Pricing</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              No hidden fees. No surprises. Pick a service and see detailed plans on each product page.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
            {trustPoints.map((point, i) => (
              <div key={i} className="flex items-center gap-2 text-muted-foreground">
                <point.icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{point.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Cards */}
      <section className="pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`relative glass-card p-6 flex flex-col hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(25,195,255,0.1)] ${
                  service.popular ? "ring-1 ring-primary/40" : ""
                }`}
              >
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3" /> POPULAR
                  </div>
                )}

                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} border border-border/30 flex items-center justify-center mb-5`}>
                  <service.icon className="w-7 h-7 text-primary" />
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground mb-5 flex-1">{service.description}</p>

                <div className="mb-5">
                  <span className="text-sm text-muted-foreground">Starting from</span>
                  <div className="text-3xl font-bold text-foreground">
                    {service.from}
                    {service.from !== "Included" && <span className="text-base font-normal text-muted-foreground">/mo</span>}
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feat, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <Link
                  to={service.href}
                  className={`block w-full py-3 text-center rounded-lg font-medium transition-all ${
                    service.popular ? "btn-glow" : "btn-outline"
                  }`}
                >
                  View Plans <ArrowRight className="w-4 h-4 inline ml-1" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ-style bottom */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Not Sure Which Plan?
          </h2>
          <p className="text-muted-foreground mb-8">
            Our team can help you choose the right solution for your needs. Get personalized recommendations based on your project requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-glow px-8 py-3 rounded-lg font-medium inline-flex items-center justify-center gap-2">
              Talk to Sales <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/knowledge-base" className="btn-outline px-8 py-3 rounded-lg font-medium inline-flex items-center justify-center gap-2">
              Browse Knowledge Base
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
