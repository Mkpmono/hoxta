import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CheckoutStep {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface CheckoutStepperProps {
  steps: CheckoutStep[];
  currentStep: number;
  className?: string;
}

export function CheckoutStepper({ steps, currentStep, className }: CheckoutStepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              {/* Step Circle */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 border-2",
                    isCompleted && "bg-primary border-primary text-primary-foreground",
                    isCurrent && "bg-primary/20 border-primary text-primary animate-pulse",
                    isUpcoming && "bg-card border-border text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium transition-colors whitespace-nowrap",
                    isCurrent && "text-primary",
                    isCompleted && "text-primary/80",
                    isUpcoming && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </motion.div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-border" />
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isCompleted ? 1 : 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="absolute inset-0 bg-primary origin-left"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const checkoutSteps: CheckoutStep[] = [
  { id: "plan", label: "Select Plan" },
  { id: "details", label: "Your Details" },
  { id: "payment", label: "Payment" },
  { id: "complete", label: "Done" },
];
