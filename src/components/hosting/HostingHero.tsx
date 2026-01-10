import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState, ReactNode } from "react";

interface HostingHeroProps {
  badge?: string;
  headline: ReactNode;
  highlightedText?: string;
  description: string;
  promotion?: {
    text: string;
    discount: string;
    endDate?: Date;
  };
  primaryCTA?: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
}

export function HostingHero({
  badge,
  headline,
  highlightedText,
  description,
  promotion,
  primaryCTA = { text: "Get Started", href: "#pricing" },
  secondaryCTA = { text: "Compare Plans", href: "#comparison" },
}: HostingHeroProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!promotion?.endDate) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = promotion.endDate!.getTime();
      const diff = end - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [promotion?.endDate]);

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          {badge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">{badge}</span>
            </motion.div>
          )}

          {/* Promotion Banner */}
          {promotion && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-8"
            >
              <div className="inline-flex flex-col sm:flex-row items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border border-primary/30">
                <span className="text-lg font-bold text-primary">{promotion.discount}</span>
                <span className="text-muted-foreground">{promotion.text}</span>
                {promotion.endDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Ends in:</span>
                    <div className="flex gap-1">
                      {[
                        { value: timeLeft.days, label: "d" },
                        { value: timeLeft.hours, label: "h" },
                        { value: timeLeft.minutes, label: "m" },
                        { value: timeLeft.seconds, label: "s" },
                      ].map((item, i) => (
                        <span key={i} className="px-2 py-1 bg-background/50 rounded text-primary font-mono">
                          {String(item.value).padStart(2, "0")}{item.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
          >
            {headline}
            {highlightedText && <>{" "}<span className="text-gradient">{highlightedText}</span></>}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            {description}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to={primaryCTA.href} className="btn-glow px-8 py-4 text-lg font-semibold inline-flex items-center gap-2 group">
              {primaryCTA.text}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to={secondaryCTA.href} className="btn-outline px-8 py-4 text-lg font-medium">
              {secondaryCTA.text}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
