import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supportedLanguages, type SupportedLanguage } from "@/i18n";
import "flag-icons/css/flag-icons.min.css";

interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  flagCode: string; // ISO 3166-1 alpha-2 for flag-icons
}

const languages: LanguageOption[] = [
  { code: "en", label: "English", flagCode: "gb" },
  { code: "ro", label: "Română", flagCode: "ro" },
  { code: "de", label: "Deutsch", flagCode: "de" },
  { code: "fr", label: "Français", flagCode: "fr" },
  { code: "es", label: "Español", flagCode: "es" },
  { code: "it", label: "Italiano", flagCode: "it" },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLangCode = (i18n.language?.split('-')[0] || 'en') as SupportedLanguage;
  const currentLang = languages.find((l) => l.code === currentLangCode) || languages[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (code: SupportedLanguage) => {
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
    setIsOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-white/5 transition-all duration-200"
        aria-label="Select language"
      >
        <span className={`fi fi-${currentLang.flagCode} rounded-sm`} style={{ fontSize: '14px' }} />
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
            className="absolute top-full right-0 mt-2 w-44 rounded-lg bg-card border border-border shadow-xl overflow-hidden z-50"
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
                <span className={`fi fi-${lang.flagCode} rounded-sm`} style={{ fontSize: '16px' }} />
                <span className="font-medium">{lang.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
