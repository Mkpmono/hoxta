import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, ChevronDown, ChevronUp } from "lucide-react";

interface CookieCategory {
  id: string;
  required?: boolean;
  defaultEnabled?: boolean;
  cookies: { name: string; description?: string }[];
}

const COOKIE_CATEGORIES: CookieCategory[] = [
  {
    id: "necessary",
    required: true,
    defaultEnabled: true,
    cookies: [
      { name: "Stripe", description: "Payment processing" },
      { name: "WHMCS", description: "Client management" },
    ],
  },
  {
    id: "analytics",
    defaultEnabled: false,
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
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-4 left-4 right-4 md:right-auto md:left-6 md:bottom-6 md:max-w-md z-50"
            >
              <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl">
                <h3 className="text-foreground font-semibold text-base mb-2">
                  🍪 {t("cookie.title", "Despre cookie-urile de pe acest site")}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {t(
                    "cookie.description",
                    "Acest website folosește cookie-uri pentru a asigura o experiență optimă. Acceptând, ești de acord că cookie-urile pot fi stocate pe dispozitivul tău pentru analiză, personalizare și marketing."
                  )}{" "}
                  <Link to="/privacy" className="text-primary hover:underline font-medium">
                    {t("cookie.policy", "Politica de Cookie-uri")}
                  </Link>
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <Button
                    onClick={() => save("all")}
                    size="sm"
                    className="rounded-full px-5"
                  >
                    {t("cookie.acceptAll", "Permite cookie-uri")}
                  </Button>
                  <Button
                    onClick={rejectAll}
                    variant="outline"
                    size="sm"
                    className="rounded-full px-5"
                  >
                    {t("cookie.decline", "Refuzați toate")}
                  </Button>
                  <button
                    onClick={() => setShowDetails(true)}
                    className="text-xs text-primary hover:underline font-medium ml-auto"
                  >
                    {t("cookie.details", "Află mai multe")}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Detailed settings panel */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ type: "spring", damping: 28, stiffness: 300 }}
                className="fixed left-4 top-4 bottom-4 md:left-6 md:top-auto md:bottom-6 z-[61] w-[calc(100%-2rem)] md:w-[440px] max-h-[90vh] flex flex-col"
              >
                <div className="bg-card border border-border rounded-2xl shadow-2xl flex flex-col max-h-full overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 pb-4 border-b border-border">
                    <h2 className="text-lg font-bold text-foreground">
                      {t("cookie.detailsTitle", "Despre cookie-urile de pe acest site")}
                    </h2>
                    <button
                      onClick={() => setShowDetails(false)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Scrollable content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-2">
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {t(
                        "cookie.detailsDescription",
                        "Puteți vedea o listă de cookie-uri alocate fiecărei categorii și informații detaliate în declarația despre cookie-uri."
                      )}
                    </p>

                    {/* Action buttons */}
                    <div className="flex gap-3 mb-5">
                      <Button
                        onClick={() => save("all")}
                        variant="outline"
                        size="sm"
                        className="rounded-full px-4 text-xs"
                      >
                        {t("cookie.acceptAll", "Permite cookie-uri")}
                      </Button>
                      <Button
                        onClick={rejectAll}
                        variant="outline"
                        size="sm"
                        className="rounded-full px-4 text-xs"
                      >
                        {t("cookie.decline", "Refuzați toate")}
                      </Button>
                    </div>

                    {/* Categories */}
                    {COOKIE_CATEGORIES.map((cat) => (
                      <div
                        key={cat.id}
                        className="border border-border rounded-xl overflow-hidden"
                      >
                        <div className="flex items-center gap-3 p-4">
                          {/* Toggle */}
                          <button
                            onClick={() => toggleCategory(cat.id)}
                            disabled={cat.required}
                            className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                              preferences[cat.id]
                                ? "bg-primary"
                                : "bg-muted"
                            } ${cat.required ? "opacity-80 cursor-not-allowed" : "cursor-pointer"}`}
                          >
                            <span
                              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                                preferences[cat.id] ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </button>

                          <div className="flex-1 min-w-0">
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
                            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {expanded === cat.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {/* Description */}
                        <div className="px-4 pb-3">
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {t(
                              `cookie.catDesc.${cat.id}`,
                              cat.id === "necessary"
                                ? "Unele cookie-uri sunt necesare pentru a asigura funcționalitatea de bază. Site-ul nu va funcționa corect fără aceste cookie-uri și sunt activate în mod implicit, neputând fi dezactivate."
                                : "Cookie-urile analitice ne ajută să îmbunătățim site-ul nostru web colectând și raportând informații despre utilizarea acestuia."
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
                              <div className="px-4 pb-4 space-y-2">
                                {cat.cookies.map((cookie) => (
                                  <div
                                    key={cookie.name}
                                    className="flex items-center gap-2 text-xs text-muted-foreground pl-2"
                                  >
                                    <ChevronDown className="w-3 h-3 -rotate-90" />
                                    <span className="font-medium text-foreground">
                                      {cookie.name}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="p-6 pt-4 border-t border-border">
                    <Button
                      onClick={() => save(preferences)}
                      size="sm"
                      className="rounded-full px-6"
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
