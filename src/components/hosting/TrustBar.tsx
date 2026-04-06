import { motion } from "framer-motion";
import { Star, Shield, Clock, Users, Award } from "lucide-react";
import { useTranslation } from "react-i18next";

interface TrustItem {
  icon: React.ReactNode;
  label: string;
  value: string;
}

interface TrustBarProps {
  items?: TrustItem[];
}

export function TrustBar({ items }: TrustBarProps) {
  const { t } = useTranslation();

  const defaultItems: TrustItem[] = [
    { icon: <Star className="w-5 h-5 fill-primary text-primary" />, label: "Trustpilot", value: "4.9/5" },
    { icon: <Shield className="w-5 h-5 text-primary" />, label: "Uptime", value: "99.9%" },
    { icon: <Clock className="w-5 h-5 text-primary" />, label: t("hosting.finalCta.moneyBack", "Money-back"), value: "30 Days" },
    { icon: <Users className="w-5 h-5 text-primary" />, label: t("pages.about.activeCustomers", "Customers"), value: "50,000+" },
    { icon: <Award className="w-5 h-5 text-primary" />, label: t("common.support247", "Support"), value: "24/7/365" },
  ];

  const resolvedItems = items || defaultItems;

  return (
    <section className="py-6 border-y border-border/30 bg-card/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {resolvedItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              {item.icon}
              <div>
                <div className="text-sm font-bold text-foreground">{item.value}</div>
                <div className="text-xs text-muted-foreground">{item.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
