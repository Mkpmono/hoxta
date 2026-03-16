import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Sparkles, Gift, ArrowRight } from "lucide-react";

const DISCOUNT_CODE = "HOXTA20";
const STORAGE_KEY = "hoxta_discount_dismissed";
const DISMISS_DURATION_MS = 3 * 60 * 60 * 1000; // 3 hours

export function DiscountPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const dismissedAt = localStorage.getItem(STORAGE_KEY);
    if (dismissedAt && Date.now() - Number(dismissedAt) < DISMISS_DURATION_MS) return;

    const timer = setTimeout(() => setIsOpen(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-md pointer-events-auto rounded-3xl border border-primary/30 bg-card overflow-hidden shadow-2xl shadow-primary/20">
              {/* Top gradient accent */}
              <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-primary" />

              {/* Decorative glow orbs */}
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/15 rounded-full blur-3xl pointer-events-none" />

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative px-8 pt-10 pb-8 flex flex-col items-center text-center">
                {/* Animated gift icon */}
                <motion.div
                  initial={{ rotate: -10 }}
                  animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mb-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/30 flex items-center justify-center">
                    <Gift className="w-8 h-8 text-primary" />
                  </div>
                </motion.div>

                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20"
                >
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-semibold text-primary tracking-wide uppercase">Ofertă Exclusivă</span>
                </motion.div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  🎉 20% Reducere Instant
                </h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-[300px] leading-relaxed">
                  Folosește codul de mai jos la checkout și primești{" "}
                  <span className="text-primary font-semibold">20% discount</span>{" "}
                  la prima ta comandă! 🚀
                </p>

                {/* Code box */}
                <motion.button
                  onClick={handleCopy}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group w-full max-w-[280px] flex items-center justify-between px-6 py-4 rounded-2xl bg-background border-2 border-dashed border-primary/30 hover:border-primary/60 transition-all"
                >
                  <span className="text-xl font-mono font-extrabold tracking-[0.25em] text-foreground">
                    {DISCOUNT_CODE}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                    {copied ? (
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-1.5 text-primary"
                      >
                        <Check className="w-4 h-4" />
                        <span>Copiat! ✅</span>
                      </motion.div>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copiază</span>
                      </>
                    )}
                  </div>
                </motion.button>

                {/* CTA hint */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-4 text-xs text-muted-foreground flex items-center gap-1"
                >
                  <ArrowRight className="w-3 h-3" />
                  Introdu codul la pasul de plată
                </motion.p>

                {/* Dismiss */}
                <button
                  onClick={handleClose}
                  className="mt-5 text-xs text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                  Nu, mulțumesc
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
