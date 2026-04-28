import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

const cache = new Map<string, any>();
const inflight = new Map<string, Promise<any>>();

async function fetchPage(slug: string) {
  if (cache.has(slug)) return cache.get(slug);
  if (inflight.has(slug)) return inflight.get(slug);
  const p = (async () => {
    const { data } = await supabase
      .from("editable_pages")
      .select("content, translations")
      .eq("slug", slug)
      .maybeSingle();
    cache.set(slug, data || null);
    return data;
  })();
  inflight.set(slug, p);
  return p;
}

export function invalidateEditablePageCache(slug?: string) {
  if (slug) {
    cache.delete(slug);
    inflight.delete(slug);
  } else {
    cache.clear();
    inflight.clear();
  }
}

/**
 * Returns the page content localized for the current language.
 * Falls back to defaults when no DB row exists or translation missing.
 */
export function useEditablePage<T = any>(slug: string, defaults: T): T {
  const { i18n } = useTranslation();
  const lang = (i18n.language || "en").split("-")[0];
  const [data, setData] = useState<{ content: any; translations: any } | null>(
    cache.get(slug) ?? null,
  );

  useEffect(() => {
    let mounted = true;
    fetchPage(slug).then((d) => {
      if (mounted) setData(d);
    });
    return () => {
      mounted = false;
    };
  }, [slug]);

  if (!data?.content) return defaults;

  const translated = data.translations?.[lang];
  const merged = translated && typeof translated === "object"
    ? deepMerge(data.content, translated)
    : data.content;

  return deepMerge(defaults as any, merged) as T;
}

// Deep-merge: b values override a values; arrays from b replace arrays from a.
function deepMerge(a: any, b: any): any {
  if (b === undefined || b === null) return a;
  if (Array.isArray(a) || Array.isArray(b)) return b ?? a;
  if (typeof a !== "object" || typeof b !== "object") return b ?? a;
  const out: any = { ...a };
  for (const k of Object.keys(b)) {
    out[k] = deepMerge(a?.[k], b[k]);
  }
  return out;
}
