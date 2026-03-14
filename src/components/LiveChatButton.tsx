import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function LiveChatButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.9 }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
            className="w-[320px] rounded-2xl overflow-hidden shadow-2xl border border-border"
          >
            {/* Header */}
            <div className="bg-primary px-5 py-4 flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-primary" />
              </div>
              <div className="flex-1">
                <p className="text-primary-foreground font-semibold text-sm">Hoxta Support</p>
                <p className="text-primary-foreground/70 text-xs">We typically reply in minutes</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="bg-card p-5 space-y-4">
              <div className="bg-muted/50 rounded-xl p-4">
                <p className="text-sm text-foreground font-medium">👋 Hello!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  How can we help you today? Our team is here for you.
                </p>
              </div>
              <div className="space-y-2">
                <a
                  href="mailto:support@hoxta.com"
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors group"
                >
                  <span className="text-lg">✉️</span>
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Email us</p>
                    <p className="text-xs text-muted-foreground">support@hoxta.com</p>
                  </div>
                </a>
                <a
                  href="https://discord.gg/hoxta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors group"
                >
                  <span className="text-lg">💬</span>
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Discord</p>
                    <p className="text-xs text-muted-foreground">Join our community</p>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen(!open)}
        className="group relative w-[60px] h-[60px] rounded-full shadow-xl flex items-center justify-center bg-primary text-primary-foreground overflow-hidden"
        aria-label="Live Chat"
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full animate-ping bg-primary/30" style={{ animationDuration: "2.5s" }} />
        )}

        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6 relative z-10" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="w-6 h-6 relative z-10" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
