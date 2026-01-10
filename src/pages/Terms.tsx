import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";

export default function Terms() {
  return (
    <Layout>
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
            <div className="glass-card p-8 prose prose-invert max-w-none">
              <p className="text-muted-foreground">Last updated: January 2026</p>
              <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">By accessing and using Hoxta services, you agree to be bound by these Terms of Service.</p>
              <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">2. Service Description</h2>
              <p className="text-muted-foreground">Hoxta provides web hosting, game server hosting, VPS, and dedicated server services.</p>
              <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">3. Acceptable Use</h2>
              <p className="text-muted-foreground">You agree not to use our services for any illegal or unauthorized purpose.</p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
