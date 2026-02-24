import { motion } from "framer-motion";
import { Check, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Product, ProductPlan, BillingCycle, getPlanPrice } from "@/data/products";

interface PlanSelectorProps {
  product: Product;
  selectedPlanId: string | null;
  selectedBillingCycle: BillingCycle;
  onPlanSelect: (planId: string) => void;
  onBillingCycleChange: (cycle: BillingCycle) => void;
  onContinue: () => void;
}

export function PlanSelector({
  product,
  selectedPlanId,
  selectedBillingCycle,
  onPlanSelect,
  onBillingCycleChange,
  onContinue,
}: PlanSelectorProps) {
  const selectedPlan = product.plans.find((p) => p.id === selectedPlanId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Billing info */}

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {product.plans.map((plan, index) => {
          const isSelected = selectedPlanId === plan.id;
          const price = getPlanPrice(plan, selectedBillingCycle);

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onPlanSelect(plan.id)}
              className={cn(
                "relative cursor-pointer rounded-2xl p-6 transition-all duration-300",
                isSelected
                  ? "glass-card border-primary/50 shadow-glow ring-2 ring-primary/30"
                  : "glass-card-hover"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  POPULAR
                </div>
              )}

              {/* Selection Indicator */}
              <div
                className={cn(
                  "absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                  isSelected
                    ? "bg-primary border-primary"
                    : "border-border bg-transparent"
                )}
              >
                {isSelected && <Check className="w-4 h-4 text-primary-foreground" />}
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                {plan.description && (
                  <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                )}
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">
                    ${price.toFixed(2)}
                  </span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                {selectedBillingCycle === "annually" && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Billed ${(price * 12).toFixed(2)}/year
                  </p>
                )}
              </div>

              <ul className="space-y-2">
                {plan.features.slice(0, 5).map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      {typeof feature.value === "boolean" ? (
                        feature.label
                      ) : (
                        <>
                          <span className="text-foreground font-medium">{feature.value}</span>{" "}
                          {feature.label}
                        </>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      {/* Continue Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onContinue}
          disabled={!selectedPlan}
          className="btn-glow px-8"
          size="lg"
        >
          Continue with {selectedPlan?.name || "Plan"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}
