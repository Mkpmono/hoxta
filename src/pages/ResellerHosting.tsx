import { Layout } from "@/components/layout/Layout";
import { useTranslation } from "react-i18next";
import {
  HostingHero, TrustBar, PricingPlans, FeatureGrid, ContentSection,
  HowItWorks, GlobalInfrastructure, PlanComparison, FAQAccordion, FinalCTA, CrossSellBlock,
} from "@/components/hosting";
import { resellerHostingPlans, resellerHostingFeatures, resellerHostingFAQs, resellerHostingComparison } from "@/data/hostingData";
import { Users, TrendingUp, DollarSign, Server } from "lucide-react";
import { SEOHead, ServiceSchema, FAQSchema, OrganizationSchema } from "@/components/seo";

export default function ResellerHosting() {
  const { t } = useTranslation();
  return (
    <Layout>
      <SEOHead title="Reseller Hosting - Start Your Hosting Business | Hoxta" description="Launch your own hosting company with Hoxta's white-label reseller hosting. WHM/cPanel, free WHMCS, unlimited clients. Plans from $14.99/mo." canonicalUrl="https://hoxta.com/reseller-hosting" />
      <ServiceSchema name="Hoxta Reseller Hosting" description="White-label reseller hosting with WHM/cPanel, WHMCS integration, and unlimited client accounts." priceRange="$14.99 - $74.99" />
      <FAQSchema faqs={resellerHostingFAQs} />
      <OrganizationSchema />

      <HostingHero
        badge={t("pages.reseller.badge")}
        headline={t("pages.reseller.headline")}
        highlightedText={t("pages.reseller.highlightedText")}
        description={t("pages.reseller.description")}
        promotion={{ text: t("pages.reseller.promoText"), discount: t("pages.reseller.promoDiscount"), endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) }}
        primaryCTA={{ text: t("pages.reseller.primaryCta"), href: "#pricing" }}
        secondaryCTA={{ text: t("buttons.comparePlans"), href: "#comparison" }}
      />
      <TrustBar />
      <PricingPlans title={t("pages.reseller.plansTitle")} subtitle={t("pages.reseller.plansSubtitle")} plans={resellerHostingPlans} productSlug="reseller-hosting" />
      <FeatureGrid title={t("pages.reseller.whyTitle")} subtitle={t("pages.reseller.whySubtitle")} features={resellerHostingFeatures} />
      <ContentSection title={t("pages.reseller.whatIsTitle")} description={t("pages.reseller.whatIsDesc")} points={t("pages.reseller.whatIsPoints", { returnObjects: true }) as string[]} icon={Users} />
      <ContentSection title={t("pages.reseller.scaleTitle")} description={t("pages.reseller.scaleDesc")} points={t("pages.reseller.scalePoints", { returnObjects: true }) as string[]} icon={TrendingUp} reverse />
      <ContentSection title={t("pages.reseller.profitTitle")} description={t("pages.reseller.profitDesc")} points={t("pages.reseller.profitPoints", { returnObjects: true }) as string[]} icon={DollarSign} />
      <HowItWorks />
      <GlobalInfrastructure />
      <PlanComparison title={t("pages.reseller.compareTitle")} subtitle={t("pages.reseller.compareSubtitle")} plans={resellerHostingComparison.plans} categories={resellerHostingComparison.categories} />
      <CrossSellBlock headline={t("pages.reseller.crossSellTitle")} description={t("pages.reseller.crossSellDesc")} benefits={t("pages.reseller.crossSellBenefits", { returnObjects: true }) as string[]} ctaText={t("pages.reseller.crossSellCta")} ctaHref="/vps-hosting" icon={Server} />
      <FAQAccordion title={t("pages.reseller.faqTitle")} subtitle={t("pages.reseller.faqSubtitle")} items={resellerHostingFAQs} />
      <FinalCTA title={t("pages.reseller.ctaTitle")} subtitle={t("pages.reseller.ctaSubtitle")} />
    </Layout>
  );
}
