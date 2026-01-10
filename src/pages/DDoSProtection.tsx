import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Shield, Check, Zap, Globe, Server } from "lucide-react";
import { Link } from "react-router-dom";
import { AntiDDoSSection } from "@/components/home/AntiDDoSSection";

export default function DDoSProtection() {
  const features = [
    { title: "400+ Gbps Capacity", desc: "Enterprise-grade mitigation capacity" },
    { title: "Always-On Protection", desc: "24/7 automated DDoS scrubbing" },
    { title: "L3/L4/L7 Protection", desc: "Multi-layer attack mitigation" },
    { title: "Instant Mitigation", desc: "<10 second attack detection" },
    { title: "Zero Downtime", desc: "Seamless traffic filtering" },
    { title: "Real-time Reports", desc: "Live attack dashboards" },
  ];

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
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">DDoS Protection</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Enterprise <span className="text-gradient">DDoS Protection</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Keep your services online with our multi-layered DDoS mitigation infrastructure.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Check className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground ml-8">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AntiDDoSSection />

      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass-card p-8 text-center"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">Protected by Default</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              All Hoxta services include DDoS protection at no additional cost.
            </p>
            <Link to="/contact" className="btn-glow inline-block">
              Get Protected
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
