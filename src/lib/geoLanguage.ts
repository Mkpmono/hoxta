// Map ISO country code → preferred language code available on the site
const COUNTRY_LANG_MAP: Record<string, string> = {
  // Romanian
  RO: "ro", MD: "ro",
  // German
  DE: "de", AT: "de", CH: "de", LI: "de",
  // French
  FR: "fr", BE: "nl", LU: "fr", MC: "fr",
  // Spanish (Spain + LATAM)
  ES: "es", MX: "es", AR: "es", CO: "es", CL: "es", PE: "es", VE: "es",
  UY: "es", PY: "es", BO: "es", EC: "es", CR: "es", PA: "es", DO: "es",
  GT: "es", HN: "es", NI: "es", SV: "es", CU: "es", PR: "es",
  // Italian
  IT: "it", SM: "it", VA: "it",
  // Dutch
  NL: "nl",
};

export function mapCountryToLanguage(country: string | null, available: string[]): string {
  if (!country) return "en";
  const upper = country.toUpperCase();
  const preferred = COUNTRY_LANG_MAP[upper];
  if (preferred && available.includes(preferred)) return preferred;
  return "en";
}

export async function detectCountryFromCloudflare(): Promise<string | null> {
  try {
    const res = await fetch("https://www.cloudflare.com/cdn-cgi/trace", {
      cache: "no-store",
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) return null;
    const text = await res.text();
    const match = text.match(/loc=([A-Z]{2})/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}
