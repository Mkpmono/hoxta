import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Globe, Bot, Lock, Gauge, Check } from "lucide-react";

interface ProtectionLayer {
  id: string;
  label: string;
  icon: React.ReactNode;
  features: string[];
  attacks: string[];
  bestFor: string;
}

const layers: ProtectionLayer[] = [
  {
    id: "l3l4",
    label: "L3/L4",
    icon: <Shield className="w-5 h-5" />,
    features: [
      "Volumetric attack mitigation",
      "SYN flood protection",
      "UDP amplification defense",
      "ICMP flood filtering",
      "IP reputation scoring",
    ],
    attacks: ["SYN Floods", "UDP Floods", "DNS Amplification", "NTP Reflection", "SSDP Attacks"],
    bestFor: "Network infrastructure & game servers",
  },
  {
    id: "l7",
    label: "L7",
    icon: <Globe className="w-5 h-5" />,
    features: [
      "HTTP/HTTPS flood protection",
      "Slowloris mitigation",
      "Challenge-response validation",
      "JavaScript challenge",
      "Session fingerprinting",
    ],
    attacks: ["HTTP Floods", "Slowloris", "RUDY", "Apache Killer", "WordPress Pingback"],
    bestFor: "Web applications & APIs",
  },
  {
    id: "bot",
    label: "Bot Mitigation",
    icon: <Bot className="w-5 h-5" />,
    features: [
      "Behavioral analysis",
      "Browser fingerprinting",
      "CAPTCHA challenges",
      "Bot signature database",
      "Credential stuffing protection",
    ],
    attacks: ["Scraping Bots", "Credential Stuffing", "Account Takeover", "Spam Bots", "Click Fraud"],
    bestFor: "E-commerce & login pages",
  },
  {
    id: "waf",
    label: "WAF/Rules",
    icon: <Lock className="w-5 h-5" />,
    features: [
      "OWASP Top 10 protection",
      "Custom rule builder",
      "Geo-blocking",
      "IP whitelisting/blacklisting",
      "Request inspection",
    ],
    attacks: ["SQL Injection", "XSS", "Path Traversal", "RCE Attempts", "Zero-day Exploits"],
    bestFor: "Sensitive applications & compliance",
  },
  {
    id: "rate",
    label: "Rate Limiting",
    icon: <Gauge className="w-5 h-5" />,
    features: [
      "Requests per second limits",
      "Concurrent connection limits",
      "Bandwidth throttling",
      "API rate limiting",
      "Burst allowance",
    ],
    attacks: ["Brute Force", "API Abuse", "Resource Exhaustion", "Login Attempts", "Enumeration"],
    bestFor: "APIs & authentication endpoints",
  },
];

export function ProtectionTabs() {
  const [activeTab, setActiveTab] = useState("l3l4");
  const activeLayer = layers.find((l) => l.id === activeTab)!;

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
            Multi-Layer Protection
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive defense across all attack vectors with specialized protection at every layer.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {layers.map((layer) => (
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
              <span>{layer.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
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
              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Features</h3>
                <ul className="space-y-3">
                  {activeLayer.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Attacks Blocked */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Attacks Blocked</h3>
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
                  <span className="text-xs font-medium text-primary uppercase tracking-wide">Best For</span>
                  <p className="text-foreground mt-1">{activeLayer.bestFor}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
