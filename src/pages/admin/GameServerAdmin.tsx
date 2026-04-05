import { AdminLayout } from "@/components/panel/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Save, X, Gamepad2, Languages, Loader2, Eye, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useTranslateContent } from "@/hooks/useTranslateContent";

interface GamePlan {
  name: string;
  price: number;
  ram: string;
  cpu: string;
  storage: string;
  slots: number;
  features: string[];
  popular?: boolean;
}

interface GameFAQ {
  question: string;
  answer: string;
}

interface GameServer {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  pricing_display: string;
  pricing_unit: string;
  price_value: number;
  category: string;
  os: string;
  popular: boolean;
  is_published: boolean;
  cover_image_url: string | null;
  features: string[] | null;
  hero_points: string[] | null;
  tags: string[] | null;
  sort_order: number | null;
  plans: GamePlan[];
  faqs: GameFAQ[];
  translations?: Record<string, any>;
}

const emptyPlan: GamePlan = { name: "", price: 0, ram: "", cpu: "", storage: "", slots: 0, features: [], popular: false };
const emptyFAQ: GameFAQ = { question: "", answer: "" };

export default function GameServerAdmin() {
  const [servers, setServers] = useState<GameServer[]>([]);
  const [editing, setEditing] = useState<Partial<GameServer> | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const { translateFields, translating } = useTranslateContent();

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from("game_servers").select("*").order("sort_order");
    setServers((data || []) as unknown as GameServer[]);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const toggleSection = (section: string) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  const handleTranslate = async () => {
    if (!editing?.title) return;
    const fields: Record<string, string> = {
      title: editing.title || "",
      short_description: editing.short_description || "",
      full_description: editing.full_description || "",
    };
    const translations = await translateFields(fields);
    if (translations) {
      setEditing(prev => prev ? { ...prev, translations } : prev);
    }
  };

  const saveServer = async () => {
    if (!editing?.title || !editing?.slug) return;

    let translations = editing.translations;
    const fields: Record<string, string> = {
      title: editing.title || "",
      short_description: editing.short_description || "",
      full_description: editing.full_description || "",
    };
    const newTranslations = await translateFields(fields);
    if (newTranslations) translations = newTranslations;

    const payload: any = {
      title: editing.title,
      slug: editing.slug,
      short_description: editing.short_description || "",
      full_description: editing.full_description || "",
      pricing_display: editing.pricing_display || "$0.00/slot",
      pricing_unit: editing.pricing_unit || "slot",
      price_value: editing.price_value || 0,
      category: editing.category || "other",
      os: editing.os || "linux",
      popular: editing.popular ?? false,
      is_published: editing.is_published ?? false,
      cover_image_url: editing.cover_image_url || null,
      features: editing.features || [],
      hero_points: editing.hero_points || [],
      tags: editing.tags || [],
      sort_order: editing.sort_order ?? 0,
      plans: editing.plans || [],
      faqs: editing.faqs || [],
      translations: translations || {},
    };

    if (editing.id) {
      const { error } = await supabase.from("game_servers").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("game_servers").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }
    toast({ title: "Saved & Translated! ✅" });
    setEditing(null);
    fetchData();
  };

  const deleteServer = async (id: string) => {
    if (!confirm("Delete this game server?")) return;
    await supabase.from("game_servers").delete().eq("id", id);
    fetchData();
  };

  // Plan helpers
  const updatePlan = (index: number, field: keyof GamePlan, value: any) => {
    const plans = [...(editing?.plans || [])];
    plans[index] = { ...plans[index], [field]: value };
    setEditing(prev => prev ? { ...prev, plans } : prev);
  };

  const addPlan = () => {
    const plans = [...(editing?.plans || []), { ...emptyPlan }];
    setEditing(prev => prev ? { ...prev, plans } : prev);
  };

  const removePlan = (index: number) => {
    const plans = [...(editing?.plans || [])];
    plans.splice(index, 1);
    setEditing(prev => prev ? { ...prev, plans } : prev);
  };

  // FAQ helpers
  const updateFAQ = (index: number, field: keyof GameFAQ, value: string) => {
    const faqs = [...(editing?.faqs || [])];
    faqs[index] = { ...faqs[index], [field]: value };
    setEditing(prev => prev ? { ...prev, faqs } : prev);
  };

  const addFAQ = () => {
    const faqs = [...(editing?.faqs || []), { ...emptyFAQ }];
    setEditing(prev => prev ? { ...prev, faqs } : prev);
  };

  const removeFAQ = (index: number) => {
    const faqs = [...(editing?.faqs || [])];
    faqs.splice(index, 1);
    setEditing(prev => prev ? { ...prev, faqs } : prev);
  };

  const TranslateButton = ({ onClick, hasTranslations }: { onClick: () => void; hasTranslations: boolean }) => (
    <Button
      type="button" variant="outline" size="sm" onClick={onClick} disabled={translating}
      className={cn("gap-2 border-primary/30 text-primary hover:bg-primary/10", hasTranslations && "border-emerald-500/30 text-emerald-400")}
    >
      {translating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
      {translating ? "Translating..." : hasTranslations ? "Re-translate" : "Auto Translate 🌐"}
    </Button>
  );

  const TranslationStatus = ({ translations }: { translations?: Record<string, any> }) => {
    if (!translations || Object.keys(translations).length === 0) return null;
    return (
      <div className="flex items-center gap-2 text-xs text-emerald-400">
        <Languages className="w-3 h-3" />
        Translated: {Object.keys(translations).join(", ").toUpperCase()}
      </div>
    );
  };

  const SectionHeader = ({ title, section, count }: { title: string; section: string; count: number }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
    >
      <span className="font-medium text-foreground">{title} ({count})</span>
      {expandedSection === section ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
    </button>
  );

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Game Servers</h1>
          <p className="text-sm text-muted-foreground">Manage game server listings</p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="glass-card p-4 rounded-xl animate-pulse h-16" />)}
          </div>
        ) : editing ? (
          <div className="glass-card p-6 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-foreground">{editing.id ? "Edit Game Server" : "New Game Server"}</h2>
              <div className="flex items-center gap-2">
                <TranslateButton onClick={handleTranslate} hasTranslations={!!editing.translations && Object.keys(editing.translations).length > 0} />
                <Button variant="ghost" size="icon" onClick={() => setEditing(null)}><X className="w-4 h-4" /></Button>
              </div>
            </div>
            <TranslationStatus translations={editing.translations} />
            
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Title</Label><Input value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
              <div><Label>Slug</Label><Input value={editing.slug || ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></div>
            </div>
            <div><Label>Short Description</Label><Input value={editing.short_description || ""} onChange={(e) => setEditing({ ...editing, short_description: e.target.value })} /></div>
            <div><Label>Full Description (Markdown)</Label><Textarea rows={4} value={editing.full_description || ""} onChange={(e) => setEditing({ ...editing, full_description: e.target.value })} /></div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label>Pricing Display</Label><Input value={editing.pricing_display || ""} onChange={(e) => setEditing({ ...editing, pricing_display: e.target.value })} placeholder="$0.50/slot" /></div>
              <div><Label>Pricing Unit</Label><Input value={editing.pricing_unit || ""} onChange={(e) => setEditing({ ...editing, pricing_unit: e.target.value })} placeholder="slot" /></div>
              <div><Label>Price Value</Label><Input type="number" step="0.01" value={editing.price_value ?? 0} onChange={(e) => setEditing({ ...editing, price_value: parseFloat(e.target.value) || 0 })} /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label>Category</Label><Input value={editing.category || ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} placeholder="survival, fps, sandbox..." /></div>
              <div><Label>OS</Label>
                <select className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" value={editing.os || "linux"} onChange={(e) => setEditing({ ...editing, os: e.target.value })}>
                  <option value="linux">Linux</option>
                  <option value="windows">Windows</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div><Label>Sort Order</Label><Input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} /></div>
            </div>
            <div><Label>Cover Image URL</Label><Input value={editing.cover_image_url || ""} onChange={(e) => setEditing({ ...editing, cover_image_url: e.target.value })} /></div>
            <div><Label>Features (comma separated)</Label><Input value={editing.features?.join(", ") || ""} onChange={(e) => setEditing({ ...editing, features: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })} /></div>
            <div><Label>Hero Points (comma separated)</Label><Input value={editing.hero_points?.join(", ") || ""} onChange={(e) => setEditing({ ...editing, hero_points: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })} /></div>
            <div><Label>Tags (comma separated)</Label><Input value={editing.tags?.join(", ") || ""} onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })} /></div>
            
            <div className="flex gap-6">
              <div className="flex items-center gap-2"><Switch checked={editing.is_published ?? false} onCheckedChange={(v) => setEditing({ ...editing, is_published: v })} /><Label>Published</Label></div>
              <div className="flex items-center gap-2"><Switch checked={editing.popular ?? false} onCheckedChange={(v) => setEditing({ ...editing, popular: v })} /><Label>Popular</Label></div>
            </div>

            {/* Plans Section */}
            <div className="space-y-3">
              <SectionHeader title="📦 Pricing Plans" section="plans" count={(editing.plans || []).length} />
              {expandedSection === "plans" && (
                <div className="space-y-4 pl-2">
                  {(editing.plans || []).map((plan, i) => (
                    <div key={i} className="p-4 rounded-lg border border-border bg-card/50 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-foreground">Plan {i + 1}: {plan.name || "Unnamed"}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Switch checked={plan.popular ?? false} onCheckedChange={(v) => updatePlan(i, "popular", v)} />
                            <span className="text-xs text-muted-foreground">Popular</span>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removePlan(i)}><Trash2 className="w-4 h-4 text-red-400" /></Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><Label className="text-xs">Plan Name</Label><Input value={plan.name} onChange={(e) => updatePlan(i, "name", e.target.value)} placeholder="Starter, Pro, Enterprise..." /></div>
                        <div><Label className="text-xs">Price ($)</Label><Input type="number" step="0.01" value={plan.price} onChange={(e) => updatePlan(i, "price", parseFloat(e.target.value) || 0)} /></div>
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                        <div><Label className="text-xs">RAM</Label><Input value={plan.ram} onChange={(e) => updatePlan(i, "ram", e.target.value)} placeholder="4GB" /></div>
                        <div><Label className="text-xs">CPU</Label><Input value={plan.cpu} onChange={(e) => updatePlan(i, "cpu", e.target.value)} placeholder="2 vCores" /></div>
                        <div><Label className="text-xs">Storage</Label><Input value={plan.storage} onChange={(e) => updatePlan(i, "storage", e.target.value)} placeholder="50GB NVMe" /></div>
                        <div><Label className="text-xs">Slots</Label><Input type="number" value={plan.slots} onChange={(e) => updatePlan(i, "slots", parseInt(e.target.value) || 0)} /></div>
                      </div>
                      <div><Label className="text-xs">Plan Features (comma separated)</Label><Input value={plan.features?.join(", ") || ""} onChange={(e) => updatePlan(i, "features", e.target.value.split(",").map(t => t.trim()).filter(Boolean))} placeholder="DDoS Protection, Daily Backups, Mod Support..." /></div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addPlan} className="gap-1">
                    <Plus className="w-4 h-4" /> Add Plan
                  </Button>
                </div>
              )}
            </div>

            {/* FAQs Section */}
            <div className="space-y-3">
              <SectionHeader title="❓ FAQs" section="faqs" count={(editing.faqs || []).length} />
              {expandedSection === "faqs" && (
                <div className="space-y-3 pl-2">
                  {(editing.faqs || []).map((faq, i) => (
                    <div key={i} className="p-4 rounded-lg border border-border bg-card/50 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-foreground">FAQ {i + 1}</span>
                        <Button variant="ghost" size="icon" onClick={() => removeFAQ(i)}><Trash2 className="w-4 h-4 text-red-400" /></Button>
                      </div>
                      <div><Label className="text-xs">Question</Label><Input value={faq.question} onChange={(e) => updateFAQ(i, "question", e.target.value)} placeholder="Can I install mods?" /></div>
                      <div><Label className="text-xs">Answer</Label><Textarea rows={2} value={faq.answer} onChange={(e) => updateFAQ(i, "answer", e.target.value)} placeholder="Yes! Our panel supports one-click mod installation..." /></div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addFAQ} className="gap-1">
                    <Plus className="w-4 h-4" /> Add FAQ
                  </Button>
                </div>
              )}
            </div>

            {/* Save Actions */}
            <div className="flex gap-3 pt-2">
              <Button onClick={saveServer}><Save className="w-4 h-4 mr-1" /> Save Game Server</Button>
              {editing.id && editing.is_published && (
                <a href={`/game-servers/${editing.slug}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline"><Eye className="w-4 h-4 mr-1" /> Preview Live</Button>
                </a>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-end mb-4">
              <Button size="sm" onClick={() => setEditing({ is_published: false, popular: false, category: "other", os: "linux", sort_order: servers.length + 1, plans: [], faqs: [] })}>
                <Plus className="w-4 h-4 mr-1" /> New Game Server
              </Button>
            </div>
            <div className="space-y-2">
              {servers.map((s) => (
                <div key={s.id} className="glass-card p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Gamepad2 className={cn("w-5 h-5", s.is_published ? "text-primary" : "text-muted-foreground")} />
                    <div>
                      <span className="font-medium text-foreground">{s.title}</span>
                      <span className={cn("ml-2 text-xs px-2 py-0.5 rounded-full", s.is_published ? "bg-emerald-500/20 text-emerald-400" : "bg-muted text-muted-foreground")}>
                        {s.is_published ? "Published" : "Draft"}
                      </span>
                      {s.popular && <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">Popular</span>}
                      <div className="flex items-center gap-3">
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {s.category} · {s.pricing_display} · {(s.plans || []).length} plans · {(s.faqs || []).length} FAQs
                        </p>
                        <TranslationStatus translations={s.translations} />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {s.is_published && (
                      <a href={`/game-servers/${s.slug}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" title="View Live Page">
                          <ExternalLink className="w-4 h-4 text-primary" />
                        </Button>
                      </a>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => setEditing(s)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteServer(s.id)}><Trash2 className="w-4 h-4 text-red-400" /></Button>
                  </div>
                </div>
              ))}
              {servers.length === 0 && <p className="text-center text-muted-foreground py-8">No game servers yet.</p>}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
