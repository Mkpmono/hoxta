import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const services = [{ name: "Web Hosting", status: "operational" }, { name: "Game Servers", status: "operational" }, { name: "VPS Hosting", status: "operational" }, { name: "Dedicated Servers", status: "operational" }, { name: "DDoS Protection", status: "operational" }, { name: "Control Panel", status: "operational" }];

export default function Status() {
  return (
    <Layout>
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 text-green-400 mb-4"><CheckCircle className="w-4 h-4" /><span className="text-sm font-medium">All Systems Operational</span></div>
            <h1 className="text-4xl font-bold text-foreground">System Status</h1>
          </motion.div>
          <div className="space-y-3">
            {services.map((service, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4 flex items-center justify-between">
                <span className="text-foreground">{service.name}</span>
                <span className="flex items-center gap-2 text-green-400 text-sm"><span className="w-2 h-2 rounded-full bg-green-400" />Operational</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
