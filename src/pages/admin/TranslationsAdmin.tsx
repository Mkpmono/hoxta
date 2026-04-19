import { useState, useEffect, useMemo } from "react";
import { AdminLayout } from "@/components/panel/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Languages, RefreshCw, Check, AlertCircle, Download, Sparkles, Plus, Trash2, X } from "lucide-react";
import enCommon from "@/i18n/locales/en/common.json";
import { reloadTranslations } from "@/i18n";
import { useSiteLanguages, type SiteLanguage } from "@/hooks/useSiteLanguages";
import "flag-icons/css/flag-icons.min.css";

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

function deepMerge(a: any, b: any): any {
  if (typeof a !== "object" || a === null || Array.isArray(a)) return b;
  if (typeof b !== "object" || b === null || Array.isArray(b)) return b;
  const out: Record<string, any> = { ...a };
  for (const k of Object.keys(b)) {
    out[k] = k in a ? deepMerge(a[k], b[k]) : b[k];
  }
  return out;
}

const CHUNK_SIZE = 50;
const RETRY_DELAY = 3000;

async function translateChunkWithRetry(
  chunk: Record<string, string>,
  targetLang: string,
  targetLangName: string,
  retries = 3
): Promise<Record<string, string>> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const { data, error } = await supabase.functions.invoke("translate-i18n", {
      body: { chunk, targetLang, targetLangName, sourceLang: "en" },
    });

    if (!error && data?.translated) return data.translated;

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
  const { languages, refetch: refetchLanguages } = useSiteLanguages();
  const [translating, setTranslating] = useState(false);
  const [progress, setProgress] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  const [dbTranslations, setDbTranslations] = useState<Record<string, { data: any; updated_at: string }>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLang, setNewLang] = useState({ code: "", name: "", flag_code: "" });
  const [adding, setAdding] = useState(false);

  const totalKeys = countKeys(enCommon);
  const sourceFlat = flatten(enCommon);

  const targetLangs = useMemo(
    () => languages.filter((l) => l.code !== "en").map((l) => l.code),
    [languages]
  );

  useEffect(() => {
    loadTranslations();
  }, []);

  const loadTranslations = async () => {
    const { data, error } = await supabase.from("site_translations").select("*");
    if (!error && data) {
      const map: Record<string, { data: any; updated_at: string }> = {};
      for (const row of data) {
        map[row.lang] = { data: row.data, updated_at: row.updated_at };
      }
      setDbTranslations(map);
    }
  };

  const getMissingKeys = (langCode: string): Record<string, string> => {
    const dbData = dbTranslations[langCode]?.data || {};
    const dbFlat = flatten(dbData);
    const missing: Record<string, string> = {};
    for (const [key, value] of Object.entries(sourceFlat)) {
      if (!(key in dbFlat) || !dbFlat[key]) missing[key] = value;
    }
    return missing;
  };

  const totalMissing = targetLangs.reduce((sum, l) => sum + Object.keys(getMissingKeys(l)).length, 0);

  const translateLanguage = async (
    lang: SiteLanguage,
    langIndex: number,
    totalLangs: number,
    onlyMissing = false
  ) => {
    const flat = onlyMissing ? getMissingKeys(lang.code) : sourceFlat;
    if (Object.keys(flat).length === 0) return null;
    const chunks = chunkObject(flat, CHUNK_SIZE);
    const mergedFlat: Record<string, string> = {};

    for (let i = 0; i < chunks.length; i++) {
      const overallProgress = ((langIndex * chunks.length + i) / (totalLangs * chunks.length)) * 100;
      setProgress(`${lang.name}: ${i + 1}/${chunks.length} bucăți (${Object.keys(chunks[i]).length} chei)...`);
      setProgressPercent(Math.round(overallProgress));

      const result = await translateChunkWithRetry(chunks[i], lang.code, lang.name);
      Object.assign(mergedFlat, result);

      if (i < chunks.length - 1) await new Promise((r) => setTimeout(r, 500));
    }

    const newNested = unflatten(mergedFlat);
    const existing = dbTranslations[lang.code]?.data || {};
    const merged = deepMerge(existing, newNested);

    await supabase
      .from("site_translations")
      .upsert(
        { lang: lang.code, data: merged as any, updated_at: new Date().toISOString() },
        { onConflict: "lang" }
      );

    return merged;
  };

  const handleTranslateAll = async () => {
    if (!confirm(`Aceasta va RE-TRADUCE toate ${totalKeys} cheile pentru toate limbile țintă. Continui?`)) return;
    setTranslating(true);
    setProgressPercent(0);

    try {
      await supabase
        .from("site_translations")
        .upsert(
          { lang: "en", data: enCommon as any, updated_at: new Date().toISOString() },
          { onConflict: "lang" }
        );

      const targets = languages.filter((l) => l.code !== "en");
      for (let i = 0; i < targets.length; i++) {
        await translateLanguage(targets[i], i, targets.length, false);
      }

      setProgressPercent(100);
      toast({ title: "✅ Traducere completă!" });
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
      toast({ title: "Nimic de sincronizat" });
      return;
    }
    setTranslating(true);
    setProgressPercent(0);

    try {
      await supabase
        .from("site_translations")
        .upsert(
          { lang: "en", data: enCommon as any, updated_at: new Date().toISOString() },
          { onConflict: "lang" }
        );

      const targets = languages.filter(
        (l) => l.code !== "en" && Object.keys(getMissingKeys(l.code)).length > 0
      );
      for (let i = 0; i < targets.length; i++) {
        await translateLanguage(targets[i], i, targets.length, true);
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

  const handleTranslateSingle = async (lang: SiteLanguage, onlyMissing = false) => {
    setTranslating(true);
    setProgressPercent(0);
    try {
      const result = await translateLanguage(lang, 0, 1, onlyMissing);
      if (result === null) {
        toast({ title: "Nimic de tradus" });
      } else {
        setProgressPercent(100);
        toast({ title: "✅ Tradus!", description: `${lang.name} actualizat.` });
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

  const handleAddLanguage = async () => {
    const code = newLang.code.trim().toLowerCase();
    const name = newLang.name.trim();
    const flag = newLang.flag_code.trim().toLowerCase();
    if (!code || !name || !flag) {
      toast({ title: "Câmpuri lipsă", description: "Cod, nume și steag obligatorii.", variant: "destructive" });
      return;
    }
    if (languages.some((l) => l.code === code)) {
      toast({ title: "Există deja", description: `Limba ${code} este deja adăugată.`, variant: "destructive" });
      return;
    }

    setAdding(true);
    try {
      const maxOrder = Math.max(0, ...languages.map((l) => l.sort_order));
      const { error } = await supabase.from("site_languages").insert({
        code,
        name,
        flag_code: flag,
        sort_order: maxOrder + 1,
        is_enabled: true,
      });
      if (error) throw error;

      toast({ title: "✅ Limbă adăugată", description: `${name} (${code}). Începe traducerea automată...` });
      setShowAddModal(false);
      setNewLang({ code: "", name: "", flag_code: "" });
      await refetchLanguages();

      // Auto-translate immediately
      const newLangObj: SiteLanguage = {
        id: code,
        code,
        name,
        flag_code: flag,
        sort_order: maxOrder + 1,
        is_enabled: true,
      };
      await handleTranslateSingle(newLangObj, false);
    } catch (err: any) {
      toast({ title: "Eroare", description: err.message, variant: "destructive" });
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteLanguage = async (lang: SiteLanguage) => {
    if (lang.code === "en") {
      toast({ title: "Nu poți șterge EN", description: "Engleza este limba sursă.", variant: "destructive" });
      return;
    }
    if (!confirm(`Sigur vrei să ștergi limba ${lang.name} (${lang.code})? Traducerile vor fi păstrate în DB dar nu mai apar în meniu.`)) return;

    const { error } = await supabase.from("site_languages").delete().eq("id", lang.id);
    if (error) {
      toast({ title: "Eroare", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Limbă eliminată", description: `${lang.name} nu mai apare în meniu.` });
    await refetchLanguages();
    await reloadTranslations();
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
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Languages className="w-7 h-7 text-primary" />
              Traduceri Automate Site
            </h1>
            <p className="text-muted-foreground mt-1">
              Detectează automat texte noi și le traduce. Adaugă limbi noi cu auto-traducere AI.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adaugă limbă
          </button>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-semibold text-foreground">🇬🇧 Limba sursă: English</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {totalKeys} chei totale • {languages.length} limbi active
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleSyncMissing}
                disabled={translating || totalMissing === 0}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {translating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {totalMissing > 0 ? `Sincronizează (${totalMissing} chei noi)` : "Totul e la zi ✓"}
              </button>
              <button
                onClick={handleTranslateAll}
                disabled={translating}
                className="flex items-center gap-2 px-4 py-2.5 bg-muted text-muted-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors disabled:opacity-50"
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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {languages.map((lang) => {
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
                    <span className={`fi fi-${lang.flag_code} rounded-sm`} style={{ fontSize: "20px" }} />
                    <div>
                      <h4 className="font-medium text-foreground text-sm">{lang.name}</h4>
                      <span className="text-xs text-muted-foreground uppercase">{lang.code}{isSource && " • sursă"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {isComplete || isSource ? (
                      <Check className="w-4 h-4 text-primary" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-primary/70" />
                    )}
                    {!isSource && (
                      <button
                        onClick={() => handleDeleteLanguage(lang)}
                        disabled={translating}
                        className="p-1 text-muted-foreground/50 hover:text-destructive transition-colors disabled:opacity-30"
                        title="Elimină limba din meniu"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
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
                    <p className="text-xs text-primary/80">⚠ {missingCount} chei noi de tradus</p>
                  )}
                  {lastUpdated && <p className="text-xs text-muted-foreground">Actualizat: {lastUpdated}</p>}
                </div>

                <div className="flex gap-2 mt-3">
                  {!isSource && (
                    <>
                      {missingCount > 0 && (
                        <button
                          onClick={() => handleTranslateSingle(lang, true)}
                          disabled={translating}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50"
                        >
                          <Sparkles className="w-3 h-3" />
                          Doar lipsuri
                        </button>
                      )}
                      <button
                        onClick={() => handleTranslateSingle(lang, false)}
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
          <p><strong className="text-foreground">Auto-detecție regiune:</strong> site-ul detectează automat țara vizitatorului prin Cloudflare și setează limba: RO→Română, DE/AT/CH→Germană, FR→Franceză, ES/Mexic/LATAM→Spaniolă, IT→Italiană, NL/BE→Olandeză, restul→Engleză. Detecția se reaplică la fiecare vizită până când userul alege manual o limbă din switcher.</p>
        </div>
      </div>

      {/* Add Language Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Adaugă limbă nouă</h3>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Cod ISO 639-1 (2 litere)</label>
                <input
                  type="text"
                  maxLength={3}
                  placeholder="ex: pt, pl, ja"
                  value={newLang.code}
                  onChange={(e) => setNewLang({ ...newLang, code: e.target.value.toLowerCase() })}
                  className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Nume afișat</label>
                <input
                  type="text"
                  placeholder="ex: Português, Polski, 日本語"
                  value={newLang.name}
                  onChange={(e) => setNewLang({ ...newLang, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Cod steag ISO 3166-1 alpha-2 (2 litere)</label>
                <input
                  type="text"
                  maxLength={2}
                  placeholder="ex: pt, pl, jp"
                  value={newLang.flag_code}
                  onChange={(e) => setNewLang({ ...newLang, flag_code: e.target.value.toLowerCase() })}
                  className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm"
                />
                {newLang.flag_code && (
                  <span className={`fi fi-${newLang.flag_code} rounded-sm mt-2 inline-block`} style={{ fontSize: "24px" }} />
                )}
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-xs text-foreground">
              💡 După adăugare, AI va traduce automat toate cele {totalKeys} chei. Durează 1-3 minute.
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                disabled={adding}
                className="px-4 py-2 text-sm bg-muted text-muted-foreground rounded-lg hover:bg-muted/80"
              >
                Anulează
              </button>
              <button
                onClick={handleAddLanguage}
                disabled={adding}
                className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2"
              >
                {adding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Adaugă & traduce
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
