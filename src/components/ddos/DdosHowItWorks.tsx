import { motion } from "framer-motion";
import { Search, Filter, Trash2, Workflow, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: <Search className="w-6 h-6" />,
    title: "Detection",
    description: "Traffic analyzed in real-time using ML-based anomaly detection.",
  },
  {
    icon: <Filter className="w-6 h-6" />,
    title: "Classification",
    description: "Attack vectors identified and categorized within milliseconds.",
  },
  {
    icon: <Trash2 className="w-6 h-6" />,
    title: "Scrubbing",
    description: "Malicious traffic filtered at edge POPs before reaching origin.",
  },
  {
    icon: <Workflow className="w-6 h-6" />,
    title: "Clean Pipe",
    description: "Only legitimate traffic forwarded to your infrastructure.",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Reporting",
    description: "Full attack analytics and insights delivered in real-time.",
  },
];

export function DdosHowItWorks() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our 5-stage mitigation pipeline protects your infrastructure from Layer 3/4/7 attacks.
          </p>
        </motion.div>

        {/* Desktop: Horizontal Timeline */}
        <div className="hidden md:block relative max-w-5xl mx-auto">
          {/* Connection line */}
          <div className="absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="grid grid-cols-5 gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative text-center"
              >
                {/* Step number */}
                <div className="relative z-10 w-8 h-8 mx-auto mb-4 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary text-sm font-bold">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-card/80 border border-border/50 flex items-center justify-center text-primary">
                  {step.icon}
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile: Vertical Timeline */}
        <div className="md:hidden space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-4"
            >
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold">
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 flex-1 bg-primary/20 mt-2" />
                )}
              </div>
              <div className="flex-1 pb-6">
                <div className="w-12 h-12 rounded-xl bg-card/80 border border-border/50 flex items-center justify-center text-primary mb-3">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
