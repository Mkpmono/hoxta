import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo";
import {
  DdosHero,
  DdosHowItWorks,
  ProtectionTabs,
  DdosPlans,
  MonitoringPreview,
  UseCasesGrid,
  DdosFaq,
  DdosFinalCta,
} from "@/components/ddos";

export default function DDoSProtection() {
  return (
    <Layout>
      <SEOHead
        title="Enterprise DDoS Protection | Hoxta Hosting"
        description="Multi-layered DDoS protection with 400+ Gbps capacity, <10s mitigation, and 24/7 SOC monitoring. Protect your infrastructure from L3/L4/L7 attacks."
        canonicalUrl="/ddos-protection"
      />

      {/* Hero with CTAs and trust badges */}
      <DdosHero />

      {/* How It Works - 5-step timeline */}
      <DdosHowItWorks />

      {/* Protection Layers - tabbed interface */}
      <ProtectionTabs />

      {/* Pricing Plans with comparison table */}
      <DdosPlans />

      {/* Real-time Monitoring Preview */}
      <MonitoringPreview />

      {/* Use Cases Grid */}
      <UseCasesGrid />

      {/* FAQ Accordion */}
      <DdosFaq />

      {/* Final CTA */}
      <DdosFinalCta />
    </Layout>
  );
}
