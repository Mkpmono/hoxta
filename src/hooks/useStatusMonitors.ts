import { useState, useEffect } from "react";

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

export type TimeRange = "1m" | "5m" | "15m" | "30m" | "1h" | "6h" | "24h" | "7d" | "30d";

const API_BASE = "https://api.hoxta.com";

export function useStatusMonitors(timeRange: TimeRange = "24h") {
  const [monitors, setMonitors] = useState<MonitorWithChecks[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/content/status.php?range=${timeRange}`);
      if (res.ok) {
        const data = await res.json();
        setMonitors(data.monitors || []);
      }
    } catch {
      // API not available
    }
    setLastUpdated(new Date());
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [timeRange]);

  return { monitors, loading, lastUpdated, refetch: fetchData };
}
