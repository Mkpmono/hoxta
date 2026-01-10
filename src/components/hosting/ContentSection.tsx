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
            initial={{ opacity: 0, x: reverse ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
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
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
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
            initial={{ opacity: 0, x: reverse ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
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
              <div className="relative aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent rounded-2xl" />
                <div className="absolute inset-4 glass-card rounded-xl flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    {Icon && <Icon className="w-12 h-12 text-primary" />}
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-8 right-8 w-16 h-16 rounded-lg bg-primary/10 animate-pulse" />
                <div className="absolute bottom-12 left-8 w-12 h-12 rounded-full bg-primary/5 animate-pulse delay-500" />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
