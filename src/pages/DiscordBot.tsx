import { Layout } from "@/components/layout/Layout";
import { useTranslation } from "react-i18next";
import { Bot, Shield, Zap, Clock, Terminal, RefreshCw, BarChart3, Code } from "lucide-react";
import {
  HostingHero, TrustBar, PricingPlans, FeatureGrid, ContentSection,
  HowItWorks, GlobalInfrastructure, FAQAccordion, FinalCTA,
} from "@/components/hosting";
import { SEOHead, ServiceSchema, FAQSchema, OrganizationSchema } from "@/components/seo";
import { discordBotProduct } from "@/data/products";

const discordBotPlans = discordBotProduct.plans.map((plan) => ({
  id: plan.id, productSlug: discordBotProduct.slug, name: plan.name, description: plan.description,
  monthlyPrice: plan.pricing.monthly, yearlyPrice: plan.pricing.annually, popular: plan.popular, features: plan.features,
}));

export default function DiscordBot() {
  const { t } = useTranslation();

  const discordBotFeatures = [
    { icon: Clock, title: t("pages.discordBot.features.uptime", "24/7 Uptime"), description: t("pages.discordBot.features.uptimeDesc", "Your bot stays online around the clock.") },
    { icon: RefreshCw, title: t("pages.discordBot.features.autoRestart", "Auto-Restart"), description: t("pages.discordBot.features.autoRestartDesc", "Automatic restart on crashes with smart health monitoring.") },
    { icon: Terminal, title: t("pages.discordBot.features.console", "Console Access"), description: t("pages.discordBot.features.consoleDesc", "Full console access to view logs, debug issues, and monitor performance.") },
    { icon: Code, title: t("pages.discordBot.features.anyLang", "Any Language"), description: t("pages.discordBot.features.anyLangDesc", "Support for Node.js, Python, Java, and more.") },
    { icon: BarChart3, title: t("pages.discordBot.features.monitoring", "Resource Monitoring"), description: t("pages.discordBot.features.monitoringDesc", "Real-time CPU, RAM, and network usage graphs.") },
    { icon: Shield, title: t("pages.discordBot.features.ddos", "DDoS Protected"), description: t("pages.discordBot.features.ddosDesc", "Enterprise-grade protection for your bot's web dashboard and API endpoints.") },
  ];

  const discordBotFAQs = [
    { question: t("pages.discordBot.faq.q1", "Which languages and libraries are supported?"), answer: t("pages.discordBot.faq.a1", "We support all major programming languages and Discord libraries including Node.js, Python, Java, and more.") },
    { question: t("pages.discordBot.faq.q2", "How do I deploy my bot?"), answer: t("pages.discordBot.faq.a2", "Simply upload your bot files via our web panel, SFTP, or Git integration.") },
    { question: t("pages.discordBot.faq.q3", "What happens if my bot crashes?"), answer: t("pages.discordBot.faq.a3", "Our watchdog system automatically restarts crashed bots within seconds.") },
    { question: t("pages.discordBot.faq.q4", "Can I use databases with my bot?"), answer: t("pages.discordBot.faq.a4", "Yes! All plans support SQLite out of the box. Standard and above include MySQL/PostgreSQL.") },
    { question: t("pages.discordBot.faq.q5", "Do you support sharding for large bots?"), answer: t("pages.discordBot.faq.a5", "Absolutely! Our Professional and Enterprise plans are designed for bots in thousands of servers.") },
    { question: t("pages.discordBot.faq.q6", "Can I access my bot's logs?"), answer: t("pages.discordBot.faq.a6", "Yes, you have full console access with real-time log streaming.") },
  ];

  return (
    <Layout>
      <SEOHead title="Discord Bot Hosting - 24/7 Uptime, Auto-Restart | Hoxta" description="Reliable Discord bot hosting with 24/7 uptime, auto-restart, and full console access." canonicalUrl="https://hoxta.com/discord-bot" />
      <ServiceSchema name="Hoxta Discord Bot Hosting" description="Reliable Discord bot hosting with 24/7 uptime, auto-restart, monitoring." priceRange="$3 - $35" />
      <FAQSchema faqs={discordBotFAQs} />
      <OrganizationSchema />

      <HostingHero
        badge={t("pages.discordBot.badge")}
        headline={<>{t("pages.discordBot.headline")} <span className="text-gradient">{t("pages.discordBot.highlightedText")}</span></>}
        description={t("pages.discordBot.description")}
        primaryCTA={{ text: t("buttons.getStarted"), href: "#pricing" }}
        secondaryCTA={{ text: t("buttons.viewPlans"), href: "#features" }}
      />
      <TrustBar />
      <div id="pricing">
        <PricingPlans title={t("pages.discordBot.plansTitle")} subtitle={t("pages.discordBot.plansSubtitle")} plans={discordBotPlans} productSlug="discord-bot" />
      </div>
      <div id="features">
        <FeatureGrid title={t("pages.discordBot.whyTitle")} subtitle={t("pages.discordBot.whySubtitle")} features={discordBotFeatures} />
      </div>
      <ContentSection title={t("pages.discordBot.alwaysOnline")} description={t("pages.discordBot.alwaysOnlineDesc")} points={t("pages.discordBot.alwaysOnlinePoints", { returnObjects: true }) as string[]} icon={Clock} />
      <ContentSection title={t("pages.discordBot.devFriendly")} description={t("pages.discordBot.devFriendlyDesc")} points={t("pages.discordBot.devFriendlyPoints", { returnObjects: true }) as string[]} icon={Terminal} reverse />
      <HowItWorks />
      <GlobalInfrastructure />
      <FAQAccordion title={t("pages.discordBot.faqTitle")} subtitle={t("pages.discordBot.faqSubtitle")} items={discordBotFAQs} />
      <FinalCTA title={t("pages.discordBot.ctaTitle")} subtitle={t("pages.discordBot.ctaSubtitle")} />
    </Layout>
  );
}
