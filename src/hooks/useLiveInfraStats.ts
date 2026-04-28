import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface LiveInfraStats {
  monitorsCount: number;
  uptimePercent: number;
  avgResponseMs: number;
  allOperational: boolean;
  loading: boolean;
}

/**
 * Aggregated, REAL infrastructure stats from our own monitoring.
 * Pulls last 30 days of status_checks + active monitors.
 * No fake numbers — only what we actually measure.
 */
export function useLiveInfraStats() {
  const [stats, setStats] = useState<LiveInfraStats>({
    monitorsCount: 0,
    uptimePercent: 0,
    avgResponseMs: 0,
    allOperational: true,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { data: monitors, error: mErr } = await supabase
          .from("status_monitors_public")
          .select("id")
          .eq("is_active", true);

        if (mErr) console.error("[useLiveInfraStats] monitors error:", mErr);

        const monitorIds = (monitors || []).map((m) => m.id!).filter(Boolean);

        if (monitorIds.length === 0) {
          if (!cancelled) setStats((s) => ({ ...s, loading: false }));
          return;
        }

        const since = new Date(Date.now() - 30 * 86400_000).toISOString();

        const { data: checks, error: cErr } = await supabase
          .from("status_checks")
          .select("status, response_time_ms")
          .in("monitor_id", monitorIds)
          .gte("checked_at", since)
          .limit(5000);

        if (cErr) console.error("[useLiveInfraStats] checks error:", cErr);

        const list = checks || [];
        const total = list.length;
        const up = list.filter((c) => c.status === "up").length;
        const respList = list
          .map((c) => c.response_time_ms)
          .filter((v): v is number => typeof v === "number" && v > 0);
        const avg = respList.length
          ? Math.round(respList.reduce((a, b) => a + b, 0) / respList.length)
          : 0;

        if (cancelled) return;
        setStats({
          monitorsCount: monitorIds.length,
          uptimePercent: total > 0 ? parseFloat(((up / total) * 100).toFixed(2)) : 100,
          avgResponseMs: avg,
          allOperational: total === 0 || up / total > 0.99,
          loading: false,
        });
      } catch (e) {
        console.error("[useLiveInfraStats] fatal:", e);
        if (!cancelled) setStats((s) => ({ ...s, loading: false }));
      }
    }

    load();
    const t = setInterval(load, 5 * 60_000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  return stats;
}
