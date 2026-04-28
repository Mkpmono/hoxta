import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo";
import { motion } from "framer-motion";
import { Send, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useEditablePage } from "@/hooks/useEditablePage";
import { DEFAULT_CONTACT, PageIcon } from "@/data/editablePagesDefaults";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { openLiveChat } from "@/lib/liveChat";

export default function Contact() {
  const c = useEditablePage("contact", DEFAULT_CONTACT);
  const [formData, setFormData] = useState({ name: "", email: "", subject: c.formSubjectOptions?.[0] || "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: formData,
      });
      if (error) throw error;
      toast.success(c.formSuccessMessage);
      setFormData({ name: "", email: "", subject: c.formSubjectOptions?.[0] || "", message: "" });
    } catch (err: any) {
      toast.error(err?.message || "Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCardClick = (e: React.MouseEvent, url: string) => {
    if (url === "#live-chat" || url === "#") {
      e.preventDefault();
      openLiveChat();
    }
  };

  return (
    <Layout>
      <SEOHead
        title={`${c.titlePart1} ${c.titlePart2} | Hoxta Hosting`}
        description={c.subtitle}
        canonicalUrl="/contact"
      />

      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <PageIcon name="Headphones" className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{c.badge}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {c.titlePart1} <span className="text-primary">{c.titlePart2}</span>
            </h1>
            <p className="text-lg text-muted-foreground">{c.subtitle}</p>
          </motion.div>
        </div>
      </section>

      {/* Action cards */}
      <section className="pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {c.actionCards.map((card, i) => {
              const isExternal = /^https?:\/\//.test(card.ctaUrl);
              const isAnchor = card.ctaUrl.startsWith("#");
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="glass-card p-6 flex flex-col items-center text-center hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                    <PageIcon name={card.icon} className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground mb-6 flex-1">{card.description}</p>
                  <a
                    href={card.ctaUrl}
                    onClick={(e) => handleCardClick(e, card.ctaUrl)}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="btn-outline px-6 py-2.5 rounded-lg font-medium text-sm inline-flex items-center gap-2"
                  >
                    {card.ctaLabel} <ArrowRight className="w-4 h-4" />
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{c.formTitle}</h2>
              <p className="text-muted-foreground">{c.formSubtitle}</p>
            </motion.div>
            <motion.form
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="glass-card p-8 space-y-6"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{c.formNameLabel}</label>
                  <Input type="text" name="name" required maxLength={200} placeholder={c.formNamePlaceholder}
                    value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    className="bg-card/60 border-border/50 focus:border-primary/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{c.formEmailLabel}</label>
                  <Input type="email" name="email" required maxLength={255} placeholder={c.formEmailPlaceholder}
                    value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    className="bg-card/60 border-border/50 focus:border-primary/50" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{c.formSubjectLabel}</label>
                <select name="subject" required value={formData.subject}
                  onChange={(e) => setFormData((p) => ({ ...p, subject: e.target.value }))}
                  className="w-full h-10 px-3 rounded-md bg-card/60 border border-border/50 focus:border-primary/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ring-offset-background">
                  <option value="" disabled>{c.formSubjectPlaceholder}</option>
                  {c.formSubjectOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{c.formMessageLabel}</label>
                <textarea name="message" rows={6} required maxLength={5000} placeholder={c.formMessagePlaceholder}
                  value={formData.message} onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                  className="w-full px-3 py-2 rounded-md bg-card/60 border border-border/50 focus:border-primary/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ring-offset-background resize-none" />
              </div>
              <Button type="submit" disabled={submitting} className="w-full btn-glow gap-2 h-12 text-base">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {c.formSubmitLabel}
              </Button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Info Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {c.infoCards.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <PageIcon name={item.icon} className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                </div>
                <div className="space-y-3">
                  {item.rows.map((row, j) => (
                    <div key={j} className="flex items-center justify-between text-sm gap-3">
                      <span className="text-muted-foreground">{row.label}</span>
                      {row.href ? (
                        <a href={row.href}
                          target={row.href.startsWith("http") ? "_blank" : undefined}
                          rel={row.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="text-primary hover:underline truncate">
                          {row.value}
                        </a>
                      ) : (
                        <span className="text-foreground font-medium">{row.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust banner */}
      <section className="py-12 bg-card/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-center">
            {c.trustItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-muted-foreground">
                <PageIcon name={item.icon} className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
