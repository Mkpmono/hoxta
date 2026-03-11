import { motion } from "framer-motion";
import { LucideIcon, Check } from "lucide-react";

interface ContentSectionProps {
  title: string;
  description: string;
  points?: string[];
  image?: string;
  imageAlt?: string;
  icon?: LucideIcon;
  reverse?: boolean;
  children?: React.ReactNode;
}

/* ── Animated illustration when no image is provided ── */
function AnimatedIllustration({ icon: Icon, title }: { icon?: LucideIcon; title: string }) {
  const isPerformance = /performance|speed|fast/i.test(title);
  const isSecurity = /security|protect|ssl/i.test(title);

  if (isPerformance) return <PerformanceVisual />;
  if (isSecurity) return <SecurityVisual />;
  return <HostingVisual />;
}

/* ── Hosting / "What is" visual ── */
function HostingVisual() {
  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border/40 bg-card/60 backdrop-blur-sm p-6">
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl" />

      <div className="relative rounded-xl border border-border/50 bg-background/80 overflow-hidden h-full flex flex-col">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-card/50">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
          <span className="text-xs text-muted-foreground ml-2 font-mono">hoxta-server</span>
        </div>
        <div className="flex-1 p-4 font-mono text-xs space-y-2">
          {[
            { delay: 0.2, content: <><span className="text-primary">$</span> deploying website...</> },
            { delay: 0.5, content: <><span className="text-green-400">✓</span> <span className="text-muted-foreground">DNS configured</span></> },
            { delay: 0.8, content: <><span className="text-green-400">✓</span> <span className="text-muted-foreground">SSL certificate issued</span></> },
            { delay: 1.1, content: <><span className="text-green-400">✓</span> <span className="text-muted-foreground">Files uploaded (2.4 MB)</span></> },
            { delay: 1.4, content: <><span className="text-green-400">✓</span> <span className="text-muted-foreground">Database connected</span></> },
            { delay: 1.7, content: <><span className="text-primary">→</span> <span className="text-foreground font-semibold">Site is live!</span> <span className="text-green-400">🟢</span></> },
          ].map((line, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: line.delay }} className="text-muted-foreground">
              {line.content}
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 2 }}
        className="absolute bottom-4 right-4 glass-card px-3 py-2 rounded-lg flex items-center gap-2"
      >
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-xs font-medium text-foreground">Online</span>
      </motion.div>
    </div>
  );
}

/* ── Performance visual ── */
function PerformanceVisual() {
  const bars = [85, 92, 78, 95, 88, 96, 91];

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border/40 bg-card/60 backdrop-blur-sm p-6">
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl" />

      <div className="relative h-full flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "TTFB", value: "42ms", color: "text-green-400" },
            { label: "LCP", value: "0.8s", color: "text-green-400" },
            { label: "Score", value: "98/100", color: "text-primary" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.15 }}
              className="rounded-lg border border-border/40 bg-background/60 p-3 text-center"
            >
              <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="flex-1 rounded-xl border border-border/40 bg-background/60 p-4 flex items-end gap-2">
          {bars.map((height, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t-md bg-gradient-to-t from-primary/80 to-primary/30"
              initial={{ height: 0 }}
              whileInView={{ height: `${height}%` }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: "easeOut" }}
            />
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Server Response Time (7 days)</span>
          <span className="text-green-400 font-medium">↓ 40% faster</span>
        </div>
      </div>
    </div>
  );
}

/* ── Security visual ── */
function SecurityVisual() {
  const checks = [
    { label: "SSL Certificate", status: "Active" },
    { label: "DDoS Shield", status: "Protected" },
    { label: "Malware Scan", status: "Clean" },
    { label: "Firewall", status: "Enabled" },
    { label: "Backup", status: "Today 03:00" },
  ];

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border/40 bg-card/60 backdrop-blur-sm p-6">
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl" />

      <div className="relative h-full flex flex-col gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/5 p-4"
        >
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">All Systems Secure</div>
            <div className="text-xs text-green-400">5/5 checks passed</div>
          </div>
        </motion.div>

        <div className="flex-1 rounded-xl border border-border/40 bg-background/60 p-4 space-y-3 overflow-hidden">
          {checks.map((check, i) => (
            <motion.div
              key={check.label}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.12 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-green-400" />
                </div>
                <span className="text-sm text-foreground">{check.label}</span>
              </div>
              <span className="text-xs text-green-400 font-medium">{check.status}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ContentSection({
  title,
  description,
  points,
  image,
  imageAlt,
  icon: Icon,
  reverse = false,
  children,
}: ContentSectionProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className={`flex flex-col ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-12 lg:gap-20`}>
          {/* Content */}
          <motion.div
            initial={{ opacity: 1, x: reverse ? 20 : -20 }}
            whileInView={{ x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 max-w-xl"
          >
            {Icon && (
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Icon className="w-6 h-6 text-primary" />
              </div>
            )}
            
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">{title}</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">{description}</p>
            
            {points && points.length > 0 && (
              <ul className="space-y-3">
                {points.map((point, index) => (
                  <motion.li
                    key={index}
                    initial={{ x: -10 }}
                    whileInView={{ x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="p-1 rounded-full bg-primary/10 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{point}</span>
                  </motion.li>
                ))}
              </ul>
            )}
            
            {children}
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 1, x: reverse ? -20 : 20 }}
            whileInView={{ x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 w-full max-w-lg"
          >
            {image ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl blur-2xl" />
                <img
                  src={image}
                  alt={imageAlt || title}
                  className="relative w-full rounded-2xl border border-border/50 shadow-2xl"
                />
              </div>
            ) : (
              <AnimatedIllustration icon={Icon} title={title} />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}