import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // GET /log-visitor?action=check-blocked&ip=xxx
    if (req.method === "GET") {
      const action = url.searchParams.get("action");
      
      if (action === "check-blocked") {
        const ip = url.searchParams.get("ip");
        if (!ip) {
          return new Response(JSON.stringify({ blocked: false }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const { data } = await supabase
          .from("blocked_ips")
          .select("id")
          .eq("ip_address", ip)
          .maybeSingle();
        return new Response(JSON.stringify({ blocked: !!data }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (action === "stats") {
        const { count: totalVisitors } = await supabase
          .from("visitor_logs")
          .select("*", { count: "exact", head: true });
        const { count: totalBots } = await supabase
          .from("visitor_logs")
          .select("*", { count: "exact", head: true })
          .eq("is_bot", true);
        const { count: blockedIPs } = await supabase
          .from("blocked_ips")
          .select("*", { count: "exact", head: true });

        return new Response(JSON.stringify({
          total_visitors: totalVisitors || 0,
          total_bots: totalBots || 0,
          blocked_ips: blockedIPs || 0,
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "Unknown action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST — log visitor
    const body = await req.json();
    const { ip_address, country_code, isp, user_agent, is_bot, bot_reasons, canvas_fingerprint, ray_id, result } = body;

    const { error } = await supabase.from("visitor_logs").insert({
      ip_address: ip_address || "Unknown",
      country_code: country_code || null,
      isp: isp || null,
      user_agent: user_agent || null,
      is_bot: is_bot || false,
      bot_reasons: bot_reasons || [],
      canvas_fingerprint: canvas_fingerprint || null,
      ray_id: ray_id || null,
      result: result || "passed",
    });

    if (error) throw error;

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
