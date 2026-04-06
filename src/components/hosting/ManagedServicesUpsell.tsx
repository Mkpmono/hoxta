import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, HardDrive, Activity, Headphones, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

export function ManagedServicesUpsell() {
  const { t } = useTranslation();

  const services = [
    { icon: Headphones, title: t("hosting.managedServices.managedSupport"), description: t("hosting.managedServices.managedSupportDesc"), features: ["Server optimization", "Security patching", "Performance tuning"] },
    { icon: HardDrive, title: t("hosting.managedServices.backupSolutions"), description: t("hosting.managedServices.backupSolutionsDesc"), features: ["Daily snapshots", "Off-site storage", "1-click restore"] },
    { icon: Activity, title: t("hosting.managedServices.monitoring"), description: t("hosting.managedServices.monitoringDesc"), features: ["Real-time metrics", "Uptime monitoring", "Instant alerts"] },
    { icon: Shield, title: t("hosting.managedServices.securityAddons"), description: t("hosting.managedServices.securityAddonsDesc"), features: ["Firewall management", "Malware scanning", "DDoS mitigation"] },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <span className="text-sm font-medium">{t("hosting.managedServices.badge")}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("hosting.managedServices.title")} <span className="text-gradient">{t("hosting.managedServices.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("hosting.managedServices.subtitle")}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div key={service.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6 hover:border-primary/30 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <service.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="w-3 h-3 text-primary" />{feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }} className="text-center mt-8">
          <Link to="/contact" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors">
            {t("hosting.managedServices.contactText")} <span className="text-lg">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
