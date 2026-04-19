import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { supabase } from '@/integrations/supabase/client';
import { detectCountryFromCloudflare, mapCountryToLanguage } from '@/lib/geoLanguage';

import enCommon from './locales/en/common.json';
import roCommon from './locales/ro/common.json';
import deCommon from './locales/de/common.json';
import frCommon from './locales/fr/common.json';
import esCommon from './locales/es/common.json';
import itCommon from './locales/it/common.json';

// Static fallback list — DB drives the actual list of available languages at runtime
export const supportedLanguages = ['en', 'ro', 'de', 'fr', 'es', 'it', 'nl'] as const;
export type SupportedLanguage = string;

const resources: Record<string, { common: any }> = {
  en: { common: enCommon },
  ro: { common: roCommon },
  de: { common: deCommon },
  fr: { common: frCommon },
  es: { common: esCommon },
  it: { common: itCommon },
};

const MANUAL_KEY = 'lang_manual';
const LANG_KEY = 'lang';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common'],
    detection: {
      order: ['localStorage', 'htmlTag'],
      lookupLocalStorage: LANG_KEY,
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    saveMissing: import.meta.env.DEV,
  });

// Geo-detect (only if user hasn't picked manually). Runs every visit.
async function applyGeoDetectionIfNeeded(availableCodes: string[]) {
  try {
    const manual = localStorage.getItem(MANUAL_KEY) === '1';
    if (manual) return;

    const country = await detectCountryFromCloudflare();
    const target = mapCountryToLanguage(country, availableCodes);
    if (target && target !== i18n.language) {
      localStorage.setItem(LANG_KEY, target);
      await i18n.changeLanguage(target);
    }
  } catch (err) {
    console.warn('[i18n] geo-detect failed', err);
  }
}

// Load DB translations and merge (overrides static files)
async function loadDbTranslations() {
  try {
    const [{ data: tData }, { data: lData }] = await Promise.all([
      supabase.from('site_translations').select('lang, data'),
      supabase.from('site_languages').select('code').eq('is_enabled', true),
    ]);

    if (tData) {
      for (const row of tData) {
        if (row.lang && row.data && typeof row.data === 'object') {
          i18n.addResourceBundle(row.lang, 'common', row.data as Record<string, any>, true, true);
        }
      }
    }

    const availableCodes = (lData || []).map((r: any) => r.code);
    if (availableCodes.length > 0) {
      // If current language is no longer available, fall back to en
      if (!availableCodes.includes(i18n.language)) {
        await i18n.changeLanguage('en');
      }
      await applyGeoDetectionIfNeeded(availableCodes);
    }
  } catch (err) {
    console.warn('[i18n] Failed to load DB translations:', err);
  }
}

export const reloadTranslations = loadDbTranslations;

loadDbTranslations();

if (import.meta.env.DEV) {
  console.log(`[i18n] Current language: ${i18n.language}`);
}

export default i18n;
