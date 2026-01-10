import { motion } from "framer-motion";
import { Star, Shield, Clock, Users, Award } from "lucide-react";

interface TrustItem {
  icon: React.ReactNode;
  label: string;
  value: string;
}

interface TrustBarProps {
  items?: TrustItem[];
}

const defaultItems: TrustItem[] = [
  {
    icon: <Star className="w-5 h-5 fill-primary text-primary" />,
    label: "Trustpilot",
    value: "4.9/5",
  },
  {
    icon: <Shield className="w-5 h-5 text-primary" />,
    label: "Uptime",
    value: "99.9%",
  },
  {
    icon: <Clock className="w-5 h-5 text-primary" />,
    label: "Money-back",
    value: "30 Days",
  },
  {
    icon: <Users className="w-5 h-5 text-primary" />,
    label: "Customers",
    value: "50,000+",
  },
  {
    icon: <Award className="w-5 h-5 text-primary" />,
    label: "Support",
    value: "24/7/365",
  },
];

export function TrustBar({ items = defaultItems }: TrustBarProps) {
  return (
    <section className="py-8 border-y border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16"
        >
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                {item.icon}
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-foreground">{item.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">{item.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
