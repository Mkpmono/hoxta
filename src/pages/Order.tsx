import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { CheckoutStepper, checkoutSteps, PlanSelector, OrderSummary } from "@/components/checkout";
import { getProductBySlug, BillingCycle } from "@/data/products";
import { createOrderSession } from "@/services/orderService";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Order() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const productSlug = searchParams.get("product") || "web-hosting";
  const initialPlan = searchParams.get("plan") || null;
  const initialBilling = (searchParams.get("billing") as BillingCycle) || "annually";
  
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(initialPlan);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(initialBilling);
  const [isLoading, setIsLoading] = useState(false);
  
  const product = getProductBySlug(productSlug);
  const selectedPlan = product?.plans.find((p) => p.id === selectedPlanId);
  
  useEffect(() => {
    if (product && !selectedPlanId) {
      const popular = product.plans.find((p) => p.popular);
      setSelectedPlanId(popular?.id || product.plans[0]?.id || null);
    }
  }, [product, selectedPlanId]);
  
  if (!product) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Button onClick={() => navigate("/")} className="mt-4">Go Home</Button>
        </div>
      </Layout>
    );
  }
  
  const handleContinue = async () => {
    if (!selectedPlan) return;
    setIsLoading(true);
    
    try {
      const session = await createOrderSession(productSlug, selectedPlan, billingCycle);
      navigate(`/checkout?session=${session.sessionId}`);
    } catch (error) {
      console.error("Failed to create order session:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container">
          {/* Back Link */}
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Order {product.name}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {product.shortDescription}
            </p>
          </motion.div>
          
          {/* Stepper */}
          <CheckoutStepper steps={checkoutSteps} currentStep={0} className="max-w-2xl mx-auto mb-12" />
          
          {/* Plan Selection */}
          <PlanSelector
            product={product}
            selectedPlanId={selectedPlanId}
            selectedBillingCycle={billingCycle}
            onPlanSelect={setSelectedPlanId}
            onBillingCycleChange={setBillingCycle}
            onContinue={handleContinue}
          />
        </div>
      </div>
    </Layout>
  );
}
