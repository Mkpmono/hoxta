import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Headphones, Cpu, HardDrive, Wifi, Shield, Clock } from "lucide-react";

const features = [
  {
    icon: Headphones,
    title: "Customer Support",
    description: "Răspuns mediu sub 15 minute. Ingineri 24/7, prin ticket & chat, cu ghidare pas cu pas în troubleshooting.",
    stats: "Media pe ultimele 30 zile",
    link: "Deschide un ticket",
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
    description: "Advanced scrubbing 24/7 rules & game proofing.",
    ddosUI: true,
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
      <motion.div
        className="w-16 h-16 rounded-full border-2 border-primary/30 flex items-center justify-center"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Shield className="w-8 h-8 text-primary" />
      </motion.div>
      <div className="ml-4 text-sm text-primary hover:underline cursor-pointer">
        Always-on scrubbing 24/7, rules & more!
      </div>
    </div>
  );
}

export function WhyChooseSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6">
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

        {/* Feature Cards */}
        <div ref={containerRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card-hover p-6"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
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

              {feature.link && (
                <a href="/contact" className="inline-block mt-4 text-sm text-primary hover:underline">
                  {feature.link}
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
