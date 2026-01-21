import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from './locales/en/common.json';
import roCommon from './locales/ro/common.json';
import deCommon from './locales/de/common.json';
import frCommon from './locales/fr/common.json';
import esCommon from './locales/es/common.json';
import itCommon from './locales/it/common.json';

export const supportedLanguages = ['en', 'ro', 'de', 'fr', 'es', 'it'] as const;
export type SupportedLanguage = typeof supportedLanguages[number];

const resources = {
  en: { common: enCommon },
  ro: { common: roCommon },
  de: { common: deCommon },
  fr: { common: frCommon },
  es: { common: esCommon },
  it: { common: itCommon },
};

// Map browser language codes to our supported languages
function mapBrowserLanguage(browserLang: string): SupportedLanguage {
  const langCode = browserLang.toLowerCase().split('-')[0];
  
  if (supportedLanguages.includes(langCode as SupportedLanguage)) {
    return langCode as SupportedLanguage;
  }
  
  return 'en'; // Default fallback
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common'],
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'lang',
      caches: ['localStorage'],
      convertDetectedLanguage: (lng) => mapBrowserLanguage(lng),
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    // Show missing key warning in dev
    saveMissing: import.meta.env.DEV,
    missingKeyHandler: import.meta.env.DEV
      ? (lngs, ns, key) => {
          console.warn(`[i18n] Missing translation key: "${key}" for languages: ${lngs.join(', ')}`);
        }
      : undefined,
  });

// Dev helper: log current language once
if (import.meta.env.DEV) {
  console.log(`[i18n] Current language: ${i18n.language}`);
  console.log(`[i18n] Supported languages: ${supportedLanguages.join(', ')}`);
}

export default i18n;
