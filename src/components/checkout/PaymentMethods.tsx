import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Wallet, Bitcoin, Ticket, Lock, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { PaymentMethodId } from "@/data/products";

interface PaymentMethodsProps {
  selectedMethod: PaymentMethodId | null;
  onSelect: (method: PaymentMethodId) => void;
  onSubmit: (method: PaymentMethodId, details?: Record<string, string>) => void;
  isProcessing: boolean;
  amount: number;
  currency?: string;
}

const paymentOptions = [
  {
    id: "stripe" as const,
    name: "Credit / Debit Card",
    description: "Visa, Mastercard, American Express",
    icon: CreditCard,
    color: "from-blue-500 to-purple-500",
  },
  {
    id: "paypal" as const,
    name: "PayPal",
    description: "Pay with PayPal balance or linked card",
    icon: Wallet,
    color: "from-blue-600 to-blue-400",
  },
  {
    id: "crypto" as const,
    name: "Cryptocurrency",
    description: "Bitcoin, Ethereum, USDT, and more",
    icon: Bitcoin,
    color: "from-orange-500 to-yellow-500",
  },
  {
    id: "paysafe" as const,
    name: "Paysafecard",
    description: "Prepaid voucher payment",
    icon: Ticket,
    color: "from-green-500 to-teal-500",
  },
];

export function PaymentMethods({
  selectedMethod,
  onSelect,
  onSubmit,
  isProcessing,
  amount,
  currency = "USD",
}: PaymentMethodsProps) {
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : v;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleCardSubmit = () => {
    onSubmit("stripe", cardDetails);
  };

  const handleExternalSubmit = (method: PaymentMethodId) => {
    onSubmit(method);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Payment Method Selection */}
      <div className="grid grid-cols-2 gap-4">
        {paymentOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedMethod === option.id;

          return (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(option.id)}
              disabled={isProcessing}
              className={cn(
                "p-4 rounded-xl border-2 text-left transition-all",
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-border/50 bg-card/50 hover:border-border"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br",
                    option.color
                  )}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">{option.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{option.description}</p>
                </div>
                {isSelected && (
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Payment Form Area */}
      <AnimatePresence mode="wait">
        {selectedMethod === "stripe" && (
          <motion.div
            key="stripe"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-6 space-y-4"
          >
            <h4 className="font-medium text-foreground flex items-center gap-2">
              <Lock className="w-4 h-4 text-green-500" />
              Secure Card Payment
            </h4>

            <div>
              <Label htmlFor="cardName">Name on Card</Label>
              <Input
                id="cardName"
                placeholder="John Doe"
                value={cardDetails.name}
                onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.number}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, number: formatCardNumber(e.target.value) })
                }
                maxLength={19}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, expiry: formatExpiry(e.target.value) })
                  }
                  maxLength={5}
                />
              </div>
              <div>
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  placeholder="123"
                  value={cardDetails.cvc}
                  onChange={(e) =>
                    setCardDetails({
                      ...cardDetails,
                      cvc: e.target.value.replace(/\D/g, "").slice(0, 4),
                    })
                  }
                  maxLength={4}
                />
              </div>
            </div>

            <Button
              onClick={handleCardSubmit}
              disabled={isProcessing || !cardDetails.number || !cardDetails.expiry || !cardDetails.cvc}
              className="w-full btn-glow"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  Pay ${amount.toFixed(2)} {currency}
                  <Lock className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Your payment is secured with 256-bit SSL encryption
            </p>
          </motion.div>
        )}

        {selectedMethod === "paypal" && (
          <motion.div
            key="paypal"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-6 text-center space-y-4"
          >
            <Wallet className="w-12 h-12 mx-auto text-blue-500" />
            <div>
              <h4 className="font-medium text-foreground">Pay with PayPal</h4>
              <p className="text-sm text-muted-foreground mt-1">
                You'll be redirected to PayPal to complete your payment securely.
              </p>
            </div>
            <Button
              onClick={() => handleExternalSubmit("paypal")}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Redirecting to PayPal...
                </>
              ) : (
                <>Continue to PayPal</>
              )}
            </Button>
          </motion.div>
        )}

        {selectedMethod === "crypto" && (
          <motion.div
            key="crypto"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-6 text-center space-y-4"
          >
            <Bitcoin className="w-12 h-12 mx-auto text-orange-500" />
            <div>
              <h4 className="font-medium text-foreground">Pay with Cryptocurrency</h4>
              <p className="text-sm text-muted-foreground mt-1">
                We accept Bitcoin, Ethereum, USDT, and 100+ other cryptocurrencies.
              </p>
            </div>
            <Button
              onClick={() => handleExternalSubmit("crypto")}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Payment...
                </>
              ) : (
                <>Pay with Crypto</>
              )}
            </Button>
          </motion.div>
        )}

        {selectedMethod === "paysafe" && (
          <motion.div
            key="paysafe"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-6 text-center space-y-4"
          >
            <Ticket className="w-12 h-12 mx-auto text-green-500" />
            <div>
              <h4 className="font-medium text-foreground">Pay with Paysafecard</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Enter your 16-digit Paysafecard PIN to complete the payment.
              </p>
            </div>
            <Button
              onClick={() => handleExternalSubmit("paysafe")}
              disabled={isProcessing}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Continue with Paysafecard</>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
