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
        <div
          className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16"
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                {item.icon}
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-foreground">{item.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
