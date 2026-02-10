import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface StatusMonitor {
  id: string;
  name: string;
  url: string | null;
  category: string;
  is_active: boolean;
  sort_order: number;
}

export interface StatusCheck {
  id: string;
  monitor_id: string;
  status: "up" | "down" | "degraded";
  response_time_ms: number | null;
  checked_at: string;
}

export interface MonitorWithChecks extends StatusMonitor {
  checks: StatusCheck[];
  uptimePercent: number;
}

export function useStatusMonitors(timeRange: "30m" | "1h" | "6h" | "24h" | "7d" | "30d" = "24h") {
  const [monitors, setMonitors] = useState<MonitorWithChecks[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const getTimeAgo = (range: string): string => {
    const now = new Date();
    switch (range) {
      case "30m": return new Date(now.getTime() - 30 * 60000).toISOString();
      case "1h": return new Date(now.getTime() - 60 * 60000).toISOString();
      case "6h": return new Date(now.getTime() - 6 * 3600000).toISOString();
      case "24h": return new Date(now.getTime() - 24 * 3600000).toISOString();
      case "7d": return new Date(now.getTime() - 7 * 86400000).toISOString();
      case "30d": return new Date(now.getTime() - 30 * 86400000).toISOString();
      default: return new Date(now.getTime() - 24 * 3600000).toISOString();
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const since = getTimeAgo(timeRange);

    const [monitorsRes, checksRes] = await Promise.all([
      supabase.from("status_monitors").select("*").eq("is_active", true).order("sort_order"),
      supabase.from("status_checks").select("*").gte("checked_at", since).order("checked_at", { ascending: true }),
    ]);

    if (monitorsRes.data && checksRes.data) {
      const checksMap = new Map<string, StatusCheck[]>();
      for (const c of checksRes.data as unknown as StatusCheck[]) {
        if (!checksMap.has(c.monitor_id)) checksMap.set(c.monitor_id, []);
        checksMap.get(c.monitor_id)!.push(c);
      }

      const result: MonitorWithChecks[] = (monitorsRes.data as unknown as StatusMonitor[]).map((m) => {
        const checks = checksMap.get(m.id) || [];
        const total = checks.length;
        const upCount = checks.filter((c) => c.status === "up").length;
        const uptimePercent = total > 0 ? Math.round((upCount / total) * 10000) / 100 : 100;
        return { ...m, checks, uptimePercent };
      });

      setMonitors(result);
    }
    setLastUpdated(new Date());
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, [timeRange]);

  return { monitors, loading, lastUpdated, refetch: fetchData };
}
