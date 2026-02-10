import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";

interface ComparisonFeature {
  name: string;
  values: (string | boolean | null)[];
}

interface ComparisonPlan {
  name: string;
  price: string;
}

interface PlanComparisonProps {
  title?: string;
  subtitle?: string;
  plans: ComparisonPlan[];
  features?: ComparisonFeature[];
  categories?: { name: string; features: ComparisonFeature[] }[];
}

export function PlanComparison({
  title = "Compare Plans",
  subtitle = "Find the perfect plan for your needs with our detailed comparison.",
  plans,
  features,
  categories,
}: PlanComparisonProps) {
  const renderValue = (value: string | boolean | null) => {
    if (value === true) {
      return <Check className="w-5 h-5 text-primary mx-auto" />;
    }
    if (value === false) {
      return <X className="w-5 h-5 text-muted-foreground/50 mx-auto" />;
    }
    if (value === null) {
      return <Minus className="w-5 h-5 text-muted-foreground/30 mx-auto" />;
    }
    return <span className="text-foreground font-medium">{value}</span>;
  };

  const allFeatures = categories
    ? categories.flatMap((cat) => cat.features)
    : features;

  return (
    <section id="comparison" className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div
          className="overflow-x-auto"
        >
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-4 px-4 text-muted-foreground font-medium">Features</th>
                {plans.map((plan, index) => (
                  <th key={index} className="py-4 px-4 text-center">
                    <div className="text-foreground font-semibold text-lg">{plan.name}</div>
                    <div className="text-primary font-bold">{plan.price}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories ? (
                categories.map((category, catIndex) => (
                  <>
                    <tr key={`cat-${catIndex}`} className="border-b border-border/30">
                      <td
                        colSpan={plans.length + 1}
                        className="py-4 px-4 text-primary font-semibold text-sm uppercase tracking-wide bg-primary/5"
                      >
                        {category.name}
                      </td>
                    </tr>
                    {category.features.map((feature, index) => (
                      <tr
                        key={`${catIndex}-${index}`}
                        className="border-b border-border/20 hover:bg-card/30 transition-colors"
                      >
                        <td className="py-4 px-4 text-muted-foreground">{feature.name}</td>
                        {feature.values.map((value, i) => (
                          <td key={i} className="py-4 px-4 text-center">
                            {renderValue(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                ))
              ) : (
                allFeatures.map((feature, index) => (
                  <tr
                    key={index}
                    className="border-b border-border/20 hover:bg-card/30 transition-colors"
                  >
                    <td className="py-4 px-4 text-muted-foreground">{feature.name}</td>
                    {feature.values.map((value, i) => (
                      <td key={i} className="py-4 px-4 text-center">
                        {renderValue(value)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
