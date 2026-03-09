import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/panel/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Languages, RefreshCw, Check, AlertCircle, Download, Upload } from "lucide-react";
import roCommon from "@/i18n/locales/ro/common.json";

const LANGUAGES = [
  { code: "ro", name: "Română", flag: "🇷🇴" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
];

function countKeys(obj: any, prefix = ""): number {
  let count = 0;
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      count += countKeys(value, `${prefix}${key}.`);
    } else {
      count++;
    }
  }
  return count;
}

export default function TranslationsAdmin() {
  const [translating, setTranslating] = useState(false);
  const [progress, setProgress] = useState("");
  const [dbTranslations, setDbTranslations] = useState<Record<string, { data: any; updated_at: string }>>({});
  const [loading, setLoading] = useState(true);

  const totalKeys = countKeys(roCommon);

  useEffect(() => {
    loadTranslations();
  }, []);

  const loadTranslations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("site_translations")
      .select("*");
    
    if (!error && data) {
      const map: Record<string, { data: any; updated_at: string }> = {};
      for (const row of data) {
        map[row.lang] = { data: row.data, updated_at: row.updated_at };
      }
      setDbTranslations(map);
    }
    setLoading(false);
  };

  const handleTranslateAll = async () => {
    setTranslating(true);
    setProgress("Se trimite textul pentru traducere... (poate dura 1-3 minute)");

    try {
      const { data, error } = await supabase.functions.invoke("translate-i18n", {
        body: { roData: roCommon },
      });

      if (error) {
        toast({ title: "Eroare traducere", description: error.message, variant: "destructive" });
        setTranslating(false);
        setProgress("");
        return;
      }

      const translations = data.translations as Record<string, any>;
      setProgress("Se salvează traducerile în baza de date...");

      // Save each language to DB
      for (const [lang, langData] of Object.entries(translations)) {
        const { error: upsertError } = await supabase
          .from("site_translations")
          .upsert(
            { lang, data: langData as any, updated_at: new Date().toISOString() },
            { onConflict: "lang" }
          );
        
        if (upsertError) {
          console.error(`Error saving ${lang}:`, upsertError);
        }
      }

      toast({ title: "✅ Traducere completă!", description: `Toate cele ${LANGUAGES.length} limbi au fost traduse automat.` });
      await loadTranslations();
    } catch (err: any) {
      toast({ title: "Eroare", description: err.message, variant: "destructive" });
    } finally {
      setTranslating(false);
      setProgress("");
    }
  };

  const handleTranslateSingle = async (langCode: string) => {
    setTranslating(true);
    setProgress(`Se traduce în ${LANGUAGES.find(l => l.code === langCode)?.name}...`);

    try {
      const { data, error } = await supabase.functions.invoke("translate-i18n", {
        body: { roData: roCommon, targetLangs: [langCode] },
      });

      if (error) {
        toast({ title: "Eroare", description: error.message, variant: "destructive" });
        return;
      }

      const translations = data.translations;
      const langData = translations[langCode];

      if (langData) {
        await supabase
          .from("site_translations")
          .upsert(
            { lang: langCode, data: langData as any, updated_at: new Date().toISOString() },
            { onConflict: "lang" }
          );
      }

      // Also save ro
      await supabase
        .from("site_translations")
        .upsert(
          { lang: "ro", data: roCommon as any, updated_at: new Date().toISOString() },
          { onConflict: "lang" }
        );

      toast({ title: "✅ Tradus!", description: `${LANGUAGES.find(l => l.code === langCode)?.name} actualizat.` });
      await loadTranslations();
    } catch (err: any) {
      toast({ title: "Eroare", description: err.message, variant: "destructive" });
    } finally {
      setTranslating(false);
      setProgress("");
    }
  };

  const downloadJson = (lang: string) => {
    const data = dbTranslations[lang]?.data;
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${lang}-common.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Languages className="w-7 h-7 text-primary" />
              Traduceri Automate Site
            </h1>
            <p className="text-muted-foreground mt-1">
              Traduce automat toate textele din interfață din Română în toate limbile suportate.
            </p>
          </div>
        </div>

        {/* Source info */}
        <div className="bg-card border border-border/50 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">🇷🇴 Limba sursă: Română</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {totalKeys} chei de traducere • Fișierul <code className="bg-muted px-1.5 py-0.5 rounded text-xs">ro/common.json</code> este sursa principală
              </p>
            </div>
            <button
              onClick={handleTranslateAll}
              disabled={translating}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {translating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Languages className="w-4 h-4" />
              )}
              {translating ? "Se traduce..." : "Traduce Toate Limbile"}
            </button>
          </div>

          {progress && (
            <div className="mt-4 flex items-center gap-2 text-sm text-primary">
              <RefreshCw className="w-4 h-4 animate-spin" />
              {progress}
            </div>
          )}
        </div>

        {/* Languages grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {LANGUAGES.map((lang) => {
            const dbData = dbTranslations[lang.code];
            const dbKeyCount = dbData ? countKeys(dbData.data) : 0;
            const isComplete = dbKeyCount >= totalKeys * 0.9; // 90%+ = complete
            const lastUpdated = dbData?.updated_at
              ? new Date(dbData.updated_at).toLocaleDateString("ro-RO", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
              : null;

            return (
              <div
                key={lang.code}
                className="bg-card border border-border/50 rounded-xl p-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{lang.flag}</span>
                    <div>
                      <h4 className="font-medium text-foreground text-sm">{lang.name}</h4>
                      <span className="text-xs text-muted-foreground uppercase">{lang.code}</span>
                    </div>
                  </div>
                  {isComplete ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : dbKeyCount > 0 ? (
                    <AlertCircle className="w-4 h-4 text-primary/60" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-muted-foreground/30" />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{dbKeyCount} / {totalKeys} chei</span>
                    <span>{Math.round((dbKeyCount / totalKeys) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${Math.min((dbKeyCount / totalKeys) * 100, 100)}%` }}
                    />
                  </div>
                  {lastUpdated && (
                    <p className="text-xs text-muted-foreground">Actualizat: {lastUpdated}</p>
                  )}
                </div>

                <div className="flex gap-2 mt-3">
                  {lang.code !== "ro" && (
                    <button
                      onClick={() => handleTranslateSingle(lang.code)}
                      disabled={translating}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 ${translating ? "animate-spin" : ""}`} />
                      Retraduce
                    </button>
                  )}
                  {dbKeyCount > 0 && (
                    <button
                      onClick={() => downloadJson(lang.code)}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      JSON
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Info */}
        <div className="bg-muted/30 border border-border/30 rounded-xl p-4 text-sm text-muted-foreground space-y-2">
          <p><strong>Cum funcționează:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Textele din <code className="bg-muted px-1 rounded">ro/common.json</code> sunt sursa principală</li>
            <li>La apăsarea butonului, AI-ul traduce automat în toate cele 5 limbi</li>
            <li>Traducerile sunt salvate în baza de date și încărcate automat pe site</li>
            <li>Când adaugi text nou în română, apasă din nou "Traduce Toate" pentru actualizare</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
