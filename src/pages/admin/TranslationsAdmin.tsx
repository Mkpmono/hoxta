import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/panel/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Languages, RefreshCw, Check, AlertCircle, Download, Sparkles } from "lucide-react";
import enCommon from "@/i18n/locales/en/common.json";
import { reloadTranslations } from "@/i18n";

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ro", name: "Română", flag: "🇷🇴" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
];

const TARGET_LANGS = ["ro", "de", "fr", "es", "it"];

function countKeys(obj: any): number {
  let count = 0;
  if (!obj || typeof obj !== "object") return 0;
  for (const value of Object.values(obj)) {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      count += countKeys(value);
    } else {
      count++;
    }
  }
  return count;
}

function flatten(obj: Record<string, any>, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};
  if (!obj || typeof obj !== "object") return result;
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
      body: { chunk, targetLang, sourceLang: "en" },
    });

    if (!error && data?.translated) {
      return data.translated;
    }

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

  const totalKeys = countKeys(enCommon);
  const sourceFlat = flatten(enCommon);

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

  // Compute missing keys for a given language by comparing EN flat vs DB flat
  const getMissingKeys = (langCode: string): Record<string, string> => {
    const dbData = dbTranslations[langCode]?.data || {};
    const dbFlat = flatten(dbData);
    const missing: Record<string, string> = {};
    for (const [key, value] of Object.entries(sourceFlat)) {
      if (!(key in dbFlat) || !dbFlat[key]) {
        missing[key] = value;
      }
    }
    return missing;
  };

  const totalMissing = TARGET_LANGS.reduce((sum, l) => sum + Object.keys(getMissingKeys(l)).length, 0);

  const translateLanguage = async (
    langCode: string,
    langIndex: number,
    totalLangs: number,
    onlyMissing = false
  ) => {
    const flat = onlyMissing ? getMissingKeys(langCode) : sourceFlat;
    if (Object.keys(flat).length === 0) {
      return null;
    }
    const chunks = chunkObject(flat, CHUNK_SIZE);
    const mergedFlat: Record<string, string> = {};

    for (let i = 0; i < chunks.length; i++) {
      const langName = LANGUAGES.find((l) => l.code === langCode)?.name || langCode;
      const overallProgress = ((langIndex * chunks.length + i) / (totalLangs * chunks.length)) * 100;
      setProgress(`${langName}: ${i + 1}/${chunks.length} bucăți (${Object.keys(chunks[i]).length} chei)...`);
      setProgressPercent(Math.round(overallProgress));

      const result = await translateChunkWithRetry(chunks[i], langCode);
      Object.assign(mergedFlat, result);

      if (i < chunks.length - 1) {
        await new Promise((r) => setTimeout(r, 500));
      }
    }

    const newNested = unflatten(mergedFlat);

    // Deep merge with existing DB data so we don't lose anything
    const existing = dbTranslations[langCode]?.data || {};
    const merged = deepMerge(existing, newNested);

    await supabase
      .from("site_translations")
      .upsert(
        { lang: langCode, data: merged as any, updated_at: new Date().toISOString() },
        { onConflict: "lang" }
      );

    return merged;
  };

  function deepMerge(a: any, b: any): any {
    if (typeof a !== "object" || a === null || Array.isArray(a)) return b;
    if (typeof b !== "object" || b === null || Array.isArray(b)) return b;
    const out: Record<string, any> = { ...a };
    for (const k of Object.keys(b)) {
      out[k] = k in a ? deepMerge(a[k], b[k]) : b[k];
    }
    return out;
  }

  const handleTranslateAll = async () => {
    if (!confirm(`Aceasta va RE-TRADUCE toate ${totalKeys} cheile pentru toate cele 5 limbi. Operațiunea durează câteva minute. Continui?`)) return;
    setTranslating(true);
    setProgressPercent(0);

    try {
      // Save EN as source-of-truth first
      await supabase
        .from("site_translations")
        .upsert(
          { lang: "en", data: enCommon as any, updated_at: new Date().toISOString() },
          { onConflict: "lang" }
        );

      for (let i = 0; i < TARGET_LANGS.length; i++) {
        await translateLanguage(TARGET_LANGS[i], i, TARGET_LANGS.length, false);
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

  const handleSyncMissing = async () => {
    if (totalMissing === 0) {
      toast({ title: "Nimic de sincronizat", description: "Toate limbile sunt la zi cu EN." });
      return;
    }
    setTranslating(true);
    setProgressPercent(0);

    try {
      // Always save EN snapshot
      await supabase
        .from("site_translations")
        .upsert(
          { lang: "en", data: enCommon as any, updated_at: new Date().toISOString() },
          { onConflict: "lang" }
        );

      const langsToSync = TARGET_LANGS.filter((l) => Object.keys(getMissingKeys(l)).length > 0);
      for (let i = 0; i < langsToSync.length; i++) {
        await translateLanguage(langsToSync[i], i, langsToSync.length, true);
      }

      setProgressPercent(100);
      toast({ title: "✅ Sincronizat!", description: `${totalMissing} chei noi traduse.` });
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

  const handleTranslateSingle = async (langCode: string, onlyMissing = false) => {
    setTranslating(true);
    setProgressPercent(0);

    try {
      const result = await translateLanguage(langCode, 0, 1, onlyMissing);
      if (result === null) {
        toast({ title: "Nimic de tradus", description: "Această limbă este deja completă." });
      } else {
        setProgressPercent(100);
        toast({ title: "✅ Tradus!", description: `${LANGUAGES.find((l) => l.code === langCode)?.name} actualizat.` });
      }
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
    const data = lang === "en" ? enCommon : dbTranslations[lang]?.data;
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
              Detectează automat texte noi adăugate pe site și le traduce în toate limbile.
            </p>
          </div>
        </div>

        {/* Source info + actions */}
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-semibold text-foreground">🇬🇧 Limba sursă: English</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {totalKeys} chei totale • Fișier <code className="bg-muted px-1.5 py-0.5 rounded text-xs">en/common.json</code>
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleSyncMissing}
                disabled={translating || totalMissing === 0}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                title="Detectează și traduce doar cheile noi care lipsesc"
              >
                {translating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {totalMissing > 0 ? `Sincronizează (${totalMissing} chei noi)` : "Totul e la zi ✓"}
              </button>
              <button
                onClick={handleTranslateAll}
                disabled={translating}
                className="flex items-center gap-2 px-4 py-2.5 bg-muted text-muted-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors disabled:opacity-50"
                title="Re-traduce TOTUL de la zero"
              >
                <Languages className="w-4 h-4" />
                Re-traduce tot
              </button>
            </div>
          </div>

          {translating && (
            <div className="space-y-2">
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
            const isSource = lang.code === "en";
            const dbData = dbTranslations[lang.code];
            const dbKeyCount = isSource ? totalKeys : (dbData ? countKeys(dbData.data) : 0);
            const missingCount = isSource ? 0 : Object.keys(getMissingKeys(lang.code)).length;
            const isComplete = missingCount === 0 && dbKeyCount > 0;
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
                      <span className="text-xs text-muted-foreground uppercase">{lang.code}{isSource && " • sursă"}</span>
                    </div>
                  </div>
                  {isComplete || isSource ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : missingCount > 0 ? (
                    <AlertCircle className="w-4 h-4 text-amber-500" />
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
                  {missingCount > 0 && (
                    <p className="text-xs text-amber-600 dark:text-amber-400">⚠ {missingCount} chei noi de tradus</p>
                  )}
                  {lastUpdated && <p className="text-xs text-muted-foreground">Actualizat: {lastUpdated}</p>}
                </div>

                <div className="flex gap-2 mt-3">
                  {!isSource && (
                    <>
                      {missingCount > 0 && (
                        <button
                          onClick={() => handleTranslateSingle(lang.code, true)}
                          disabled={translating}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50"
                        >
                          <Sparkles className="w-3 h-3" />
                          Doar lipsuri
                        </button>
                      )}
                      <button
                        onClick={() => handleTranslateSingle(lang.code, false)}
                        disabled={translating}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3 h-3 ${translating ? "animate-spin" : ""}`} />
                        Re-traduce
                      </button>
                    </>
                  )}
                  {(dbKeyCount > 0 || isSource) && (
                    <button
                      onClick={() => downloadJson(lang.code)}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-muted/30 border border-border/30 rounded-xl p-4 text-sm text-muted-foreground space-y-2">
          <p><strong className="text-foreground">Cum funcționează pentru pagini noi:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Adaugă chei noi în <code className="bg-muted px-1 rounded">en/common.json</code> și folosește <code className="bg-muted px-1 rounded">{`t("noua.cheie")`}</code> în componente</li>
            <li>Vino aici și apasă <strong>"Sincronizează"</strong> — sistemul detectează automat cheile noi și le traduce în toate limbile</li>
            <li>Cheile existente NU sunt re-traduse (economie de timp și API calls)</li>
            <li>Traducerile sunt salvate în baza de date și fac override pe fișierele JSON statice</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
