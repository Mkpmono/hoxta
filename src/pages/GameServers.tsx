import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Gamepad2, Shield, Zap, Globe, Headphones, Cpu, Users } from "lucide-react";
import { GameCatalog } from "@/components/hosting/GameCatalog";
import {
  TrustBar,
  FeatureGrid,
  GlobalInfrastructure,
  FAQAccordion,
  FinalCTA,
} from "@/components/hosting";
import { SEOHead, ServiceSchema, FAQSchema, OrganizationSchema } from "@/components/seo";

const gameFeatures = [
  {
    icon: Zap,
    title: "Instant Setup",
    description: "Your game server is deployed instantly. Start playing within minutes of ordering.",
  },
  {
    icon: Shield,
    title: "DDoS Protection",
    description: "Enterprise-grade DDoS mitigation protects your server from attacks 24/7.",
  },
  {
    icon: Globe,
    title: "Global Locations",
    description: "Deploy in multiple regions for the lowest ping to your players.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Expert gaming support available around the clock via live chat and tickets.",
  },
  {
    icon: Cpu,
    title: "High Performance",
    description: "Latest-gen hardware with NVMe SSDs for lag-free gaming experience.",
  },
  {
    icon: Users,
    title: "Easy Management",
    description: "User-friendly control panel for server management, mods, and backups.",
  },
];

const gameFAQs = [
  {
    question: "How quickly is my game server deployed?",
    answer: "Game servers are deployed instantly after payment confirmation. You'll receive login details within minutes and can start configuring your server right away.",
  },
  {
    question: "Can I install mods and plugins?",
    answer: "Yes! Our control panel supports one-click mod installation for most games. You can also upload custom mods via SFTP or the file manager.",
  },
  {
    question: "What locations are available?",
    answer: "We offer game servers in North America, Europe, Asia, and Australia. Choose the location closest to your player base for the best performance.",
  },
  {
    question: "Can I upgrade my server later?",
    answer: "Absolutely! You can upgrade RAM, slots, or CPU at any time through your control panel. Upgrades are applied instantly without data loss.",
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes, we offer a 24-hour money-back guarantee on all game servers. If you're not satisfied, contact support for a full refund.",
  },
  {
    question: "Is DDoS protection included?",
    answer: "Yes! All game servers include enterprise-grade DDoS protection at no extra cost. Your server stays online even during attacks.",
  },
];

export default function GameServers() {
  return (
    <Layout>
      {/* SEO */}
      <SEOHead
        title="Game Server Hosting - Instant Setup, DDoS Protected | Hoxta"
        description="High-performance game server hosting for Minecraft, Rust, FiveM, CS2, and more. Instant setup, DDoS protection, 24/7 support. From $0.50/slot."
        canonicalUrl="https://hoxta.com/game-servers"
      />
      <ServiceSchema
        name="Hoxta Game Server Hosting"
        description="High-performance game server hosting with instant setup, DDoS protection, and 24/7 expert gaming support."
        priceRange="$0.50 - $120.00"
      />
      <FAQSchema faqs={gameFAQs} />
      <OrganizationSchema />

      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute inset-0 wave-bg opacity-30" />
        
        <div className="container mx-auto px-4 md:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Gamepad2 className="w-4 h-4" />
              <span className="text-sm font-medium">Game Server Hosting</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Game Server{" "}
              <span className="text-gradient">Hosting</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              High-performance game servers with instant setup, DDoS protection, and 24/7 support. 
              Choose your game and start playing in minutes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Game Catalog */}
      <GameCatalog />

      {/* Trust Bar */}
      <TrustBar />

      {/* Feature Grid */}
      <FeatureGrid
        title="Why Choose Hoxta Game Servers"
        subtitle="Built for gamers, by gamers. Premium features included with every server."
        features={gameFeatures}
      />

      {/* Global Infrastructure */}
      <GlobalInfrastructure />

      {/* FAQ */}
      <FAQAccordion
        title="Game Server FAQ"
        subtitle="Common questions about our game server hosting."
        items={gameFAQs}
      />

      {/* Final CTA */}
      <FinalCTA
        title="Ready to Start Gaming?"
        subtitle="Deploy your game server in under 60 seconds with instant setup and 24/7 support."
      />
    </Layout>
  );
}
