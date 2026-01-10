import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";

export default function Pricing() {
  return (
    <Layout>
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Pricing</h1>
            <p className="text-muted-foreground mb-8">Transparent pricing for all our services. Visit individual product pages for detailed plans.</p>
            <div className="grid md:grid-cols-3 gap-6">
              {[{ title: "Web Hosting", from: "$2.99", link: "/web-hosting" }, { title: "Game Servers", from: "$3.29", link: "/game-servers" }, { title: "VPS Hosting", from: "$5.99", link: "/vps" }].map((item, i) => (
                <motion.a key={i} href={item.link} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card-hover p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <div className="text-3xl font-bold text-primary mb-2">From {item.from}</div>
                  <div className="text-sm text-muted-foreground">/month</div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
