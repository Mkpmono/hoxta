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
    const body = await req.json();
    const { ip_address, country_code, isp, user_agent, is_bot, bot_reasons, canvas_fingerprint, ray_id, result } = body;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

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
