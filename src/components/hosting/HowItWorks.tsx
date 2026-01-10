import { motion } from "framer-motion";
import { MousePointer, CreditCard, Rocket, Settings } from "lucide-react";

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

const defaultSteps: Step[] = [
  {
    icon: <MousePointer className="w-6 h-6" />,
    title: "Choose Your Plan",
    description: "Select the perfect hosting plan that matches your requirements and budget.",
  },
  {
    icon: <CreditCard className="w-6 h-6" />,
    title: "Instant Checkout",
    description: "Complete your order securely with our streamlined payment process.",
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: "Deploy & Configure",
    description: "Your hosting is activated instantly with automatic setup and configuration.",
  },
  {
    icon: <Settings className="w-6 h-6" />,
    title: "Manage & Scale",
    description: "Use our intuitive control panel to manage and scale your services anytime.",
  },
];

export function HowItWorks({
  title = "Get Started in Minutes",
  subtitle = "From signup to deployment, we've made the process simple and fast.",
  steps = defaultSteps,
}: HowItWorksProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative text-center"
              >
                {/* Step Number */}
                <div className="relative z-10 w-12 h-12 mx-auto mb-6 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-primary font-bold">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-card/50 border border-border/50 flex items-center justify-center text-primary">
                  {step.icon}
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
