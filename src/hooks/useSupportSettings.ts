import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SupportSettings {
  id: string;
  discord_url: string;
  discord_enabled: boolean;
  email_address: string;
  email_enabled: boolean;
  live_chat_enabled: boolean;
  live_chat_label: string;
  live_chat_embed_script: string;
}

const FALLBACK: SupportSettings = {
  id: "",
  discord_url: "https://discord.gg/ju7ADq4ZqY",
  discord_enabled: true,
  email_address: "support@hoxta.com",
  email_enabled: true,
  live_chat_enabled: false,
  live_chat_label: "Live Chat",
  live_chat_embed_script: "",
};

export function useSupportSettings() {
  return useQuery({
    queryKey: ["support_settings"],
    queryFn: async (): Promise<SupportSettings> => {
      const { data, error } = await supabase
        .from("support_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error || !data) return FALLBACK;
      return {
        id: data.id,
        discord_url: data.discord_url ?? FALLBACK.discord_url,
        discord_enabled: !!data.discord_enabled,
        email_address: data.email_address ?? FALLBACK.email_address,
        email_enabled: !!data.email_enabled,
        live_chat_enabled: !!data.live_chat_enabled,
        live_chat_label: data.live_chat_label ?? "Live Chat",
        live_chat_embed_script: data.live_chat_embed_script ?? "",
      };
    },
    staleTime: 60_000,
  });
}
