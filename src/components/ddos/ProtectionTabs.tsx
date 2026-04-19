import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Globe, Bot, Lock, Gauge, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ProtectionLayer {
  id: string;
  icon: React.ReactNode;
  features: string[];
  attacks: string[];
}

const layerData: ProtectionLayer[] = [
  {
    id: "l3l4",
    icon: <Shield className="w-5 h-5" />,
    features: [
      "Volumetric attack mitigation",
      "SYN flood protection",
      "UDP amplification defense",
      "ICMP flood filtering",
      "IP reputation scoring",
    ],
    attacks: ["SYN Floods", "UDP Floods", "DNS Amplification", "NTP Reflection", "SSDP Attacks"],
  },
  {
    id: "l7",
    icon: <Globe className="w-5 h-5" />,
    features: [
      "HTTP/HTTPS flood protection",
      "Slowloris mitigation",
      "Challenge-response validation",
      "JavaScript challenge",
      "Session fingerprinting",
    ],
    attacks: ["HTTP Floods", "Slowloris", "RUDY", "Apache Killer", "WordPress Pingback"],
  },
  {
    id: "bot",
    icon: <Bot className="w-5 h-5" />,
    features: [
      "Behavioral analysis",
      "Browser fingerprinting",
      "CAPTCHA challenges",
      "Bot signature database",
      "Credential stuffing protection",
    ],
    attacks: ["Scraping Bots", "Credential Stuffing", "Account Takeover", "Spam Bots", "Click Fraud"],
  },
  {
    id: "waf",
    icon: <Lock className="w-5 h-5" />,
    features: [
      "OWASP Top 10 protection",
      "Custom rule builder",
      "Geo-blocking",
      "IP whitelisting/blacklisting",
      "Request inspection",
    ],
    attacks: ["SQL Injection", "XSS", "Path Traversal", "RCE Attempts", "Zero-day Exploits"],
  },
  {
    id: "rate",
    icon: <Gauge className="w-5 h-5" />,
    features: [
      "Requests per second limits",
      "Concurrent connection limits",
      "Bandwidth throttling",
      "API rate limiting",
      "Burst allowance",
    ],
    attacks: ["Brute Force", "API Abuse", "Resource Exhaustion", "Login Attempts", "Enumeration"],
  },
];

export function ProtectionTabs() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("l3l4");
  const activeLayer = layerData.find((l) => l.id === activeTab)!;

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("ddos.tabs.title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("ddos.tabs.subtitle")}
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {layerData.map((layer) => (
            <button
              key={layer.id}
              onClick={() => setActiveTab(layer.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === layer.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground border border-border/50"
              }`}
            >
              {layer.icon}
              <span>{t(`ddos.tabs.labels.${layer.id}`)}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-8 max-w-4xl mx-auto"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">{t("ddos.tabs.features")}</h3>
                <ul className="space-y-3">
                  {activeLayer.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">{t("ddos.tabs.attacksBlocked")}</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {activeLayer.attacks.map((attack, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full bg-destructive/10 text-destructive text-sm"
                    >
                      {attack}
                    </span>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <span className="text-xs font-medium text-primary uppercase tracking-wide">
                    {t("ddos.tabs.bestFor")}
                  </span>
                  <p className="text-foreground mt-1">
                    {t(`ddos.tabs.bestForText.${activeLayer.id}`)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
