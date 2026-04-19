import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteLanguages } from "@/hooks/useSiteLanguages";
import "flag-icons/css/flag-icons.min.css";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { languages } = useSiteLanguages();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLangCode = (i18n.language?.split("-")[0] || "en");
  const currentLang =
    languages.find((l) => l.code === currentLangCode) ||
    languages[0] || { code: "en", name: "English", flag_code: "gb" };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
    localStorage.setItem("lang_manual", "1");
    setIsOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-white/5 transition-all duration-200"
        aria-label="Select language"
      >
        <span className={`fi fi-${currentLang.flag_code} rounded-sm`} style={{ fontSize: "14px" }} />
        <span className="hidden md:inline text-xs">{currentLang.code.toUpperCase()}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-44 rounded-lg bg-card border border-border shadow-xl overflow-hidden z-50 max-h-80 overflow-y-auto"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                  currentLangCode === lang.code
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-white/5"
                }`}
              >
                <span className={`fi fi-${lang.flag_code} rounded-sm`} style={{ fontSize: "16px" }} />
                <span className="font-medium">{lang.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
