import { useState, forwardRef } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ChatIcon = forwardRef<SVGSVGElement, { className?: string }>(({ className }, ref) => {
  return (
    <svg ref={ref} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="11.5" r="1" fill="currentColor" />
      <circle cx="12.5" cy="11.5" r="1" fill="currentColor" />
      <circle cx="15.5" cy="11.5" r="1" fill="currentColor" />
    </svg>
  );
});
ChatIcon.displayName = "ChatIcon";

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
            <div className="bg-primary px-5 py-4 flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <ChatIcon className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-primary" />
              </div>
              <div className="flex-1">
                <p className="text-primary-foreground font-semibold text-sm">Hoxta Support</p>
                <p className="text-primary-foreground/70 text-xs">We typically reply in minutes</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-card p-5 space-y-4">
              <div className="bg-muted/50 rounded-xl p-4">
                <p className="text-sm text-foreground font-medium">👋 Hello!</p>
                <p className="text-sm text-muted-foreground mt-1">How can we help you today? Our team is here for you.</p>
              </div>
              <div className="space-y-2">
                <a href="mailto:support@hoxta.com" className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors group">
                  <span className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-base">✉️</span>
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Email us</p>
                    <p className="text-xs text-muted-foreground">support@hoxta.com</p>
                  </div>
                </a>
                <a href="https://discord.gg/ju7ADq4ZqY" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors group">
                  <span className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-base">💬</span>
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

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.06, boxShadow: "0 8px 30px hsl(var(--primary) / 0.5)" }}
        whileTap={{ scale: 0.93 }}
        onClick={() => setOpen(!open)}
        className="relative w-16 h-16 rounded-[20px] flex items-center justify-center text-primary-foreground overflow-hidden"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8))",
          boxShadow: "0 4px 20px hsl(var(--primary) / 0.35), inset 0 1px 0 hsl(0 0% 100% / 0.15)",
        }}
        aria-label="Live Chat"
      >
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />

        {/* Subtle pulse when closed */}
        {!open && (
          <motion.span
            className="absolute inset-0 rounded-[20px]"
            style={{ border: "2px solid hsl(var(--primary) / 0.4)" }}
            animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
        )}

        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="relative z-10"
            >
              <X className="w-6 h-6" strokeWidth={2.5} />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="relative z-10"
            >
              <ChatIcon className="w-7 h-7" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
