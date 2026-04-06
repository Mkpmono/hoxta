import { motion } from "framer-motion";
import { MousePointer, CreditCard, Rocket, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface HowItWorksProps {
  title?: string;
  subtitle?: string;
  steps?: Step[];
}

export function HowItWorks({ title, subtitle, steps }: HowItWorksProps) {
  const { t } = useTranslation();

  const resolvedTitle = title || t("hosting.howItWorks.title");
  const resolvedSubtitle = subtitle || t("hosting.howItWorks.subtitle");
  const resolvedSteps = steps || [
    { icon: <MousePointer className="w-6 h-6" />, title: t("hosting.howItWorks.step1"), description: t("hosting.howItWorks.step1Desc") },
    { icon: <CreditCard className="w-6 h-6" />, title: t("hosting.howItWorks.step2"), description: t("hosting.howItWorks.step2Desc") },
    { icon: <Rocket className="w-6 h-6" />, title: t("hosting.howItWorks.step3"), description: t("hosting.howItWorks.step3Desc") },
    { icon: <Settings className="w-6 h-6" />, title: t("hosting.howItWorks.step4"), description: t("hosting.howItWorks.step4Desc") },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{resolvedTitle}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{resolvedSubtitle}</p>
        </div>
        <div className="relative max-w-5xl mx-auto">
          <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="grid md:grid-cols-4 gap-8">
            {resolvedSteps.map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="relative z-10 w-12 h-12 mx-auto mb-6 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-primary font-bold">{index + 1}</div>
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-card/50 border border-border/50 flex items-center justify-center text-primary">{step.icon}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
