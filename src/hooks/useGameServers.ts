import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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

export function useGameServers() {
  const [games, setGames] = useState<DBGameServer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGames = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("game_servers")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!error && data) {
      setGames(data as unknown as DBGameServer[]);
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
    const fetch = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("game_servers")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (!error && data) {
        setGame(data as unknown as DBGameServer);
      }
      setLoading(false);
    };
    fetch();
  }, [slug]);

  return { game, loading };
}
