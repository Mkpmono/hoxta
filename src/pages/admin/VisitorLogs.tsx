import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, ShieldAlert, Globe, Monitor, Trash2, RefreshCw, Search, Filter } from "lucide-react";
import { AdminLayout } from "@/components/panel/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface VisitorLog {
  id: string;
  ip_address: string;
  country_code: string | null;
  isp: string | null;
  user_agent: string | null;
  is_bot: boolean;
  bot_reasons: string[] | null;
  canvas_fingerprint: string | null;
  ray_id: string | null;
  result: string;
  created_at: string;
}

export default function VisitorLogs() {
  const [logs, setLogs] = useState<VisitorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "bots" | "clean">("all");

  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("visitor_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);

    if (!error && data) {
      setLogs(data as unknown as VisitorLog[]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, []);

  const handleClearLogs = async () => {
    if (!confirm("Ești sigur că vrei să ștergi toate logurile?")) return;
    const { error } = await supabase.from("visitor_logs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (!error) fetchLogs();
  };

  const filtered = logs.filter((log) => {
    const matchesSearch =
      !search ||
      log.ip_address.includes(search) ||
      (log.user_agent || "").toLowerCase().includes(search.toLowerCase()) ||
      (log.country_code || "").toLowerCase().includes(search.toLowerCase()) ||
      (log.isp || "").toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filterType === "all" ||
      (filterType === "bots" && log.is_bot) ||
      (filterType === "clean" && !log.is_bot);

    return matchesSearch && matchesFilter;
  });

  const totalVisitors = logs.length;
  const totalBots = logs.filter((l) => l.is_bot).length;
  const totalClean = logs.filter((l) => !l.is_bot).length;
  const uniqueIPs = new Set(logs.map((l) => l.ip_address)).size;

  const getBrowserName = (ua: string | null) => {
    if (!ua) return "Unknown";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Edg")) return "Edge";
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Safari")) return "Safari";
    if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
    return "Other";
  };

  const getOSName = (ua: string | null) => {
    if (!ua) return "Unknown";
    if (ua.includes("Windows")) return "Windows";
    if (ua.includes("Mac")) return "macOS";
    if (ua.includes("Linux")) return "Linux";
    if (ua.includes("Android")) return "Android";
    if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
    return "Other";
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleString("ro-RO", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Visitor Logs</h1>
            <p className="text-sm text-muted-foreground">DDoS Gate — trafic monitorizat</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchLogs} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="destructive" size="sm" onClick={handleClearLogs}>
              <Trash2 className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Globe, label: "Total Vizitatori", value: totalVisitors, color: "text-primary" },
            { icon: Shield, label: "Trafic Curat", value: totalClean, color: "text-green-400" },
            { icon: ShieldAlert, label: "Boți Detectați", value: totalBots, color: "text-destructive" },
            { icon: Monitor, label: "IP-uri Unice", value: uniqueIPs, color: "text-yellow-400" },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted/50 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="glass-card p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Caută după IP, browser, țară, ISP..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "clean", "bots"] as const).map((f) => (
                <Button
                  key={f}
                  variant={filterType === f ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType(f)}
                >
                  <Filter className="w-3 h-3 mr-1" />
                  {f === "all" ? "Toate" : f === "clean" ? "Curate" : "Boți"}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-3 text-muted-foreground font-medium">Status</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">IP</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Țară</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">ISP</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Browser</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">OS</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Ray ID</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-muted-foreground">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />
                      Se încarcă...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-muted-foreground">
                      Niciun log găsit
                    </td>
                  </tr>
                ) : (
                  filtered.map((log) => (
                    <tr key={log.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        {log.is_bot ? (
                          <Badge variant="destructive" className="text-[10px]">
                            <ShieldAlert className="w-3 h-3 mr-1" />
                            BOT
                          </Badge>
                        ) : (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px]">
                            <Shield className="w-3 h-3 mr-1" />
                            CLEAN
                          </Badge>
                        )}
                      </td>
                      <td className="p-3 font-mono text-xs text-foreground">{log.ip_address}</td>
                      <td className="p-3">
                        {log.country_code ? (
                          <span className="flex items-center gap-1 text-xs">
                            <span className={`fi fi-${log.country_code.toLowerCase()}`} />
                            {log.country_code}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </td>
                      <td className="p-3 text-xs text-muted-foreground max-w-[150px] truncate">{log.isp || "—"}</td>
                      <td className="p-3 text-xs text-foreground">{getBrowserName(log.user_agent)}</td>
                      <td className="p-3 text-xs text-muted-foreground">{getOSName(log.user_agent)}</td>
                      <td className="p-3 font-mono text-[10px] text-muted-foreground">{log.ray_id || "—"}</td>
                      <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">{formatDate(log.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filtered.length > 0 && (
            <div className="p-3 border-t border-border/50 text-xs text-muted-foreground">
              Se afișează {filtered.length} din {logs.length} loguri
            </div>
          )}
        </div>

        {/* Bot details */}
        {filtered.some((l) => l.is_bot && l.bot_reasons && l.bot_reasons.length > 0) && (
          <div className="glass-card p-4 mt-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Detalii Boți Detectați</h3>
            <div className="space-y-2">
              {filtered
                .filter((l) => l.is_bot && l.bot_reasons && l.bot_reasons.length > 0)
                .slice(0, 10)
                .map((log) => (
                  <div key={log.id} className="flex items-center gap-3 text-xs">
                    <span className="font-mono text-foreground">{log.ip_address}</span>
                    <span className="text-muted-foreground">→</span>
                    <div className="flex gap-1 flex-wrap">
                      {log.bot_reasons!.map((r, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] border-destructive/30 text-destructive">
                          {r}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
}
