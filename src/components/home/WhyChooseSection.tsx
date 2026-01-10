import { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Headphones, Cpu, HardDrive, Wifi, Shield, Zap, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Headphones,
    title: "Customer Support",
    description: "Răspuns mediu sub 15 minute. Ingineri 24/7, prin ticket & chat, cu ghidare pas cu pas în troubleshooting.",
    stats: "Media pe ultimele 30 zile",
    showTicketCTA: true,
  },
  {
    icon: Cpu,
    title: "Enterprise Hardware",
    description: "Experience superior performance with our enterprise-grade server and network hardware ensuring maximum reliability and uptime.",
    stats: "99.9% Monthly uptime",
    bars: true,
  },
  {
    icon: HardDrive,
    title: "NVMe Storage",
    description: "Lightning-fast storage with NVMe SSDs delivering exceptional read/write speeds and low latency.",
    storageUI: true,
  },
  {
    icon: Wifi,
    title: "Fast Network",
    description: "Enjoy lightning-fast speeds with our 10 Gbps network infrastructure. Say goodbye to slow connections and enjoy seamless remote performance.",
    networkUI: true,
  },
  {
    icon: Shield,
    title: "DDoS Protection",
    description: "Advanced scrubbing 24/7 rules & game proofing. Multi-layer protection keeps your services online.",
    ddosUI: true,
  },
  {
    icon: Zap,
    title: "Instant Setup",
    description: "Get your server deployed in under 60 seconds. Automated provisioning with pre-configured templates for all popular games and services.",
    instantUI: true,
  },
];

interface AnimatedBarProps {
  height: number;
  delay: number;
}

function AnimatedBar({ height, delay }: AnimatedBarProps) {
  return (
    <motion.div
      className="w-2 bg-primary/40 rounded-t"
      initial={{ height: 0 }}
      whileInView={{ height: `${height}%` }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    />
  );
}

function StorageCard() {
  const [values, setValues] = useState({ read: 0, write: 0, iops: 0, latency: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setValues({ read: 7200, write: 4850, iops: 210000, latency: 0.1 });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mt-4 p-3 rounded-lg bg-card/50 border border-border/30">
      <div className="flex items-center gap-4 mb-3">
        <div className="text-xs text-muted-foreground">NVMe</div>
        <div className="text-xs text-muted-foreground">PCIe 4.0 x4</div>
        <div className="ml-auto flex items-center gap-1">
          <span className="text-xs text-muted-foreground">Health</span>
          <span className="text-xs text-green-400">99%</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">40°C</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Read</div>
          <div className="text-lg font-semibold text-primary">{values.read.toLocaleString()} <span className="text-xs">MB/s</span></div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Write</div>
          <div className="text-lg font-semibold text-foreground">{values.write.toLocaleString()} <span className="text-xs">MB/s</span></div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-16 h-16 relative">
            <svg className="w-full h-full -rotate-90">
              <circle cx="32" cy="32" r="28" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
              <motion.circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="4"
                strokeDasharray="176"
                initial={{ strokeDashoffset: 176 }}
                whileInView={{ strokeDashoffset: 35 }}
                transition={{ duration: 1, delay: 0.3 }}
                viewport={{ once: true }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium">80%</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">512GB<br/>/ 1TB SSD</div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">IOPS</span>
            <span className="text-foreground">{values.iops.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Latency</span>
            <span className="text-foreground">{values.latency}ms</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              whileInView={{ width: "67%" }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
            />
          </div>
          <div className="text-xs text-primary">67% used</div>
        </div>
      </div>
    </div>
  );
}

function NetworkCard() {
  return (
    <div className="mt-4">
      <div className="text-4xl font-bold text-foreground mb-3">4 Gbps</div>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-20">Downloads</span>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              whileInView={{ width: "85%" }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            />
          </div>
          <span className="text-xs text-foreground">4085 Mbps</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-20">Uploads</span>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary/60"
              initial={{ width: 0 }}
              whileInView={{ width: "68%" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            />
          </div>
          <span className="text-xs text-foreground">4078 Mbps</span>
        </div>
      </div>
    </div>
  );
}

function DDoSCard() {
  return (
    <div className="mt-4 flex items-center justify-center">
      <div className="relative">
        <motion.div
          className="w-20 h-20 rounded-full border-2 border-primary/30 flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Shield className="w-10 h-10 text-primary" />
        </motion.div>
        {/* Pulse rings */}
        <motion.div
          className="absolute inset-0 rounded-full border border-primary/20"
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border border-primary/20"
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      </div>
      <div className="ml-4 text-sm text-primary hover:underline cursor-pointer">
        Always-on scrubbing 24/7
      </div>
    </div>
  );
}

function InstantSetupCard() {
  const [progress, setProgress] = useState(0);
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setShowCheck(true), 500);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">Server Deployment</span>
        <motion.span
          className="text-sm font-medium text-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {showCheck ? "✓ Complete" : `${progress}%`}
        </motion.span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          viewport={{ once: true }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Auto-configured</span>
        <span className="text-primary font-medium">&lt; 60 seconds</span>
      </div>
    </div>
  );
}

function NetworkBackground() {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Animated nodes */}
      {!prefersReducedMotion && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </>
      )}
      
      {/* Glow spots */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/3 rounded-full blur-[80px]" />
    </div>
  );
}

export function WhyChooseSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <NetworkBackground />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="text-sm font-medium text-primary mb-2 block">FEATURES</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Why choose Hoxta?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Performanță enterprise, latență mică și securitate by design. Cardurile de mai jos sunt gata de folosit ca secțiuni în pagina ta.
          </p>
        </motion.div>

        {/* Feature Cards - Symmetric 3x2 Grid */}
        <div 
          ref={containerRef} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -6, 
                transition: { duration: 0.2 } 
              }}
              className="glass-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_8px_40px_rgba(25,195,255,0.12)]"
            >
              <div className="flex items-start gap-4 mb-4">
                <motion.div 
                  className="p-2.5 rounded-xl bg-primary/10 border border-primary/20"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <feature.icon className="w-5 h-5 text-primary" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>

              {feature.bars && (
                <div className="mt-4">
                  <div className="text-xs text-muted-foreground mb-2">{feature.stats}</div>
                  <div className="flex items-end gap-1 h-20">
                    {[60, 80, 45, 90, 75, 85, 70, 95, 65, 88, 72, 92].map((h, i) => (
                      <AnimatedBar key={i} height={h} delay={i * 0.05} />
                    ))}
                  </div>
                </div>
              )}

              {feature.storageUI && <StorageCard />}
              {feature.networkUI && <NetworkCard />}
              {feature.ddosUI && <DDoSCard />}
              {feature.instantUI && <InstantSetupCard />}

              {feature.showTicketCTA && (
                <div className="mt-4">
                  <Link to="/panel/tickets/new">
                    <Button 
                      className="w-full btn-glow group"
                      size="sm"
                    >
                      <MessageSquare className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      Deschide un ticket
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
