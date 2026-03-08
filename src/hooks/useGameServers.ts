import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getTranslatedField } from "@/lib/translations";

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
  translations?: Record<string, Record<string, string>>;
}

export function useGameServers() {
  const [games, setGames] = useState<DBGameServer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("game_servers")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });
      
      if (error) {
        console.error("Error fetching games:", error);
      } else {
        // Apply translations to each game
        const translatedGames = (data || []).map(game => ({
          ...game,
          title: getTranslatedField(game, "title") || game.title,
          short_description: getTranslatedField(game, "short_description") || game.short_description,
          full_description: getTranslatedField(game, "full_description") || game.full_description,
        }));
        setGames(translatedGames);
      }
    } catch (err) {
      console.error("Error fetching games:", err);
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
    if (!slug) { 
      setLoading(false); 
      return; 
    }
    
    const fetchGame = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("game_servers")
          .select("*")
          .eq("slug", slug)
          .single();
        
        if (error) {
          console.error("Error fetching game:", error);
          setGame(null);
        } else if (data) {
          // Apply translations
          const translatedGame = {
            ...data,
            title: getTranslatedField(data, "title") || data.title,
            short_description: getTranslatedField(data, "short_description") || data.short_description,
            full_description: getTranslatedField(data, "full_description") || data.full_description,
          };
          setGame(translatedGame);
        }
      } catch (err) {
        console.error("Error fetching game:", err);
        setGame(null);
      }
      setLoading(false);
    };
    
    fetchGame();
  }, [slug]);

  return { game, loading };
}
