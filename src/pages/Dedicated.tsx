import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Check, Server, Cpu, HardDrive, Wifi, Zap, Shield, Lock, Gauge } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  HostingHero,
  TrustBar,
  FeatureGrid,
  ContentSection,
  GlobalInfrastructure,
  FAQAccordion,
  FinalCTA,
  ManagedServicesUpsell,
} from "@/components/hosting";
import { SEOHead, ServiceSchema, FAQSchema, OrganizationSchema } from "@/components/seo";

interface DedicatedServer {
  id: string;
  name: string;
  price: number;
  popular?: boolean;
  specs: {
    cpu: string;
    cores: string;
    ram: string;
    storage: string;
    bandwidth: string;
  };
}

const servers: DedicatedServer[] = [
  {
    id: "dedicated-starter",
    name: "Intel Xeon E3",
    price: 89,
    specs: { cpu: "Intel Xeon E3-1230v6", cores: "4 Cores / 8 Threads", ram: "32 GB DDR4", storage: "2x 500GB NVMe", bandwidth: "10 TB" },
  },
  {
    id: "dedicated-business",
    name: "Intel Xeon E5",
    price: 149,
    popular: true,
    specs: { cpu: "Intel Xeon E5-2680v4", cores: "14 Cores / 28 Threads", ram: "64 GB DDR4", storage: "2x 1TB NVMe", bandwidth: "20 TB" },
  },
  {
    id: "dedicated-enterprise",
    name: "AMD EPYC",
    price: 249,
    specs: { cpu: "AMD EPYC 7302P", cores: "16 Cores / 32 Threads", ram: "128 GB DDR4", storage: "2x 2TB NVMe", bandwidth: "Unlimited" },
  },
];

const dedicatedFeatures = [
  {
    icon: Cpu,
    title: "Full Hardware Control",
    description: "Complete access to physical hardware with no virtualization overhead.",
  },
  {
    icon: Shield,
    title: "DDoS Protection",
    description: "Up to 1Tbps protection included with every server.",
  },
  {
    icon: Gauge,
    title: "Maximum Performance",
    description: "No resource sharing means consistent, predictable power.",
  },
  {
    icon: Lock,
    title: "IPMI Access",
    description: "Remote server management with out-of-band console access.",
  },
  {
    icon: HardDrive,
    title: "NVMe RAID Storage",
    description: "Hardware RAID with NVMe drives for speed and redundancy.",
  },
  {
    icon: Wifi,
    title: "Premium Network",
    description: "1Gbps dedicated port with premium routing and low latency.",
  },
];

const dedicatedFAQs = [
  {
    question: "How long does it take to deploy a dedicated server?",
    answer: "Standard configurations are typically deployed within 1-4 hours. Custom configurations may take 24-48 hours depending on hardware availability.",
  },
  {
    question: "Can I customize the server configuration?",
    answer: "Yes! Contact our sales team for custom configurations including additional RAM, storage, or specific CPU requirements.",
  },
  {
    question: "Is there a setup fee?",
    answer: "No, there are no setup fees for any of our dedicated server configurations. You only pay the monthly cost.",
  },
  {
    question: "What operating systems are available?",
    answer: "We support all major Linux distributions (Ubuntu, CentOS, Debian, etc.) and Windows Server. Custom images can be deployed upon request.",
  },
  {
    question: "Do you offer managed dedicated servers?",
    answer: "Yes! We offer optional managed services including server monitoring, security patching, backup management, and 24/7 support.",
  },
  {
    question: "What is your SLA guarantee?",
    answer: "All dedicated servers come with a 99.99% uptime SLA backed by service credits. We guarantee network, power, and hardware availability.",
  },
];

export default function Dedicated() {
  const navigate = useNavigate();

  const handleOrderServer = (serverId: string) => {
    navigate(`/checkout?product=dedicated&plan=${serverId}&billing=monthly`);
  };

  return (
    <Layout>
      {/* SEO */}
      <SEOHead
        title="Dedicated Servers - Enterprise Bare Metal | Hoxta"
        description="Enterprise-grade dedicated servers with Intel Xeon & AMD EPYC processors. Full hardware control, NVMe RAID, DDoS protection. From $89/mo."
        canonicalUrl="https://hoxta.com/dedicated-servers"
      />
      <ServiceSchema
        name="Hoxta Dedicated Servers"
        description="Enterprise bare metal dedicated servers with full hardware control, NVMe RAID storage, and premium network connectivity."
        priceRange="$89 - $249"
      />
      <FAQSchema faqs={dedicatedFAQs} />
      <OrganizationSchema />

      {/* Hero */}
      <HostingHero
        badge="Dedicated Servers"
        headline="Powerful"
        highlightedText="Dedicated Servers"
        description="Bare metal servers with full hardware control and maximum performance. No sharing, no compromises."
        promotion={{
          text: "Enterprise Deal",
          discount: "Free Setup + First Month 50% OFF",
          endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        }}
        primaryCTA={{ text: "Configure Server", href: "#servers" }}
        secondaryCTA={{ text: "Contact Sales", href: "/contact" }}
      />

      {/* Trust Bar */}
      <TrustBar />

      {/* Server Selection */}
      <section id="servers" className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Choose Your <span className="text-gradient">Configuration</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Pre-configured servers ready for rapid deployment. Need a custom build? Contact our sales team.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {servers.map((server, index) => (
              <motion.div
                key={server.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`glass-card p-6 relative ${server.popular ? "border-primary/50 shadow-glow" : ""}`}
              >
                {server.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                    BEST VALUE
                  </div>
                )}
                <h3 className="text-xl font-semibold text-foreground mb-2">{server.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-foreground">${server.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <Cpu className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-foreground">{server.specs.cpu}</div>
                      <div className="text-xs text-muted-foreground">{server.specs.cores}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Server className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">{server.specs.ram} ECC RAM</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <HardDrive className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">{server.specs.storage} RAID</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Wifi className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">{server.specs.bandwidth} @ 1Gbps</span>
                  </div>
                </div>

                <div className="space-y-2 mb-6 pt-4 border-t border-border/50">
                  {["DDoS Protection", "IPMI Access", "99.99% Uptime SLA", "24/7 Expert Support"].map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      {feature}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleOrderServer(server.id)}
                  className={`block w-full py-3 text-center rounded-lg font-medium transition-colors ${
                    server.popular ? "btn-glow" : "btn-outline"
                  }`}
                >
                  Order Now
                </button>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <Zap className="w-8 h-8 text-primary" />
              <div>
                <h4 className="font-semibold text-foreground">Need a custom configuration?</h4>
                <p className="text-sm text-muted-foreground">Contact us for custom builds and enterprise solutions.</p>
              </div>
            </div>
            <Link to="/contact" className="btn-outline whitespace-nowrap">
              Contact Sales
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <FeatureGrid
        title="Why Choose Hoxta Dedicated Servers"
        subtitle="Bare metal with premium features included."
        features={dedicatedFeatures}
      />

      {/* Content Sections */}
      <ContentSection
        title="What is a Dedicated Server?"
        description="A dedicated server gives you an entire physical machine just for you. Unlike VPS or shared hosting, you get 100% of the hardware with no virtualization — maximum performance and full control."
        points={[
          "Full physical server exclusively for you",
          "No CPU or RAM sharing",
          "Maximum I/O with direct hardware access",
          "Complete OS and software customization",
        ]}
        icon={Server}
      />

      <ContentSection
        title="Top-Tier Performance"
        description="Our servers run on the latest Intel and AMD hardware for consistent performance on demanding workloads."
        points={[
          "Latest Intel Xeon and AMD EPYC processors",
          "ECC RAM for data integrity",
          "Hardware RAID with NVMe SSDs",
          "Redundant power and network",
        ]}
        icon={Gauge}
        reverse
      />

      {/* Global Infrastructure */}
      <GlobalInfrastructure />

      {/* Managed Services Upsell */}
      <ManagedServicesUpsell />

      {/* FAQ */}
      <FAQAccordion
        title="Dedicated Server FAQ"
        subtitle="Common questions about our dedicated servers."
        items={dedicatedFAQs}
      />

      {/* Final CTA */}
      <FinalCTA
        title="Ready for Dedicated Power?"
        subtitle="Deploy your dedicated server today with 24/7 expert support."
      />
    </Layout>
  );
}
