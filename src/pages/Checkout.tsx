import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { CheckoutStepper, checkoutSteps, OrderSummary, CustomerForm, PaymentMethods } from "@/components/checkout";
import { getProductBySlug, PaymentMethodId } from "@/data/products";
import { getOrderSession, updateOrderCustomer, processPayment, OrderSession } from "@/services/orderService";
import { CustomerData } from "@/components/checkout/CustomerForm";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session");
  
  const [session, setSession] = useState<OrderSession | null>(null);
  const [step, setStep] = useState<"details" | "payment">("details");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodId | null>(null);
  
  useEffect(() => {
    if (!sessionId) {
      navigate("/order");
      return;
    }
    
    getOrderSession(sessionId).then((s) => {
      if (!s) {
        toast.error("Session expired");
        navigate("/order");
        return;
      }
      setSession(s);
      setIsLoading(false);
    });
  }, [sessionId, navigate]);
  
  if (isLoading || !session) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }
  
  const product = getProductBySlug(session.productSlug);
  const plan = product?.plans.find((p) => p.id === session.planId);
  
  if (!product || !plan) {
    navigate("/order");
    return null;
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
  
  const currentStepIndex = step === "details" ? 1 : 2;
  
  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container">
          {/* Stepper */}
          <CheckoutStepper steps={checkoutSteps} currentStep={currentStepIndex} className="max-w-2xl mx-auto mb-12" />
          
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
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
            </div>
            
            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <OrderSummary
                productName={product.name}
                plan={plan}
                billingCycle={session.billingCycle}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
