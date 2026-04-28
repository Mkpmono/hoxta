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
import { DEFAULT_CONTACT, ContactPageContent, PAGE_ICON_OPTIONS } from "@/data/editablePagesDefaults";

export default function ContactAdmin() {
  const [c, setC] = useState<ContactPageContent>(DEFAULT_CONTACT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [pageId, setPageId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("editable_pages")
        .select("id, content")
        .eq("slug", "contact")
        .maybeSingle();
      if (data) {
        setPageId(data.id);
        setC({ ...DEFAULT_CONTACT, ...(data.content as any) });
      }
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    const payload = { slug: "contact", content: c as any };
    const res = pageId
      ? await supabase.from("editable_pages").update({ content: payload.content }).eq("id", pageId)
      : await supabase.from("editable_pages").insert(payload).select("id").single();
    setSaving(false);
    if (res.error) {
      toast.error(`Save failed: ${res.error.message}`);
      return;
    }
    if (!pageId && (res as any).data?.id) setPageId((res as any).data.id);
    invalidateEditablePageCache("contact");
    toast.success("Contact page saved");
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
        .eq("slug", "contact");
      if (updateRes.error) throw updateRes.error;
      invalidateEditablePageCache("contact");
      toast.success("Translated to all languages");
    } catch (e: any) {
      toast.error(e?.message || "Translation failed");
    } finally {
      setTranslating(false);
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
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Contact Page</h1>
            <p className="text-sm text-muted-foreground">Edit every text, card and link. Save then translate to all languages.</p>
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

        {/* Hero */}
        <Section title="Hero">
          <Field label="Badge" value={c.badge} onChange={(v) => setC({ ...c, badge: v })} />
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Title — first part" value={c.titlePart1} onChange={(v) => setC({ ...c, titlePart1: v })} />
            <Field label="Title — accent (highlighted)" value={c.titlePart2} onChange={(v) => setC({ ...c, titlePart2: v })} />
          </div>
          <Field label="Subtitle" value={c.subtitle} onChange={(v) => setC({ ...c, subtitle: v })} multiline />
        </Section>

        {/* Action cards */}
        <Section title="Action cards (Support Ticket / Live Chat / Sales)">
          <ArrayEditor
            items={c.actionCards}
            onChange={(items) => setC({ ...c, actionCards: items })}
            newItem={() => ({ icon: "Sparkles", title: "", description: "", ctaLabel: "", ctaUrl: "" })}
            renderItem={(item, update) => (
              <div className="space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <IconSelect value={item.icon} onChange={(v) => update({ ...item, icon: v })} />
                  <Field label="Title" value={item.title} onChange={(v) => update({ ...item, title: v })} />
                </div>
                <Field label="Description" value={item.description} onChange={(v) => update({ ...item, description: v })} multiline />
                <div className="grid md:grid-cols-2 gap-3">
                  <Field label="CTA label" value={item.ctaLabel} onChange={(v) => update({ ...item, ctaLabel: v })} />
                  <Field label="CTA URL (use #live-chat to open chat widget)" value={item.ctaUrl} onChange={(v) => update({ ...item, ctaUrl: v })} />
                </div>
              </div>
            )}
          />
        </Section>

        {/* Form */}
        <Section title="Contact form">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Form title" value={c.formTitle} onChange={(v) => setC({ ...c, formTitle: v })} />
            <Field label="Form subtitle" value={c.formSubtitle} onChange={(v) => setC({ ...c, formSubtitle: v })} />
            <Field label="Name field label" value={c.formNameLabel} onChange={(v) => setC({ ...c, formNameLabel: v })} />
            <Field label="Name placeholder" value={c.formNamePlaceholder} onChange={(v) => setC({ ...c, formNamePlaceholder: v })} />
            <Field label="Email field label" value={c.formEmailLabel} onChange={(v) => setC({ ...c, formEmailLabel: v })} />
            <Field label="Email placeholder" value={c.formEmailPlaceholder} onChange={(v) => setC({ ...c, formEmailPlaceholder: v })} />
            <Field label="Subject label" value={c.formSubjectLabel} onChange={(v) => setC({ ...c, formSubjectLabel: v })} />
            <Field label="Subject placeholder" value={c.formSubjectPlaceholder} onChange={(v) => setC({ ...c, formSubjectPlaceholder: v })} />
            <Field label="Message label" value={c.formMessageLabel} onChange={(v) => setC({ ...c, formMessageLabel: v })} />
            <Field label="Message placeholder" value={c.formMessagePlaceholder} onChange={(v) => setC({ ...c, formMessagePlaceholder: v })} />
            <Field label="Submit button label" value={c.formSubmitLabel} onChange={(v) => setC({ ...c, formSubmitLabel: v })} />
            <Field label="Success message" value={c.formSuccessMessage} onChange={(v) => setC({ ...c, formSuccessMessage: v })} />
          </div>
          <div>
            <Label className="mb-2 block">Subject options (one per line)</Label>
            <Textarea
              rows={5}
              value={c.formSubjectOptions.join("\n")}
              onChange={(e) => setC({ ...c, formSubjectOptions: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
            />
          </div>
        </Section>

        {/* Info cards */}
        <Section title="Info cards (Email / Hours / Connect)">
          <ArrayEditor
            items={c.infoCards}
            onChange={(items) => setC({ ...c, infoCards: items })}
            newItem={() => ({ icon: "Mail", title: "New section", rows: [] })}
            renderItem={(card, update) => (
              <div className="space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <IconSelect value={card.icon} onChange={(v) => update({ ...card, icon: v })} />
                  <Field label="Title" value={card.title} onChange={(v) => update({ ...card, title: v })} />
                </div>
                <ArrayEditor
                  items={card.rows}
                  onChange={(rows) => update({ ...card, rows })}
                  newItem={() => ({ label: "", value: "", href: "" })}
                  compact
                  renderItem={(row, updateRow) => (
                    <div className="grid md:grid-cols-3 gap-2">
                      <Field label="Label" value={row.label} onChange={(v) => updateRow({ ...row, label: v })} />
                      <Field label="Value" value={row.value} onChange={(v) => updateRow({ ...row, value: v })} />
                      <Field label="URL (optional)" value={row.href || ""} onChange={(v) => updateRow({ ...row, href: v })} />
                    </div>
                  )}
                />
              </div>
            )}
          />
        </Section>

        {/* Trust banner */}
        <Section title="Trust banner (footer of page)">
          <ArrayEditor
            items={c.trustItems}
            onChange={(items) => setC({ ...c, trustItems: items })}
            newItem={() => ({ icon: "Shield", label: "" })}
            compact
            renderItem={(item, update) => (
              <div className="grid md:grid-cols-2 gap-3">
                <IconSelect value={item.icon} onChange={(v) => update({ ...item, icon: v })} />
                <Field label="Label" value={item.label} onChange={(v) => update({ ...item, label: v })} />
              </div>
            )}
          />
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

// ───── Reusable building blocks ─────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card p-6 rounded-xl space-y-4">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return (
    <div>
      <Label className="text-xs uppercase text-muted-foreground">{label}</Label>
      {multiline ? (
        <Textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function IconSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label className="text-xs uppercase text-muted-foreground">Icon</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3 rounded-md bg-card/60 border border-border/50 text-foreground text-sm"
      >
        {PAGE_ICON_OPTIONS.map((name) => (
          <option key={name} value={name}>{name}</option>
        ))}
      </select>
    </div>
  );
}

function ArrayEditor<T>({
  items, onChange, renderItem, newItem, compact,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, update: (newItem: T) => void) => React.ReactNode;
  newItem: () => T;
  compact?: boolean;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className={`relative ${compact ? "p-3" : "p-4"} rounded-lg bg-muted/30 border border-border/30`}>
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="absolute top-2 right-2 p-1.5 rounded-md text-destructive hover:bg-destructive/10"
            title="Remove"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="pr-8">
            {renderItem(item, (updated) => onChange(items.map((it, j) => (j === i ? updated : it))))}
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, newItem()])}>
        <Plus className="w-4 h-4 mr-1" /> Add item
      </Button>
    </div>
  );
}
