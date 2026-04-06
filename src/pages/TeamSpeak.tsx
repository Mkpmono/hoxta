import { Layout } from "@/components/layout/Layout";
import { useTranslation } from "react-i18next";
import { Headphones, Shield, Zap, Globe, Users, Settings, Lock, Volume2 } from "lucide-react";
import {
  HostingHero, TrustBar, PricingPlans, FeatureGrid, ContentSection,
  HowItWorks, GlobalInfrastructure, FAQAccordion, FinalCTA,
} from "@/components/hosting";
import { SEOHead, ServiceSchema, FAQSchema, OrganizationSchema } from "@/components/seo";
import { teamspeakProduct } from "@/data/products";

const teamspeakPlans = teamspeakProduct.plans.map((plan) => ({
  id: plan.id, productSlug: teamspeakProduct.slug, name: plan.name, description: plan.description,
  monthlyPrice: plan.pricing.monthly, yearlyPrice: plan.pricing.annually, popular: plan.popular, features: plan.features,
}));

export default function TeamSpeak() {
  const { t } = useTranslation();

  const teamspeakFeatures = [
    { icon: Volume2, title: t("pages.teamspeak.features.audio", "Crystal Clear Audio"), description: t("pages.teamspeak.features.audioDesc", "High-quality Opus codec for pristine voice quality.") },
    { icon: Shield, title: t("pages.teamspeak.features.ddos", "DDoS Protection"), description: t("pages.teamspeak.features.ddosDesc", "Enterprise-grade protection keeps your voice server online.") },
    { icon: Zap, title: t("pages.teamspeak.features.instant", "Instant Setup"), description: t("pages.teamspeak.features.instantDesc", "Your TeamSpeak server is deployed instantly.") },
    { icon: Globe, title: t("pages.teamspeak.features.global", "Global Locations"), description: t("pages.teamspeak.features.globalDesc", "Multiple datacenter locations for the lowest latency.") },
    { icon: Settings, title: t("pages.teamspeak.features.control", "Full Control"), description: t("pages.teamspeak.features.controlDesc", "Complete access to server settings, permissions, and channel management.") },
    { icon: Lock, title: t("pages.teamspeak.features.secure", "Secure & Private"), description: t("pages.teamspeak.features.secureDesc", "End-to-end encryption and granular permission systems.") },
  ];

  const teamspeakFAQs = [
    { question: t("pages.teamspeak.faq.q1", "How do I upgrade my slot count?"), answer: t("pages.teamspeak.faq.a1", "You can upgrade at any time through your control panel.") },
    { question: t("pages.teamspeak.faq.q2", "Which regions are available?"), answer: t("pages.teamspeak.faq.a2", "We offer TeamSpeak servers in North America, Europe, and Asia-Pacific.") },
    { question: t("pages.teamspeak.faq.q3", "Is the voice quality really that good?"), answer: t("pages.teamspeak.faq.a3", "Yes! We use the Opus codec at high bitrates.") },
    { question: t("pages.teamspeak.faq.q4", "Can I use a custom domain?"), answer: t("pages.teamspeak.faq.a4", "Yes, Large and Enterprise plans include custom domain support.") },
    { question: t("pages.teamspeak.faq.q5", "How do backups work?"), answer: t("pages.teamspeak.faq.a5", "We automatically backup your server configuration and channels.") },
    { question: t("pages.teamspeak.faq.q6", "Do you provide a web interface?"), answer: t("pages.teamspeak.faq.a6", "Yes! All plans include our web-based control panel.") },
  ];

  return (
    <Layout>
      <SEOHead title="TeamSpeak Hosting - Crystal Clear Voice Servers | Hoxta" description="High-quality TeamSpeak server hosting with instant setup, DDoS protection, and low latency." canonicalUrl="https://hoxta.com/teamspeak" />
      <ServiceSchema name="Hoxta TeamSpeak Hosting" description="High-quality TeamSpeak server hosting with crystal clear audio and DDoS protection." priceRange="$3 - $25" />
      <FAQSchema faqs={teamspeakFAQs} />
      <OrganizationSchema />

      <HostingHero
        badge={t("pages.teamspeak.badge")}
        headline={<>{t("pages.teamspeak.headline")} <span className="text-gradient">{t("pages.teamspeak.highlightedText")}</span></>}
        description={t("pages.teamspeak.description")}
        primaryCTA={{ text: t("buttons.getStarted"), href: "#pricing" }}
        secondaryCTA={{ text: t("buttons.comparePlans"), href: "#pricing" }}
      />
      <TrustBar />
      <div id="pricing">
        <PricingPlans title={t("pages.teamspeak.plansTitle")} subtitle={t("pages.teamspeak.plansSubtitle")} plans={teamspeakPlans} productSlug="teamspeak" />
      </div>
      <FeatureGrid title={t("pages.teamspeak.whyTitle")} subtitle={t("pages.teamspeak.whySubtitle")} features={teamspeakFeatures} />
      <ContentSection title={t("pages.teamspeak.voiceTitle")} description={t("pages.teamspeak.voiceDesc")} points={t("pages.teamspeak.voicePoints", { returnObjects: true }) as string[]} icon={Headphones} />
      <ContentSection title={t("pages.teamspeak.controlTitle")} description={t("pages.teamspeak.controlDesc")} points={t("pages.teamspeak.controlPoints", { returnObjects: true }) as string[]} icon={Settings} reverse />
      <HowItWorks />
      <GlobalInfrastructure />
      <FAQAccordion title={t("pages.teamspeak.faqTitle")} subtitle={t("pages.teamspeak.faqSubtitle")} items={teamspeakFAQs} />
      <FinalCTA title={t("pages.teamspeak.ctaTitle")} subtitle={t("pages.teamspeak.ctaSubtitle")} />
    </Layout>
  );
}
