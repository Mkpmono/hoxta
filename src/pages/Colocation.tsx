import { Layout } from "@/components/layout/Layout";
import { Server, Shield, Zap, Globe, Headphones, Lock, Thermometer, Network } from "lucide-react";
import {
  HostingHero,
  TrustBar,
  PricingPlans,
  FeatureGrid,
  ContentSection,
  HowItWorks,
  GlobalInfrastructure,
  FAQAccordion,
  FinalCTA,
} from "@/components/hosting";
import { SEOHead, ServiceSchema, FAQSchema, OrganizationSchema } from "@/components/seo";

const colocationPlans = [
  {
    name: "Starter",
    description: "1U Rack Space",
    monthlyPrice: 79,
    yearlyPrice: 790,
    popular: false,
    features: [
      { label: "Rack Space", value: "1U" },
      { label: "Power", value: "2A @ 120V" },
      { label: "Bandwidth", value: "10TB" },
      { label: "IP Addresses", value: "1 IPv4" },
      { label: "Remote Hands", value: "1 hour/month" },
      { label: "Network Port", value: "1 Gbps" },
    ],
    cta: { text: "Get Started", href: "/contact?service=colocation&plan=starter" },
  },
  {
    name: "Business",
    description: "Quarter Rack (10U)",
    monthlyPrice: 299,
    yearlyPrice: 2990,
    popular: true,
    features: [
      { label: "Rack Space", value: "10U" },
      { label: "Power", value: "10A @ 120V" },
      { label: "Bandwidth", value: "Unmetered" },
      { label: "IP Addresses", value: "/28 IPv4 (16)" },
      { label: "Remote Hands", value: "4 hours/month" },
      { label: "Network Port", value: "10 Gbps" },
    ],
    cta: { text: "Get Started", href: "/contact?service=colocation&plan=business" },
  },
  {
    name: "Enterprise",
    description: "Half Rack (20U)",
    monthlyPrice: 549,
    yearlyPrice: 5490,
    popular: false,
    features: [
      { label: "Rack Space", value: "20U" },
      { label: "Power", value: "20A @ 120V" },
      { label: "Bandwidth", value: "Unmetered" },
      { label: "IP Addresses", value: "/27 IPv4 (32)" },
      { label: "Remote Hands", value: "8 hours/month" },
      { label: "Network Port", value: "10 Gbps" },
    ],
    cta: { text: "Get Started", href: "/contact?service=colocation&plan=enterprise" },
  },
  {
    name: "Full Rack",
    description: "42U Full Cabinet",
    monthlyPrice: 999,
    yearlyPrice: 9990,
    popular: false,
    features: [
      { label: "Rack Space", value: "42U" },
      { label: "Power", value: "30A @ 208V" },
      { label: "Bandwidth", value: "Unmetered" },
      { label: "IP Addresses", value: "/26 IPv4 (64)" },
      { label: "Remote Hands", value: "Unlimited" },
      { label: "Network Port", value: "100 Gbps" },
    ],
    cta: { text: "Contact Sales", href: "/contact?service=colocation&plan=fullrack" },
  },
];

const colocationFeatures = [
  {
    icon: Lock,
    title: "24/7 Security",
    description: "Biometric access control, CCTV surveillance, and on-site security personnel protect your equipment.",
  },
  {
    icon: Thermometer,
    title: "Climate Control",
    description: "Precision cooling systems maintain optimal temperatures with N+1 redundancy.",
  },
  {
    icon: Zap,
    title: "Redundant Power",
    description: "Dual utility feeds, UPS systems, and diesel generators ensure 100% uptime.",
  },
  {
    icon: Network,
    title: "Premium Connectivity",
    description: "Multiple tier-1 carriers with BGP peering for optimal routing and low latency.",
  },
  {
    icon: Shield,
    title: "DDoS Protection",
    description: "Enterprise-grade DDoS mitigation included to protect your infrastructure.",
  },
  {
    icon: Headphones,
    title: "Remote Hands",
    description: "Our expert technicians are available 24/7 for hardware support and troubleshooting.",
  },
];

const colocationFAQs = [
  {
    question: "How do I deliver my hardware to your datacenter?",
    answer: "You can ship equipment directly to our datacenter or arrange for personal delivery during business hours. We provide a receiving dock and can coordinate with shipping carriers. Include your account details with all shipments.",
  },
  {
    question: "What is the minimum contract term?",
    answer: "Our minimum contract term is 12 months for colocation services. We offer month-to-month options after the initial term, and discounts are available for longer commitments.",
  },
  {
    question: "How many IP addresses can I get?",
    answer: "IP allocations depend on your plan and justified need. Starter includes 1 IPv4, while larger plans include /28 to /26 blocks. Additional IPs are available upon request with proper justification.",
  },
  {
    question: "Do you provide KVM-over-IP access?",
    answer: "Yes, we can provide KVM-over-IP access for remote console access to your servers. This is available as an add-on service or included with Enterprise and Full Rack plans.",
  },
  {
    question: "What is your SLA for uptime?",
    answer: "We guarantee 100% power uptime and 99.999% network uptime backed by our SLA. Credit is provided for any downtime exceeding these guarantees.",
  },
  {
    question: "Can I access my equipment 24/7?",
    answer: "Yes! Our datacenter is accessible 24/7/365 for customers. Simply schedule your visit through our portal or contact support for immediate access during off-hours.",
  },
];

export default function Colocation() {
  return (
    <Layout>
      <SEOHead
        title="Colocation Services - Secure Datacenter Hosting | Hoxta"
        description="Enterprise colocation with 24/7 security, redundant power, and premium connectivity. From 1U to full rack solutions. 100% uptime SLA."
        canonicalUrl="https://hoxta.com/colocation"
      />
      <ServiceSchema
        name="Hoxta Colocation Services"
        description="Enterprise colocation with 24/7 security, redundant power, premium connectivity, and expert remote hands support."
        priceRange="$79 - $999"
      />
      <FAQSchema faqs={colocationFAQs} />
      <OrganizationSchema />

      <HostingHero
        badge="Colocation"
        headline={
          <>
            Secure <span className="text-gradient">Colocation</span> Services
          </>
        }
        description="House your hardware in our enterprise-grade datacenters. 24/7 security, redundant power, premium connectivity, and expert remote hands support."
        primaryCTA={{ text: "Get Started", href: "#pricing" }}
        secondaryCTA={{ text: "Contact Sales", href: "/contact?service=colocation" }}
      />

      <TrustBar />

      <div id="pricing">
        <PricingPlans
          title="Colocation Plans"
          subtitle="From single servers to full racks, we have the space for your infrastructure."
          plans={colocationPlans}
        />
      </div>

      <FeatureGrid
        title="Datacenter Features"
        subtitle="Enterprise infrastructure designed for maximum uptime and security."
        features={colocationFeatures}
      />

      <ContentSection
        title="Enterprise Security"
        description="Your hardware is protected by multiple layers of physical and digital security. Our datacenter meets the highest standards for compliance and data protection."
        points={[
          "Biometric and key-card access control",
          "24/7 CCTV monitoring and recording",
          "On-site security personnel",
          "SOC 2 Type II compliant facility",
        ]}
        icon={Lock}
      />

      <ContentSection
        title="Redundant Infrastructure"
        description="Our datacenter is designed with N+1 redundancy across all critical systems. Multiple utility feeds, UPS batteries, and diesel generators ensure your equipment stays online."
        points={[
          "Dual utility power feeds",
          "N+1 UPS with 15+ minute runtime",
          "Diesel generators with 72-hour fuel",
          "Precision cooling with N+1 redundancy",
        ]}
        icon={Zap}
        reverse
      />

      <HowItWorks />

      <GlobalInfrastructure />

      <FAQAccordion
        title="Colocation FAQ"
        subtitle="Common questions about our colocation services."
        items={colocationFAQs}
      />

      <FinalCTA
        title="Ready to Colocate?"
        subtitle="Contact our team to discuss your colocation requirements and get a custom quote."
        primaryCTA={{ text: "Contact Sales", href: "/contact?service=colocation" }}
      />
    </Layout>
  );
}
