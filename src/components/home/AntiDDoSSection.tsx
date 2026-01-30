import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Check, Shield, Zap, Activity } from "lucide-react";

export function AntiDDoSSection() {
  const { t } = useTranslation();

  const features = [
    t("sections.antiDdosCapacity"),
    t("sections.antiDdosFiltering"),
    t("sections.antiDdosAlerts"),
  ];

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden border border-primary/10 p-8 md:p-12"
          style={{
            background: `
              radial-gradient(900px 420px at 90% 0%, rgba(255,255,255,0.06), transparent 60%),
              linear-gradient(135deg, hsl(210 60% 7%) 0%, hsl(210 50% 14%) 100%)
            `,
            boxShadow: '0 24px 70px rgba(0,0,0,0.45)',
          }}
        >
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Static illustration (no SVG/canvas/anim) */}
            <div className="relative w-full max-w-[420px] mx-auto">
              <div className="relative rounded-3xl border border-border/40 bg-card/20 backdrop-blur-sm p-8 overflow-hidden">
                <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-primary/10 blur-[90px]" />
                <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-primary/10 blur-[100px]" />

                <div className="relative grid gap-5">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">{t("sections.antiDdos")}</div>
                      <div className="text-lg font-semibold text-foreground">Always-on mitigation</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: Zap, label: "<10s" },
                      { icon: Activity, label: "24/7" },
                      { icon: Shield, label: "L3–L7" },
                    ].map((item, idx) => (
                      <div key={idx} className="rounded-2xl border border-border/40 bg-background/20 p-4 text-center">
                        <item.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                        <div className="text-sm font-semibold text-foreground">{item.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-border/40 bg-background/20 p-4">
                    <div className="text-xs text-muted-foreground mb-2">Live status</div>
                    <div className="h-2 rounded-full bg-border/50 overflow-hidden">
                      <div className="h-full w-2/3 bg-primary/40" />
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">All systems nominal</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t("sections.antiDdos")}
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {t("sections.antiDdosDesc")}
              </p>

              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <div className="p-1 rounded-full bg-primary/20">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
