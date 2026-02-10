import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useKBAdmin } from "@/hooks/useKBAdmin";
import { useGameServers, DBGameServer } from "@/hooks/useGameServers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Plus, Pencil, Trash2, Save, X, LogIn, LogOut, ShieldAlert, Eye, EyeOff, Star, StarOff,
  ArrowLeft, Gamepad2, Image, Upload, GripVertical
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";

// ---- Login (reuse pattern from KBAdmin) ----
function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) toast.error(error.message);
      else toast.success("Account created! Ask the site owner to grant you admin access.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-md">
          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <ShieldAlert className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">{isSignUp ? "Create Admin Account" : "Admin Login"}</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Email</label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Password</label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
              </div>
              <Button type="submit" className="w-full btn-glow" disabled={loading}>
                <LogIn className="w-4 h-4 mr-2" />
                {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Log In"}
              </Button>
            </form>
            <button onClick={() => setIsSignUp(!isSignUp)} className="w-full text-center text-sm text-muted-foreground hover:text-primary mt-4 transition-colors">
              {isSignUp ? "Already have an account? Log in" : "Need an account? Sign up"}
            </button>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link to="/game-servers" className="hover:text-primary transition-colors">← Back to Game Servers</Link>
          </p>
        </div>
      </section>
    </Layout>
  );
}

function NoAccess() {
  return (
    <Layout>
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 text-center">
          <ShieldAlert className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You don't have admin privileges.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/game-servers"><Button variant="outline">Back to Game Servers</Button></Link>
            <Button variant="ghost" onClick={() => supabase.auth.signOut()}>
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

// ---- Image Uploader ----
function GameImageUploader({ onUploaded }: { onUploaded: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `games/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("article-images").upload(path, file);
    if (error) { toast.error("Upload failed: " + error.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("article-images").getPublicUrl(path);
    onUploaded(publicUrl);
    setUploading(false);
    toast.success("Image uploaded!");
  };

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={uploading}>
        <Upload className="w-4 h-4 mr-1" /> {uploading ? "Uploading..." : "Upload Cover Image"}
      </Button>
    </div>
  );
}

// ---- Empty game template ----
const emptyGame: Omit<DBGameServer, "id" | "created_at" | "updated_at"> = {
  slug: "",
  title: "",
  cover_image_url: null,
  pricing_display: "$0.00/slot",
  price_value: 0,
  pricing_unit: "slot",
  short_description: "",
  full_description: "",
  tags: [],
  category: "other",
  os: "linux",
  popular: false,
  is_published: false,
  hero_points: [],
  features: [],
  plans: [],
  faqs: [],
  sort_order: 0,
};

const categoryOptions = [
  { value: "fps", label: "FPS" },
  { value: "survival", label: "Survival" },
  { value: "sandbox", label: "Sandbox" },
  { value: "roleplay", label: "Roleplay" },
  { value: "mmo", label: "MMO" },
  { value: "racing", label: "Racing" },
  { value: "other", label: "Other" },
];

const osOptions = [
  { value: "linux", label: "Linux" },
  { value: "windows", label: "Windows" },
  { value: "both", label: "Both" },
];

const pricingUnitOptions = [
  { value: "slot", label: "Per Slot" },
  { value: "GB", label: "Per GB" },
  { value: "month", label: "Per Month" },
];

// ---- FAQ Editor ----
function FAQEditor({ faqs, onChange }: { faqs: any[]; onChange: (f: any[]) => void }) {
  const addFAQ = () => onChange([...faqs, { question: "", answer: "" }]);
  const removeFAQ = (i: number) => onChange(faqs.filter((_, idx) => idx !== i));
  const updateFAQ = (i: number, field: string, value: string) => {
    const updated = [...faqs];
    updated[i] = { ...updated[i], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">FAQs</label>
        <Button type="button" size="sm" variant="outline" onClick={addFAQ}><Plus className="w-3 h-3 mr-1" /> Add FAQ</Button>
      </div>
      {faqs.map((faq, i) => (
        <div key={i} className="p-3 rounded-lg bg-muted/50 border border-border space-y-2">
          <div className="flex items-start gap-2">
            <div className="flex-1 space-y-2">
              <Input placeholder="Question" value={faq.question || ""} onChange={e => updateFAQ(i, "question", e.target.value)} />
              <Textarea placeholder="Answer" value={faq.answer || ""} onChange={e => updateFAQ(i, "answer", e.target.value)} rows={2} />
            </div>
            <Button type="button" size="sm" variant="ghost" onClick={() => removeFAQ(i)}><Trash2 className="w-3 h-3 text-destructive" /></Button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- Plan Editor ----
function PlanEditor({ plans, onChange }: { plans: any[]; onChange: (p: any[]) => void }) {
  const addPlan = () => onChange([...plans, { name: "", slots: "", ram: "", cpu: "", storage: "", price: 0, popular: false, features: [] }]);
  const removePlan = (i: number) => onChange(plans.filter((_, idx) => idx !== i));
  const updatePlan = (i: number, field: string, value: any) => {
    const updated = [...plans];
    updated[i] = { ...updated[i], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">Plans</label>
        <Button type="button" size="sm" variant="outline" onClick={addPlan}><Plus className="w-3 h-3 mr-1" /> Add Plan</Button>
      </div>
      {plans.map((plan, i) => (
        <div key={i} className="p-3 rounded-lg bg-muted/50 border border-border space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Plan {i + 1}</span>
            <label className="flex items-center gap-1 text-xs ml-auto">
              <input type="checkbox" checked={!!plan.popular} onChange={e => updatePlan(i, "popular", e.target.checked)} /> Popular
            </label>
            <Button type="button" size="sm" variant="ghost" onClick={() => removePlan(i)}><Trash2 className="w-3 h-3 text-destructive" /></Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <Input placeholder="Name" value={plan.name || ""} onChange={e => updatePlan(i, "name", e.target.value)} />
            <Input placeholder="Slots" value={plan.slots || ""} onChange={e => updatePlan(i, "slots", e.target.value)} />
            <Input placeholder="RAM" value={plan.ram || ""} onChange={e => updatePlan(i, "ram", e.target.value)} />
            <Input placeholder="CPU" value={plan.cpu || ""} onChange={e => updatePlan(i, "cpu", e.target.value)} />
            <Input placeholder="Storage" value={plan.storage || ""} onChange={e => updatePlan(i, "storage", e.target.value)} />
            <Input placeholder="Price" type="number" step="0.01" value={plan.price || ""} onChange={e => updatePlan(i, "price", parseFloat(e.target.value) || 0)} />
          </div>
          <Input
            placeholder="Features (comma-separated)"
            value={(plan.features || []).join(", ")}
            onChange={e => updatePlan(i, "features", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))}
          />
        </div>
      ))}
    </div>
  );
}

// ---- Game Editor ----
function GameEditor({
  game,
  onSave,
  onCancel,
  saving,
}: {
  game: Partial<DBGameServer>;
  onSave: (data: any) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<any>({ ...emptyGame, ...game });

  const set = (field: string, value: any) => setForm((f: any) => ({ ...f, [field]: value }));
  const autoSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">{game.id ? "Edit Game" : "New Game"}</h2>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onCancel}><X className="w-4 h-4 mr-1" /> Cancel</Button>
          <Button onClick={() => onSave(form)} disabled={saving}><Save className="w-4 h-4 mr-1" /> {saving ? "Saving..." : "Save"}</Button>
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Title *</label>
          <Input
            value={form.title}
            onChange={e => { set("title", e.target.value); if (!game.id) set("slug", autoSlug(e.target.value)); }}
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Slug *</label>
          <Input value={form.slug} onChange={e => set("slug", e.target.value)} />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Category</label>
          <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.category} onChange={e => set("category", e.target.value)}>
            {categoryOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">OS</label>
          <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.os} onChange={e => set("os", e.target.value)}>
            {osOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Sort Order</label>
          <Input type="number" value={form.sort_order} onChange={e => set("sort_order", parseInt(e.target.value) || 0)} />
        </div>
      </div>

      {/* Pricing */}
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Pricing Display (e.g. $0.50/GB)</label>
          <Input value={form.pricing_display} onChange={e => set("pricing_display", e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Price Value</label>
          <Input type="number" step="0.01" value={form.price_value} onChange={e => set("price_value", parseFloat(e.target.value) || 0)} />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Pricing Unit</label>
          <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.pricing_unit} onChange={e => set("pricing_unit", e.target.value)}>
            {pricingUnitOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Cover Image */}
      <div>
        <label className="text-sm text-muted-foreground mb-1 block">Cover Image</label>
        <div className="flex items-center gap-4">
          {form.cover_image_url && (
            <img src={form.cover_image_url} alt="Cover" className="h-20 w-32 object-cover rounded-lg border border-border" />
          )}
          <GameImageUploader onUploaded={(url) => set("cover_image_url", url)} />
          {form.cover_image_url && (
            <Button type="button" variant="ghost" size="sm" onClick={() => set("cover_image_url", null)}><X className="w-3 h-3" /> Remove</Button>
          )}
        </div>
        <Input className="mt-2" placeholder="Or paste image URL..." value={form.cover_image_url || ""} onChange={e => set("cover_image_url", e.target.value || null)} />
      </div>

      {/* Descriptions */}
      <div>
        <label className="text-sm text-muted-foreground mb-1 block">Short Description</label>
        <Input value={form.short_description} onChange={e => set("short_description", e.target.value)} />
      </div>
      <div>
        <label className="text-sm text-muted-foreground mb-1 block">Full Description</label>
        <Textarea value={form.full_description} onChange={e => set("full_description", e.target.value)} rows={4} />
      </div>

      {/* Tags */}
      <div>
        <label className="text-sm text-muted-foreground mb-1 block">Tags (comma-separated)</label>
        <Input value={(form.tags || []).join(", ")} onChange={e => set("tags", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))} />
      </div>

      {/* Hero Points */}
      <div>
        <label className="text-sm text-muted-foreground mb-1 block">Hero Points (one per line)</label>
        <Textarea
          value={(form.hero_points || []).join("\n")}
          onChange={e => set("hero_points", e.target.value.split("\n").filter(Boolean))}
          rows={4}
          placeholder="One-click modpack installation&#10;Java & Bedrock crossplay support"
        />
      </div>

      {/* Features */}
      <div>
        <label className="text-sm text-muted-foreground mb-1 block">Features (one per line)</label>
        <Textarea
          value={(form.features || []).join("\n")}
          onChange={e => set("features", e.target.value.split("\n").filter(Boolean))}
          rows={6}
          placeholder="Full FTP & SFTP access&#10;One-click modpack installer&#10;Automatic backups"
        />
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.popular} onChange={e => set("popular", e.target.checked)} />
          <Star className="w-4 h-4 text-yellow-500" /> Popular
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_published} onChange={e => set("is_published", e.target.checked)} />
          <Eye className="w-4 h-4 text-primary" /> Published
        </label>
      </div>

      {/* Plans */}
      <PlanEditor plans={form.plans || []} onChange={p => set("plans", p)} />

      {/* FAQs */}
      <FAQEditor faqs={form.faqs || []} onChange={f => set("faqs", f)} />
    </div>
  );
}

// ---- Main Page ----
export default function GameAdmin() {
  const { isAdmin, loading: authLoading, user } = useKBAdmin();
  const { games, loading: gamesLoading, refetch } = useGameServers();
  const [editing, setEditing] = useState<Partial<DBGameServer> | null>(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("");

  if (authLoading) {
    return <Layout><section className="pt-32 pb-20"><div className="container mx-auto px-4 text-center"><p className="text-muted-foreground">Loading...</p></div></section></Layout>;
  }
  if (!user) return <AdminLogin />;
  if (!isAdmin) return <NoAccess />;

  const handleSave = async (data: any) => {
    setSaving(true);
    const payload = {
      slug: data.slug,
      title: data.title,
      cover_image_url: data.cover_image_url,
      pricing_display: data.pricing_display,
      price_value: data.price_value,
      pricing_unit: data.pricing_unit,
      short_description: data.short_description,
      full_description: data.full_description,
      tags: data.tags || [],
      category: data.category,
      os: data.os,
      popular: data.popular,
      is_published: data.is_published,
      hero_points: data.hero_points || [],
      features: data.features || [],
      plans: data.plans || [],
      faqs: data.faqs || [],
      sort_order: data.sort_order || 0,
    };

    if (data.id) {
      const { error } = await supabase.from("game_servers").update(payload).eq("id", data.id);
      if (error) { toast.error("Failed to update: " + error.message); setSaving(false); return; }
      toast.success("Game updated!");
    } else {
      const { error } = await supabase.from("game_servers").insert(payload);
      if (error) { toast.error("Failed to create: " + error.message); setSaving(false); return; }
      toast.success("Game created!");
    }
    setSaving(false);
    setEditing(null);
    refetch();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("game_servers").delete().eq("id", id);
    if (error) toast.error("Failed to delete: " + error.message);
    else { toast.success("Game deleted!"); refetch(); }
  };

  const togglePublish = async (game: DBGameServer) => {
    const { error } = await supabase.from("game_servers").update({ is_published: !game.is_published }).eq("id", game.id);
    if (error) toast.error(error.message);
    else refetch();
  };

  const filteredGames = games.filter(g =>
    !filter || g.title.toLowerCase().includes(filter.toLowerCase()) || g.category.includes(filter.toLowerCase())
  );

  return (
    <Layout>
      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 mb-8">
            <div className="flex items-center gap-3">
              <Link to="/game-servers" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></Link>
              <Gamepad2 className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Game Server Manager</h1>
            </div>
            <Button onClick={() => supabase.auth.signOut()} variant="ghost" size="sm" className="shrink-0">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>

          {editing ? (
            <div className="glass-card p-6">
              <GameEditor game={editing} onSave={handleSave} onCancel={() => setEditing(null)} saving={saving} />
            </div>
          ) : (
            <>
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Button onClick={() => setEditing({})}>
                  <Plus className="w-4 h-4 mr-1" /> Add Game
                </Button>
                <Input
                  className="max-w-xs"
                  placeholder="Filter games..."
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                />
                <span className="text-sm text-muted-foreground ml-auto">{games.length} games total</span>
              </div>

              {/* Games List */}
              {gamesLoading ? (
                <p className="text-muted-foreground text-center py-12">Loading...</p>
              ) : filteredGames.length === 0 ? (
                <div className="text-center py-16 glass-card">
                  <Gamepad2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No games yet. Add your first game server!</p>
                  <Button onClick={() => setEditing({})}><Plus className="w-4 h-4 mr-1" /> Add Game</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredGames.map(game => (
                    <div key={game.id} className="glass-card p-4 flex items-center gap-4">
                      {/* Cover */}
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        {game.cover_image_url ? (
                          <img src={game.cover_image_url} alt={game.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Gamepad2 className="w-6 h-6 text-muted-foreground" /></div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground truncate">{game.title}</h3>
                          {game.popular && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${game.is_published ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}>
                            {game.is_published ? "Published" : "Draft"}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">{game.category}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{game.short_description} • {game.pricing_display} • {(game.plans || []).length} plans • {(game.faqs || []).length} FAQs</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button variant="ghost" size="sm" onClick={() => togglePublish(game)} title={game.is_published ? "Unpublish" : "Publish"}>
                          {game.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setEditing(game)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete "{game.title}"?</AlertDialogTitle>
                              <AlertDialogDescription>This will permanently remove this game server and its page.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(game.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
