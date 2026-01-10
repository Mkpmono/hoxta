import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Mail, MessageCircle, MapPin, Clock } from "lucide-react";
import { brand } from "@/config/brand";

export default function Contact() {
  return (
    <Layout>
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Contact Us</h1>
            <p className="text-muted-foreground">Get in touch with our team</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 space-y-6">
              <div className="flex items-center gap-4"><Mail className="w-5 h-5 text-primary" /><div><div className="font-medium text-foreground">Email</div><div className="text-sm text-muted-foreground">{brand.supportEmail}</div></div></div>
              <div className="flex items-center gap-4"><MessageCircle className="w-5 h-5 text-primary" /><div><div className="font-medium text-foreground">Discord</div><div className="text-sm text-muted-foreground">Join our community</div></div></div>
              <div className="flex items-center gap-4"><MapPin className="w-5 h-5 text-primary" /><div><div className="font-medium text-foreground">Location</div><div className="text-sm text-muted-foreground">{brand.location}</div></div></div>
              <div className="flex items-center gap-4"><Clock className="w-5 h-5 text-primary" /><div><div className="font-medium text-foreground">Support Hours</div><div className="text-sm text-muted-foreground">24/7 Available</div></div></div>
            </motion.div>
            <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 space-y-4">
              <div><label className="block text-sm font-medium text-foreground mb-1">Name</label><input type="text" className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none text-foreground" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Email</label><input type="email" className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none text-foreground" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Message</label><textarea rows={4} className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none text-foreground resize-none" /></div>
              <button type="submit" className="w-full btn-glow">Send Message</button>
            </motion.form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
