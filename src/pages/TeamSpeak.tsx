import { Layout } from "@/components/layout/Layout";
import { Headphones, Shield, Zap, Globe, Users, Settings, Lock, Volume2 } from "lucide-react";
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
import { teamspeakProduct } from "@/data/products";

// Convert product plans to PricingPlans format
const teamspeakPlans = teamspeakProduct.plans.map((plan) => ({
  id: plan.id,
  productSlug: teamspeakProduct.slug,
  name: plan.name,
  description: plan.description,
  monthlyPrice: plan.pricing.monthly,
  yearlyPrice: plan.pricing.annually,
  popular: plan.popular,
  features: plan.features,
}));

const teamspeakFeatures = [
  {
    icon: Volume2,
    title: "Crystal Clear Audio",
    description: "High-quality Opus codec for pristine voice quality with minimal latency.",
  },
  {
    icon: Shield,
    title: "DDoS Protection",
    description: "Enterprise-grade protection keeps your voice server online during attacks.",
  },
  {
    icon: Zap,
    title: "Instant Setup",
    description: "Your TeamSpeak server is deployed instantly. Start talking in minutes.",
  },
  {
    icon: Globe,
    title: "Global Locations",
    description: "Multiple datacenter locations for the lowest latency to your users.",
  },
  {
    icon: Settings,
    title: "Full Control",
    description: "Complete access to server settings, permissions, and channel management.",
  },
  {
    icon: Lock,
    title: "Secure & Private",
    description: "End-to-end encryption and granular permission systems protect your conversations.",
  },
];

const teamspeakFAQs = [
  {
    question: "How do I upgrade my slot count?",
    answer: "You can upgrade your slot count at any time through your control panel. Simply select your new plan and the upgrade is applied instantly. You only pay the difference.",
  },
  {
    question: "Which regions are available?",
    answer: "We offer TeamSpeak servers in North America, Europe, and Asia-Pacific regions. Choose the location closest to your users for the best voice quality.",
  },
  {
    question: "Is the voice quality really that good?",
    answer: "Yes! We use the Opus codec at high bitrates and optimize our network specifically for real-time voice traffic. Most users notice a significant improvement over free alternatives.",
  },
  {
    question: "Can I use a custom domain?",
    answer: "Yes, Large and Enterprise plans include custom domain support. You can use your own domain like ts.yourdomain.com to connect to your server.",
  },
  {
    question: "How do backups work?",
    answer: "We automatically backup your server configuration, channels, and permissions. Daily backups are kept for 7 days, hourly for 24 hours. You can restore with one click.",
  },
  {
    question: "Do you provide a web interface?",
    answer: "Yes! All plans include access to our web-based control panel where you can manage your server, view usage statistics, and configure settings without the TeamSpeak client.",
  },
];

export default function TeamSpeak() {
  return (
    <Layout>
      <SEOHead
        title="TeamSpeak Hosting - Crystal Clear Voice Servers | Hoxta"
        description="High-quality TeamSpeak server hosting with instant setup, DDoS protection, and low latency. From 15 to 512 slots. Starting at $3/month."
        canonicalUrl="https://hoxta.com/teamspeak"
      />
      <ServiceSchema
        name="Hoxta TeamSpeak Hosting"
        description="High-quality TeamSpeak server hosting with crystal clear audio, instant setup, and enterprise DDoS protection."
        priceRange="$3 - $25"
      />
      <FAQSchema faqs={teamspeakFAQs} />
      <OrganizationSchema />

      <HostingHero
        badge="Voice Servers"
        headline={
          <>
            TeamSpeak <span className="text-gradient">Hosting</span>
          </>
        }
        description="Crystal-clear voice communication for your gaming clan, community, or team. Low latency, high quality, always protected."
        primaryCTA={{ text: "Get Started", href: "#pricing" }}
        secondaryCTA={{ text: "Compare Plans", href: "#pricing" }}
      />

      <TrustBar />

      <div id="pricing">
        <PricingPlans
          title="TeamSpeak Server Plans"
          subtitle="Choose the perfect plan for your community size."
          plans={teamspeakPlans}
          productSlug="teamspeak"
        />
      </div>

      <FeatureGrid
        title="Why Choose Our TeamSpeak Hosting"
        subtitle="Premium features for the ultimate voice experience."
        features={teamspeakFeatures}
      />

      <ContentSection
        title="Unmatched Voice Quality"
        description="We optimize every aspect of our TeamSpeak hosting for the clearest voice communication. From codec settings to network priority, your voice traffic gets VIP treatment."
        points={[
          "Opus codec at high bitrates",
          "Network priority for voice packets",
          "Sub-20ms latency to most users",
          "Jitter buffer optimization",
        ]}
        icon={Headphones}
      />

      <ContentSection
        title="Complete Control"
        description="Manage every aspect of your TeamSpeak server through our intuitive control panel or directly via ServerQuery. Create channels, set permissions, and customize to your heart's content."
        points={[
          "Web-based control panel",
          "ServerQuery access",
          "Granular permission system",
          "Channel templates",
        ]}
        icon={Settings}
        reverse
      />

      <HowItWorks />

      <GlobalInfrastructure />

      <FAQAccordion
        title="TeamSpeak Hosting FAQ"
        subtitle="Common questions about our voice server hosting."
        items={teamspeakFAQs}
      />

      <FinalCTA
        title="Ready to Talk?"
        subtitle="Deploy your TeamSpeak server in seconds and start communicating with crystal clarity."
      />
    </Layout>
  );
}
