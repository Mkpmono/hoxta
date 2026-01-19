import { Layout } from "@/components/layout/Layout";
import { Bot, Shield, Zap, Clock, Terminal, RefreshCw, BarChart3, Code } from "lucide-react";
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
import { discordBotProduct } from "@/data/products";

// Convert product plans to PricingPlans format
const discordBotPlans = discordBotProduct.plans.map((plan) => ({
  id: plan.id,
  productSlug: discordBotProduct.slug,
  name: plan.name,
  description: plan.description,
  monthlyPrice: plan.pricing.monthly,
  yearlyPrice: plan.pricing.annually,
  popular: plan.popular,
  features: plan.features,
}));

const discordBotFeatures = [
  {
    icon: Clock,
    title: "24/7 Uptime",
    description: "Your bot stays online around the clock. No more downtime from sleeping servers.",
  },
  {
    icon: RefreshCw,
    title: "Auto-Restart",
    description: "Automatic restart on crashes with smart health monitoring and notifications.",
  },
  {
    icon: Terminal,
    title: "Console Access",
    description: "Full console access to view logs, debug issues, and monitor performance in real-time.",
  },
  {
    icon: Code,
    title: "Any Language",
    description: "Support for Node.js, Python, Java, and more. Run Discord.js, Discord.py, JDA, and others.",
  },
  {
    icon: BarChart3,
    title: "Resource Monitoring",
    description: "Real-time CPU, RAM, and network usage graphs to optimize your bot's performance.",
  },
  {
    icon: Shield,
    title: "DDoS Protected",
    description: "Enterprise-grade protection for your bot's web dashboard and API endpoints.",
  },
];

const discordBotFAQs = [
  {
    question: "Which languages and libraries are supported?",
    answer: "We support all major programming languages and Discord libraries including Node.js (Discord.js, Eris), Python (Discord.py, Nextcord, Pycord), Java (JDA), and more. If it can run on Linux, we can host it.",
  },
  {
    question: "How do I deploy my bot?",
    answer: "Simply upload your bot files via our web panel, SFTP, or Git integration. Set your start command, add your environment variables (like bot token), and click deploy. It's that simple.",
  },
  {
    question: "What happens if my bot crashes?",
    answer: "Our watchdog system automatically restarts crashed bots within seconds. You'll receive a notification with crash logs so you can debug the issue.",
  },
  {
    question: "Can I use databases with my bot?",
    answer: "Yes! All plans support SQLite out of the box. Standard and above include MySQL/PostgreSQL access. You can also connect to external database services.",
  },
  {
    question: "Do you support sharding for large bots?",
    answer: "Absolutely! Our Professional and Enterprise plans are designed for bots in thousands of servers. We support Discord's sharding and can help optimize your shard distribution.",
  },
  {
    question: "Can I access my bot's logs?",
    answer: "Yes, you have full console access with real-time log streaming. Logs are retained for 7 days, and you can download them anytime for debugging.",
  },
];

export default function DiscordBot() {
  return (
    <Layout>
      <SEOHead
        title="Discord Bot Hosting - 24/7 Uptime, Auto-Restart | Hoxta"
        description="Reliable Discord bot hosting with 24/7 uptime, auto-restart, and full console access. Support for Node.js, Python, and more. From $3/month."
        canonicalUrl="https://hoxta.com/discord-bot"
      />
      <ServiceSchema
        name="Hoxta Discord Bot Hosting"
        description="Reliable Discord bot hosting with 24/7 uptime, auto-restart, monitoring, and support for all major languages and libraries."
        priceRange="$3 - $35"
      />
      <FAQSchema faqs={discordBotFAQs} />
      <OrganizationSchema />

      <HostingHero
        badge="Bot Hosting"
        headline={
          <>
            Discord Bot <span className="text-gradient">Hosting</span>
          </>
        }
        description="Keep your Discord bot online 24/7 with automatic restarts, real-time monitoring, and support for any programming language."
        primaryCTA={{ text: "Get Started", href: "#pricing" }}
        secondaryCTA={{ text: "View Features", href: "#features" }}
      />

      <TrustBar />

      <div id="pricing">
        <PricingPlans
          title="Discord Bot Hosting Plans"
          subtitle="From hobby projects to verified bots with millions of users."
          plans={discordBotPlans}
          productSlug="discord-bot"
        />
      </div>

      <div id="features">
        <FeatureGrid
          title="Everything Your Bot Needs"
          subtitle="Built for developers who want their bots to just work."
          features={discordBotFeatures}
        />
      </div>

      <ContentSection
        title="Always Online"
        description="No more 'why is the bot offline?' questions. Our infrastructure is designed for 24/7 operation with multiple redundancy layers and instant crash recovery."
        points={[
          "99.9%+ uptime guarantee",
          "Automatic crash recovery",
          "Health monitoring alerts",
          "Zero-downtime deploys",
        ]}
        icon={Clock}
      />

      <ContentSection
        title="Developer Friendly"
        description="We built this for developers. Full SSH access, Git deployments, environment variables, custom domains for dashboards, and everything else you need."
        points={[
          "Git push deployments",
          "Environment variables",
          "SSH and SFTP access",
          "Custom start commands",
        ]}
        icon={Terminal}
        reverse
      />

      <HowItWorks />

      <GlobalInfrastructure />

      <FAQAccordion
        title="Discord Bot Hosting FAQ"
        subtitle="Common questions about our bot hosting service."
        items={discordBotFAQs}
      />

      <FinalCTA
        title="Ready to Deploy?"
        subtitle="Get your Discord bot online in minutes with our developer-friendly hosting platform."
      />
    </Layout>
  );
}
