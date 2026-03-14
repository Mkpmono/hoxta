import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = (value: "all" | "essential") => {
    localStorage.setItem("cookie_consent", value);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-50"
        >
          <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
            <h3 className="text-foreground font-semibold text-base mb-2">
              🍪 {t("cookie.title", "We care about your privacy")}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              {t(
                "cookie.description",
                "This website uses cookies to ensure a great experience. By accepting, you agree that cookies may be stored on your device for analytics, personalization, and marketing purposes."
              )}{" "}
              <Link to="/privacy" className="text-primary hover:underline font-medium">
                {t("cookie.policy", "Cookie Policy")}
              </Link>
            </p>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => accept("all")}
                size="sm"
                className="rounded-full px-5"
              >
                {t("cookie.acceptAll", "Accept all")}
              </Button>
              <Button
                onClick={() => accept("essential")}
                variant="outline"
                size="sm"
                className="rounded-full px-5"
              >
                {t("cookie.decline", "Decline")}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
