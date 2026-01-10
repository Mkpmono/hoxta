import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="glass-card p-8 md:p-12 text-center"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Need to know more?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            You can ask questions, request a quote or discuss a custom setup. We'll get back to you quickly.
          </p>
          <Link to="/contact" className="btn-glow inline-flex items-center gap-2">
            Contact us
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
