import { motion } from "framer-motion";
import { Gamepad2, Globe, Code2, Phone, Building2, ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";

export function UseCasesGrid() {
  const { t } = useTranslation();
  const useCases = [
    { icon: <Gamepad2 className="w-6 h-6" />, key: "games" },
    { icon: <Globe className="w-6 h-6" />, key: "web" },
    { icon: <Code2 className="w-6 h-6" />, key: "api" },
    { icon: <Phone className="w-6 h-6" />, key: "voip" },
    { icon: <Building2 className="w-6 h-6" />, key: "vpn" },
    { icon: <ShoppingCart className="w-6 h-6" />, key: "ecommerce" },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("ddos.useCases.title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("ddos.useCases.subtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 group hover:border-primary/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                {useCase.icon}
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-4">
                {t(`ddos.useCases.items.${useCase.key}.title`)}
              </h3>

              <div className="space-y-3">
                <div>
                  <span className="text-xs font-medium text-destructive uppercase tracking-wide">
                    {t("ddos.useCases.pain")}
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t(`ddos.useCases.items.${useCase.key}.pain`)}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-primary uppercase tracking-wide">
                    {t("ddos.useCases.solution")}
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t(`ddos.useCases.items.${useCase.key}.solution`)}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-green-500 uppercase tracking-wide">
                    {t("ddos.useCases.outcome")}
                  </span>
                  <p className="text-sm text-foreground mt-1 font-medium">
                    {t(`ddos.useCases.items.${useCase.key}.outcome`)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
