import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, ChevronDown, ChevronUp, Shield, Cookie, BarChart3 } from "lucide-react";

interface CookieCategory {
  id: string;
  required?: boolean;
  defaultEnabled?: boolean;
  icon: React.ReactNode;
  cookies: { name: string; description?: string }[];
}

const COOKIE_CATEGORIES: CookieCategory[] = [
  {
    id: "necessary",
    required: true,
    defaultEnabled: true,
    icon: <Shield className="w-4 h-4" />,
    cookies: [
      { name: "Stripe", description: "Payment processing" },
      { name: "WHMCS", description: "Client management" },
    ],
  },
  {
    id: "analytics",
    defaultEnabled: false,
    icon: <BarChart3 className="w-4 h-4" />,
    cookies: [
      { name: "Google Analytics", description: "Traffic analytics" },
    ],
  },
];

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<Record<string, boolean>>(() => {
    const defaults: Record<string, boolean> = {};
    COOKIE_CATEGORIES.forEach((c) => {
      defaults[c.id] = c.required || c.defaultEnabled || false;
    });
    return defaults;
  });
  const { t } = useTranslation();

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const save = (value: Record<string, boolean> | "all") => {
    const data = value === "all"
      ? Object.fromEntries(COOKIE_CATEGORIES.map((c) => [c.id, true]))
      : value;
    localStorage.setItem("cookie_consent", JSON.stringify(data));
    setVisible(false);
  };

  const rejectAll = () => {
    const data = Object.fromEntries(
      COOKIE_CATEGORIES.map((c) => [c.id, !!c.required])
    );
    localStorage.setItem("cookie_consent", JSON.stringify(data));
    setVisible(false);
  };

  const toggleCategory = (id: string) => {
    const cat = COOKIE_CATEGORIES.find((c) => c.id === id);
    if (cat?.required) return;
    setPreferences((p) => ({ ...p, [id]: !p[id] }));
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop for details panel */}
          {showDetails && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetails(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            />
          )}

          {/* Simple banner – bottom left */}
          {!showDetails && (
            <motion.div
              initial={{ y: 80, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 80, opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed bottom-4 left-4 right-4 md:right-auto md:left-6 md:bottom-6 md:max-w-[420px] z-50"
            >
              <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-card/95 backdrop-blur-xl shadow-[0_8px_40px_-12px_hsl(var(--primary)/0.25)]">
                {/* Top accent line */}
                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

                {/* Decorative glow */}
                <div className="absolute -top-16 -left-16 w-32 h-32 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

                <div className="relative p-5">
                  {/* Header with cookie icon */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Cookie className="w-4.5 h-4.5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-foreground font-bold text-[15px] leading-tight">
                        {t("cookie.title", "Despre cookie-urile de pe acest site")}
                      </h3>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-[13px] leading-relaxed mb-4">
                    {t(
                      "cookie.description",
                      "Acest website folosește cookie-uri pentru a asigura o experiență optimă. Acceptând, ești de acord că cookie-urile pot fi stocate pe dispozitivul tău pentru analiză, personalizare și marketing."
                    )}{" "}
                    <Link to="/privacy" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                      {t("cookie.policy", "Politica de Cookie-uri")}
                    </Link>
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5">
                    <Button
                      onClick={() => save("all")}
                      size="sm"
                      className="rounded-xl px-5 h-9 text-[13px] font-semibold shadow-[0_2px_12px_-3px_hsl(var(--primary)/0.4)]"
                    >
                      {t("cookie.acceptAll", "Permite cookie-uri")}
                    </Button>
                    <Button
                      onClick={rejectAll}
                      variant="outline"
                      size="sm"
                      className="rounded-xl px-5 h-9 text-[13px] font-semibold border-border/60 hover:bg-muted/50"
                    >
                      {t("cookie.decline", "Refuzați toate")}
                    </Button>
                    <button
                      onClick={() => setShowDetails(true)}
                      className="ml-auto text-[12px] text-primary/80 hover:text-primary font-semibold transition-colors whitespace-nowrap"
                    >
                      {t("cookie.details", "Află mai multe")}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Detailed settings panel */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, x: -30, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -30, scale: 0.97 }}
                transition={{ type: "spring", damping: 28, stiffness: 300 }}
                className="fixed left-4 top-4 bottom-4 md:left-6 md:top-auto md:bottom-6 z-[61] w-[calc(100%-2rem)] md:w-[460px] max-h-[85vh] flex flex-col"
              >
                <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-card/95 backdrop-blur-xl shadow-[0_12px_50px_-15px_hsl(var(--primary)/0.3)] flex flex-col max-h-full">
                  {/* Top accent */}
                  <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

                  {/* Decorative glow */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

                  {/* Header */}
                  <div className="relative flex items-center justify-between p-6 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center">
                        <Cookie className="w-4.5 h-4.5 text-primary" />
                      </div>
                      <h2 className="text-base font-bold text-foreground">
                        {t("cookie.detailsTitle", "Setări Cookie-uri")}
                      </h2>
                    </div>
                    <button
                      onClick={() => setShowDetails(false)}
                      className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="mx-6 h-px bg-border/50" />

                  {/* Scrollable content */}
                  <div className="flex-1 overflow-y-auto p-6 pt-4 space-y-3">
                    <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">
                      {t(
                        "cookie.detailsDescription",
                        "Controlează cookie-urile utilizate pe acest site. Cookie-urile necesare nu pot fi dezactivate."
                      )}
                    </p>

                    {/* Quick action buttons */}
                    <div className="flex gap-2 mb-5">
                      <Button
                        onClick={() => save("all")}
                        variant="outline"
                        size="sm"
                        className="rounded-xl px-4 h-8 text-[12px] font-semibold border-primary/30 text-primary hover:bg-primary/10"
                      >
                        {t("cookie.acceptAll", "Permite cookie-uri")}
                      </Button>
                      <Button
                        onClick={rejectAll}
                        variant="outline"
                        size="sm"
                        className="rounded-xl px-4 h-8 text-[12px] font-semibold border-border/60 hover:bg-muted/50"
                      >
                        {t("cookie.decline", "Refuzați toate")}
                      </Button>
                    </div>

                    {/* Categories */}
                    {COOKIE_CATEGORIES.map((cat) => (
                      <div
                        key={cat.id}
                        className="rounded-xl border border-border/50 bg-background/40 overflow-hidden transition-colors hover:border-border/80"
                      >
                        <div className="flex items-center gap-3 p-4">
                          {/* Toggle */}
                          <button
                            onClick={() => toggleCategory(cat.id)}
                            disabled={cat.required}
                            className={`relative w-11 h-6 rounded-full transition-all duration-200 shrink-0 ${
                              preferences[cat.id]
                                ? "bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.3)]"
                                : "bg-muted"
                            } ${cat.required ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
                          >
                            <motion.span
                              layout
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm ${
                                preferences[cat.id] ? "left-[22px]" : "left-0.5"
                              }`}
                            />
                          </button>

                          {/* Icon + label */}
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className={`${preferences[cat.id] ? "text-primary" : "text-muted-foreground"} transition-colors`}>
                              {cat.icon}
                            </span>
                            <p className="text-sm font-semibold text-foreground">
                              {t(
                                `cookie.cat.${cat.id}`,
                                cat.id === "necessary"
                                  ? "Cookie-uri necesare"
                                  : "Cookie-uri analitice"
                              )}
                            </p>
                          </div>

                          <button
                            onClick={() =>
                              setExpanded(expanded === cat.id ? null : cat.id)
                            }
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
                          >
                            <motion.div
                              animate={{ rotate: expanded === cat.id ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="w-4 h-4" />
                            </motion.div>
                          </button>
                        </div>

                        {/* Description */}
                        <div className="px-4 pb-3">
                          <p className="text-[12px] text-muted-foreground/80 leading-relaxed">
                            {t(
                              `cookie.catDesc.${cat.id}`,
                              cat.id === "necessary"
                                ? "Cookie-urile necesare asigură funcționalitatea de bază. Site-ul nu va funcționa corect fără ele și sunt activate implicit."
                                : "Cookie-urile analitice ne ajută să îmbunătățim site-ul colectând informații anonime despre utilizare."
                            )}
                          </p>
                        </div>

                        {/* Expanded cookies list */}
                        <AnimatePresence>
                          {expanded === cat.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="mx-4 mb-4 rounded-lg bg-muted/30 border border-border/30 divide-y divide-border/30">
                                {cat.cookies.map((cookie) => (
                                  <div
                                    key={cookie.name}
                                    className="flex items-center justify-between px-3 py-2.5"
                                  >
                                    <span className="text-[12px] font-medium text-foreground">
                                      {cookie.name}
                                    </span>
                                    {cookie.description && (
                                      <span className="text-[11px] text-muted-foreground">
                                        {cookie.description}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="mx-6 h-px bg-border/50" />

                  {/* Footer */}
                  <div className="p-6 pt-4">
                    <Button
                      onClick={() => save(preferences)}
                      size="sm"
                      className="rounded-xl px-6 h-9 text-[13px] font-semibold shadow-[0_2px_12px_-3px_hsl(var(--primary)/0.4)]"
                    >
                      {t("cookie.save", "Salvează setările")}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
