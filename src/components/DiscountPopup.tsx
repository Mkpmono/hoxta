import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Gift } from "lucide-react";

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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-md"
          >
            <div className="relative glass-card border-primary/30 p-8 text-center overflow-hidden">
              {/* Glow effect */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Icon */}
              <div className="relative mx-auto mb-4 w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Gift className="w-8 h-8 text-primary" />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-foreground mb-2">
                🎉 20% Reducere!
              </h3>
              <p className="text-muted-foreground mb-6">
                Folosește codul de mai jos la checkout și primești <span className="text-primary font-semibold">20% reducere</span> la prima comandă!
              </p>

              {/* Code */}
              <button
                onClick={handleCopy}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-primary/10 border-2 border-dashed border-primary/40 hover:border-primary/60 transition-all cursor-pointer"
              >
                <span className="text-2xl font-mono font-bold tracking-widest text-primary">
                  {DISCOUNT_CODE}
                </span>
                {copied ? (
                  <Check className="w-5 h-5 text-primary" />
                ) : (
                  <Copy className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                )}
              </button>

              <p className="text-xs text-muted-foreground mt-4">
                {copied ? "✅ Cod copiat!" : "Click pentru a copia codul"}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
