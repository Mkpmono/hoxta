import { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import { 
  Server, 
  Shield, 
  Zap, 
  Globe, 
  Headphones, 
  HardDrive,
  Activity,
  Lock,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Animated counter hook
function useAnimatedCounter(target: number, duration: number = 2000, isInView: boolean) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [target, duration, isInView]);
  
  return count;
}

// Infrastructure stats with animated counters
function InfrastructureStats() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const uptime = useAnimatedCounter(99.99, 2000, isInView);
  const locations = useAnimatedCounter(12, 1500, isInView);
  const bandwidth = useAnimatedCounter(40, 1800, isInView);
  const latency = useAnimatedCounter(5, 1200, isInView);

  const stats = [
    { value: `${uptime.toFixed(2)}%`, label: t("sections.uptimeSla"), suffix: "" },
    { value: locations, label: t("sections.globalLocations"), suffix: "+" },
    { value: bandwidth, label: t("sections.gbpsNetwork"), suffix: "+" },
    { value: `<${latency}ms`, label: t("sections.avgLatency"), suffix: "" },
  ];

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
    >
      {stats.map((stat, index) => (
        <div
          key={index}
          className="text-center p-6 rounded-2xl bg-card/40 border border-border/30 backdrop-blur-sm"
        >
          <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
            {typeof stat.value === 'number' ? stat.value : stat.value}{stat.suffix}
          </div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

// Local section accent (static, non-network)
function SectionGlow() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/3 left-1/4 w-[520px] h-[520px] bg-primary/5 rounded-full blur-[160px]" />
      <div className="absolute bottom-1/4 right-1/5 w-[420px] h-[420px] bg-primary/4 rounded-full blur-[140px]" />
    </div>
  );
}

// Feature Card Component
function FeatureCard({ feature, index }: { feature: { icon: any; title: string; description: string; highlight: string }; index: number }) {
  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative glass-card p-6 h-full border border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(25,195,255,0.12)]">
        {/* Highlight badge */}
        <div className="absolute -top-3 right-4">
          <span className="px-3 py-1 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 rounded-full">
            {feature.highlight}
          </span>
        </div>
        
        {/* Icon */}
        <motion.div 
          className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center mb-5"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <feature.icon className="w-7 h-7 text-primary" />
        </motion.div>
        
        {/* Content */}
        <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
          {feature.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

export function WhyChooseSection() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  const infrastructureFeatures = [
    {
      icon: Server,
      title: t("sections.enterpriseHardware"),
      description: t("sections.enterpriseHardwareDesc"),
      highlight: "99.99% Uptime",
    },
    {
      icon: HardDrive,
      title: t("sections.nvmeStorage"),
      description: t("sections.nvmeStorageDesc"),
      highlight: "7,000 MB/s",
    },
    {
      icon: Globe,
      title: t("sections.globalNetwork"),
      description: t("sections.globalNetworkDesc"),
      highlight: "12+ Locations",
    },
    {
      icon: Shield,
      title: t("sections.ddosProtection"),
      description: t("sections.ddosProtectionDesc"),
      highlight: "2.5 Tbps+",
    },
    {
      icon: Zap,
      title: t("sections.instantDeployment"),
      description: t("sections.instantDeploymentDesc"),
      highlight: "< 60 Seconds",
    },
    {
      icon: Headphones,
      title: t("sections.expertSupport"),
      description: t("sections.expertSupportDesc"),
      highlight: "< 15 Min",
    },
  ];

  const trustBadges = [
    { icon: Lock, label: t("sections.soc2Compliant") },
    { icon: Activity, label: t("sections.monitoring247") },
    { icon: Server, label: t("sections.tierIiiDc") },
    { icon: Shield, label: t("sections.iso27001") },
  ];

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <SectionGlow />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Server className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">{t("sections.infrastructureBuiltFor")}</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {t("sections.enterpriseGradeHosting")}
            <span className="block text-primary mt-2">{t("sections.youCanRelyOn")}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t("sections.whyChooseDesc")}
          </p>
        </motion.div>

        {/* Stats */}
        <InfrastructureStats />

        {/* Feature Cards Grid */}
        <div 
          ref={containerRef} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {infrastructureFeatures.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mb-12">
          {trustBadges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <badge.icon className="w-4 h-4 text-primary/70" />
              <span className="text-sm">{badge.label}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link to="/game-servers">
            <Button className="btn-glow group px-8">
              {t("buttons.exploreServices")}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" className="btn-outline px-8">
              <Headphones className="w-4 h-4 mr-2" />
              {t("buttons.contactSupport")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
