import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo";
import { motion } from "framer-motion";
import { 
  Mail, MessageCircle, MapPin, Clock, Ticket, Briefcase, 
  Send, ArrowRight, Headphones, Globe, Shield 
} from "lucide-react";
import { brand } from "@/config/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useState } from "react";

const contactMethods = [
  {
    icon: Ticket,
    title: "Support Ticket",
    description: "Technical issues? Open a ticket and our experts will help you resolve it quickly.",
    action: { label: "Open Ticket", href: "https://api.hoxta.com/submitticket.php", external: true },
    gradient: "from-blue-500/20 to-blue-500/5",
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Need quick help? Chat with our team in real-time for instant support.",
    action: { label: "Start Chat", href: "#", external: false },
    gradient: "from-green-500/20 to-green-500/5",
  },
  {
    icon: Briefcase,
    title: "Sales Inquiry",
    description: "Custom solutions or enterprise pricing? Let's talk about your needs.",
    action: { label: "Email Sales", href: "mailto:sales@hoxta.com", external: true },
    gradient: "from-purple-500/20 to-purple-500/5",
  },
];

const infoItems = [
  {
    icon: Mail,
    title: "Email",
    lines: [
      { label: "General", value: "info@hoxta.com", href: "mailto:info@hoxta.com" },
      { label: "Support", value: brand.supportEmail, href: `mailto:${brand.supportEmail}` },
      { label: "Sales", value: "sales@hoxta.com", href: "mailto:sales@hoxta.com" },
    ],
  },
  {
    icon: Clock,
    title: "Support Hours",
    lines: [
      { label: "Technical Support", value: "24/7/365" },
      { label: "Sales", value: "Mon-Fri 9AM-6PM EST" },
      { label: "Billing", value: "Mon-Fri 9AM-6PM EST" },
    ],
  },
  {
    icon: Globe,
    title: "Connect",
    lines: [
      { label: "Discord", value: "Community", href: brand.socials.discord },
      { label: "Twitter / X", value: "@hoxta", href: brand.socials.twitter },
      { label: "Status Page", value: "status.hoxta.com", href: "/status" },
    ],
  },
];

const subjects = [
  { value: "", label: "Select a topic" },
  { value: "sales", label: "Sales Inquiry" },
  { value: "support", label: "Technical Support" },
  { value: "billing", label: "Billing Question" },
  { value: "partnership", label: "Partnership" },
  { value: "other", label: "Other" },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  return (
    <Layout>
      <SEOHead
        title="Contact Us | Hoxta Hosting"
        description="Get in touch with Hoxta support and sales. 24/7 expert assistance for all your hosting needs."
        canonicalUrl="/contact"
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
              <Headphones className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">24/7 Support</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Get in <span className="text-primary">Touch</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              We're here to help. Reach out to our team anytime — we respond within hours, not days.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {contactMethods.map((method, i) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 flex flex-col items-center text-center hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${method.gradient} border border-border/30 flex items-center justify-center mb-5`}>
                  <method.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{method.title}</h3>
                <p className="text-sm text-muted-foreground mb-6 flex-1">{method.description}</p>
                {method.action.external ? (
                  <a href={method.action.href} className="btn-outline px-6 py-2.5 rounded-lg font-medium text-sm inline-flex items-center gap-2">
                    {method.action.label} <ArrowRight className="w-4 h-4" />
                  </a>
                ) : (
                  <Button variant="outline" className="btn-outline gap-2">
                    {method.action.label} <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                Send Us a <span className="text-primary">Message</span>
              </h2>
              <p className="text-muted-foreground">Fill out the form below and we'll get back to you within 24 hours.</p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              action="https://api.hoxta.com/submitticket.php"
              method="POST"
              className="glass-card p-8 space-y-6"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Your Name</label>
                  <Input
                    type="text"
                    name="name"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    className="bg-card/60 border-border/50 focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                  <Input
                    type="email"
                    name="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    className="bg-card/60 border-border/50 focus:border-primary/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                <select
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={e => setFormData(p => ({ ...p, subject: e.target.value }))}
                  className="w-full h-10 px-3 rounded-md bg-card/60 border border-border/50 focus:border-primary/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ring-offset-background"
                >
                  {subjects.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                <textarea
                  name="message"
                  rows={6}
                  required
                  placeholder="Describe your question or issue..."
                  value={formData.message}
                  onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                  className="w-full px-3 py-2 rounded-md bg-card/60 border border-border/50 focus:border-primary/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ring-offset-background resize-none"
                />
              </div>
              <Button type="submit" className="w-full btn-glow gap-2 h-12 text-base">
                <Send className="w-4 h-4" /> Send Message
              </Button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Info Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {infoItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                </div>
                <div className="space-y-3">
                  {item.lines.map((line, j) => (
                    <div key={j} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{line.label}</span>
                      {"href" in line && line.href ? (
                        <a href={line.href} className="text-primary hover:underline">{line.value}</a>
                      ) : (
                        <span className="text-foreground font-medium">{line.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-12 bg-card/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-center">
            {[
              { icon: Shield, label: "99.9% Uptime SLA" },
              { icon: Clock, label: "< 15min Response" },
              { icon: Headphones, label: "24/7/365 Support" },
              { icon: MapPin, label: brand.location },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-muted-foreground">
                <item.icon className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
