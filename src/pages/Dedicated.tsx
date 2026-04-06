import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Check, Server, Cpu, HardDrive, Wifi, Zap, Shield, Lock, Gauge } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  HostingHero, TrustBar, FeatureGrid, ContentSection,
  GlobalInfrastructure, FAQAccordion, FinalCTA, ManagedServicesUpsell,
} from "@/components/hosting";
import { ProcessorToggle } from "@/components/hosting/ProcessorToggle";
import { SEOHead, ServiceSchema, FAQSchema, OrganizationSchema } from "@/components/seo";

interface DedicatedServer {
  id: string; name: string; price: number; popular?: boolean;
  specs: { cpu: string; cores: string; ram: string; storage: string; bandwidth: string };
}

const intelServers: DedicatedServer[] = [
  { id: "dedicated-intel-e3", name: "Intel Xeon E3", price: 89, specs: { cpu: "Intel Xeon E3-1230v6", cores: "4 Cores / 8 Threads", ram: "32 GB DDR4", storage: "2x 500GB NVMe", bandwidth: "10 TB" } },
  { id: "dedicated-intel-e5", name: "Intel Xeon E5", price: 149, popular: true, specs: { cpu: "Intel Xeon E5-2680v4", cores: "14 Cores / 28 Threads", ram: "64 GB DDR4", storage: "2x 1TB NVMe", bandwidth: "20 TB" } },
  { id: "dedicated-intel-gold", name: "Intel Xeon Gold", price: 229, specs: { cpu: "Intel Xeon Gold 6248R", cores: "24 Cores / 48 Threads", ram: "128 GB DDR4", storage: "2x 2TB NVMe", bandwidth: "Unlimited" } },
];

const amdServers: DedicatedServer[] = [
  { id: "dedicated-amd-7232p", name: "AMD EPYC 7232P", price: 99, specs: { cpu: "AMD EPYC 7232P", cores: "8 Cores / 16 Threads", ram: "32 GB DDR4 ECC", storage: "2x 500GB NVMe", bandwidth: "10 TB" } },
  { id: "dedicated-amd-7302p", name: "AMD EPYC 7302P", price: 169, popular: true, specs: { cpu: "AMD EPYC 7302P", cores: "16 Cores / 32 Threads", ram: "64 GB DDR4 ECC", storage: "2x 1TB NVMe", bandwidth: "20 TB" } },
  { id: "dedicated-amd-7443p", name: "AMD EPYC 7443P", price: 279, specs: { cpu: "AMD EPYC 7443P", cores: "24 Cores / 48 Threads", ram: "128 GB DDR4 ECC", storage: "2x 2TB NVMe", bandwidth: "Unlimited" } },
];

export default function Dedicated() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [processor, setProcessor] = useState<"intel" | "amd">("intel");
  const servers = processor === "intel" ? intelServers : amdServers;

  const handleOrderServer = (serverId: string) => {
    navigate(`/checkout?product=dedicated&plan=${serverId}&billing=monthly`);
  };

  const dedicatedFeatures = [
    { icon: Cpu, title: t("pages.dedicated.features.hardwareControl"), description: t("pages.dedicated.features.hardwareControlDesc") },
    { icon: Shield, title: t("pages.dedicated.features.ddos"), description: t("pages.dedicated.features.ddosDesc") },
    { icon: Gauge, title: t("pages.dedicated.features.maxPerf"), description: t("pages.dedicated.features.maxPerfDesc") },
    { icon: Lock, title: t("pages.dedicated.features.ipmi"), description: t("pages.dedicated.features.ipmiDesc") },
    { icon: HardDrive, title: t("pages.dedicated.features.nvmeRaid"), description: t("pages.dedicated.features.nvmeRaidDesc") },
    { icon: Wifi, title: t("pages.dedicated.features.network"), description: t("pages.dedicated.features.networkDesc") },
  ];

  const dedicatedFAQs = [
    { question: t("pages.dedicated.faq.q1", "How long does it take to deploy a dedicated server?"), answer: t("pages.dedicated.faq.a1", "Standard configurations are typically deployed within 1-4 hours.") },
    { question: t("pages.dedicated.faq.q2", "Can I customize the server configuration?"), answer: t("pages.dedicated.faq.a2", "Yes! Contact our sales team for custom configurations.") },
    { question: t("pages.dedicated.faq.q3", "Is there a setup fee?"), answer: t("pages.dedicated.faq.a3", "No, there are no setup fees for any of our dedicated server configurations.") },
    { question: t("pages.dedicated.faq.q4", "What operating systems are available?"), answer: t("pages.dedicated.faq.a4", "We support all major Linux distributions and Windows Server.") },
    { question: t("pages.dedicated.faq.q5", "Do you offer managed dedicated servers?"), answer: t("pages.dedicated.faq.a5", "Yes! We offer optional managed services including monitoring, patching, and 24/7 support.") },
    { question: t("pages.dedicated.faq.q6", "What is your SLA guarantee?"), answer: t("pages.dedicated.faq.a6", "All dedicated servers come with a 99.99% uptime SLA backed by service credits.") },
  ];

  return (
    <Layout>
      <SEOHead title="Dedicated Servers - Intel Xeon & AMD EPYC | Hoxta" description="Enterprise-grade dedicated servers with Intel Xeon & AMD EPYC processors. From $89/mo." canonicalUrl="https://hoxta.com/dedicated-servers" />
      <ServiceSchema name="Hoxta Dedicated Servers" description="Enterprise bare metal dedicated servers with Intel Xeon and AMD EPYC options." priceRange="$89 - $279" />
      <FAQSchema faqs={dedicatedFAQs} />
      <OrganizationSchema />

      <HostingHero
        badge={t("pages.dedicated.badge")}
        headline={t("pages.dedicated.headline")}
        highlightedText={t("pages.dedicated.highlightedText")}
        description={t("pages.dedicated.description")}
        promotion={{ text: t("pages.dedicated.promoText"), discount: t("pages.dedicated.promoDiscount"), endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) }}
        primaryCTA={{ text: t("pages.dedicated.primaryCta"), href: "#servers" }}
        secondaryCTA={{ text: t("buttons.contactSales"), href: "/contact" }}
      />
      <TrustBar />

      <section id="servers" className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("pages.dedicated.chooseConfig")} <span className="text-gradient">{t("pages.dedicated.configHighlight")}</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">{t("pages.dedicated.configSubtitle")}</p>
            <ProcessorToggle selected={processor} onChange={setProcessor} />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {servers.map((server, index) => (
              <motion.div key={server.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className={`glass-card p-6 relative ${server.popular ? "border-primary/50 shadow-glow" : ""}`}>
                {server.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">{t("pages.dedicated.bestValue")}</div>}
                <h3 className="text-xl font-semibold text-foreground mb-2">{server.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-foreground">${server.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3"><Cpu className="w-5 h-5 text-primary mt-0.5" /><div><div className="text-sm font-medium text-foreground">{server.specs.cpu}</div><div className="text-xs text-muted-foreground">{server.specs.cores}</div></div></div>
                  <div className="flex items-center gap-3"><Server className="w-5 h-5 text-primary" /><span className="text-sm text-muted-foreground">{server.specs.ram} {t("pages.dedicated.eccRam")}</span></div>
                  <div className="flex items-center gap-3"><HardDrive className="w-5 h-5 text-primary" /><span className="text-sm text-muted-foreground">{server.specs.storage} {t("pages.dedicated.raid")}</span></div>
                  <div className="flex items-center gap-3"><Wifi className="w-5 h-5 text-primary" /><span className="text-sm text-muted-foreground">{server.specs.bandwidth} @ 1Gbps</span></div>
                </div>
                <div className="space-y-2 mb-6 pt-4 border-t border-border/50">
                  {[t("pages.dedicated.ddosProtection"), t("pages.dedicated.ipmiAccess"), t("pages.dedicated.uptimeSla"), t("pages.dedicated.expertSupport")].map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground"><Check className="w-4 h-4 text-primary" />{feature}</div>
                  ))}
                </div>
                <button onClick={() => handleOrderServer(server.id)} className={`block w-full py-3 text-center rounded-lg font-medium transition-colors ${server.popular ? "btn-glow" : "btn-outline"}`}>
                  {t("pages.dedicated.orderNow")}
                </button>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }} className="mt-8 glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Zap className="w-8 h-8 text-primary" />
              <div>
                <h4 className="font-semibold text-foreground">{t("pages.dedicated.customConfig")}</h4>
                <p className="text-sm text-muted-foreground">{t("pages.dedicated.customConfigDesc")}</p>
              </div>
            </div>
            <Link to="/contact" className="btn-outline whitespace-nowrap">{t("buttons.contactSales")}</Link>
          </motion.div>
        </div>
      </section>

      <FeatureGrid title={t("pages.dedicated.whyTitle")} subtitle={t("pages.dedicated.whySubtitle")} features={dedicatedFeatures} />
      <ContentSection title={t("pages.dedicated.whatIsTitle")} description={t("pages.dedicated.whatIsDesc")} points={t("pages.dedicated.whatIsPoints", { returnObjects: true }) as string[]} icon={Server} />
      <ContentSection title={t("pages.dedicated.cpuTitle")} description={t("pages.dedicated.cpuDesc")} points={t("pages.dedicated.cpuPoints", { returnObjects: true }) as string[]} icon={Gauge} reverse />
      <GlobalInfrastructure />
      <ManagedServicesUpsell />
      <FAQAccordion title={t("pages.dedicated.faqTitle")} subtitle={t("pages.dedicated.faqSubtitle")} items={dedicatedFAQs} />
      <FinalCTA title={t("pages.dedicated.ctaTitle")} subtitle={t("pages.dedicated.ctaSubtitle")} />
    </Layout>
  );
}
