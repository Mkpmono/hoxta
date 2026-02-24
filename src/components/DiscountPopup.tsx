import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Percent } from "lucide-react";

const DISCOUNT_CODE = "HOXTA20";
const STORAGE_KEY = "hoxta_discount_dismissed";

export function DiscountPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (dismissed) return;

    const timer = setTimeout(() => setIsOpen(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem(STORAGE_KEY, "true");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(DISCOUNT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: "spring", damping: 20, stiffness: 250 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-sm pointer-events-auto rounded-2xl border border-primary/20 bg-card shadow-2xl shadow-primary/10 overflow-hidden">
              {/* Top accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/80 to-primary" />

              {/* Glow */}
              <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-80 h-80 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative px-8 py-10 flex flex-col items-center text-center">
                {/* Icon */}
                <div className="mb-5 w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Percent className="w-6 h-6 text-primary" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-foreground mb-1.5">
                  Exclusive Discount
                </h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-[260px] leading-relaxed">
                  Use the code below at checkout to get{" "}
                  <span className="text-primary font-semibold">20% off</span> your first order.
                </p>

                {/* Code box */}
                <button
                  onClick={handleCopy}
                  className="group w-full max-w-[240px] flex items-center justify-between px-5 py-3.5 rounded-xl bg-background border border-border/60 hover:border-primary/40 transition-all"
                >
                  <span className="text-lg font-mono font-bold tracking-[0.2em] text-foreground">
                    {DISCOUNT_CODE}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-primary" />
                        <span className="text-primary">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </div>
                </button>

                {/* Dismiss text */}
                <button
                  onClick={handleClose}
                  className="mt-5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  No thanks, continue browsing
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
