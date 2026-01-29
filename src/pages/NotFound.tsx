import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { 
  Home, 
  Gamepad2, 
  Globe, 
  HardDrive, 
  Headphones, 
  Activity,
  ArrowRight,
  ExternalLink,
  Server
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Quick navigation links
const quickLinks = [
  { label: "Game Servers", href: "/game-servers", icon: Gamepad2 },
  { label: "VPS Hosting", href: "/vps", icon: Server },
  { label: "Web Hosting", href: "/web-hosting", icon: Globe },
  { label: "Dedicated Servers", href: "/dedicated", icon: HardDrive },
  { label: "Server Status", href: "/status", icon: Activity },
];

// Static background - NO animated network dots/lines
function StaticBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-destructive/5 rounded-full blur-[120px]" />
    </div>
  );
}

const NotFound = () => {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center overflow-hidden">
      {/* Static background - no network dots/lines */}
      <StaticBackground />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* 404 Badge */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/30 text-destructive">
              <Activity className="w-4 h-4" />
              <span className="text-sm font-medium">Connection Lost</span>
            </div>
          </motion.div>

          {/* 404 Number */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6"
          >
            <h1 className="text-8xl md:text-9xl font-bold text-primary/20 select-none relative">
              404
              <span className="absolute inset-0 text-primary blur-lg opacity-30">404</span>
            </h1>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Route Not Found
            </h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
              The server endpoint you requested doesn't exist or has been moved. 
              Check the URL or navigate back to a known location.
            </p>
            <p className="text-sm text-muted-foreground/60 mt-2 font-mono">
              Requested: {location.pathname}
            </p>
          </motion.div>

          {/* Primary CTAs */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link to="/">
              <Button className="btn-glow group px-8 py-6 text-lg">
                <Home className="w-5 h-5 mr-2" />
                Back to Home
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/panel/tickets/new">
              <Button variant="outline" className="btn-outline px-8 py-6 text-lg">
                <Headphones className="w-5 h-5 mr-2" />
                Contact Support
              </Button>
            </Link>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card p-6 rounded-2xl border border-border/30"
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
              Quick Navigation
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {quickLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
                >
                  <Link
                    to={link.href}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card/50 border border-border/30 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 group"
                  >
                    <link.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Status Link */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            animate={prefersReducedMotion ? {} : { opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8"
          >
            <Link 
              to="/status" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Activity className="w-4 h-4" />
              Check server status
              <ExternalLink className="w-3 h-3" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
