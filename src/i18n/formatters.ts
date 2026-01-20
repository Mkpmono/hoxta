import { useTranslation } from "react-i18next";
import { useMemo } from "react";

/**
 * Hook for locale-aware currency formatting
 */
export function useCurrencyFormatter() {
  const { i18n } = useTranslation();

  return useMemo(() => {
    const locale = i18n.language === "ro" ? "ro-RO" : "en-US";
    
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [i18n.language]);
}

/**
 * Hook for locale-aware date formatting
 */
export function useDateFormatter(options?: Intl.DateTimeFormatOptions) {
  const { i18n } = useTranslation();

  return useMemo(() => {
    const locale = i18n.language === "ro" ? "ro-RO" : "en-US";
    
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      ...options,
    });
  }, [i18n.language, options]);
}

/**
 * Hook for locale-aware number formatting
 */
export function useNumberFormatter(options?: Intl.NumberFormatOptions) {
  const { i18n } = useTranslation();

  return useMemo(() => {
    const locale = i18n.language === "ro" ? "ro-RO" : "en-US";
    
    return new Intl.NumberFormat(locale, options);
  }, [i18n.language, options]);
}

/**
 * Format currency using current locale
 */
export function formatCurrency(amount: number, language: string = "en"): string {
  const locale = language === "ro" ? "ro-RO" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date using current locale
 */
export function formatDate(date: Date | string, language: string = "en"): string {
  const locale = language === "ro" ? "ro-RO" : "en-US";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
}
