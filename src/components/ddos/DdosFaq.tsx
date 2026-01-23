import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "What is the difference between L3/L4 and L7 DDoS protection?",
    answer:
      "L3/L4 protection handles volumetric attacks targeting the network and transport layers (like SYN floods, UDP amplification). L7 protection focuses on application-layer attacks (like HTTP floods, Slowloris) that try to exhaust server resources. For complete coverage, we recommend both.",
  },
  {
    question: "Do you support game-specific DDoS protection?",
    answer:
      "Yes! Our game server protection is optimized for popular titles including Minecraft, FiveM, Rust, ARK, and more. We use protocol-aware filtering that understands game traffic patterns to minimize false positives while blocking attacks.",
  },
  {
    question: "Will DDoS mitigation add latency to my traffic?",
    answer:
      "Our always-on mitigation adds less than 1ms of latency in normal conditions. During active attacks, clean traffic is routed through our nearest scrubbing center with minimal impact. Most users experience no noticeable difference.",
  },
  {
    question: "How do I onboard my infrastructure?",
    answer:
      "Onboarding is simple: 1) Sign up and configure your protected IPs in our dashboard. 2) Update your DNS or BGP routing to point to our network. 3) We'll provision your protection within minutes. Our team can assist with complex setups.",
  },
  {
    question: "Do I need to change my DNS records?",
    answer:
      "For most setups, yes—you'll point your DNS to our protected IPs. For larger deployments, we support BGP-based routing where you announce your prefixes through our network. We provide detailed migration guides for both methods.",
  },
  {
    question: "What kind of reports and analytics do I get?",
    answer:
      "You get real-time dashboards showing traffic patterns, attack vectors, blocked threats, and bandwidth usage. Historical reports are available for compliance. Enterprise plans include custom reporting and API access for integration with your monitoring tools.",
  },
  {
    question: "Can I protect multiple IPs or entire subnets?",
    answer:
      "Absolutely. Standard plans protect 1 IP, Advanced protects 5 IPs, and Enterprise supports unlimited IPs including full /24 subnets or larger. Contact us for custom configurations covering your entire infrastructure.",
  },
  {
    question: "What happens during a large-scale attack?",
    answer:
      "Our network automatically scales to absorb attacks up to 500+ Gbps. Traffic is distributed across multiple scrubbing centers. Enterprise customers have access to our 24/7 SOC team who actively monitor and tune mitigation in real-time.",
  },
  {
    question: "Is there a money-back guarantee?",
    answer:
      "Yes, we offer a 30-day money-back guarantee on all plans. If you're not satisfied with our protection, contact support within 30 days for a full refund—no questions asked.",
  },
  {
    question: "How quickly can I get started?",
    answer:
      "Protection can be active within minutes of signup. Simply configure your IPs in our dashboard, update your DNS, and you're protected. For complex enterprise setups, our onboarding team typically completes deployment within 24 hours.",
  },
];

export function DdosFaq() {
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
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about our DDoS protection services.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card border-border/50 rounded-xl overflow-hidden px-6"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-primary hover:no-underline py-5">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
