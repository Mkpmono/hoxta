import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

export interface SiteSettings {
  id?: string;
  control_panel_url: string;
  control_panel_label: string;
  control_panel_label_translations: Record<string, string>;
  terms_url: string;
  terms_label: string;
  terms_label_translations: Record<string, string>;
  privacy_url: string;
  privacy_label: string;
  privacy_label_translations: Record<string, string>;
}

const DEFAULT_SETTINGS: SiteSettings = {
  control_panel_url: "https://billing.hoxta.com",
  control_panel_label: "Control Panel",
  control_panel_label_translations: {},
  terms_url: "/terms",
  terms_label: "Terms of Service",
  terms_label_translations: {},
  privacy_url: "/privacy",
  privacy_label: "Privacy Policy",
  privacy_label_translations: {},
};

let cached: SiteSettings | null = null;
let inflight: Promise<SiteSettings> | null = null;

async function fetchSettings(): Promise<SiteSettings> {
  if (cached) return cached;
  if (inflight) return inflight;
  inflight = (async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();
    const merged: SiteSettings = {
      ...DEFAULT_SETTINGS,
      ...(data || {}),
      control_panel_label_translations:
        ((data as any)?.control_panel_label_translations as Record<string, string>) || {},
      terms_label_translations:
        ((data as any)?.terms_label_translations as Record<string, string>) || {},
      privacy_label_translations:
        ((data as any)?.privacy_label_translations as Record<string, string>) || {},
    };
    cached = merged;
    return merged;
  })();
  return inflight;
}

export function invalidateSiteSettingsCache() {
  cached = null;
  inflight = null;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(cached ?? DEFAULT_SETTINGS);
  const { i18n } = useTranslation();
  const lang = i18n.language?.split("-")[0] || "en";

  useEffect(() => {
    let mounted = true;
    fetchSettings().then((s) => {
      if (mounted) setSettings(s);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const localized = (label: string, map: Record<string, string>) =>
    (map && map[lang]) || label;

  return {
    settings,
    controlPanelUrl: settings.control_panel_url,
    controlPanelLabel: localized(settings.control_panel_label, settings.control_panel_label_translations),
    termsUrl: settings.terms_url,
    termsLabel: localized(settings.terms_label, settings.terms_label_translations),
    privacyUrl: settings.privacy_url,
    privacyLabel: localized(settings.privacy_label, settings.privacy_label_translations),
  };
}
