import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";

export default function Privacy() {
  return (
    <Layout>
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
            <div className="glass-card p-8">
              <p className="text-muted-foreground mb-6">Last updated: January 2026</p>
              <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">Data Collection</h2>
              <p className="text-muted-foreground">We collect information you provide directly to us, such as when you create an account or contact support.</p>
              <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">Data Usage</h2>
              <p className="text-muted-foreground">We use your information to provide, maintain, and improve our services.</p>
              <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">Data Security</h2>
              <p className="text-muted-foreground">We implement appropriate security measures to protect your personal information.</p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
