import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface StatusMonitor {
  id: string;
  name: string;
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

export type TimeRange = "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "24h" | "7d" | "30d";

function getTimeRangeDate(range: TimeRange): Date {
  const now = new Date();
  const map: Record<TimeRange, number> = {
    "1m": 60_000,
    "5m": 5 * 60_000,
    "15m": 15 * 60_000,
    "30m": 30 * 60_000,
    "1h": 3600_000,
    "6h": 6 * 3600_000,
    "24h": 86400_000,
    "7d": 7 * 86400_000,
    "30d": 30 * 86400_000,
  };
  return new Date(now.getTime() - map[range]);
}

export function useStatusMonitors(timeRange: TimeRange = "24h") {
  const [monitors, setMonitors] = useState<MonitorWithChecks[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = useCallback(async () => {
    try {
      // Step 1: Fetch monitors first and display them immediately
      const { data: monitorRows, error: mErr } = await supabase
        .from("status_monitors_public")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (mErr) {
        console.error("Failed to fetch monitors:", mErr);
        setLoading(false);
        return;
      }

      if (!monitorRows || monitorRows.length === 0) {
        setMonitors([]);
        setLoading(false);
        setLastUpdated(new Date());
        return;
      }

      // Show monitors immediately with 100% uptime (before checks load)
      const initialMonitors: MonitorWithChecks[] = monitorRows.map((m) => ({
        id: m.id!,
        name: m.name!,
        category: m.category!,
        is_active: m.is_active!,
        sort_order: m.sort_order!,
        checks: [],
        uptimePercent: 100,
      }));
      setMonitors(initialMonitors);
      setLoading(false);

      // Step 2: Fetch checks in background (non-blocking)
      const monitorIds = monitorRows.map((m) => m.id!).filter(Boolean);
      const since = getTimeRangeDate(timeRange).toISOString();

      const { data: checkRows, error: cErr } = await supabase
        .from("status_checks")
        .select("id, monitor_id, status, response_time_ms, checked_at")
        .in("monitor_id", monitorIds)
        .gte("checked_at", since)
        .order("checked_at", { ascending: true })
        .limit(5000);

      if (cErr) {
        console.error("Failed to fetch checks:", cErr);
        // Monitors are already displayed, just skip checks
        setLastUpdated(new Date());
        return;
      }

      const checksMap = new Map<string, StatusCheck[]>();
      for (const c of checkRows || []) {
        const list = checksMap.get(c.monitor_id) || [];
        list.push({
          id: c.id,
          monitor_id: c.monitor_id,
          status: c.status as "up" | "down" | "degraded",
          response_time_ms: c.response_time_ms,
          checked_at: c.checked_at,
        });
        checksMap.set(c.monitor_id, list);
      }

      // Update monitors with actual check data
      const result: MonitorWithChecks[] = monitorRows.map((m) => {
        const checks = checksMap.get(m.id!) || [];
        const total = checks.length;
        const upCount = checks.filter((c) => c.status === "up").length;
        const uptimePercent = total > 0 ? parseFloat(((upCount / total) * 100).toFixed(2)) : 100;

        return {
          id: m.id!,
          name: m.name!,
          category: m.category!,
          is_active: m.is_active!,
          sort_order: m.sort_order!,
          checks,
          uptimePercent,
        };
      });

      setMonitors(result);
    } catch (err) {
      console.error("Status fetch error:", err);
    }
    setLastUpdated(new Date());
  }, [timeRange]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { monitors, loading, lastUpdated, refetch: fetchData };
}
