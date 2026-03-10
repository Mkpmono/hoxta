import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/panel/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Languages, RefreshCw, Check, AlertCircle, Download } from "lucide-react";
import roCommon from "@/i18n/locales/ro/common.json";
import { reloadTranslations } from "@/i18n";

const LANGUAGES = [
  { code: "ro", name: "Română", flag: "🇷🇴" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
];

const TARGET_LANGS = ["en", "de", "fr", "es", "it"];

function countKeys(obj: any): number {
  let count = 0;
  for (const value of Object.values(obj)) {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      count += countKeys(value);
    } else {
      count++;
    }
  }
  return count;
}

// Flatten nested JSON to dot-notation
function flatten(obj: Record<string, any>, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      Object.assign(result, flatten(value, newKey));
    } else {
      result[newKey] = String(value);
    }
  }
  return result;
}

// Unflatten dot-notation back to nested
function unflatten(obj: Record<string, string>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const parts = key.split(".");
    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {};
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
  }
  return result;
}

function chunkObject(obj: Record<string, string>, size: number): Record<string, string>[] {
  const entries = Object.entries(obj);
  const chunks: Record<string, string>[] = [];
  for (let i = 0; i < entries.length; i += size) {
    chunks.push(Object.fromEntries(entries.slice(i, i + size)));
  }
  return chunks;
}

const CHUNK_SIZE = 50;
const RETRY_DELAY = 3000;

async function translateChunkWithRetry(
  chunk: Record<string, string>,
  targetLang: string,
  retries = 3
): Promise<Record<string, string>> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const { data, error } = await supabase.functions.invoke("translate-i18n", {
      body: { chunk, targetLang },
    });

    if (!error && data?.translated) {
      return data.translated;
    }

    // Rate limit - wait longer
    if (error?.message?.includes("429") || data?.error?.includes("Rate limit")) {
      await new Promise((r) => setTimeout(r, RETRY_DELAY * (attempt + 1)));
      continue;
    }

    if (attempt === retries - 1) {
      throw new Error(error?.message || data?.error || "Translation failed");
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error("Max retries reached");
}

export default function TranslationsAdmin() {
  const [translating, setTranslating] = useState(false);
  const [progress, setProgress] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  const [dbTranslations, setDbTranslations] = useState<Record<string, { data: any; updated_at: string }>>({});
  const [loading, setLoading] = useState(true);

  const totalKeys = countKeys(roCommon);

  useEffect(() => {
    loadTranslations();
  }, []);

  const loadTranslations = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("site_translations").select("*");
    if (!error && data) {
      const map: Record<string, { data: any; updated_at: string }> = {};
      for (const row of data) {
        map[row.lang] = { data: row.data, updated_at: row.updated_at };
      }
      setDbTranslations(map);
    }
    setLoading(false);
  };

  const translateLanguage = async (langCode: string, langIndex: number, totalLangs: number) => {
    const flat = flatten(roCommon);
    const chunks = chunkObject(flat, CHUNK_SIZE);
    const mergedFlat: Record<string, string> = {};

    for (let i = 0; i < chunks.length; i++) {
      const langName = LANGUAGES.find((l) => l.code === langCode)?.name || langCode;
      const overallProgress = ((langIndex * chunks.length + i) / (totalLangs * chunks.length)) * 100;
      setProgress(`${langName}: ${i + 1}/${chunks.length} bucăți...`);
      setProgressPercent(Math.round(overallProgress));

      const result = await translateChunkWithRetry(chunks[i], langCode);
      Object.assign(mergedFlat, result);

      // Small delay between chunks to avoid rate limits
      if (i < chunks.length - 1) {
        await new Promise((r) => setTimeout(r, 500));
      }
    }

    const nested = unflatten(mergedFlat);

    await supabase
      .from("site_translations")
      .upsert(
        { lang: langCode, data: nested as any, updated_at: new Date().toISOString() },
        { onConflict: "lang" }
      );

    return nested;
  };

  const handleTranslateAll = async () => {
    setTranslating(true);
    setProgressPercent(0);

    try {
      // Save RO first
      await supabase
        .from("site_translations")
        .upsert(
          { lang: "ro", data: roCommon as any, updated_at: new Date().toISOString() },
          { onConflict: "lang" }
        );

      for (let i = 0; i < TARGET_LANGS.length; i++) {
        await translateLanguage(TARGET_LANGS[i], i, TARGET_LANGS.length);
      }

      setProgressPercent(100);
      toast({ title: "✅ Traducere completă!", description: `Toate cele ${LANGUAGES.length} limbi au fost traduse.` });
      await loadTranslations();
      await reloadTranslations();
    } catch (err: any) {
      toast({ title: "Eroare", description: err.message, variant: "destructive" });
    } finally {
      setTranslating(false);
      setProgress("");
      setProgressPercent(0);
    }
  };

  const handleTranslateSingle = async (langCode: string) => {
    setTranslating(true);
    setProgressPercent(0);

    try {
      await translateLanguage(langCode, 0, 1);
      setProgressPercent(100);
      toast({ title: "✅ Tradus!", description: `${LANGUAGES.find((l) => l.code === langCode)?.name} actualizat.` });
      await loadTranslations();
      await reloadTranslations();
    } catch (err: any) {
      toast({ title: "Eroare", description: err.message, variant: "destructive" });
    } finally {
      setTranslating(false);
      setProgress("");
      setProgressPercent(0);
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

        {/* Source info + translate all */}
        <div className="bg-card border border-border/50 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">🇷🇴 Limba sursă: Română</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {totalKeys} chei de traducere • Fișierul <code className="bg-muted px-1.5 py-0.5 rounded text-xs">ro/common.json</code>
              </p>
            </div>
            <button
              onClick={handleTranslateAll}
              disabled={translating}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {translating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
              {translating ? "Se traduce..." : "Traduce Toate Limbile"}
            </button>
          </div>

          {/* Progress bar */}
          {translating && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-primary flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  {progress}
                </span>
                <span className="text-muted-foreground">{progressPercent}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Languages grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {LANGUAGES.map((lang) => {
            const dbData = dbTranslations[lang.code];
            const dbKeyCount = dbData ? countKeys(dbData.data) : 0;
            const isComplete = dbKeyCount >= totalKeys * 0.9;
            const lastUpdated = dbData?.updated_at
              ? new Date(dbData.updated_at).toLocaleDateString("ro-RO", {
                  day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                })
              : null;

            return (
              <div key={lang.code} className="bg-card border border-border/50 rounded-xl p-4 hover:border-primary/30 transition-colors">
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
                    <span>{totalKeys > 0 ? Math.round((dbKeyCount / totalKeys) * 100) : 0}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${Math.min((dbKeyCount / totalKeys) * 100, 100)}%` }}
                    />
                  </div>
                  {lastUpdated && <p className="text-xs text-muted-foreground">Actualizat: {lastUpdated}</p>}
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

        <div className="bg-muted/30 border border-border/30 rounded-xl p-4 text-sm text-muted-foreground space-y-2">
          <p><strong>Cum funcționează:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Textele din <code className="bg-muted px-1 rounded">ro/common.json</code> sunt sursa principală</li>
            <li>Traducerea se face în bucăți mici (~50 chei) pentru a evita timeout-urile</li>
            <li>Progresul este vizibil în timp real pe bara de progres</li>
            <li>Traducerile sunt salvate în baza de date și încărcate automat pe site</li>
            <li>Dacă apare rate-limit, sistemul reîncearcă automat după câteva secunde</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
