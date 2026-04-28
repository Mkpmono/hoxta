import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/panel/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Loader2, FileText, Languages } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useTranslateContent } from "@/hooks/useTranslateContent";

const LANGS = [
  { code: "en", label: "English" },
  { code: "ro", label: "Română" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "it", label: "Italiano" },
];

interface LegalPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  translations: Record<string, { title?: string; content?: string }>;
}

export default function LegalPagesAdmin() {
  const [pages, setPages] = useState<LegalPage[]>([]);
  const [activeSlug, setActiveSlug] = useState<string>("terms");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeLang, setActiveLang] = useState<string>("base");
  const { translateFields, translating } = useTranslateContent();

  const fetchPages = async () => {
    setLoading(true);
    const { data } = await supabase.from("legal_pages").select("*").order("slug");
    setPages(((data as any) || []).map((p: any) => ({
      ...p,
      translations: p.translations || {},
    })));
    setLoading(false);
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const active = pages.find((p) => p.slug === activeSlug);

  const updateActive = (patch: Partial<LegalPage>) => {
    setPages((prev) => prev.map((p) => (p.slug === activeSlug ? { ...p, ...patch } : p)));
  };

  const updateTranslation = (lang: string, field: "title" | "content", value: string) => {
    if (!active) return;
    const next = { ...(active.translations || {}) };
    next[lang] = { ...(next[lang] || {}), [field]: value };
    updateActive({ translations: next });
  };

  const save = async () => {
    if (!active) return;
    setSaving(true);
    const { error } = await supabase
      .from("legal_pages")
      .update({
        title: active.title,
        content: active.content,
        translations: active.translations,
      })
      .eq("id", active.id);
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Page saved" });
  };

  const autoTranslate = async () => {
    if (!active) return;
    const result = await translateFields(
      { title: active.title, content: active.content },
      "en",
    );
    if (result) {
      const merged = { ...(active.translations || {}) };
      Object.entries(result).forEach(([lang, fields]: any) => {
        merged[lang] = { ...(merged[lang] || {}), ...fields };
      });
      updateActive({ translations: merged });
      toast({ title: "Translated", description: `Generated ${Object.keys(result).length} languages` });
    }
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
          <h1 className="text-2xl font-bold text-foreground">Legal Pages</h1>
          <p className="text-sm text-muted-foreground">
            Edit Terms of Service & Privacy Policy. Markdown supported.
          </p>
        </div>

        {/* Page selector */}
        <div className="flex gap-2">
          {pages.map((p) => (
            <button
              key={p.slug}
              onClick={() => {
                setActiveSlug(p.slug);
                setActiveLang("base");
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSlug === p.slug
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="w-4 h-4" />
              {p.slug === "terms" ? "Terms of Service" : "Privacy Policy"}
            </button>
          ))}
        </div>

        {active && (
          <>
            {/* Language tabs */}
            <div className="flex flex-wrap gap-1 bg-card/50 rounded-lg p-1 border border-border/50">
              <button
                onClick={() => setActiveLang("base")}
                className={`px-3 py-1.5 text-xs rounded-md font-medium ${
                  activeLang === "base" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                BASE (EN)
              </button>
              {LANGS.filter((l) => l.code !== "en").map((l) => (
                <button
                  key={l.code}
                  onClick={() => setActiveLang(l.code)}
                  className={`px-3 py-1.5 text-xs rounded-md font-medium ${
                    activeLang === l.code ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  {l.code.toUpperCase()}
                </button>
              ))}
              <Button
                size="sm"
                variant="ghost"
                className="ml-auto"
                onClick={autoTranslate}
                disabled={translating}
              >
                {translating ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Languages className="w-4 h-4 mr-1" />
                )}
                Auto translate
              </Button>
            </div>

            <div className="glass-card p-6 rounded-xl space-y-4">
              {activeLang === "base" ? (
                <>
                  <div>
                    <Label>Title (English / fallback)</Label>
                    <Input value={active.title} onChange={(e) => updateActive({ title: e.target.value })} />
                  </div>
                  <div>
                    <Label>Content (Markdown)</Label>
                    <Textarea
                      value={active.content}
                      onChange={(e) => updateActive({ content: e.target.value })}
                      rows={20}
                      className="font-mono text-sm"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label>Title ({activeLang.toUpperCase()})</Label>
                    <Input
                      value={active.translations?.[activeLang]?.title || ""}
                      onChange={(e) => updateTranslation(activeLang, "title", e.target.value)}
                      placeholder={active.title}
                    />
                  </div>
                  <div>
                    <Label>Content ({activeLang.toUpperCase()}) — Markdown</Label>
                    <Textarea
                      value={active.translations?.[activeLang]?.content || ""}
                      onChange={(e) => updateTranslation(activeLang, "content", e.target.value)}
                      rows={20}
                      className="font-mono text-sm"
                      placeholder={active.content}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end">
              <Button onClick={save} disabled={saving} size="lg">
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save page
              </Button>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
