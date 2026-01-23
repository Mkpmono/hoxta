import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { CheckoutStepper, OrderSummary, CustomerForm, PaymentMethods, PlanSelector } from "@/components/checkout";
import { getProductBySlug, BillingCycle, PaymentMethodId } from "@/data/products";
import { createOrderSession, updateOrderCustomer, processPayment, OrderSession } from "@/services/orderService";
import { CustomerData } from "@/components/checkout/CustomerForm";
import { Loader2, ArrowLeft, Edit3 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type CheckoutStepId = "plan" | "details" | "payment";

const directCheckoutSteps = [
  { id: "details", label: "Your Details" },
  { id: "payment", label: "Payment" },
  { id: "done", label: "Complete" },
];

const fullCheckoutSteps = [
  { id: "plan", label: "Select Plan" },
  { id: "details", label: "Your Details" },
  { id: "payment", label: "Payment" },
  { id: "done", label: "Complete" },
];

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // URL params for direct checkout
  const category = searchParams.get("category");
  const productSlug = searchParams.get("product");
  const planId = searchParams.get("plan");
  const billingParam = searchParams.get("billing") as BillingCycle | null;
  const sessionId = searchParams.get("session");
  
  const [session, setSession] = useState<OrderSession | null>(null);
  const [step, setStep] = useState<CheckoutStepId>("details");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodId | null>(null);

  // Used when we need to show Step 1 (Plan selection) inside /checkout
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<BillingCycle>(
    billingParam === "monthly" || billingParam === "quarterly" || billingParam === "annually"
      ? billingParam
      : "monthly"
  );
  
  // Validate and get product/plan from URL params
  const { product, plan, billingCycle, isValidDirectCheckout } = useMemo(() => {
    if (!productSlug || !planId) {
      return { product: null, plan: null, billingCycle: "monthly" as BillingCycle, isValidDirectCheckout: false };
    }
    
    const foundProduct = getProductBySlug(productSlug);
    if (!foundProduct) {
      return { product: null, plan: null, billingCycle: "monthly" as BillingCycle, isValidDirectCheckout: false };
    }
    
    const foundPlan = foundProduct.plans.find((p) => p.id === planId);
    if (!foundPlan) {
      return { product: foundProduct, plan: null, billingCycle: "monthly" as BillingCycle, isValidDirectCheckout: false };
    }
    
    const billing = (billingParam === "monthly" || billingParam === "quarterly" || billingParam === "annually") 
      ? billingParam 
      : "monthly";
    
    return { product: foundProduct, plan: foundPlan, billingCycle: billing, isValidDirectCheckout: true };
  }, [productSlug, planId, billingParam]);
  
  // Initialize session on mount
  useEffect(() => {
    const initSession = async () => {
      // Re-initialize cleanly whenever URL/session changes
      setIsLoading(true);
      setSession(null);

      // Case 1: Direct checkout with valid params
      if (isValidDirectCheckout && product && plan) {
        try {
          const newSession = await createOrderSession(productSlug!, plan, billingCycle);
          setSession(newSession);
          setStep("details");
          setIsLoading(false);
        } catch (error) {
          console.error("Failed to create order session:", error);
          toast.error("Failed to initialize checkout");
          // Never send game users back to /order (Step 1). Fallback to the game page.
          if (category === "games" && productSlug) {
            navigate(`/game-servers/${productSlug}`);
          } else {
            navigate(`/order?product=${productSlug}`);
          }
        }
        return;
      }
      
      // Case 2: Coming from Order page with session ID
      if (sessionId) {
        const { getOrderSession } = await import("@/services/orderService");
        const existingSession = await getOrderSession(sessionId);
        if (existingSession) {
          setSession(existingSession);
          
          // Get product/plan from session
          const sessionProduct = getProductBySlug(existingSession.productSlug);
          const sessionPlan = sessionProduct?.plans.find((p) => p.id === existingSession.planId);
          
          if (sessionProduct && sessionPlan) {
            setStep("details");
            setIsLoading(false);
            return;
          }
        }
        
        toast.error("Session expired");
        navigate("/order");
        return;
      }
      
      // Case 3: Missing/invalid params
      // If we at least have a valid product slug, show Step 1 inside /checkout.
      if (productSlug) {
        const foundProduct = getProductBySlug(productSlug);

        if (foundProduct) {
          setSelectedBillingCycle(billingCycle);
          setSelectedPlanId(null);
          setStep("plan");
          setIsLoading(false);
          return;
        }

        // Invalid product
        toast.error("Invalid product selected");
        if (category === "games") {
          navigate("/game-servers");
        } else {
          navigate("/order");
        }
        return;
      }

      // No product
      if (category === "games") {
        navigate("/game-servers");
      } else {
        navigate("/order");
      }
    };
    
    initSession();
  }, [isValidDirectCheckout, product, plan, productSlug, billingCycle, sessionId, navigate, category]);
  
  // Get current product/plan (either from URL or session)
  const currentProduct = useMemo(() => {
    if (product) return product;
    if (session) return getProductBySlug(session.productSlug);
    return null;
  }, [product, session]);
  
  const currentPlan = useMemo(() => {
    if (plan) return plan;
    if (session && currentProduct) {
      return currentProduct.plans.find((p) => p.id === session.planId);
    }
    return null;
  }, [plan, session, currentProduct]);
  
  const currentBillingCycle = useMemo(() => {
    if (billingCycle) return billingCycle;
    if (session) return session.billingCycle;
    return "monthly" as BillingCycle;
  }, [billingCycle, session]);
  
  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  // Plan selection step inside /checkout (only shown when URL params are missing/invalid)
  if (step === "plan") {
    const productForSelection = productSlug ? getProductBySlug(productSlug) : null;

    if (!productForSelection) {
      // Safety: if product is missing, bounce to browse.
      return <Navigate to={category === "games" ? "/game-servers" : "/order"} replace />;
    }

    // Auto-select popular plan in this mode as well
    const effectiveSelectedPlanId =
      selectedPlanId ||
      productForSelection.plans.find((p) => p.popular)?.id ||
      productForSelection.plans[0]?.id ||
      null;

    const steps = fullCheckoutSteps;
    const currentStepIndex = 0;

    const handleContinueFromPlan = async () => {
      const planToUse = productForSelection.plans.find((p) => p.id === effectiveSelectedPlanId);
      if (!planToUse) return;

      // Navigate to canonical /checkout URL with product+plan+billing (and category when present)
      const categoryParam = category ? `category=${encodeURIComponent(category)}&` : "";
      navigate(
        `/checkout?${categoryParam}product=${encodeURIComponent(productForSelection.slug)}&plan=${encodeURIComponent(
          planToUse.id
        )}&billing=${encodeURIComponent(selectedBillingCycle)}`
      );
    };

    return (
      <Layout>
        <div className="min-h-screen py-12">
          <div className="container">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Order {productForSelection.name}
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">{productForSelection.shortDescription}</p>
            </motion.div>

            <CheckoutStepper
              steps={steps}
              currentStep={currentStepIndex}
              className="max-w-2xl mx-auto mb-12"
            />

            <PlanSelector
              product={productForSelection}
              selectedPlanId={effectiveSelectedPlanId}
              selectedBillingCycle={selectedBillingCycle}
              onPlanSelect={(id) => setSelectedPlanId(id)}
              onBillingCycleChange={setSelectedBillingCycle}
              onContinue={handleContinueFromPlan}
            />
          </div>
        </div>
      </Layout>
    );
  }

  // Details/payment steps require a valid session + product + plan
  if (!session || !currentProduct || !currentPlan) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }
  
  const handleCustomerSubmit = async (data: CustomerData) => {
    setIsProcessing(true);
    try {
      const updated = await updateOrderCustomer(session.sessionId, data);
      setSession(updated);
      setStep("payment");
    } catch (error) {
      toast.error("Failed to save details");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handlePayment = async (method: PaymentMethodId, details?: Record<string, string>) => {
    setIsProcessing(true);
    try {
      const result = await processPayment(session.sessionId, method, details);
      if (result.success) {
        navigate(`/checkout/success?session=${session.sessionId}`);
      } else {
        navigate(`/checkout/failed?session=${session.sessionId}&error=${result.error}`);
      }
    } catch (error) {
      toast.error("Payment failed");
      setIsProcessing(false);
    }
  };
  
  // Use direct steps (plan is preselected)
  const steps = directCheckoutSteps;
  const currentStepIndex = step === "details" ? 0 : 1;
  
  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container">
          {/* Back & Change Plan */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <button
              type="button"
              onClick={() => {
                setSelectedPlanId(currentPlan.id);
                setSelectedBillingCycle(currentBillingCycle);
                setStep("plan");
              }}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              Change Plan
            </button>
          </div>
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Complete Your Order
            </h1>
            <p className="text-muted-foreground">
              {currentProduct.name} — {currentPlan.name}
            </p>
          </motion.div>
          
          {/* Stepper */}
          <CheckoutStepper steps={steps} currentStep={currentStepIndex} className="max-w-2xl mx-auto mb-12" />
          
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {step === "details" && (
                    <>
                        <h2 className="text-2xl font-bold text-foreground mb-6">Your Details</h2>
                        <CustomerForm onSubmit={handleCustomerSubmit} isLoading={isProcessing} />
                    </>
                  )}
                  
                  {step === "payment" && (
                    <>
                      <h2 className="text-2xl font-bold text-foreground mb-6">Payment Method</h2>
                      <PaymentMethods
                        selectedMethod={selectedPayment}
                        onSelect={setSelectedPayment}
                        onSubmit={handlePayment}
                        isProcessing={isProcessing}
                        amount={session.amount}
                      />
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <OrderSummary
                productName={currentProduct.name}
                plan={currentPlan}
                billingCycle={currentBillingCycle}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
