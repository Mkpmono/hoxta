import { Layout } from "@/components/layout/Layout";
import { useTranslation } from "react-i18next";
import { Server, Shield, Zap, Globe, Headphones, Lock, Thermometer, Network } from "lucide-react";
import {
  HostingHero, TrustBar, PricingPlans, FeatureGrid, ContentSection,
  HowItWorks, GlobalInfrastructure, FAQAccordion, FinalCTA,
} from "@/components/hosting";
import { SEOHead, ServiceSchema, FAQSchema, OrganizationSchema } from "@/components/seo";
import { colocationProduct } from "@/data/products";

const colocationPlans = colocationProduct.plans.map((plan) => ({
  id: plan.id, productSlug: colocationProduct.slug, name: plan.name, description: plan.description,
  monthlyPrice: plan.pricing.monthly, yearlyPrice: plan.pricing.annually, popular: plan.popular, features: plan.features,
}));

export default function Colocation() {
  const { t } = useTranslation();

  const colocationFeatures = [
    { icon: Lock, title: t("pages.colocation.features.security", "24/7 Security"), description: t("pages.colocation.features.securityDesc", "Biometric access control, CCTV surveillance, and on-site security personnel protect your equipment.") },
    { icon: Thermometer, title: t("pages.colocation.features.climate", "Climate Control"), description: t("pages.colocation.features.climateDesc", "Precision cooling systems maintain optimal temperatures with N+1 redundancy.") },
    { icon: Zap, title: t("pages.colocation.features.power", "Redundant Power"), description: t("pages.colocation.features.powerDesc", "Dual utility feeds, UPS systems, and diesel generators ensure 100% uptime.") },
    { icon: Network, title: t("pages.colocation.features.connectivity", "Premium Connectivity"), description: t("pages.colocation.features.connectivityDesc", "Multiple tier-1 carriers with BGP peering for optimal routing and low latency.") },
    { icon: Shield, title: t("pages.colocation.features.ddos", "DDoS Protection"), description: t("pages.colocation.features.ddosDesc", "Enterprise-grade DDoS mitigation included to protect your infrastructure.") },
    { icon: Headphones, title: t("pages.colocation.features.remoteHands", "Remote Hands"), description: t("pages.colocation.features.remoteHandsDesc", "Our expert technicians are available 24/7 for hardware support and troubleshooting.") },
  ];

  const colocationFAQs = [
    { question: t("pages.colocation.faq.q1", "How do I deliver my hardware to your datacenter?"), answer: t("pages.colocation.faq.a1", "You can ship equipment directly to our datacenter or arrange for personal delivery during business hours. We provide a receiving dock and can coordinate with shipping carriers.") },
    { question: t("pages.colocation.faq.q2", "What is the minimum contract term?"), answer: t("pages.colocation.faq.a2", "Our minimum contract term is 12 months for colocation services. We offer month-to-month options after the initial term.") },
    { question: t("pages.colocation.faq.q3", "How many IP addresses can I get?"), answer: t("pages.colocation.faq.a3", "IP allocations depend on your plan and justified need. Starter includes 1 IPv4, while larger plans include /28 to /26 blocks.") },
    { question: t("pages.colocation.faq.q4", "Do you provide KVM-over-IP access?"), answer: t("pages.colocation.faq.a4", "Yes, we can provide KVM-over-IP access for remote console access to your servers.") },
    { question: t("pages.colocation.faq.q5", "What is your SLA for uptime?"), answer: t("pages.colocation.faq.a5", "We guarantee 100% power uptime and 99.999% network uptime backed by our SLA.") },
    { question: t("pages.colocation.faq.q6", "Can I access my equipment 24/7?"), answer: t("pages.colocation.faq.a6", "Yes! Our datacenter is accessible 24/7/365 for customers.") },
  ];

  return (
    <Layout>
      <SEOHead title="Colocation Services - Secure Datacenter Hosting | Hoxta" description="Enterprise colocation with 24/7 security, redundant power, and premium connectivity. From 1U to full rack solutions." canonicalUrl="https://hoxta.com/colocation" />
      <ServiceSchema name="Hoxta Colocation Services" description="Enterprise colocation with 24/7 security, redundant power, premium connectivity, and expert remote hands support." priceRange="$79 - $999" />
      <FAQSchema faqs={colocationFAQs} />
      <OrganizationSchema />

      <HostingHero
        badge={t("pages.colocation.badge")}
        headline={<>{t("pages.colocation.headline")} <span className="text-gradient">{t("pages.colocation.highlightedText")}</span> {t("pages.colocation.headlineSuffix", "Services")}</>}
        description={t("pages.colocation.description")}
        primaryCTA={{ text: t("buttons.getStarted"), href: "#pricing" }}
        secondaryCTA={{ text: t("buttons.contactSales"), href: "/contact?service=colocation" }}
      />
      <TrustBar />
      <div id="pricing">
        <PricingPlans title={t("pages.colocation.plansTitle")} subtitle={t("pages.colocation.plansSubtitle")} plans={colocationPlans} productSlug="colocation" />
      </div>
      <FeatureGrid title={t("pages.colocation.whyTitle")} subtitle={t("pages.colocation.whySubtitle")} features={colocationFeatures} />
      <ContentSection title={t("pages.colocation.securityTitle")} description={t("pages.colocation.securityDesc")} points={t("pages.colocation.securityPoints", { returnObjects: true }) as string[]} icon={Lock} />
      <ContentSection title={t("pages.colocation.redundancyTitle")} description={t("pages.colocation.redundancyDesc")} points={t("pages.colocation.redundancyPoints", { returnObjects: true }) as string[]} icon={Zap} reverse />
      <HowItWorks />
      <GlobalInfrastructure />
      <FAQAccordion title={t("pages.colocation.faqTitle")} subtitle={t("pages.colocation.faqSubtitle")} items={colocationFAQs} />
      <FinalCTA title={t("pages.colocation.ctaTitle")} subtitle={t("pages.colocation.ctaSubtitle")} primaryCTA={{ text: t("pages.colocation.ctaPrimary", "Contact Sales"), href: "/contact?service=colocation" }} />
    </Layout>
  );
}
