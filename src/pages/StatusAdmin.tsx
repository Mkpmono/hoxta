import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useKBAdmin } from "@/hooks/useKBAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Save, X, Activity, ArrowLeft, LogIn, ShieldAlert, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

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

interface MonitorStats {
  monitor_id: string;
  total: number;
  up: number;
  down: number;
  degraded: number;
  avg_response: number;
  last_status: string;
  last_checked: string;
}

const EMPTY_MONITOR: Omit<Monitor, "id"> = {
  name: "",
  url: "",
  category: "Services",
  check_type: "http",
  check_interval_seconds: 60,
  is_active: true,
  sort_order: 0,
};

// Login form for admin auth - no sign-up, admin accounts are pre-created
function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast.error("Invalid credentials");
    setLoading(false);
  };

  return (
    <Layout>
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-md">
          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <ShieldAlert className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Access restricted to authorized administrators only.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Email</label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Password</label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} autoComplete="current-password" />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                <LogIn className="w-4 h-4 mr-2" />
                {loading ? "Loading..." : "Sign In"}
              </Button>
            </form>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link to="/status" className="hover:text-primary transition-colors">← Back to Status</Link>
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
        <div className="container mx-auto px-4 max-w-md text-center">
          <div className="glass-card p-8">
            <ShieldAlert className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h1 className="text-xl font-bold text-foreground mb-2">Access Denied</h1>
            <p className="text-muted-foreground text-sm mb-6">You need admin privileges to access this page.</p>
            <Button variant="outline" onClick={() => supabase.auth.signOut()}>
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default function StatusAdmin() {
  const { isAdmin, loading: authLoading, user } = useKBAdmin();
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [stats, setStats] = useState<Map<string, MonitorStats>>(new Map());
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Omit<Monitor, "id">>(EMPTY_MONITOR);
  const [isAdding, setIsAdding] = useState(false);

  const fetchMonitors = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("status_monitors")
      .select("*")
      .order("sort_order");

    if (error) {
      toast.error("Failed to load monitors");
      setLoading(false);
      return;
    }

    const mons = (data || []) as unknown as Monitor[];
    setMonitors(mons);

    // Fetch stats for last 24h
    const since = new Date(Date.now() - 24 * 3600000).toISOString();
    const { data: checks } = await supabase
      .from("status_checks")
      .select("*")
      .gte("checked_at", since)
      .order("checked_at", { ascending: false });

    if (checks) {
      const statsMap = new Map<string, MonitorStats>();
      for (const mon of mons) {
        const monChecks = (checks as any[]).filter((c) => c.monitor_id === mon.id);
        const total = monChecks.length;
        const up = monChecks.filter((c) => c.status === "up").length;
        const down = monChecks.filter((c) => c.status === "down").length;
        const degraded = monChecks.filter((c) => c.status === "degraded").length;
        const avgResp = total > 0
          ? Math.round(monChecks.reduce((s, c) => s + (c.response_time_ms || 0), 0) / total)
          : 0;
        statsMap.set(mon.id, {
          monitor_id: mon.id,
          total,
          up,
          down,
          degraded,
          avg_response: avgResp,
          last_status: monChecks[0]?.status || "unknown",
          last_checked: monChecks[0]?.checked_at || "",
        });
      }
      setStats(statsMap);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) fetchMonitors();
  }, [isAdmin]);

  if (authLoading) {
    return (
      <Layout>
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </section>
      </Layout>
    );
  }

  if (!user) return <AdminLogin />;
  if (!isAdmin) return <NoAccess />;

  const handleSave = async () => {
    if (!editForm.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from("status_monitors")
        .update({
          name: editForm.name,
          url: editForm.url || null,
          category: editForm.category,
          check_type: editForm.check_type,
          is_active: editForm.is_active,
          sort_order: editForm.sort_order,
        })
        .eq("id", editingId);

      if (error) {
        toast.error("Failed to update monitor");
        return;
      }
      toast.success("Monitor updated");
    } else {
      const { error } = await supabase.from("status_monitors").insert({
        name: editForm.name,
        url: editForm.url || null,
        category: editForm.category,
        check_type: editForm.check_type,
        is_active: editForm.is_active,
        sort_order: editForm.sort_order,
      });

      if (error) {
        toast.error("Failed to create monitor");
        return;
      }
      toast.success("Monitor created");
    }

    setEditingId(null);
    setIsAdding(false);
    setEditForm(EMPTY_MONITOR);
    fetchMonitors();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this monitor and all its history?")) return;
    const { error } = await supabase.from("status_monitors").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
      return;
    }
    toast.success("Monitor deleted");
    fetchMonitors();
  };

  const startEdit = (mon: Monitor) => {
    setEditingId(mon.id);
    setIsAdding(false);
    setEditForm({
      name: mon.name,
      url: mon.url || "",
      category: mon.category,
      check_type: mon.check_type,
      check_interval_seconds: mon.check_interval_seconds,
      is_active: mon.is_active,
      sort_order: mon.sort_order,
    });
  };

  const startAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setEditForm(EMPTY_MONITOR);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setEditForm(EMPTY_MONITOR);
  };

  const statusColor = (status: string) => {
    if (status === "up") return "text-green-400";
    if (status === "down") return "text-red-400";
    if (status === "degraded") return "text-amber-400";
    return "text-muted-foreground";
  };

  const statusDot = (status: string) => {
    if (status === "up") return "bg-green-400";
    if (status === "down") return "bg-red-400";
    if (status === "degraded") return "bg-amber-400";
    return "bg-muted-foreground";
  };

  return (
    <Layout>
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3 min-w-0">
              <Link to="/status" className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
                  <span className="truncate">Status Monitors</span>
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Manage services monitored on your status page
                </p>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button onClick={startAdd} disabled={isAdding} size="sm" className="flex-1 sm:flex-none">
                <Plus className="w-4 h-4 mr-1" /> Add Monitor
              </Button>
              <Button onClick={() => supabase.auth.signOut()} variant="ghost" size="sm" className="shrink-0">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Add Form */}
          {isAdding && (
            <div className="glass-card p-5 rounded-xl mb-6 border border-primary/30">
              <h3 className="font-semibold text-foreground mb-4">New Monitor</h3>
              <MonitorForm form={editForm} setForm={setEditForm} />
              <div className="flex gap-2 mt-4">
                <Button onClick={handleSave} size="sm"><Save className="w-4 h-4 mr-1" /> Save</Button>
                <Button onClick={cancelEdit} variant="ghost" size="sm"><X className="w-4 h-4 mr-1" /> Cancel</Button>
              </div>
            </div>
          )}

          {/* Monitor List */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card p-5 rounded-xl animate-pulse h-20" />
              ))}
            </div>
          ) : monitors.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              No monitors configured yet. Add one to start monitoring.
            </div>
          ) : (
            <div className="space-y-3">
              {monitors.map((mon) => {
                const s = stats.get(mon.id);
                const isEditing = editingId === mon.id;

                if (isEditing) {
                  return (
                    <div key={mon.id} className="glass-card p-5 rounded-xl border border-primary/30">
                      <MonitorForm form={editForm} setForm={setEditForm} />
                      <div className="flex gap-2 mt-4">
                        <Button onClick={handleSave} size="sm"><Save className="w-4 h-4 mr-1" /> Save</Button>
                        <Button onClick={cancelEdit} variant="ghost" size="sm"><X className="w-4 h-4 mr-1" /> Cancel</Button>
                      </div>
                    </div>
                  );
                }

                const uptime = s && s.total > 0
                  ? Math.round((s.up / s.total) * 10000) / 100
                  : null;

                return (
                  <div
                    key={mon.id}
                    className={cn(
                      "glass-card p-5 rounded-xl flex flex-col md:flex-row md:items-center gap-4 justify-between",
                      !mon.is_active && "opacity-50"
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {s && <span className={cn("w-2.5 h-2.5 rounded-full", statusDot(s.last_status))} />}
                        <span className="font-medium text-foreground">{mon.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {mon.category}
                        </span>
                        {!mon.is_active && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            Paused
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground flex flex-wrap gap-3">
                        {mon.url && <span className="truncate max-w-[300px]">{mon.url}</span>}
                        {s && (
                          <>
                            <span className={statusColor(s.last_status)}>
                              {uptime !== null ? `${uptime}% uptime` : "No data"}
                            </span>
                            <span>Avg: {s.avg_response}ms</span>
                            <span>{s.total} checks (24h)</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 shrink-0 self-end sm:self-center">
                      <Button onClick={() => startEdit(mon)} variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button onClick={() => handleDelete(mon.id)} variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

function MonitorForm({
  form,
  setForm,
}: {
  form: Omit<Monitor, "id">;
  setForm: React.Dispatch<React.SetStateAction<Omit<Monitor, "id">>>;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Name *</label>
        <Input
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="e.g. Minecraft Server"
        />
      </div>
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">URL / IP (with port)</label>
        <Input
          value={form.url || ""}
          onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
          placeholder="e.g. https://example.com or http://1.2.3.4:25565"
        />
      </div>
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Category</label>
        <Input
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          placeholder="e.g. Services, VPN, Servers"
        />
      </div>
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Check Type</label>
        <Select value={form.check_type} onValueChange={(v) => setForm((f) => ({ ...f, check_type: v }))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="http">HTTP(S)</SelectItem>
            <SelectItem value="tcp">TCP</SelectItem>
            <SelectItem value="ping">Ping</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Sort Order</label>
        <Input
          type="number"
          value={form.sort_order}
          onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
        />
      </div>
      <div className="flex items-end gap-3">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
            className="rounded"
          />
          Active
        </label>
      </div>
    </div>
  );
}
