import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { XCircle, RefreshCw, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutFailed() {
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error") || "Payment was not completed";
  
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
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/20 flex items-center justify-center"
            >
              <XCircle className="w-10 h-10 text-destructive" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-foreground mb-4">Payment Failed</h1>
            <p className="text-muted-foreground mb-8">{error}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="btn-glow">
                <Link to="/order">
                  <RefreshCw className="w-4 h-4 mr-2" /> Try Again
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/contact">
                  <MessageSquare className="w-4 h-4 mr-2" /> Contact Support
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
