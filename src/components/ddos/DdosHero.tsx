import { motion } from "framer-motion";
import { Shield, Clock, Server, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { StaticBackground } from "@/components/ui/StaticBackground";

export function DdosHero() {
  const { t } = useTranslation();
  const trustBadges = [
    { icon: <Zap className="w-4 h-4" />, text: t("ddos.hero.badgeCapacity") },
    { icon: <Clock className="w-4 h-4" />, text: t("ddos.hero.badgeSoc") },
    { icon: <Shield className="w-4 h-4" />, text: t("ddos.hero.badgeMitigation") },
  ];

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      <StaticBackground />

      <div className="container relative mx-auto px-4 md:px-6 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6"
          >
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">{t("ddos.hero.badge")}</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            {t("ddos.hero.titleStart")}{" "}
            <span className="text-gradient">{t("ddos.hero.titleHighlight")}</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {t("ddos.hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link
              to="/checkout?category=security&product=ddos-protection&plan=ddos-advanced&billing=monthly"
              className="btn-glow px-8 py-4 text-lg font-semibold inline-flex items-center gap-2 group"
            >
              <Shield className="w-5 h-5" />
              {t("ddos.hero.ctaProtected")}
            </Link>
            <Link
              to="/contact"
              className="btn-outline px-8 py-4 text-lg font-medium inline-flex items-center gap-2"
            >
              <Server className="w-5 h-5" />
              {t("ddos.hero.ctaEngineer")}
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6"
          >
            {trustBadges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border/50"
              >
                <div className="text-primary">{badge.icon}</div>
                <span className="text-sm font-medium text-foreground">{badge.text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
