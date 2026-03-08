import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo";
import { motion } from "framer-motion";
import { Globe, Gamepad2, Server, HardDrive, Shield, ArrowRight, Check, Zap, Users, Headphones, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Pricing() {
  const { t } = useTranslation();

  const services = [
    {
      icon: Globe, title: t("pages.pricing.webHosting"), description: t("pages.pricing.webHostingDesc"),
      from: "$2.99", features: [t("pages.pricing.freeSSL"), t("pages.pricing.dailyBackups"), t("pages.pricing.cpanelControl"), t("common.support247")],
      href: "/web-hosting", gradient: "from-blue-500/20 to-blue-500/5", popular: false,
    },
    {
      icon: Gamepad2, title: t("pages.pricing.gameServers"), description: t("pages.pricing.gameServersDesc"),
      from: "$3.29", features: [t("common.instantSetup"), t("common.ddosProtection"), t("pages.pricing.modSupport"), t("pages.pricing.customControlPanel")],
      href: "/game-servers", gradient: "from-green-500/20 to-green-500/5", popular: true,
    },
    {
      icon: Server, title: t("pages.pricing.vpsHosting"), description: t("pages.pricing.vpsHostingDesc"),
      from: "$5.99", features: [t("pages.pricing.fullRootAccess"), t("pages.pricing.nvmeStorage"), t("pages.pricing.dedicatedResources"), t("pages.pricing.choiceOfOS")],
      href: "/vps", gradient: "from-purple-500/20 to-purple-500/5", popular: false,
    },
    {
      icon: HardDrive, title: t("pages.pricing.dedicatedServers"), description: t("pages.pricing.dedicatedServersDesc"),
      from: "$69.99", features: [t("pages.pricing.epycXeonCPUs"), t("pages.pricing.hardwareRAID"), t("pages.pricing.unmeteredBandwidth"), t("pages.pricing.ipmiAccess")],
      href: "/dedicated", gradient: "from-orange-500/20 to-orange-500/5", popular: false,
    },
    {
      icon: Users, title: t("pages.pricing.resellerHosting"), description: t("pages.pricing.resellerHostingDesc"),
      from: "$9.99", features: [t("pages.pricing.whmAccess"), t("pages.pricing.whiteLabel"), t("pages.pricing.freeWHMCS"), t("pages.pricing.unlimitedDomains")],
      href: "/reseller-hosting", gradient: "from-cyan-500/20 to-cyan-500/5", popular: false,
    },
    {
      icon: Shield, title: t("pages.pricing.ddosProtection"), description: t("pages.pricing.ddosProtectionDesc"),
      from: t("pages.pricing.included"), features: [t("pages.pricing.gbpsCapacity"), t("pages.pricing.l3l4l7Filtering"), t("pages.pricing.alwaysOn"), t("pages.pricing.realtimeDashboard")],
      href: "/ddos-protection", gradient: "from-red-500/20 to-red-500/5", popular: false,
    },
  ];

  const trustPoints = [
    { icon: Shield, label: t("pages.pricing.ddosProtectionIncluded") },
    { icon: Clock, label: t("pages.contact.uptimeSla") },
    { icon: Headphones, label: t("pages.contact.support247365") },
    { icon: Zap, label: t("pages.pricing.instantActivation") },
  ];

  return (
    <Layout>
      <SEOHead title={`${t("pages.pricing.title")} | Hoxta Hosting`} description={t("pages.pricing.heroDesc")} canonicalUrl="/pricing" />

      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t("pages.pricing.transparentPricing")}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t("pages.pricing.simpleFair")} <span className="text-primary">{t("pages.pricing.title")}</span>
            </h1>
            <p className="text-lg text-muted-foreground">{t("pages.pricing.heroDesc")}</p>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
            {trustPoints.map((point, i) => (
              <div key={i} className="flex items-center gap-2 text-muted-foreground">
                <point.icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{point.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Cards */}
      <section className="pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {services.map((service, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className={`relative glass-card p-6 flex flex-col hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(25,195,255,0.1)] ${service.popular ? "ring-1 ring-primary/40" : ""}`}>
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3" /> {t("pages.pricing.popularBadge")}
                  </div>
                )}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} border border-border/30 flex items-center justify-center mb-5`}>
                  <service.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground mb-5 flex-1">{service.description}</p>
                <div className="mb-5">
                  <span className="text-sm text-muted-foreground">{t("pages.pricing.startingFrom")}</span>
                  <div className="text-3xl font-bold text-foreground">
                    {service.from}
                    {service.from !== t("pages.pricing.included") && <span className="text-base font-normal text-muted-foreground">{t("pages.pricing.perMonth")}</span>}
                  </div>
                </div>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feat, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" /> {feat}
                    </li>
                  ))}
                </ul>
                <Link to={service.href} className={`block w-full py-3 text-center rounded-lg font-medium transition-all ${service.popular ? "btn-glow" : "btn-outline"}`}>
                  {t("pages.pricing.viewPlans")} <ArrowRight className="w-4 h-4 inline ml-1" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{t("pages.pricing.notSureWhichPlan")}</h2>
          <p className="text-muted-foreground mb-8">{t("pages.pricing.notSureDesc")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-glow px-8 py-3 rounded-lg font-medium inline-flex items-center justify-center gap-2">
              {t("pages.pricing.talkToSales")} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/knowledge-base" className="btn-outline px-8 py-3 rounded-lg font-medium inline-flex items-center justify-center gap-2">
              {t("pages.pricing.browseKnowledgeBase")}
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
