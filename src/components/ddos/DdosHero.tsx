import { motion } from "framer-motion";
import { Shield, Clock, Server, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { StaticBackground } from "@/components/ui/StaticBackground";

export function DdosHero() {
  const trustBadges = [
    { icon: <Zap className="w-4 h-4" />, text: "400+ Gbps Capacity" },
    { icon: <Clock className="w-4 h-4" />, text: "24/7 SOC" },
    { icon: <Shield className="w-4 h-4" />, text: "<10s Mitigation" },
  ];

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      <StaticBackground />

      <div className="container relative mx-auto px-4 md:px-6 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6"
          >
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Enterprise DDoS Protection</span>
          </motion.div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Stop Attacks.{" "}
            <span className="text-gradient">Stay Online.</span>
          </h1>

          {/* Value proposition */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Multi-layered DDoS protection that keeps your infrastructure online. 
            Always-on mitigation with zero performance impact and real-time threat intelligence.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link
              to="/checkout?category=security&product=ddos-protection&plan=ddos-advanced&billing=monthly"
              className="btn-glow px-8 py-4 text-lg font-semibold inline-flex items-center gap-2 group"
            >
              <Shield className="w-5 h-5" />
              Get Protected
            </Link>
            <Link
              to="/contact"
              className="btn-outline px-8 py-4 text-lg font-medium inline-flex items-center gap-2"
            >
              <Server className="w-5 h-5" />
              Talk to an Engineer
            </Link>
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6"
          >
            {trustBadges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border/50"
              >
                <div className="text-primary">{badge.icon}</div>
                <span className="text-sm font-medium text-foreground">{badge.text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
