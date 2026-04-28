import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/panel/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2, Globe, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { invalidateSiteSettingsCache } from "@/hooks/useSiteSettings";

interface SectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  url: string;
  setUrl: (v: string) => void;
  label: string;
  setLabel: (v: string) => void;
  translations: Record<string, string>;
  onTranslationChange: (lang: string, value: string) => void;
  urlHint: string;
}

function Section({
  title,
  icon: Icon,
  url,
  setUrl,
  label,
  setLabel,
  translations,
  onTranslationChange,
  urlHint,
}: SectionProps) {
  return (
    <div className="glass-card p-6 rounded-xl space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>URL / Link</Label>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder={urlHint} />
          <p className="text-xs text-muted-foreground mt-1">{urlHint}</p>
        </div>
        <div>
          <Label>Default label (fallback)</Label>
          <Input value={label} onChange={(e) => setLabel(e.target.value)} />
        </div>
      </div>
      <div>
        <Label className="mb-2 block">Per-language labels</Label>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {LANGS.map((l) => (
            <div key={l.code}>
              <Label className="text-xs uppercase text-muted-foreground">{l.label}</Label>
              <Input
                value={translations[l.code] || ""}
                onChange={(e) => onTranslationChange(l.code, e.target.value)}
                placeholder={label}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const LANGS = [
  { code: "en", label: "English" },
  { code: "ro", label: "Română" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "it", label: "Italiano" },
];

interface Settings {
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

const EMPTY: Settings = {
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

export default function SiteSettingsAdmin() {
  const [s, setS] = useState<Settings>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (data) {
        setS({
          ...EMPTY,
          ...(data as any),
          control_panel_label_translations:
            ((data as any).control_panel_label_translations as Record<string, string>) || {},
          terms_label_translations:
            ((data as any).terms_label_translations as Record<string, string>) || {},
          privacy_label_translations:
            ((data as any).privacy_label_translations as Record<string, string>) || {},
        });
      }
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    const payload: any = {
      control_panel_url: s.control_panel_url.trim(),
      control_panel_label: s.control_panel_label.trim(),
      control_panel_label_translations: s.control_panel_label_translations,
      terms_url: s.terms_url.trim(),
      terms_label: s.terms_label.trim(),
      terms_label_translations: s.terms_label_translations,
      privacy_url: s.privacy_url.trim(),
      privacy_label: s.privacy_label.trim(),
      privacy_label_translations: s.privacy_label_translations,
    };
    let res;
    if (s.id) {
      res = await supabase.from("site_settings").update(payload).eq("id", s.id);
    } else {
      res = await supabase.from("site_settings").insert({ ...payload, singleton: true });
    }
    setSaving(false);
    if (res.error) {
      toast({ title: "Save failed", description: res.error.message, variant: "destructive" });
      return;
    }
    invalidateSiteSettingsCache();
    toast({ title: "Settings saved" });
  };

  const updateTranslation = (
    key: "control_panel_label_translations" | "terms_label_translations" | "privacy_label_translations",
    lang: string,
    value: string,
  ) => {
    setS((p) => ({
      ...p,
      [key]: { ...(p[key] || {}), [lang]: value },
    }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Site Settings</h1>
          <p className="text-sm text-muted-foreground">
            Configure header & footer links — URL and per-language labels.
          </p>
        </div>

        <Section
          title="Control Panel button (Header)"
          icon={Globe}
          url={s.control_panel_url}
          setUrl={(v: string) => setS((p) => ({ ...p, control_panel_url: v }))}
          label={s.control_panel_label}
          setLabel={(v: string) => setS((p) => ({ ...p, control_panel_label: v }))}
          translations={s.control_panel_label_translations}
          onTranslationChange={(lang, v) => updateTranslation("control_panel_label_translations", lang, v)}
          urlHint="Full external URL, e.g. https://billing.hoxta.com"
        />

        <Section
          title="Terms of Service link (Footer)"
          icon={FileText}
          url={s.terms_url}
          setUrl={(v: string) => setS((p) => ({ ...p, terms_url: v }))}
          label={s.terms_label}
          setLabel={(v: string) => setS((p) => ({ ...p, terms_label: v }))}
          translations={s.terms_label_translations}
          onTranslationChange={(lang, v) => updateTranslation("terms_label_translations", lang, v)}
          urlHint="Internal route (/terms) or full external URL"
        />

        <Section
          title="Privacy Policy link (Footer)"
          icon={FileText}
          url={s.privacy_url}
          setUrl={(v: string) => setS((p) => ({ ...p, privacy_url: v }))}
          label={s.privacy_label}
          setLabel={(v: string) => setS((p) => ({ ...p, privacy_label: v }))}
          translations={s.privacy_label_translations}
          onTranslationChange={(lang, v) => updateTranslation("privacy_label_translations", lang, v)}
          urlHint="Internal route (/privacy) or full external URL"
        />

        <div className="flex justify-end">
          <Button onClick={save} disabled={saving} size="lg">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save settings
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
