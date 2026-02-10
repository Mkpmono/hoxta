import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export interface PlanFeature {
  label: string;
  value: string | boolean;
}

export interface Plan {
  id?: string; // Plan ID for order routing
  productSlug?: string; // Product slug for order routing
  name: string;
  description?: string;
  monthlyPrice: number;
  yearlyPrice: number;
  popular?: boolean;
  features: PlanFeature[];
  cta?: {
    text: string;
    href: string;
  };
}

interface PricingPlansProps {
  title?: string;
  subtitle?: string;
  plans: Plan[];
  productSlug?: string; // Default product slug if not set on individual plans
  category?: string; // Category for checkout URL (e.g., "games")
}

function generateCheckoutUrl(
  plan: Plan, 
  productSlug: string | undefined, 
  isYearly: boolean,
  category?: string
): string {
  const slug = plan.productSlug || productSlug;
  const billing = isYearly ? "annually" : "monthly";
  
  // If plan has a custom CTA href, update the billing param
  if (plan.cta?.href) {
    // Update billing in the existing URL
    const url = new URL(plan.cta.href, window.location.origin);
    url.searchParams.set("billing", billing);
    return url.pathname + url.search;
  }
  
  // Route directly to checkout when we have all params
  if (slug && plan.id) {
    const categoryParam = category ? `category=${category}&` : "";
    return `/checkout?${categoryParam}product=${slug}&plan=${plan.id}&billing=${billing}`;
  }
  
  // Fallback to order page for plan selection
  if (slug) {
    return `/order?product=${slug}&billing=${billing}`;
  }
  
  return "/contact";
}

export function PricingPlans({
  title = "Choose Your Plan",
  subtitle = "Flexible pricing for every need. All plans include our core features.",
  plans,
  productSlug,
  category,
}: PricingPlansProps) {
  const { t } = useTranslation();
  const [isYearly, setIsYearly] = useState(true);

  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">{subtitle}</p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-1.5 rounded-full bg-card/50 border border-border/50">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                !isYearly
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("checkout.monthly")}
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                isYearly
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("checkout.annually")}
              <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id || plan.name}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative glass-card p-6 flex flex-col ${
                  plan.popular ? "border-primary/50 shadow-glow ring-1 ring-primary/20" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {t("common.popular").toUpperCase()}
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-foreground mb-1">{plan.name}</h3>
                  {plan.description && (
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  )}
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">
                      ${isYearly ? plan.yearlyPrice.toFixed(2) : plan.monthlyPrice.toFixed(2)}
                    </span>
                    <span className="text-muted-foreground">{t("common.perMonth")}</span>
                  </div>
                  {isYearly && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Billed ${(plan.yearlyPrice * 12).toFixed(2)}/year
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
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

                <Link
                  to={generateCheckoutUrl(plan, productSlug, isYearly, category)}
                  className={`block w-full py-3 text-center rounded-lg font-medium transition-all ${
                    plan.popular
                      ? "btn-glow"
                      : "btn-outline"
                  }`}
                >
                  {plan.cta?.text || t("buttons.orderNow")}
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
