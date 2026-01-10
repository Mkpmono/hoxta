import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";
import { HeroConsole } from "./HeroConsole";
import { FloatingIcons } from "./FloatingIcons";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center py-20 overflow-hidden">
      <FloatingIcons />
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 rounded-lg bg-primary/20">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary">Premium Infrastructure</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Premium{" "}
              <span className="text-gradient">Game, Web, VPS</span>
              <br />
              & Server Hosting
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              High-performance infrastructure for gamers, developers, and businesses. 
              From Minecraft & FiveM to custom VPS & enterprise servers — power your 
              next project with us.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link to="/pricing" className="btn-glow flex items-center gap-2">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/pricing" className="btn-outline flex items-center gap-2">
                <span>Compare Plans</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-border/50">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">99.9%</div>
                <div className="text-xs text-muted-foreground">Uptime SLA</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">400+</div>
                <div className="text-xs text-muted-foreground">Gbps DDoS</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">24/7</div>
                <div className="text-xs text-muted-foreground">Support</div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Console */}
          <div className="relative">
            <HeroConsole />
          </div>
        </div>
      </div>
    </section>
  );
}
