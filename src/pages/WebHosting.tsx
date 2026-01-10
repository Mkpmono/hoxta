import { Layout } from "@/components/layout/Layout";
import {
  HostingHero,
  TrustBar,
  PricingPlans,
  FeatureGrid,
  ContentSection,
  HowItWorks,
  GlobalInfrastructure,
  PlanComparison,
  FAQAccordion,
  FinalCTA,
} from "@/components/hosting";
import {
  webHostingPlans,
  webHostingFeatures,
  webHostingFAQs,
  webHostingComparison,
} from "@/data/hostingData";
import { Globe, Zap, Shield } from "lucide-react";

export default function WebHosting() {
  return (
    <Layout>
      {/* Hero Section */}
      <HostingHero
        badge="Web Hosting"
        headline="Lightning-Fast"
        highlightedText="Web Hosting"
        description="Launch your website with blazing-fast NVMe storage, free SSL certificates, and enterprise-grade security. From personal blogs to business sites, we've got you covered."
        promotion={{
          text: "New Year Sale",
          discount: "Up to 70% OFF",
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }}
        primaryCTA={{ text: "Get Started", href: "#pricing" }}
        secondaryCTA={{ text: "Compare Plans", href: "#comparison" }}
      />

      {/* Trust Bar */}
      <TrustBar />

      {/* Pricing Plans */}
      <PricingPlans
        title="Web Hosting Plans"
        subtitle="Powerful hosting solutions for every website. All plans include free SSL, daily backups, and 24/7 support."
        plans={webHostingPlans}
      />

      {/* Why Choose Section */}
      <FeatureGrid
        title="Why Choose Hoxta Web Hosting"
        subtitle="Enterprise-grade infrastructure with premium features included in every plan."
        features={webHostingFeatures}
      />

      {/* Content Section - What is Web Hosting */}
      <ContentSection
        title="What is Web Hosting?"
        description="Web hosting is the foundation of your online presence. It's the service that stores your website files on secure servers and makes them accessible to visitors around the world, 24 hours a day, 7 days a week."
        points={[
          "Store your website files, images, and databases securely",
          "Ensure your site is always online and accessible globally",
          "Get professional email addresses with your domain",
          "Scale resources as your website grows",
        ]}
        icon={Globe}
      />

      {/* Content Section - Performance */}
      <ContentSection
        title="Unmatched Performance"
        description="Our hosting infrastructure is built for speed. With NVMe SSD storage, LiteSpeed web servers, and optimized caching, your website loads in milliseconds, improving user experience and search rankings."
        points={[
          "NVMe SSDs deliver 10x faster speeds than traditional storage",
          "LiteSpeed web server with built-in caching technology",
          "Global CDN integration for worldwide fast delivery",
          "HTTP/3 and QUIC protocol support for modern performance",
        ]}
        icon={Zap}
        reverse
      />

      {/* Content Section - Security */}
      <ContentSection
        title="Enterprise Security"
        description="Security isn't optional – it's essential. Every hosting account is protected by multiple layers of security, from DDoS protection to malware scanning, ensuring your website and visitors stay safe."
        points={[
          "Free SSL certificates for all domains",
          "Enterprise-grade DDoS mitigation",
          "Real-time malware scanning and removal",
          "Automated daily backups with easy restore",
        ]}
        icon={Shield}
      />

      {/* How It Works */}
      <HowItWorks />

      {/* Global Infrastructure */}
      <GlobalInfrastructure />

      {/* Plan Comparison */}
      <PlanComparison
        title="Compare Web Hosting Plans"
        subtitle="See exactly what's included in each plan to find your perfect match."
        plans={webHostingComparison.plans}
        categories={webHostingComparison.categories}
      />

      {/* FAQ Section */}
      <FAQAccordion
        title="Web Hosting FAQ"
        subtitle="Got questions about web hosting? We've got answers."
        items={webHostingFAQs}
      />

      {/* Final CTA */}
      <FinalCTA
        title="Ready to Launch Your Website?"
        subtitle="Join thousands of website owners who trust Hoxta for reliable, fast, and secure web hosting."
      />
    </Layout>
  );
}
