import { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
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
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const uptime = useAnimatedCounter(99.99, 2000, isInView);
  const locations = useAnimatedCounter(12, 1500, isInView);
  const bandwidth = useAnimatedCounter(40, 1800, isInView);
  const latency = useAnimatedCounter(5, 1200, isInView);

  const stats = [
    { value: `${uptime.toFixed(2)}%`, label: "Uptime SLA", suffix: "" },
    { value: locations, label: "Global Locations", suffix: "+" },
    { value: bandwidth, label: "Gbps Network", suffix: "+" },
    { value: `<${latency}ms`, label: "Avg Latency", suffix: "" },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="text-center p-6 rounded-2xl bg-card/40 border border-border/30 backdrop-blur-sm"
        >
          <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
            {typeof stat.value === 'number' ? stat.value : stat.value}{stat.suffix}
          </div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
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

// Feature cards data
const infrastructureFeatures = [
  {
    icon: Server,
    title: "Premium Hardware",
    description: "Intel Xeon & AMD EPYC processors with ECC RAM and redundant power in Tier III+ datacenters.",
    highlight: "99.99% Uptime",
  },
  {
    icon: HardDrive,
    title: "NVMe Storage",
    description: "Ultra-fast NVMe SSDs with RAID — up to 7,000 MB/s reads and sub-millisecond latency.",
    highlight: "7,000 MB/s",
  },
  {
    icon: Globe,
    title: "Global Network",
    description: "12+ locations worldwide with direct peering to major ISPs for low latency everywhere.",
    highlight: "12+ Locations",
  },
  {
    icon: Shield,
    title: "DDoS Protection",
    description: "Multi-layer protection with 2.5 Tbps+ capacity. Game-specific filters and instant threat detection.",
    highlight: "2.5 Tbps+",
  },
  {
    icon: Zap,
    title: "Instant Setup",
    description: "One-click installs with automated provisioning. Your server is live in under 60 seconds.",
    highlight: "< 60 Seconds",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our engineers are available around the clock. Average response under 15 minutes.",
    highlight: "< 15 Min Response",
  },
];

// Feature Card Component
function FeatureCard({ feature, index }: { feature: typeof infrastructureFeatures[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
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

// Trust indicators
const trustBadges = [
  { icon: Lock, label: "SOC 2 Compliant" },
  { icon: Activity, label: "24/7 Monitoring" },
  { icon: Server, label: "Tier III+ DC" },
  { icon: Shield, label: "ISO 27001" },
];

export function WhyChooseSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <SectionGlow />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Server className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Built for Performance</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Reliable Hosting
            <span className="block text-primary mt-2">You Can Count On</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Premium hardware, global coverage, and proactive monitoring —
            designed for demanding workloads that need maximum uptime.
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mb-12"
        >
          {trustBadges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <badge.icon className="w-4 h-4 text-primary/70" />
              <span className="text-sm">{badge.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <Link to="/game-servers">
            <Button className="btn-glow group px-8">
              Explore Services
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/panel/tickets/new">
            <Button variant="outline" className="btn-outline px-8">
              <Headphones className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
