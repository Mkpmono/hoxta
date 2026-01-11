import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { CheckCircle, ArrowRight, FileText, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session") || "N/A";
  
  return (
    <Layout>
      <div className="min-h-screen py-20">
        <div className="container max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 md:p-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
            >
              <CheckCircle className="w-10 h-10 text-green-500" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-foreground mb-4">Payment Successful!</h1>
            <p className="text-muted-foreground mb-8">
              Thank you for your order. Your service is being activated and will be ready shortly.
            </p>
            
            <div className="glass-card p-4 mb-8 inline-block">
              <p className="text-sm text-muted-foreground">Order Reference</p>
              <p className="text-lg font-mono font-bold text-primary">{sessionId}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="btn-glow">
                <Link to="/panel">
                  Go to Client Panel <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/panel/invoices">
                  <FileText className="w-4 h-4 mr-2" /> View Invoice
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
