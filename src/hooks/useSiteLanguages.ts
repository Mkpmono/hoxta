import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteLanguage {
  id: string;
  code: string;
  name: string;
  flag_code: string;
  sort_order: number;
  is_enabled: boolean;
}

const FALLBACK: SiteLanguage[] = [
  { id: "en", code: "en", name: "English", flag_code: "gb", sort_order: 1, is_enabled: true },
  { id: "ro", code: "ro", name: "Română", flag_code: "ro", sort_order: 2, is_enabled: true },
  { id: "de", code: "de", name: "Deutsch", flag_code: "de", sort_order: 3, is_enabled: true },
  { id: "fr", code: "fr", name: "Français", flag_code: "fr", sort_order: 4, is_enabled: true },
  { id: "es", code: "es", name: "Español", flag_code: "es", sort_order: 5, is_enabled: true },
  { id: "it", code: "it", name: "Italiano", flag_code: "it", sort_order: 6, is_enabled: true },
];

export function useSiteLanguages() {
  const [languages, setLanguages] = useState<SiteLanguage[]>(FALLBACK);
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    const { data, error } = await supabase
      .from("site_languages")
      .select("*")
      .eq("is_enabled", true)
      .order("sort_order", { ascending: true });
    if (!error && data && data.length > 0) {
      setLanguages(data as SiteLanguage[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    refetch();
  }, []);

  return { languages, loading, refetch };
}
