import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/panel/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Loader2, Languages, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { invalidateEditablePageCache } from "@/hooks/useEditablePage";
import { DEFAULT_ABOUT, AboutPageContent, PAGE_ICON_OPTIONS } from "@/data/editablePagesDefaults";

export default function AboutAdmin() {
  const [c, setC] = useState<AboutPageContent>(DEFAULT_ABOUT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [pageId, setPageId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("editable_pages")
        .select("id, content")
        .eq("slug", "about")
        .maybeSingle();
      if (data) {
        setPageId(data.id);
        setC({ ...DEFAULT_ABOUT, ...(data.content as any) });
      }
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    const res = pageId
      ? await supabase.from("editable_pages").update({ content: c as any }).eq("id", pageId)
      : await supabase.from("editable_pages").insert({ slug: "about", content: c as any }).select("id").single();
    setSaving(false);
    if (res.error) { toast.error(`Save failed: ${res.error.message}`); return; }
    if (!pageId && (res as any).data?.id) setPageId((res as any).data.id);
    invalidateEditablePageCache("about");
    toast.success("About page saved");
  };

  const translateAll = async () => {
    setTranslating(true);
    try {
      const { data, error } = await supabase.functions.invoke("translate-page", {
        body: { content: c, sourceLang: "en" },
      });
      if (error) throw error;
      if (!data?.translations) throw new Error("No translations returned");
      const updateRes = await supabase
        .from("editable_pages")
        .update({ content: c as any, translations: data.translations })
        .eq("slug", "about");
      if (updateRes.error) throw updateRes.error;
      invalidateEditablePageCache("about");
      toast.success("Translated to all languages");
    } catch (e: any) {
      toast.error(e?.message || "Translation failed");
    } finally {
      setTranslating(false);
    }
  };

  if (loading) {
    return <AdminLayout><div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-foreground">About Page</h1>
            <p className="text-sm text-muted-foreground">Edit hero, stats, mission, values and timeline. Save then translate.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={translateAll} disabled={translating || saving}>
              {translating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Languages className="w-4 h-4 mr-2" />}
              Translate to all languages
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save
            </Button>
          </div>
        </div>

        <Section title="Hero">
          <Field label="Badge" value={c.badge} onChange={(v) => setC({ ...c, badge: v })} />
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Title — first line" value={c.titlePart1} onChange={(v) => setC({ ...c, titlePart1: v })} />
            <Field label="Title — accent (gradient)" value={c.titlePart2} onChange={(v) => setC({ ...c, titlePart2: v })} />
          </div>
          <Field label="Subtitle" value={c.subtitle} onChange={(v) => setC({ ...c, subtitle: v })} multiline />
        </Section>

        <Section title="Stats (4 metrics)">
          <ArrayEditor items={c.stats} onChange={(items) => setC({ ...c, stats: items })}
            newItem={() => ({ icon: "Star", value: "", label: "" })}
            renderItem={(s, u) => (
              <div className="grid md:grid-cols-3 gap-3">
                <IconSelect value={s.icon} onChange={(v) => u({ ...s, icon: v })} />
                <Field label="Value (e.g. 10,000+)" value={s.value} onChange={(v) => u({ ...s, value: v })} />
                <Field label="Label" value={s.label} onChange={(v) => u({ ...s, label: v })} />
              </div>
            )} />
        </Section>

        <Section title="Mission & Vision">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Mission title" value={c.missionTitle} onChange={(v) => setC({ ...c, missionTitle: v })} />
            <Field label="Vision title" value={c.visionTitle} onChange={(v) => setC({ ...c, visionTitle: v })} />
          </div>
          <Field label="Mission text" value={c.missionText} onChange={(v) => setC({ ...c, missionText: v })} multiline />
          <Field label="Vision text" value={c.visionText} onChange={(v) => setC({ ...c, visionText: v })} multiline />
        </Section>

        <Section title="What Drives Us (values)">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Section title" value={c.valuesTitle} onChange={(v) => setC({ ...c, valuesTitle: v })} />
            <Field label="Section subtitle" value={c.valuesSubtitle} onChange={(v) => setC({ ...c, valuesSubtitle: v })} />
          </div>
          <ArrayEditor items={c.values} onChange={(items) => setC({ ...c, values: items })}
            newItem={() => ({ icon: "Sparkles", title: "", description: "" })}
            renderItem={(v, u) => (
              <div className="space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <IconSelect value={v.icon} onChange={(x) => u({ ...v, icon: x })} />
                  <Field label="Title" value={v.title} onChange={(x) => u({ ...v, title: x })} />
                </div>
                <Field label="Description" value={v.description} onChange={(x) => u({ ...v, description: x })} multiline />
              </div>
            )} />
        </Section>

        <Section title="Timeline (Our Journey)">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Timeline title" value={c.timelineTitle} onChange={(v) => setC({ ...c, timelineTitle: v })} />
            <Field label="Timeline subtitle" value={c.timelineSubtitle} onChange={(v) => setC({ ...c, timelineSubtitle: v })} />
          </div>
          <ArrayEditor items={c.timeline} onChange={(items) => setC({ ...c, timeline: items })}
            newItem={() => ({ year: "", title: "", description: "" })}
            renderItem={(t, u) => (
              <div className="space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <Field label="Year" value={t.year} onChange={(v) => u({ ...t, year: v })} />
                  <Field label="Title" value={t.title} onChange={(v) => u({ ...t, title: v })} />
                </div>
                <Field label="Description" value={t.description} onChange={(v) => u({ ...t, description: v })} multiline />
              </div>
            )} />
        </Section>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={translateAll} disabled={translating || saving}>
            {translating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Languages className="w-4 h-4 mr-2" />}
            Translate to all languages
          </Button>
          <Button onClick={save} disabled={saving} size="lg">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="glass-card p-6 rounded-xl space-y-4"><h3 className="text-lg font-semibold text-foreground">{title}</h3><div className="space-y-4">{children}</div></div>;
}
function Field({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return <div><Label className="text-xs uppercase text-muted-foreground">{label}</Label>{multiline ? <Textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} /> : <Input value={value} onChange={(e) => onChange(e.target.value)} />}</div>;
}
function IconSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <div><Label className="text-xs uppercase text-muted-foreground">Icon</Label><select value={value} onChange={(e) => onChange(e.target.value)} className="w-full h-10 px-3 rounded-md bg-card/60 border border-border/50 text-foreground text-sm">{PAGE_ICON_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}</select></div>;
}
function ArrayEditor<T>({ items, onChange, renderItem, newItem }: { items: T[]; onChange: (items: T[]) => void; renderItem: (item: T, update: (n: T) => void) => React.ReactNode; newItem: () => T }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="relative p-4 rounded-lg bg-muted/30 border border-border/30">
          <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="absolute top-2 right-2 p-1.5 rounded-md text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></button>
          <div className="pr-8">{renderItem(item, (updated) => onChange(items.map((it, j) => (j === i ? updated : it))))}</div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, newItem()])}><Plus className="w-4 h-4 mr-1" /> Add item</Button>
    </div>
  );
}
