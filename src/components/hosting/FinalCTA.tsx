import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Clock, Headphones } from "lucide-react";

interface FinalCTAProps {
  title?: string;
  subtitle?: string;
  primaryCTA?: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
  guarantees?: { icon: React.ReactNode; text: string }[];
}

const defaultGuarantees = [
  { icon: <Shield className="w-4 h-4" />, text: "30-Day Money Back" },
  { icon: <Clock className="w-4 h-4" />, text: "99.9% Uptime SLA" },
  { icon: <Headphones className="w-4 h-4" />, text: "24/7 Expert Support" },
];

// FIX: Added forwardRef to prevent React warning about refs on function components
export const FinalCTA = forwardRef<HTMLElement, FinalCTAProps>(function FinalCTA({
  title = "Ready to Get Started?",
  subtitle = "Join thousands of happy customers who trust Hoxta for their hosting. See the difference yourself.",
  primaryCTA = { text: "Get Started Now", href: "#pricing" },
  secondaryCTA = { text: "Contact Sales", href: "/contact" },
  guarantees = defaultGuarantees,
}, ref) {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div
          className="relative overflow-hidden rounded-3xl"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />
          <div className="absolute inset-0 bg-card/80 backdrop-blur-sm" />
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl" />

          <div className="relative px-8 py-16 md:py-20 text-center">
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6"
            >
              {title}
            </h2>

            <p
              className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
            >
              {subtitle}
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
            >
              <Link
                to={primaryCTA.href}
                className="btn-glow px-8 py-4 text-lg font-semibold inline-flex items-center gap-2 group"
              >
                {primaryCTA.text}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to={secondaryCTA.href} className="btn-outline px-8 py-4 text-lg font-medium">
                {secondaryCTA.text}
              </Link>
            </div>

            {/* Guarantees */}
            <div
              className="flex flex-wrap items-center justify-center gap-6"
            >
              {guarantees.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="text-primary">{item.icon}</div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
