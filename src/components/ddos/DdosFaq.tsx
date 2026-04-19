import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function DdosFaq() {
  const { t } = useTranslation();
  const faqItems = (t("ddos.faq.items", { returnObjects: true }) as { q: string; a: string }[]) || [];

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("ddos.faq.title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("ddos.faq.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {Array.isArray(faqItems) && faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card border-border/50 rounded-xl overflow-hidden px-6"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-primary hover:no-underline py-5">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
