import { Layout } from "@/components/layout/Layout";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, LogOut, Save, X, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface Monitor {
  id: string;
  name: string;
  url: string | null;
  category: string;
  check_type: string;
  check_interval_seconds: number;
  is_active: boolean;
  sort_order: number;
}

export default function StatusAdmin() {
  const { logout } = useAdminAuth();
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [editing, setEditing] = useState<Partial<Monitor> | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from("status_monitors").select("*").order("sort_order");
    setMonitors(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const saveMonitor = async () => {
    if (!editing?.name) return;
    const payload = {
      name: editing.name,
      url: editing.url || null,
      category: editing.category || "Services",
      check_type: editing.check_type || "http",
      check_interval_seconds: editing.check_interval_seconds || 60,
      is_active: editing.is_active ?? true,
      sort_order: editing.sort_order ?? 0,
    };

    if (editing.id) {
      const { error } = await supabase.from("status_monitors").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("status_monitors").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }
    toast({ title: "Saved!" });
    setEditing(null);
    fetchData();
  };

  const deleteMonitor = async (id: string) => {
    if (!confirm("Delete this monitor and all its checks?")) return;
    await supabase.from("status_checks").delete().eq("monitor_id", id);
    await supabase.from("status_monitors").delete().eq("id", id);
    fetchData();
  };

  return (
    <Layout>
      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Status Admin</h1>
              <p className="text-sm text-muted-foreground">Manage infrastructure monitors</p>
            </div>
            <div className="flex gap-2">
              <Link to="/kb-admin"><Button variant="outline" size="sm">Content Admin</Button></Link>
              <Button variant="ghost" size="sm" onClick={logout}><LogOut className="w-4 h-4" /></Button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="glass-card p-4 rounded-xl animate-pulse h-16" />)}
            </div>
          ) : editing ? (
            <div className="glass-card p-6 rounded-xl space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-foreground">{editing.id ? "Edit Monitor" : "New Monitor"}</h2>
                <Button variant="ghost" size="icon" onClick={() => setEditing(null)}><X className="w-4 h-4" /></Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Name</Label><Input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
                <div><Label>Category</Label><Input value={editing.category || ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} placeholder="Services" /></div>
              </div>
              <div><Label>URL / IP (leave empty for simulated)</Label><Input value={editing.url || ""} onChange={(e) => setEditing({ ...editing, url: e.target.value })} placeholder="https://example.com or 1.2.3.4:25565" /></div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Check Type</Label>
                  <select className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" value={editing.check_type || "http"} onChange={(e) => setEditing({ ...editing, check_type: e.target.value })}>
                    <option value="http">HTTP</option>
                    <option value="tcp">TCP</option>
                    <option value="ping">Ping</option>
                  </select>
                </div>
                <div><Label>Interval (sec)</Label><Input type="number" value={editing.check_interval_seconds || 60} onChange={(e) => setEditing({ ...editing, check_interval_seconds: parseInt(e.target.value) || 60 })} /></div>
                <div><Label>Sort Order</Label><Input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} /></div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={editing.is_active ?? true} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} />
                <Label>Active</Label>
              </div>
              <Button onClick={saveMonitor}><Save className="w-4 h-4 mr-1" /> Save Monitor</Button>
            </div>
          ) : (
            <div>
              <div className="flex justify-end mb-4">
                <Button size="sm" onClick={() => setEditing({ is_active: true, check_type: "http", check_interval_seconds: 60, sort_order: monitors.length + 1, category: "Services" })}>
                  <Plus className="w-4 h-4 mr-1" /> New Monitor
                </Button>
              </div>
              <div className="space-y-2">
                {monitors.map((m) => (
                  <div key={m.id} className="glass-card p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Activity className={cn("w-5 h-5", m.is_active ? "text-emerald-400" : "text-muted-foreground")} />
                      <div>
                        <span className="font-medium text-foreground">{m.name}</span>
                        <span className={cn("ml-2 text-xs px-2 py-0.5 rounded-full", m.is_active ? "bg-emerald-500/20 text-emerald-400" : "bg-muted text-muted-foreground")}>
                          {m.is_active ? "Active" : "Inactive"}
                        </span>
                        <p className="text-xs text-muted-foreground mt-0.5">{m.category} · {m.check_type} · {m.url || "simulated"}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setEditing(m)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteMonitor(m.id)}><Trash2 className="w-4 h-4 text-red-400" /></Button>
                    </div>
                  </div>
                ))}
                {monitors.length === 0 && <p className="text-center text-muted-foreground py-8">No monitors yet.</p>}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
