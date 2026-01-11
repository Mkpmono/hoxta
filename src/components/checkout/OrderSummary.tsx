import { motion } from "framer-motion";
import { Shield, Clock, CheckCircle } from "lucide-react";
import {
  ProductPlan,
  BillingCycle,
  getPlanPrice,
  getBillingCycleLabel,
  calculateOrderTotal,
} from "@/data/products";

interface OrderSummaryProps {
  productName: string;
  plan: ProductPlan;
  billingCycle: BillingCycle;
  taxRate?: number;
  showGuarantees?: boolean;
}

export function OrderSummary({
  productName,
  plan,
  billingCycle,
  taxRate = 0,
  showGuarantees = true,
}: OrderSummaryProps) {
  const pricePerMonth = getPlanPrice(plan, billingCycle);
  const { subtotal, tax, total } = calculateOrderTotal(plan, billingCycle, taxRate);
  const cycleLabel = getBillingCycleLabel(billingCycle);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 sticky top-24"
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">Order Summary</h3>

      {/* Product Info */}
      <div className="space-y-3 pb-4 border-b border-border/50">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Product</span>
          <span className="text-foreground font-medium">{productName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Plan</span>
          <span className="text-foreground font-medium">{plan.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Billing Cycle</span>
          <span className="text-foreground font-medium">{cycleLabel}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Price per month</span>
          <span className="text-foreground font-medium">${pricePerMonth.toFixed(2)}/mo</span>
        </div>
      </div>

      {/* Features Preview */}
      <div className="py-4 border-b border-border/50">
        <p className="text-sm text-muted-foreground mb-2">Plan includes:</p>
        <ul className="space-y-1">
          {plan.features.slice(0, 4).map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-3.5 h-3.5 text-primary" />
              <span>
                {typeof feature.value === "boolean"
                  ? feature.label
                  : `${feature.value} ${feature.label}`}
              </span>
            </li>
          ))}
          {plan.features.length > 4 && (
            <li className="text-xs text-muted-foreground pl-5">
              +{plan.features.length - 4} more features
            </li>
          )}
        </ul>
      </div>

      {/* Pricing Breakdown */}
      <div className="py-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-foreground">${subtotal.toFixed(2)}</span>
        </div>
        {tax > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span className="text-foreground">${tax.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between pt-2 border-t border-border/30">
          <span className="text-foreground font-semibold">Total Due Today</span>
          <span className="text-xl font-bold text-primary">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Guarantees */}
      {showGuarantees && (
        <div className="pt-4 border-t border-border/50 space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-green-500" />
            <span>30-day money-back guarantee</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span>Instant activation after payment</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
