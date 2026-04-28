import { motion } from "framer-motion";
import { MapPin, Zap, Globe, Shield, Server, Cpu, Network, RefreshCw, Activity } from "lucide-react";
import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useLiveInfraStats } from "@/hooks/useLiveInfraStats";

const Globe3D = lazy(() => import("./Globe3D").then(m => ({ default: m.Globe3D })));

interface GlobalInfrastructureProps {
  title?: string;
  subtitle?: string;
}

export function GlobalInfrastructure({ title, subtitle }: GlobalInfrastructureProps) {
  const { t } = useTranslation();
  const live = useLiveInfraStats();

  const resolvedTitle = title || t("hosting.globalInfra.title");
  const resolvedSubtitle = subtitle || t("hosting.globalInfra.subtitle");

  const stats = [
    { icon: MapPin, value: "UK · DE", label: "Locations" },
    {
      icon: Activity,
      value: live.loading ? "—" : `${live.monitorsCount}`,
      label: "Live monitors",
    },
    {
      icon: Globe,
      value: live.loading ? "—" : `${live.uptimePercent}%`,
      label: "30-day uptime",
    },
    {
      icon: Zap,
      value: live.loading || !live.avgResponseMs ? "—" : `${live.avgResponseMs}ms`,
      label: "Avg response",
    },
  ];

  const networkHighlights = [
    { icon: Network, text: t("hosting.globalInfra.anycast") },
    { icon: Cpu, text: t("hosting.globalInfra.nvmeNodes") },
    { icon: RefreshCw, text: t("hosting.globalInfra.failover") },
    { icon: Server, text: t("hosting.globalInfra.tierIII") },
    { icon: Activity, text: t("hosting.globalInfra.instantProvisioning") },
    { icon: Zap, text: t("hosting.globalInfra.lowLatency") },
    { icon: Shield, text: t("hosting.globalInfra.builtInDdos") },
    { icon: Globe, text: t("hosting.globalInfra.scalable") },
  ];

  return (
    <section className="py-14 md:py-20 bg-gradient-to-b from-card/30 via-transparent to-card/30 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{resolvedTitle}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{resolvedSubtitle}</p>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12">
          <div className="glass-card p-1.5 md:p-3 overflow-hidden bg-background/80 max-w-5xl mx-auto">
            <Suspense fallback={<div className="w-full aspect-[5/2] flex items-center justify-center text-muted-foreground">Loading globe...</div>}>
              <Globe3D />
            </Suspense>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 text-center">
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">{t("hosting.globalInfra.capabilities")}</h3>
            <div className="grid grid-cols-2 gap-3">
              {networkHighlights.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <item.icon className="w-4 h-4 text-primary shrink-0" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
