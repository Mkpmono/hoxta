import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Home, Gamepad2, Globe, HardDrive, Headphones, Activity, ArrowRight, ExternalLink, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

function StaticBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-destructive/5 rounded-full blur-[120px]" />
    </div>
  );
}

const NotFound = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  const quickLinks = [
    { label: t("pages.notFound.gameServers"), href: "/game-servers", icon: Gamepad2 },
    { label: t("pages.notFound.vpsHosting"), href: "/vps", icon: Server },
    { label: t("pages.notFound.webHosting"), href: "/web-hosting", icon: Globe },
    { label: t("pages.notFound.dedicatedServers"), href: "/dedicated", icon: HardDrive },
    { label: t("pages.notFound.serverStatus"), href: "/status", icon: Activity },
  ];

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center overflow-hidden">
      <StaticBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8 }} animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/30 text-destructive">
              <Activity className="w-4 h-4" />
              <span className="text-sm font-medium">{t("pages.notFound.connectionLost")}</span>
            </div>
          </motion.div>

          <motion.div initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }} animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="mb-6">
            <h1 className="text-8xl md:text-9xl font-bold text-primary/20 select-none relative">
              404
              <span className="absolute inset-0 text-primary blur-lg opacity-30">404</span>
            </h1>
          </motion.div>

          <motion.div initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }} animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{t("pages.notFound.title")}</h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">{t("pages.notFound.subtitle")}</p>
            <p className="text-sm text-muted-foreground/60 mt-2 font-mono">{t("pages.notFound.requested")}: {location.pathname}</p>
          </motion.div>

          <motion.div initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }} animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/"><Button className="btn-glow group px-8 py-6 text-lg"><Home className="w-5 h-5 mr-2" />{t("pages.notFound.goHome")}<ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" /></Button></Link>
            <Link to="/contact"><Button variant="outline" className="btn-outline px-8 py-6 text-lg"><Headphones className="w-5 h-5 mr-2" />{t("pages.notFound.contactSupport")}</Button></Link>
          </motion.div>

          <motion.div initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }} animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="glass-card p-6 rounded-2xl border border-border/30">
            <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">{t("pages.notFound.quickNav")}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {quickLinks.map((link, index) => (
                <motion.div key={link.href} initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }} animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}>
                  <Link to={link.href} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card/50 border border-border/30 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 group">
                    <link.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{link.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={prefersReducedMotion ? {} : { opacity: 0 }} animate={prefersReducedMotion ? {} : { opacity: 1 }} transition={{ duration: 0.6, delay: 0.8 }} className="mt-8">
            <Link to="/status" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Activity className="w-4 h-4" /> {t("pages.notFound.checkStatus")} <ExternalLink className="w-3 h-3" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
