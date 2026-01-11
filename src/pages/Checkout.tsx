import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { CheckoutStepper, OrderSummary, CustomerForm, PaymentMethods } from "@/components/checkout";
import { getProductBySlug, BillingCycle, PaymentMethodId, ProductPlan } from "@/data/products";
import { createOrderSession, updateOrderCustomer, processPayment, OrderSession } from "@/services/orderService";
import { CustomerData } from "@/components/checkout/CustomerForm";
import { Loader2, ArrowLeft, Edit3 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// Checkout steps when plan is preselected (skip step 1)
const directCheckoutSteps = [
  { id: "details", label: "Your Details" },
  { id: "payment", label: "Payment" },
  { id: "done", label: "Complete" },
];

// Full steps when coming from browse
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
  const productSlug = searchParams.get("product");
  const planId = searchParams.get("plan");
  const billingParam = searchParams.get("billing") as BillingCycle | null;
  const sessionId = searchParams.get("session");
  
  const [session, setSession] = useState<OrderSession | null>(null);
  const [step, setStep] = useState<"details" | "payment">("details");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodId | null>(null);
  
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
      // Case 1: Direct checkout with valid params
      if (isValidDirectCheckout && product && plan) {
        try {
          const newSession = await createOrderSession(productSlug!, plan, billingCycle);
          setSession(newSession);
          setIsLoading(false);
        } catch (error) {
          console.error("Failed to create order session:", error);
          toast.error("Failed to initialize checkout");
          navigate(`/order?product=${productSlug}`);
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
            setIsLoading(false);
            return;
          }
        }
        
        toast.error("Session expired");
        navigate("/order");
        return;
      }
      
      // Case 3: Invalid params - redirect to order page
      if (productSlug) {
        toast.error("Invalid plan selected");
        navigate(`/order?product=${productSlug}`);
      } else {
        navigate("/order");
      }
    };
    
    initSession();
  }, [isValidDirectCheckout, product, plan, productSlug, billingCycle, sessionId, navigate]);
  
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
  if (isLoading || !session || !currentProduct || !currentPlan) {
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
  
  // Use direct steps (skip plan selection step)
  const steps = directCheckoutSteps;
  const currentStepIndex = step === "details" ? 0 : 1;
  
  // Build change plan URL
  const changePlanUrl = `/order?product=${currentProduct.slug}&plan=${currentPlan.id}&billing=${currentBillingCycle}`;
  
  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container">
          {/* Back & Change Plan */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Link
              to={changePlanUrl}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              Change Plan
            </Link>
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
