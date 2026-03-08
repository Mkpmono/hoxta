import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, ShieldAlert, ShieldBan, Globe, Monitor, Trash2, RefreshCw, Search, Filter, Ban, Eye, EyeOff, ExternalLink } from "lucide-react";
import { AdminLayout } from "@/components/panel/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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

interface BlockedIP {
  id: string;
  ip_address: string;
  reason: string | null;
  created_at: string;
}

export default function VisitorLogs() {
  const [logs, setLogs] = useState<VisitorLog[]>([]);
  const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "bots" | "clean" | "blocked">("all");
  const [expandedUA, setExpandedUA] = useState<Set<string>>(new Set());
  const [scanningIP, setScanningIP] = useState<string | null>(null);
  const [scanResults, setScanResults] = useState<Record<string, any>>({});

  const fetchLogs = async () => {
    setLoading(true);
    const [logsRes, blockedRes] = await Promise.all([
      supabase.from("visitor_logs").select("*").order("created_at", { ascending: false }).limit(500),
      supabase.from("blocked_ips").select("*").order("created_at", { ascending: false }),
    ]);
    if (!logsRes.error && logsRes.data) setLogs(logsRes.data as unknown as VisitorLog[]);
    if (!blockedRes.error && blockedRes.data) setBlockedIPs(blockedRes.data as unknown as BlockedIP[]);
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, []);

  const handleClearLogs = async () => {
    if (!confirm("Ești sigur că vrei să ștergi toate logurile?")) return;
    const { error } = await supabase.from("visitor_logs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (!error) fetchLogs();
  };

  const handleBlockIP = async (ip: string) => {
    if (!confirm(`Blochezi IP-ul ${ip}?`)) return;
    const { error } = await supabase.from("blocked_ips").insert({ ip_address: ip, reason: "Manual block from admin" } as any);
    if (error) {
      if (error.code === "23505") toast.error("IP-ul este deja blocat");
      else toast.error("Eroare: " + error.message);
    } else {
      toast.success(`IP ${ip} blocat`);
      fetchLogs();
    }
  };

  const handleUnblockIP = async (ip: string) => {
    const { error } = await supabase.from("blocked_ips").delete().eq("ip_address", ip);
    if (!error) {
      toast.success(`IP ${ip} deblocat`);
      fetchLogs();
    }
  };

  const handleScanIP = async (ip: string) => {
    setScanningIP(ip);
    try {
      // Use ip-api.com for free abuse/reputation info
      const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,isp,org,as,proxy,hosting,query`);
      const data = await res.json();
      setScanResults((prev) => ({ ...prev, [ip]: data }));
      toast.success(`Scanare completă pentru ${ip}`);
    } catch {
      toast.error("Eroare la scanare IP");
    } finally {
      setScanningIP(null);
    }
  };

  const isIPBlocked = (ip: string) => blockedIPs.some((b) => b.ip_address === ip);

  const toggleUA = (id: string) => {
    setExpandedUA((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const filtered = logs.filter((log) => {
    const matchesSearch = !search ||
      log.ip_address.includes(search) ||
      (log.user_agent || "").toLowerCase().includes(search.toLowerCase()) ||
      (log.country_code || "").toLowerCase().includes(search.toLowerCase()) ||
      (log.isp || "").toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filterType === "all" ||
      (filterType === "bots" && log.is_bot) ||
      (filterType === "clean" && !log.is_bot) ||
      (filterType === "blocked" && isIPBlocked(log.ip_address));
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
              <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />Refresh
            </Button>
            <Button variant="destructive" size="sm" onClick={handleClearLogs}>
              <Trash2 className="w-4 h-4 mr-1" />Clear All
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {[
            { icon: Globe, label: "Total Vizitatori", value: totalVisitors, color: "text-primary" },
            { icon: Shield, label: "Trafic Curat", value: totalClean, color: "text-green-400" },
            { icon: ShieldAlert, label: "Boți Detectați", value: totalBots, color: "text-destructive" },
            { icon: Monitor, label: "IP-uri Unice", value: uniqueIPs, color: "text-yellow-400" },
            { icon: ShieldBan, label: "IP-uri Blocate", value: blockedIPs.length, color: "text-orange-400" },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted/50 ${stat.color}`}><stat.icon className="w-5 h-5" /></div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Blocked IPs */}
        {blockedIPs.length > 0 && (
          <div className="glass-card p-4 mb-4">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <ShieldBan className="w-4 h-4 text-orange-400" /> IP-uri Blocate ({blockedIPs.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {blockedIPs.map((b) => (
                <Badge key={b.id} variant="outline" className="border-orange-500/30 text-orange-400 text-xs gap-1">
                  {b.ip_address}
                  <button onClick={() => handleUnblockIP(b.ip_address)} className="ml-1 hover:text-foreground" title="Deblochează">×</button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="glass-card p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Caută după IP, browser, țară, ISP, user agent..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="flex gap-2">
              {(["all", "clean", "bots", "blocked"] as const).map((f) => (
                <Button key={f} variant={filterType === f ? "default" : "outline"} size="sm" onClick={() => setFilterType(f)}>
                  <Filter className="w-3 h-3 mr-1" />
                  {f === "all" ? "Toate" : f === "clean" ? "Curate" : f === "bots" ? "Boți" : "Blocate"}
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
                  <th className="text-left p-3 text-muted-foreground font-medium">Browser / OS</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">User Agent</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Ray ID</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Data</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Acțiuni</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} className="text-center py-12 text-muted-foreground"><RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />Se încarcă...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={9} className="text-center py-12 text-muted-foreground">Niciun log găsit</td></tr>
                ) : (
                  filtered.map((log) => (
                    <tr key={log.id} className={`border-b border-border/30 hover:bg-muted/30 transition-colors ${isIPBlocked(log.ip_address) ? "bg-orange-500/5" : ""}`}>
                      <td className="p-3">
                        {isIPBlocked(log.ip_address) ? (
                          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-[10px]">
                            <ShieldBan className="w-3 h-3 mr-1" />BLOCKED
                          </Badge>
                        ) : log.is_bot ? (
                          <Badge variant="destructive" className="text-[10px]"><ShieldAlert className="w-3 h-3 mr-1" />BOT</Badge>
                        ) : (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px]"><Shield className="w-3 h-3 mr-1" />CLEAN</Badge>
                        )}
                      </td>
                      <td className="p-3 font-mono text-xs text-foreground">{log.ip_address}</td>
                      <td className="p-3">
                        {log.country_code ? (
                          <span className="flex items-center gap-1 text-xs"><span className={`fi fi-${log.country_code.toLowerCase()}`} />{log.country_code}</span>
                        ) : <span className="text-muted-foreground text-xs">—</span>}
                      </td>
                      <td className="p-3 text-xs text-muted-foreground max-w-[150px] truncate">{log.isp || "—"}</td>
                      <td className="p-3 text-xs text-foreground">
                        {getBrowserName(log.user_agent)} / {getOSName(log.user_agent)}
                      </td>
                      <td className="p-3 text-xs max-w-[200px]">
                        {log.user_agent ? (
                          <div>
                            <button onClick={() => toggleUA(log.id)} className="flex items-center gap-1 text-primary hover:text-primary/80 text-[10px]">
                              {expandedUA.has(log.id) ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              {expandedUA.has(log.id) ? "Ascunde" : "Arată"}
                            </button>
                            {expandedUA.has(log.id) && (
                              <p className="text-muted-foreground text-[10px] mt-1 break-all leading-relaxed">{log.user_agent}</p>
                            )}
                          </div>
                        ) : <span className="text-muted-foreground text-xs">—</span>}
                      </td>
                      <td className="p-3 font-mono text-[10px] text-muted-foreground">{log.ray_id || "—"}</td>
                      <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">{formatDate(log.created_at)}</td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          {!isIPBlocked(log.ip_address) ? (
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-orange-400 hover:text-orange-300 hover:bg-orange-500/10" onClick={() => handleBlockIP(log.ip_address)} title="Blochează IP">
                              <Ban className="w-3 h-3" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-green-400 hover:text-green-300 hover:bg-green-500/10" onClick={() => handleUnblockIP(log.ip_address)} title="Deblochează IP">
                              <Shield className="w-3 h-3" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-primary hover:text-primary/80" onClick={() => handleScanIP(log.ip_address)}
                            disabled={scanningIP === log.ip_address} title="Scanează IP">
                            <ExternalLink className={`w-3 h-3 ${scanningIP === log.ip_address ? "animate-spin" : ""}`} />
                          </Button>
                        </div>
                      </td>
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

        {/* Scan Results */}
        {Object.keys(scanResults).length > 0 && (
          <div className="glass-card p-4 mt-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Rezultate Scanare IP</h3>
            <div className="space-y-3">
              {Object.entries(scanResults).map(([ip, data]: [string, any]) => (
                <div key={ip} className="border border-border/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-foreground font-bold">{ip}</span>
                    <div className="flex gap-2">
                      {data.proxy && <Badge variant="destructive" className="text-[10px]">PROXY</Badge>}
                      {data.hosting && <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-[10px]">HOSTING</Badge>}
                      {!data.proxy && !data.hosting && <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px]">CLEAN</Badge>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                    <div><span className="text-muted-foreground">Țară:</span> <span className="text-foreground">{data.country || "—"}</span></div>
                    <div><span className="text-muted-foreground">Oraș:</span> <span className="text-foreground">{data.city || "—"}</span></div>
                    <div><span className="text-muted-foreground">ISP:</span> <span className="text-foreground">{data.isp || "—"}</span></div>
                    <div><span className="text-muted-foreground">Org:</span> <span className="text-foreground">{data.org || "—"}</span></div>
                    <div className="col-span-2"><span className="text-muted-foreground">AS:</span> <span className="text-foreground">{data.as || "—"}</span></div>
                  </div>
                  {!isIPBlocked(ip) && (data.proxy || data.hosting) && (
                    <Button variant="outline" size="sm" className="mt-2 text-orange-400 border-orange-500/30 text-xs" onClick={() => handleBlockIP(ip)}>
                      <Ban className="w-3 h-3 mr-1" /> Blochează IP-ul
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bot details */}
        {filtered.some((l) => l.is_bot && l.bot_reasons && l.bot_reasons.length > 0) && (
          <div className="glass-card p-4 mt-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Detalii Boți Detectați</h3>
            <div className="space-y-2">
              {filtered.filter((l) => l.is_bot && l.bot_reasons && l.bot_reasons.length > 0).slice(0, 10).map((log) => (
                <div key={log.id} className="flex items-center gap-3 text-xs">
                  <span className="font-mono text-foreground">{log.ip_address}</span>
                  <span className="text-muted-foreground">→</span>
                  <div className="flex gap-1 flex-wrap">
                    {log.bot_reasons!.map((r, i) => (
                      <Badge key={i} variant="outline" className="text-[10px] border-destructive/30 text-destructive">{r}</Badge>
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
