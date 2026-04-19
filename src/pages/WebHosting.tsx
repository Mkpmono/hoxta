import { Layout } from "@/components/layout/Layout";
import { useTranslation } from "react-i18next";
import {
  HostingHero, TrustBar, PricingPlans, FeatureGrid, ContentSection,
  HowItWorks, GlobalInfrastructure, PlanComparison, FAQAccordion, FinalCTA, CrossSellBlock,
} from "@/components/hosting";
import { webHostingPlans, webHostingFeatures, webHostingFAQs, webHostingComparison } from "@/data/hostingData";
import { Globe, Zap, Shield, Server } from "lucide-react";
import { SEOHead, ServiceSchema, FAQSchema, OrganizationSchema } from "@/components/seo";
import { useHostingPlans, rowToPlan } from "@/hooks/useHostingPlans";

export default function WebHosting() {
  const { t } = useTranslation();
  const { plans: dbPlans } = useHostingPlans("web-hosting");
  const livePlans = dbPlans.length > 0 ? dbPlans.map(rowToPlan) : webHostingPlans;
  return (
    <Layout>
      <SEOHead title="Web Hosting - Fast, Secure & Reliable | Hoxta" description="Launch your website with Hoxta's blazing-fast NVMe web hosting. Free SSL, daily backups, 24/7 support, and 99.9% uptime. Plans from $2.99/mo." canonicalUrl="https://hoxta.com/web-hosting" />
      <ServiceSchema name="Hoxta Web Hosting" description="Premium web hosting with NVMe SSD storage, free SSL certificates, daily backups, and enterprise-grade DDoS protection." priceRange="$2.99 - $24.99" />
      <FAQSchema faqs={webHostingFAQs} />
      <OrganizationSchema />

      <HostingHero
        badge={t("pages.webHosting.badge")}
        headline={t("pages.webHosting.headline")}
        highlightedText={t("pages.webHosting.highlightedText")}
        description={t("pages.webHosting.description")}
        promotion={{ text: t("pages.webHosting.promoText"), discount: t("pages.webHosting.promoDiscount"), endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }}
        primaryCTA={{ text: t("buttons.getStarted"), href: "#pricing" }}
        secondaryCTA={{ text: t("buttons.comparePlans"), href: "#comparison" }}
      />
      <TrustBar />
      <PricingPlans title={t("pages.webHosting.plansTitle")} subtitle={t("pages.webHosting.plansSubtitle")} plans={webHostingPlans} productSlug="web-hosting" />
      <FeatureGrid title={t("pages.webHosting.whyTitle")} subtitle={t("pages.webHosting.whySubtitle")} features={webHostingFeatures} />
      <ContentSection title={t("pages.webHosting.whatIsTitle")} description={t("pages.webHosting.whatIsDesc")} points={t("pages.webHosting.whatIsPoints", { returnObjects: true }) as string[]} icon={Globe} />
      <ContentSection title={t("pages.webHosting.perfTitle")} description={t("pages.webHosting.perfDesc")} points={t("pages.webHosting.perfPoints", { returnObjects: true }) as string[]} icon={Zap} reverse />
      <ContentSection title={t("pages.webHosting.secTitle")} description={t("pages.webHosting.secDesc")} points={t("pages.webHosting.secPoints", { returnObjects: true }) as string[]} icon={Shield} />
      <HowItWorks />
      <GlobalInfrastructure />
      <PlanComparison title={t("pages.webHosting.compareTitle")} subtitle={t("pages.webHosting.compareSubtitle")} plans={webHostingComparison.plans} categories={webHostingComparison.categories} />
      <CrossSellBlock headline={t("pages.webHosting.crossSellTitle")} description={t("pages.webHosting.crossSellDesc")} benefits={t("pages.webHosting.crossSellBenefits", { returnObjects: true }) as string[]} ctaText={t("pages.webHosting.crossSellCta")} ctaHref="/vps-hosting" icon={Server} />
      <FAQAccordion title={t("pages.webHosting.faqTitle")} subtitle={t("pages.webHosting.faqSubtitle")} items={webHostingFAQs} />
      <FinalCTA title={t("pages.webHosting.ctaTitle")} subtitle={t("pages.webHosting.ctaSubtitle")} />
    </Layout>
  );
}
