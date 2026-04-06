import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Gamepad2, Shield, Zap, Globe, Headphones, Cpu, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { GameCatalog } from "@/components/hosting/GameCatalog";
import {
  TrustBar,
  FeatureGrid,
  GlobalInfrastructure,
  FAQAccordion,
  FinalCTA,
} from "@/components/hosting";
import { SEOHead, ServiceSchema, FAQSchema, OrganizationSchema } from "@/components/seo";

export default function GameServers() {
  const { t } = useTranslation();

  const gameFeatures = [
    { icon: Zap, title: t("pages.gameServers.features.instantSetup"), description: t("pages.gameServers.features.instantSetupDesc") },
    { icon: Shield, title: t("pages.gameServers.features.ddos"), description: t("pages.gameServers.features.ddosDesc") },
    { icon: Globe, title: t("pages.gameServers.features.globalLocations"), description: t("pages.gameServers.features.globalLocationsDesc") },
    { icon: Headphones, title: t("pages.gameServers.features.support247"), description: t("pages.gameServers.features.support247Desc") },
    { icon: Cpu, title: t("pages.gameServers.features.highPerf"), description: t("pages.gameServers.features.highPerfDesc") },
    { icon: Users, title: t("pages.gameServers.features.easyManagement"), description: t("pages.gameServers.features.easyManagementDesc") },
  ];

  const gameFAQs = [
    { question: t("pages.gameServers.faq.q1", "How quickly is my game server deployed?"), answer: t("pages.gameServers.faq.a1", "Game servers are deployed instantly after payment confirmation. You'll receive login details within minutes and can start configuring your server right away.") },
    { question: t("pages.gameServers.faq.q2", "Can I install mods and plugins?"), answer: t("pages.gameServers.faq.a2", "Yes! Our control panel supports one-click mod installation for most games. You can also upload custom mods via SFTP or the file manager.") },
    { question: t("pages.gameServers.faq.q3", "What locations are available?"), answer: t("pages.gameServers.faq.a3", "We offer game servers in North America, Europe, Asia, and Australia. Choose the location closest to your player base for the best performance.") },
    { question: t("pages.gameServers.faq.q4", "Can I upgrade my server later?"), answer: t("pages.gameServers.faq.a4", "Absolutely! You can upgrade RAM, slots, or CPU at any time through your control panel. Upgrades are applied instantly without data loss.") },
    { question: t("pages.gameServers.faq.q5", "Do you offer refunds?"), answer: t("pages.gameServers.faq.a5", "Yes, we offer a 24-hour money-back guarantee on all game servers. If you're not satisfied, contact support for a full refund.") },
    { question: t("pages.gameServers.faq.q6", "Is DDoS protection included?"), answer: t("pages.gameServers.faq.a6", "Yes! All game servers include enterprise-grade DDoS protection at no extra cost. Your server stays online even during attacks.") },
  ];

  return (
    <Layout>
      <SEOHead
        title="Game Server Hosting - Instant Setup, DDoS Protected | Hoxta"
        description="High-performance game server hosting for Minecraft, Rust, FiveM, CS2, and more. Instant setup, DDoS protection, 24/7 support. From $0.50/slot."
        canonicalUrl="https://hoxta.com/game-servers"
      />
      <ServiceSchema name="Hoxta Game Server Hosting" description="High-performance game server hosting with instant setup, DDoS protection, and 24/7 expert gaming support." priceRange="$0.50 - $120.00" />
      <FAQSchema faqs={gameFAQs} />
      <OrganizationSchema />

      <section className="pt-24 pb-12 md:pt-32 md:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute inset-0 wave-bg opacity-30" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Gamepad2 className="w-4 h-4" />
              <span className="text-sm font-medium">{t("pages.gameServers.badge")}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {t("pages.gameServers.headline")}{" "}
              <span className="text-gradient">{t("pages.gameServers.highlightedText")}</span>
            </h1>
            <p className="text-lg text-muted-foreground">{t("pages.gameServers.description")}</p>
          </motion.div>
        </div>
      </section>

      <GameCatalog />
      <TrustBar />
      <FeatureGrid title={t("pages.gameServers.whyTitle")} subtitle={t("pages.gameServers.whySubtitle")} features={gameFeatures} />
      <GlobalInfrastructure />
      <FAQAccordion title={t("pages.gameServers.faqTitle")} subtitle={t("pages.gameServers.faqSubtitle")} items={gameFAQs} />
      <FinalCTA title={t("pages.gameServers.ctaTitle")} subtitle={t("pages.gameServers.ctaSubtitle")} />
    </Layout>
  );
}
