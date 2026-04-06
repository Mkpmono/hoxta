import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useTranslation } from "react-i18next";
import {
  HostingHero, TrustBar, PricingPlans, FeatureGrid, ContentSection,
  HowItWorks, GlobalInfrastructure, PlanComparison, FAQAccordion, FinalCTA, CrossSellBlock,
} from "@/components/hosting";
import { ProcessorToggle } from "@/components/hosting/ProcessorToggle";
import { vpsIntelPlans, vpsAmdPlans, vpsHostingFeatures, vpsHostingFAQs, vpsHostingComparison } from "@/data/hostingData";
import { Cpu, Lock, Gauge, Server } from "lucide-react";
import { SEOHead, ServiceSchema, FAQSchema, OrganizationSchema } from "@/components/seo";

export default function VPS() {
  const { t } = useTranslation();
  const [processor, setProcessor] = useState<"intel" | "amd">("intel");
  const plans = processor === "intel" ? vpsIntelPlans : vpsAmdPlans;

  return (
    <Layout>
      <SEOHead title="VPS Hosting - High-Performance Virtual Servers | Hoxta" description="Deploy powerful VPS with NVMe storage, full root access, and DDoS protection. Choose Intel Xeon or AMD EPYC. Scalable virtual servers from $12.99/mo." canonicalUrl="https://hoxta.com/vps-hosting" />
      <ServiceSchema name="Hoxta VPS Hosting" description="High-performance VPS hosting with dedicated resources, NVMe SSD storage, full root access, and enterprise DDoS protection." priceRange="$12.99 - $99.99" />
      <FAQSchema faqs={vpsHostingFAQs} />
      <OrganizationSchema />

      <HostingHero
        badge={t("pages.vps.badge")}
        headline={t("pages.vps.headline")}
        highlightedText={t("pages.vps.highlightedText")}
        description={t("pages.vps.description")}
        promotion={{ text: t("pages.vps.promoText"), discount: t("pages.vps.promoDiscount"), endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) }}
        primaryCTA={{ text: t("pages.vps.primaryCta"), href: "#pricing" }}
        secondaryCTA={{ text: t("buttons.comparePlans"), href: "#comparison" }}
      />
      <TrustBar />

      <section id="pricing" className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("pages.vps.plansTitle")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">{t("pages.vps.plansSubtitle")}</p>
            <ProcessorToggle selected={processor} onChange={setProcessor} />
          </div>
        </div>
        <PricingPlans plans={plans} productSlug="vps" />
      </section>

      <FeatureGrid title={t("pages.vps.whyTitle")} subtitle={t("pages.vps.whySubtitle")} features={vpsHostingFeatures} />
      <ContentSection title={t("pages.vps.whatIsTitle")} description={t("pages.vps.whatIsDesc")} points={t("pages.vps.whatIsPoints", { returnObjects: true }) as string[]} icon={Server} />
      <ContentSection title={t("pages.vps.perfTitle")} description={t("pages.vps.perfDesc")} points={t("pages.vps.perfPoints", { returnObjects: true }) as string[]} icon={Gauge} reverse />
      <ContentSection title={t("pages.vps.rootTitle")} description={t("pages.vps.rootDesc")} points={t("pages.vps.rootPoints", { returnObjects: true }) as string[]} icon={Lock} />
      <ContentSection title={t("pages.vps.scaleTitle")} description={t("pages.vps.scaleDesc")} points={t("pages.vps.scalePoints", { returnObjects: true }) as string[]} icon={Cpu} reverse />
      <HowItWorks />
      <GlobalInfrastructure />
      <PlanComparison title={t("pages.vps.compareTitle")} subtitle={t("pages.vps.compareSubtitle")} plans={vpsHostingComparison.plans} categories={vpsHostingComparison.categories} />
      <CrossSellBlock headline={t("pages.vps.crossSellTitle")} description={t("pages.vps.crossSellDesc")} benefits={t("pages.vps.crossSellBenefits", { returnObjects: true }) as string[]} ctaText={t("pages.vps.crossSellCta")} ctaHref="/dedicated-servers" icon={Server} />
      <FAQAccordion title={t("pages.vps.faqTitle")} subtitle={t("pages.vps.faqSubtitle")} items={vpsHostingFAQs} />
      <FinalCTA title={t("pages.vps.ctaTitle")} subtitle={t("pages.vps.ctaSubtitle")} />
    </Layout>
  );
}
