import i18n from "@/i18n";

/**
 * Get a translated field from a record's translations JSONB column.
 * Falls back to the original field value if no translation exists.
 */
export function getTranslatedField(
  record: { translations?: Record<string, Record<string, string>> | null; [key: string]: any },
  fieldName: string
): string {
  const lang = i18n.language || "en";
  
  // Try to get translated version
  if (record.translations && typeof record.translations === "object") {
    const langTranslations = record.translations[lang];
    if (langTranslations && langTranslations[fieldName]) {
      return langTranslations[fieldName];
    }
  }
  
  // Fallback to original field
  return record[fieldName] || "";
}
