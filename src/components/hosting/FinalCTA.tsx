import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Clock, Headphones } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FinalCTAProps {
  title?: string;
  subtitle?: string;
  primaryCTA?: { text: string; href: string };
  secondaryCTA?: { text: string; href: string };
  guarantees?: { icon: React.ReactNode; text: string }[];
}

export const FinalCTA = forwardRef<HTMLElement, FinalCTAProps>(function FinalCTA({
  title, subtitle, primaryCTA, secondaryCTA, guarantees,
}, ref) {
  const { t } = useTranslation();

  const resolvedTitle = title || t("hosting.finalCta.title");
  const resolvedSubtitle = subtitle || t("hosting.finalCta.subtitle");
  const resolvedPrimary = primaryCTA || { text: t("hosting.finalCta.getStarted"), href: "#pricing" };
  const resolvedSecondary = secondaryCTA || { text: t("hosting.finalCta.contactSales"), href: "/contact" };
  const resolvedGuarantees = guarantees || [
    { icon: <Shield className="w-4 h-4" />, text: t("hosting.finalCta.moneyBack") },
    { icon: <Clock className="w-4 h-4" />, text: t("hosting.finalCta.uptimeSla") },
    { icon: <Headphones className="w-4 h-4" />, text: t("hosting.finalCta.support247") },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />
          <div className="absolute inset-0 bg-card/80 backdrop-blur-sm" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl" />
          <div className="relative px-8 py-16 md:py-20 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">{resolvedTitle}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">{resolvedSubtitle}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Link to={resolvedPrimary.href} className="btn-glow px-8 py-4 text-lg font-semibold inline-flex items-center gap-2 group">
                {resolvedPrimary.text}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to={resolvedSecondary.href} className="btn-outline px-8 py-4 text-lg font-medium">{resolvedSecondary.text}</Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {resolvedGuarantees.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="text-primary">{item.icon}</div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
