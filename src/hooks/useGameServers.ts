import { useState, useEffect } from "react";

export interface DBGameServer {
  id: string;
  slug: string;
  title: string;
  cover_image_url: string | null;
  pricing_display: string;
  price_value: number;
  pricing_unit: string;
  short_description: string;
  full_description: string;
  tags: string[];
  category: string;
  os: string;
  popular: boolean;
  is_published: boolean;
  hero_points: string[];
  features: string[];
  plans: any[];
  faqs: any[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// TODO: Replace with PHP backend API call when available
// For now, fetch from a static JSON or return empty
const API_BASE = "https://api.hoxta.com";

export function useGameServers() {
  const [games, setGames] = useState<DBGameServer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/content/game-servers.php`);
      if (res.ok) {
        const data = await res.json();
        setGames(data.servers || data || []);
      }
    } catch {
      // API not available, games will be empty
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return { games, loading, refetch: fetchGames };
}

export function useGameServerBySlug(slug: string | undefined) {
  const [game, setGame] = useState<DBGameServer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    const fetchGame = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/content/game-servers.php?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          setGame(data.server || data || null);
        }
      } catch {
        // API not available
      }
      setLoading(false);
    };
    fetchGame();
  }, [slug]);

  return { game, loading };
}
