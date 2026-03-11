import { motion } from "framer-motion";
import { LucideIcon, Check } from "lucide-react";
import { HostingVisual } from "./visuals/HostingVisual";
import { PerformanceVisual } from "./visuals/PerformanceVisual";
import { SecurityVisual } from "./visuals/SecurityVisual";
import { ScaleVisual } from "./visuals/ScaleVisual";
import { ControlVisual } from "./visuals/ControlVisual";
import { ProfitVisual } from "./visuals/ProfitVisual";
import { InfrastructureVisual } from "./visuals/InfrastructureVisual";
import { ProcessorVisual } from "./visuals/ProcessorVisual";

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

function AnimatedIllustration({ title }: { title: string }) {
  if (/performance|speed|fast/i.test(title)) return <PerformanceVisual />;
  if (/security|protect|ssl/i.test(title)) return <SecurityVisual />;
  if (/scale|grow|demand/i.test(title)) return <ScaleVisual />;
  if (/root|access|control|manage/i.test(title)) return <ControlVisual />;
  if (/profit|revenue|business|money/i.test(title)) return <ProfitVisual />;
  if (/redundan|infrastructure|datacenter|uptime/i.test(title)) return <InfrastructureVisual />;
  if (/processor|cpu|xeon|epyc|intel|amd/i.test(title)) return <ProcessorVisual />;
  return <HostingVisual />;
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
              <AnimatedIllustration title={title} />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
