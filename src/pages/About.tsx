import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Users, Award, Globe, Zap } from "lucide-react";

export default function About() {
  return (
    <Layout>
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">About <span className="text-gradient">Hoxta</span></h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Premium hosting infrastructure for gamers, developers, and businesses worldwide.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[{ icon: Users, label: "10,000+", desc: "Active Customers" }, { icon: Award, label: "99.9%", desc: "Uptime SLA" }, { icon: Globe, label: "5", desc: "Data Centers" }, { icon: Zap, label: "24/7", desc: "Expert Support" }].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-6 text-center">
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.desc}</div>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">To provide the most reliable, high-performance hosting infrastructure that empowers gamers and developers to build amazing experiences without worrying about their servers.</p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
