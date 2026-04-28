import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, Save, ChevronDown, ChevronRight, Eye, EyeOff, Loader2, ExternalLink, Globe, Server, Cpu, HardDrive, Bot, Mic, Users, Gamepad2, Lock } from "lucide-react";
import { AdminLayout } from "@/components/panel/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { CustomService, CustomServiceSections } from "@/hooks/useCustomServices";

const MENU_GROUPS = [
  { value: "web", label: "Web Hosting" },
  { value: "games", label: "Game Servers" },
  { value: "server", label: "Servers (VPS/Dedicated)" },
  { value: "moreHosting", label: "More Hosting" },
  { value: "helpInfo", label: "Help & Info" },
  { value: "more", label: "More (separat)" },
];

const DEFAULT_SECTIONS: CustomServiceSections = {
  hero: { enabled: true, title: "", subtitle: "", ctaLabel: "Get Started", ctaUrl: "/order" },
  features: { enabled: true, title: "Features", items: [] },
  plans: { enabled: false, title: "Plans", items: [] },
  content: { enabled: false, title: "", markdown: "" },
  faq: { enabled: true, title: "FAQ", items: [] },
  cta: { enabled: true, title: "Ready to start?", subtitle: "", ctaLabel: "Order now", ctaUrl: "/order" },
};

function emptyService(): Partial<CustomService> {
  return {
    slug: "",
    name: "",
    menu_label: "",
    menu_description: "",
    menu_icon: "Sparkles",
    menu_group: "more",
    category: "General",
    tags: [],
    cover_image_url: "",
    short_description: "",
    sections: DEFAULT_SECTIONS,
    is_published: false,
    show_in_menu: true,
    sort_order: 100,
  };
}

export default function CustomServicesAdmin() {
  const [services, setServices] = useState<CustomService[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<CustomService> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("custom_services")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      toast.error("Eroare la încărcare: " + error.message);
    } else {
      setServices((data || []) as unknown as CustomService[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!editing) return;
    if (!editing.slug || !editing.name) {
      toast.error("Slug și nume sunt obligatorii");
      return;
    }
    setSaving(true);
    const payload = {
      ...editing,
      sections: editing.sections || DEFAULT_SECTIONS,
      tags: editing.tags || [],
    };
    delete (payload as any).created_at;
    delete (payload as any).updated_at;

    const { error } = editing.id
      ? await supabase.from("custom_services").update(payload as any).eq("id", editing.id)
      : await supabase.from("custom_services").insert(payload as any);

    setSaving(false);
    if (error) {
      toast.error("Eroare la salvare: " + error.message);
      return;
    }
    toast.success("Serviciu salvat");
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Sigur ștergi acest serviciu?")) return;
    const { error } = await supabase.from("custom_services").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Șters");
    load();
  };

  const togglePublish = async (s: CustomService) => {
    const { error } = await supabase
      .from("custom_services")
      .update({ is_published: !s.is_published })
      .eq("id", s.id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Custom Services</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Adaugă servicii noi care apar automat în meniu și au pagină dedicată la <code className="text-primary">/services/[slug]</code>
            </p>
          </div>
          <button
            onClick={() => setEditing(emptyService())}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          >
            <Plus className="w-4 h-4" /> Serviciu nou
          </button>
        </div>

        {loading ? (
          <div className="text-muted-foreground">Loading…</div>
        ) : services.length === 0 ? (
          <div className="p-12 rounded-xl border border-dashed border-border text-center text-muted-foreground">
            Nu ai încă niciun serviciu. Apasă "Serviciu nou".
          </div>
        ) : (
          <div className="space-y-2">
            {services.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{s.name}</span>
                    {s.is_published ? (
                      <span className="text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-400">
                        Live
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        Draft
                      </span>
                    )}
                    {s.show_in_menu && (
                      <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                        În meniu ({s.menu_group})
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    /services/{s.slug} · ordin {s.sort_order}
                  </div>
                </div>
                <button
                  onClick={() => togglePublish(s)}
                  className="p-2 rounded hover:bg-muted text-muted-foreground"
                  title={s.is_published ? "Unpublish" : "Publish"}
                >
                  {s.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setEditing(s)}
                  className="px-3 py-1.5 rounded text-sm bg-muted hover:bg-muted/80 text-foreground"
                >
                  Editează
                </button>
                <button
                  onClick={() => remove(s.id)}
                  className="p-2 rounded hover:bg-destructive/10 text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {editing && (
          <ServiceEditor
            service={editing}
            onChange={setEditing}
            onCancel={() => setEditing(null)}
            onSave={save}
            saving={saving}
          />
        )}
      </div>
    </AdminLayout>
  );
}

function ServiceEditor({
  service,
  onChange,
  onCancel,
  onSave,
  saving,
}: {
  service: Partial<CustomService>;
  onChange: (s: Partial<CustomService>) => void;
  onCancel: () => void;
  onSave: () => void;
  saving: boolean;
}) {
  const sections = (service.sections || DEFAULT_SECTIONS) as CustomServiceSections;
  const set = (patch: Partial<CustomService>) => onChange({ ...service, ...patch });
  const setSection = (key: keyof CustomServiceSections, patch: any) =>
    set({
      sections: {
        ...sections,
        [key]: { ...(sections[key] || {}), ...patch },
      },
    });

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen flex items-start justify-center p-4 py-10">
        <div className="w-full max-w-4xl bg-card border border-border rounded-2xl shadow-2xl">
          <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-border bg-card rounded-t-2xl">
            <h2 className="text-xl font-bold text-foreground">
              {service.id ? "Editează serviciu" : "Serviciu nou"}
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={onCancel} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
                Anulează
              </button>
              <button
                onClick={onSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Salvează
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Basic */}
            <Card title="Identificare">
              <Row>
                <Field label="Nume *">
                  <input
                    className="input"
                    value={service.name || ""}
                    onChange={(e) => set({ name: e.target.value })}
                  />
                </Field>
                <Field label="Slug * (URL)">
                  <input
                    className="input"
                    placeholder="storage-hosting"
                    value={service.slug || ""}
                    onChange={(e) => set({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
                  />
                </Field>
              </Row>
              <Row>
                <Field label="Categorie">
                  <input
                    className="input"
                    value={service.category || ""}
                    onChange={(e) => set({ category: e.target.value })}
                  />
                </Field>
                <Field label="Sortare (mai mic = sus)">
                  <input
                    type="number"
                    className="input"
                    value={service.sort_order ?? 100}
                    onChange={(e) => set({ sort_order: parseInt(e.target.value) || 100 })}
                  />
                </Field>
              </Row>
              <Field label="Descriere scurtă (SEO + listing)">
                <textarea
                  className="input"
                  rows={2}
                  value={service.short_description || ""}
                  onChange={(e) => set({ short_description: e.target.value })}
                />
              </Field>
              <Field label="Cover image URL (opțional)">
                <input
                  className="input"
                  value={service.cover_image_url || ""}
                  onChange={(e) => set({ cover_image_url: e.target.value })}
                />
              </Field>
            </Card>

            {/* Menu */}
            <Card title="Apariție în meniu">
              <Row>
                <Field label="Grup în meniu">
                  <select
                    className="input"
                    value={service.menu_group || "more"}
                    onChange={(e) => set({ menu_group: e.target.value })}
                  >
                    {MENU_GROUPS.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Iconiță (Lucide name)">
                  <input
                    className="input"
                    placeholder="HardDrive, Mail, Sparkles..."
                    value={service.menu_icon || ""}
                    onChange={(e) => set({ menu_icon: e.target.value })}
                  />
                </Field>
              </Row>
              <Row>
                <Field label="Etichetă meniu (opțional, default = Nume)">
                  <input
                    className="input"
                    value={service.menu_label || ""}
                    onChange={(e) => set({ menu_label: e.target.value })}
                  />
                </Field>
                <Field label="Descriere sub etichetă (în mega-dropdown)">
                  <input
                    className="input"
                    value={service.menu_description || ""}
                    onChange={(e) => set({ menu_description: e.target.value })}
                  />
                </Field>
              </Row>
              <div className="flex items-center gap-6 pt-2">
                <Toggle
                  label="Publicat (vizibil pe site)"
                  value={!!service.is_published}
                  onChange={(v) => set({ is_published: v })}
                />
                <Toggle
                  label="Apare în meniu"
                  value={!!service.show_in_menu}
                  onChange={(v) => set({ show_in_menu: v })}
                />
              </div>
            </Card>

            {/* Hero */}
            <SectionBlock
              title="Hero"
              enabled={sections.hero?.enabled !== false}
              onToggle={(v) => setSection("hero", { enabled: v })}
            >
              <Field label="Titlu hero">
                <input className="input" value={sections.hero?.title || ""} onChange={(e) => setSection("hero", { title: e.target.value })} />
              </Field>
              <Field label="Subtitlu">
                <textarea className="input" rows={2} value={sections.hero?.subtitle || ""} onChange={(e) => setSection("hero", { subtitle: e.target.value })} />
              </Field>
              <Row>
                <Field label="CTA label">
                  <input className="input" value={sections.hero?.ctaLabel || ""} onChange={(e) => setSection("hero", { ctaLabel: e.target.value })} />
                </Field>
                <Field label="CTA URL">
                  <input className="input" value={sections.hero?.ctaUrl || ""} onChange={(e) => setSection("hero", { ctaUrl: e.target.value })} />
                </Field>
              </Row>
            </SectionBlock>

            {/* Features */}
            <SectionBlock
              title="Features"
              enabled={sections.features?.enabled !== false}
              onToggle={(v) => setSection("features", { enabled: v })}
            >
              <Field label="Titlu secțiune">
                <input className="input" value={sections.features?.title || ""} onChange={(e) => setSection("features", { title: e.target.value })} />
              </Field>
              <ListEditor
                items={sections.features?.items || []}
                onChange={(items) => setSection("features", { items })}
                empty={{ icon: "Sparkles", title: "", description: "" }}
                renderItem={(item, update) => (
                  <>
                    <Row>
                      <Field label="Icon (Lucide)">
                        <input className="input" value={item.icon || ""} onChange={(e) => update({ ...item, icon: e.target.value })} />
                      </Field>
                      <Field label="Titlu">
                        <input className="input" value={item.title || ""} onChange={(e) => update({ ...item, title: e.target.value })} />
                      </Field>
                    </Row>
                    <Field label="Descriere">
                      <textarea className="input" rows={2} value={item.description || ""} onChange={(e) => update({ ...item, description: e.target.value })} />
                    </Field>
                  </>
                )}
              />
            </SectionBlock>

            {/* Plans */}
            <SectionBlock
              title="Planuri"
              enabled={sections.plans?.enabled !== false}
              onToggle={(v) => setSection("plans", { enabled: v })}
            >
              <Field label="Titlu secțiune">
                <input className="input" value={sections.plans?.title || ""} onChange={(e) => setSection("plans", { title: e.target.value })} />
              </Field>
              <ListEditor
                items={sections.plans?.items || []}
                onChange={(items) => setSection("plans", { items })}
                empty={{ name: "", price: "", description: "", features: [], ctaUrl: "/order", popular: false }}
                renderItem={(item, update) => (
                  <>
                    <Row>
                      <Field label="Nume plan">
                        <input className="input" value={item.name || ""} onChange={(e) => update({ ...item, name: e.target.value })} />
                      </Field>
                      <Field label="Preț (text liber)">
                        <input className="input" placeholder="$5/mo" value={item.price || ""} onChange={(e) => update({ ...item, price: e.target.value })} />
                      </Field>
                    </Row>
                    <Field label="Descriere scurtă">
                      <input className="input" value={item.description || ""} onChange={(e) => update({ ...item, description: e.target.value })} />
                    </Field>
                    <Field label="Features (una pe linie)">
                      <textarea
                        className="input"
                        rows={4}
                        value={(item.features || []).join("\n")}
                        onChange={(e) => update({ ...item, features: e.target.value.split("\n").filter(Boolean) })}
                      />
                    </Field>
                    <Row>
                      <Field label="URL comandă">
                        <input className="input" value={item.ctaUrl || ""} onChange={(e) => update({ ...item, ctaUrl: e.target.value })} />
                      </Field>
                      <Field label="Popular?">
                        <select className="input" value={item.popular ? "1" : "0"} onChange={(e) => update({ ...item, popular: e.target.value === "1" })}>
                          <option value="0">Nu</option>
                          <option value="1">Da</option>
                        </select>
                      </Field>
                    </Row>
                  </>
                )}
              />
            </SectionBlock>

            {/* Content */}
            <SectionBlock
              title="Conținut text liber"
              enabled={sections.content?.enabled === true}
              onToggle={(v) => setSection("content", { enabled: v })}
            >
              <Field label="Titlu">
                <input className="input" value={sections.content?.title || ""} onChange={(e) => setSection("content", { title: e.target.value })} />
              </Field>
              <Field label="Text (markdown simplu)">
                <textarea className="input" rows={6} value={sections.content?.markdown || ""} onChange={(e) => setSection("content", { markdown: e.target.value })} />
              </Field>
            </SectionBlock>

            {/* FAQ */}
            <SectionBlock
              title="FAQ"
              enabled={sections.faq?.enabled !== false}
              onToggle={(v) => setSection("faq", { enabled: v })}
            >
              <Field label="Titlu">
                <input className="input" value={sections.faq?.title || ""} onChange={(e) => setSection("faq", { title: e.target.value })} />
              </Field>
              <ListEditor
                items={sections.faq?.items || []}
                onChange={(items) => setSection("faq", { items })}
                empty={{ question: "", answer: "" }}
                renderItem={(item, update) => (
                  <>
                    <Field label="Întrebare">
                      <input className="input" value={item.question || ""} onChange={(e) => update({ ...item, question: e.target.value })} />
                    </Field>
                    <Field label="Răspuns">
                      <textarea className="input" rows={3} value={item.answer || ""} onChange={(e) => update({ ...item, answer: e.target.value })} />
                    </Field>
                  </>
                )}
              />
            </SectionBlock>

            {/* CTA */}
            <SectionBlock
              title="CTA final"
              enabled={sections.cta?.enabled !== false}
              onToggle={(v) => setSection("cta", { enabled: v })}
            >
              <Field label="Titlu">
                <input className="input" value={sections.cta?.title || ""} onChange={(e) => setSection("cta", { title: e.target.value })} />
              </Field>
              <Field label="Subtitlu">
                <textarea className="input" rows={2} value={sections.cta?.subtitle || ""} onChange={(e) => setSection("cta", { subtitle: e.target.value })} />
              </Field>
              <Row>
                <Field label="CTA label">
                  <input className="input" value={sections.cta?.ctaLabel || ""} onChange={(e) => setSection("cta", { ctaLabel: e.target.value })} />
                </Field>
                <Field label="CTA URL">
                  <input className="input" value={sections.cta?.ctaUrl || ""} onChange={(e) => setSection("cta", { ctaUrl: e.target.value })} />
                </Field>
              </Row>
            </SectionBlock>
          </div>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          background: hsl(var(--muted) / 0.4);
          border: 1px solid hsl(var(--border));
          color: hsl(var(--foreground));
          font-size: 0.875rem;
        }
        .input:focus { outline: none; border-color: hsl(var(--primary) / 0.5); }
      `}</style>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-5">
      <h3 className="font-semibold text-foreground mb-4">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function SectionBlock({
  title,
  enabled,
  onToggle,
  children,
}: {
  title: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-xl border border-border bg-background/40">
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 font-semibold text-foreground"
        >
          {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          {title}
        </button>
        <Toggle label="Activ" value={enabled} onChange={onToggle} />
      </div>
      {open && enabled && <div className="p-4 pt-0 space-y-3">{children}</div>}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs font-medium text-muted-foreground mb-1.5">{label}</div>
      {children}
    </label>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid md:grid-cols-2 gap-3">{children}</div>;
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-foreground">
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="accent-primary w-4 h-4" />
      {label}
    </label>
  );
}

function ListEditor<T extends Record<string, any>>({
  items,
  onChange,
  empty,
  renderItem,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  empty: T;
  renderItem: (item: T, update: (next: T) => void) => React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={idx} className="rounded-lg border border-border bg-card/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">#{idx + 1}</span>
            <button
              onClick={() => onChange(items.filter((_, i) => i !== idx))}
              className="text-destructive hover:text-destructive/80"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          {renderItem(item, (next) => {
            const copy = [...items];
            copy[idx] = next;
            onChange(copy);
          })}
        </div>
      ))}
      <button
        onClick={() => onChange([...items, { ...empty }])}
        className="w-full py-2 rounded-lg border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
      >
        <Plus className="w-4 h-4 inline mr-1" />
        Adaugă
      </button>
    </div>
  );
}
