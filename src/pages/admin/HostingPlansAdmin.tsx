import { AdminLayout } from "@/components/panel/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Languages,
  Loader2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useTranslateContent } from "@/hooks/useTranslateContent";

export interface HostingPlanCategory {
  key: string; // db category value, e.g. "web-hosting"
  label: string; // human label, e.g. "Web Hosting"
}

interface HostingPlan {
  id?: string;
  category: string;
  slug: string;
  name: string;
  short_description: string;
  full_description: string;
  price_value: number;
  pricing_display: string;
  billing_cycle: string;
  cpu?: string | null;
  ram?: string | null;
  storage?: string | null;
  bandwidth?: string | null;
  locations?: string[] | null;
  os?: string | null;
  features: string[];
  hero_points?: string[] | null;
  faqs: { question: string; answer: string }[];
  order_url?: string | null;
  cover_image_url?: string | null;
  tags?: string[] | null;
  popular: boolean;
  is_published: boolean;
  sort_order?: number | null;
  translations?: Record<string, any>;
}

interface Props {
  category: HostingPlanCategory;
}

const emptyFAQ = { question: "", answer: "" };

export function HostingPlansAdmin({ category }: Props) {
  const [plans, setPlans] = useState<HostingPlan[]>([]);
  const [editing, setEditing] = useState<Partial<HostingPlan> | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const { translateFields, translating } = useTranslateContent();

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("hosting_plans")
      .select("*")
      .eq("category", category.key)
      .order("sort_order", { ascending: true });
    setPlans((data || []) as unknown as HostingPlan[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    setEditing(null);
  }, [category.key]);

  const toggleSection = (s: string) =>
    setExpandedSection((p) => (p === s ? null : s));

  const handleTranslate = async () => {
    if (!editing?.name) return;
    const fields: Record<string, string> = {
      name: editing.name || "",
      short_description: editing.short_description || "",
      full_description: editing.full_description || "",
    };
    const t = await translateFields(fields);
    if (t) setEditing((prev) => (prev ? { ...prev, translations: t } : prev));
  };

  const savePlan = async () => {
    if (!editing?.name || !editing?.slug) {
      toast({
        title: "Câmpuri lipsă",
        description: "Numele și slug-ul sunt obligatorii.",
        variant: "destructive",
      });
      return;
    }

    let translations = editing.translations;
    const fields: Record<string, string> = {
      name: editing.name || "",
      short_description: editing.short_description || "",
      full_description: editing.full_description || "",
    };
    const newT = await translateFields(fields);
    if (newT) translations = newT;

    const payload: any = {
      category: category.key,
      slug: editing.slug,
      name: editing.name,
      short_description: editing.short_description || "",
      full_description: editing.full_description || "",
      price_value: editing.price_value || 0,
      pricing_display: editing.pricing_display || "",
      billing_cycle: editing.billing_cycle || "monthly",
      cpu: editing.cpu || null,
      ram: editing.ram || null,
      storage: editing.storage || null,
      bandwidth: editing.bandwidth || null,
      locations: editing.locations || [],
      os: editing.os || null,
      features: editing.features || [],
      hero_points: editing.hero_points || [],
      faqs: editing.faqs || [],
      order_url: editing.order_url || null,
      cover_image_url: editing.cover_image_url || null,
      tags: editing.tags || [],
      popular: editing.popular ?? false,
      is_published: editing.is_published ?? false,
      sort_order: editing.sort_order ?? 0,
      translations: translations || {},
    };

    if (editing.id) {
      const { error } = await supabase
        .from("hosting_plans")
        .update(payload)
        .eq("id", editing.id);
      if (error) {
        toast({ title: "Eroare", description: error.message, variant: "destructive" });
        return;
      }
    } else {
      const { error } = await supabase.from("hosting_plans").insert(payload);
      if (error) {
        toast({ title: "Eroare", description: error.message, variant: "destructive" });
        return;
      }
    }
    toast({ title: "Salvat ✅" });
    setEditing(null);
    fetchData();
  };

  const deletePlan = async (id: string) => {
    if (!confirm("Ștergi acest pachet?")) return;
    await supabase.from("hosting_plans").delete().eq("id", id);
    fetchData();
  };

  // FAQ helpers
  const updateFAQ = (i: number, f: "question" | "answer", v: string) => {
    const faqs = [...(editing?.faqs || [])];
    faqs[i] = { ...faqs[i], [f]: v };
    setEditing((p) => (p ? { ...p, faqs } : p));
  };
  const addFAQ = () => {
    const faqs = [...(editing?.faqs || []), { ...emptyFAQ }];
    setEditing((p) => (p ? { ...p, faqs } : p));
  };
  const removeFAQ = (i: number) => {
    const faqs = [...(editing?.faqs || [])];
    faqs.splice(i, 1);
    setEditing((p) => (p ? { ...p, faqs } : p));
  };

  const SectionHeader = ({
    title,
    section,
    count,
  }: {
    title: string;
    section: string;
    count: number;
  }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
    >
      <span className="font-medium text-foreground">
        {title} ({count})
      </span>
      {expandedSection === section ? (
        <ChevronUp className="w-4 h-4 text-muted-foreground" />
      ) : (
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      )}
    </button>
  );

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{category.label}</h1>
            <p className="text-sm text-muted-foreground">
              Gestionează pachetele {category.label}
            </p>
          </div>
          {!editing && (
            <Button
              onClick={() =>
                setEditing({
                  category: category.key,
                  slug: "",
                  name: "",
                  short_description: "",
                  full_description: "",
                  price_value: 0,
                  pricing_display: "",
                  billing_cycle: "monthly",
                  features: [],
                  faqs: [],
                  popular: false,
                  is_published: true,
                  sort_order: plans.length + 1,
                })
              }
              className="gap-2"
            >
              <Plus className="w-4 h-4" /> Pachet nou
            </Button>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-4 rounded-xl animate-pulse h-16" />
            ))}
          </div>
        ) : editing ? (
          <div className="glass-card p-6 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-foreground">
                {editing.id ? "Editare pachet" : "Pachet nou"}
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleTranslate}
                  disabled={translating}
                  className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
                >
                  {translating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Languages className="w-4 h-4" />
                  )}
                  {translating ? "Traducere..." : "Auto Translate 🌐"}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setEditing(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Basic info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nume pachet</Label>
                <Input
                  value={editing.name || ""}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="Starter, Professional…"
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input
                  value={editing.slug || ""}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  placeholder="starter"
                />
              </div>
            </div>
            <div>
              <Label>Descriere scurtă</Label>
              <Input
                value={editing.short_description || ""}
                onChange={(e) =>
                  setEditing({ ...editing, short_description: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Descriere completă (Markdown)</Label>
              <Textarea
                rows={4}
                value={editing.full_description || ""}
                onChange={(e) =>
                  setEditing({ ...editing, full_description: e.target.value })
                }
              />
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Preț (valoare)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editing.price_value ?? 0}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      price_value: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <Label>Display preț</Label>
                <Input
                  value={editing.pricing_display || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, pricing_display: e.target.value })
                  }
                  placeholder="$3.99/mo"
                />
              </div>
              <div>
                <Label>Ciclu facturare</Label>
                <select
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  value={editing.billing_cycle || "monthly"}
                  onChange={(e) =>
                    setEditing({ ...editing, billing_cycle: e.target.value })
                  }
                >
                  <option value="monthly">Lunar</option>
                  <option value="quarterly">Trimestrial</option>
                  <option value="annually">Anual</option>
                </select>
              </div>
            </div>

            {/* Order URL — KEY FIELD */}
            <div className="p-4 rounded-lg border border-primary/30 bg-primary/5">
              <Label className="flex items-center gap-2 mb-2 text-primary">
                <ExternalLink className="w-4 h-4" />
                Link comandă WHMCS (custom)
              </Label>
              <Input
                value={editing.order_url || ""}
                onChange={(e) =>
                  setEditing({ ...editing, order_url: e.target.value })
                }
                placeholder="https://billing.hoxta.com/cart.php?a=add&pid=42"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Butonul "Comandă Acum" va deschide acest link direct (în tab nou). Lasă gol pentru a ascunde butonul.
              </p>
            </div>

            {/* Specs (optional) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <Label className="text-xs">CPU</Label>
                <Input
                  value={editing.cpu || ""}
                  onChange={(e) => setEditing({ ...editing, cpu: e.target.value })}
                  placeholder="4 vCores"
                />
              </div>
              <div>
                <Label className="text-xs">RAM</Label>
                <Input
                  value={editing.ram || ""}
                  onChange={(e) => setEditing({ ...editing, ram: e.target.value })}
                  placeholder="8GB"
                />
              </div>
              <div>
                <Label className="text-xs">Storage</Label>
                <Input
                  value={editing.storage || ""}
                  onChange={(e) => setEditing({ ...editing, storage: e.target.value })}
                  placeholder="160GB NVMe"
                />
              </div>
              <div>
                <Label className="text-xs">Bandwidth</Label>
                <Input
                  value={editing.bandwidth || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, bandwidth: e.target.value })
                  }
                  placeholder="6TB"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">OS</Label>
                <Input
                  value={editing.os || ""}
                  onChange={(e) => setEditing({ ...editing, os: e.target.value })}
                  placeholder="Linux / Windows"
                />
              </div>
              <div>
                <Label className="text-xs">Locații (separate prin virgulă)</Label>
                <Input
                  value={(editing.locations || []).join(", ")}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      locations: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="Frankfurt, Bucharest, NYC"
                />
              </div>
            </div>

            {/* Features */}
            <div>
              <Label>Features (separate prin virgulă)</Label>
              <Textarea
                rows={3}
                value={(editing.features || []).join(", ")}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    features: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="Free SSL, Daily Backups, DDoS Protection…"
              />
            </div>
            <div>
              <Label>Hero Points (separate prin virgulă)</Label>
              <Input
                value={(editing.hero_points || []).join(", ")}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    hero_points: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            </div>
            <div>
              <Label>Tags (separate prin virgulă)</Label>
              <Input
                value={(editing.tags || []).join(", ")}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    tags: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            </div>
            <div>
              <Label>Imagine cover (URL)</Label>
              <Input
                value={editing.cover_image_url || ""}
                onChange={(e) =>
                  setEditing({ ...editing, cover_image_url: e.target.value })
                }
                placeholder="https://… sau /images/…"
              />
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={editing.is_published ?? false}
                  onCheckedChange={(v) =>
                    setEditing({ ...editing, is_published: v })
                  }
                />
                <Label>Publicat</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={editing.popular ?? false}
                  onCheckedChange={(v) => setEditing({ ...editing, popular: v })}
                />
                <Label>Popular badge</Label>
              </div>
              <div>
                <Label className="text-xs">Sort order</Label>
                <Input
                  type="number"
                  value={editing.sort_order ?? 0}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      sort_order: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            {/* FAQs */}
            <div className="space-y-3">
              <SectionHeader
                title="❓ FAQs"
                section="faqs"
                count={(editing.faqs || []).length}
              />
              {expandedSection === "faqs" && (
                <div className="space-y-3 pl-2">
                  {(editing.faqs || []).map((faq, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg border border-border bg-card/50 space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-foreground">
                          FAQ {i + 1}
                        </span>
                        <Button variant="ghost" size="icon" onClick={() => removeFAQ(i)}>
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Întrebare"
                        value={faq.question}
                        onChange={(e) => updateFAQ(i, "question", e.target.value)}
                      />
                      <Textarea
                        rows={3}
                        placeholder="Răspuns"
                        value={faq.answer}
                        onChange={(e) => updateFAQ(i, "answer", e.target.value)}
                      />
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addFAQ} className="gap-1">
                    <Plus className="w-4 h-4" /> Adaugă FAQ
                  </Button>
                </div>
              )}
            </div>

            {/* Save */}
            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setEditing(null)}>
                Anulează
              </Button>
              <Button onClick={savePlan} disabled={translating} className="gap-2">
                {translating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Salvează
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {plans.length === 0 && (
              <div className="glass-card p-8 rounded-xl text-center text-muted-foreground">
                Niciun pachet adăugat încă. Apasă pe „Pachet nou" pentru a începe.
              </div>
            )}
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  "glass-card p-4 rounded-xl flex items-center justify-between gap-4",
                  !plan.is_published && "opacity-60"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground truncate">
                      {plan.name}
                    </h3>
                    {plan.popular && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-primary/20 text-primary">
                        POPULAR
                      </span>
                    )}
                    {!plan.is_published && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-muted text-muted-foreground">
                        DRAFT
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {plan.pricing_display} · {plan.short_description}
                  </p>
                  {plan.order_url ? (
                    <p className="text-xs text-emerald-400 truncate flex items-center gap-1 mt-1">
                      <ExternalLink className="w-3 h-3" /> {plan.order_url}
                    </p>
                  ) : (
                    <p className="text-xs text-amber-500 mt-1">
                      ⚠ Fără link WHMCS — butonul nu va apărea
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditing(plan)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => plan.id && deletePlan(plan.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
