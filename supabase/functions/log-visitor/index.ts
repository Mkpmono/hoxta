import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Trusted reverse-DNS suffixes for legitimate search engine bots
const TRUSTED_BOT_DOMAINS: Record<string, string[]> = {
  googlebot: ["googlebot.com", "google.com"],
  "google-inspectiontool": ["google.com"],
  bingbot: ["search.msn.com"],
  duckduckbot: ["duckduckgo.com"],
  yandexbot: ["yandex.com", "yandex.net", "yandex.ru"],
  baiduspider: ["baidu.com", "baidu.jp"],
  applebot: ["applebot.apple.com", "apple.com"],
  facebookexternalhit: ["facebook.com", "fbsv.net"],
  twitterbot: ["twitter.com", "twttr.com"],
  linkedinbot: ["linkedin.com"],
};

// In-memory cache: ip -> { verified: bool, expiresAt: number }
const verifyCache = new Map<string, { verified: boolean; expiresAt: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function getCachedVerify(ip: string): boolean | null {
  const entry = verifyCache.get(ip);
  if (!entry || Date.now() > entry.expiresAt) {
    verifyCache.delete(ip);
    return null;
  }
  return entry.verified;
}

function setCachedVerify(ip: string, verified: boolean) {
  verifyCache.set(ip, { verified, expiresAt: Date.now() + CACHE_TTL_MS });
  // Garbage collect when too big
  if (verifyCache.size > 5000) {
    const now = Date.now();
    for (const [k, v] of verifyCache) if (v.expiresAt < now) verifyCache.delete(k);
  }
}

/**
 * Verify a bot via reverse + forward DNS lookup (RFC-recommended method).
 * Anti-spoofing: even if UA says "Googlebot", we confirm IP truly belongs to Google.
 */
async function verifyLegitimateBot(ip: string, userAgent: string): Promise<boolean> {
  const cached = getCachedVerify(ip);
  if (cached !== null) return cached;

  const ua = userAgent.toLowerCase();
  const matchedBot = Object.keys(TRUSTED_BOT_DOMAINS).find((bot) => ua.includes(bot));
  if (!matchedBot) {
    setCachedVerify(ip, false);
    return false;
  }
  const allowedDomains = TRUSTED_BOT_DOMAINS[matchedBot];

  try {
    // 1) Reverse DNS via Google DNS-over-HTTPS
    const reverseIp = ip.includes(":")
      ? ip.split(":").reverse().join(".") + ".ip6.arpa"
      : ip.split(".").reverse().join(".") + ".in-addr.arpa";

    const ptrRes = await fetch(`https://dns.google/resolve?name=${reverseIp}&type=PTR`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!ptrRes.ok) {
      setCachedVerify(ip, false);
      return false;
    }
    const ptrData = await ptrRes.json();
    const hostname = ptrData.Answer?.[0]?.data?.replace(/\.$/, "")?.toLowerCase();
    if (!hostname) {
      setCachedVerify(ip, false);
      return false;
    }

    // 2) Hostname must end with one of the allowed domains
    const hostMatches = allowedDomains.some((d) => hostname.endsWith("." + d) || hostname === d);
    if (!hostMatches) {
      setCachedVerify(ip, false);
      return false;
    }

    // 3) Forward DNS: hostname must resolve back to the same IP
    const fwdRes = await fetch(`https://dns.google/resolve?name=${hostname}&type=${ip.includes(":") ? "AAAA" : "A"}`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!fwdRes.ok) {
      setCachedVerify(ip, false);
      return false;
    }
    const fwdData = await fwdRes.json();
    const resolvedIps: string[] = (fwdData.Answer || []).map((a: any) => a.data);
    const verified = resolvedIps.includes(ip);
    setCachedVerify(ip, verified);
    return verified;
  } catch {
    setCachedVerify(ip, false);
    return false;
  }
}

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

    // GET endpoints
    if (req.method === "GET") {
      const action = url.searchParams.get("action");

      // Verify a claimed bot via reverse DNS (anti-spoofing)
      if (action === "verify-bot") {
        const ip = url.searchParams.get("ip") || "";
        const ua = url.searchParams.get("ua") || "";
        // Cloudflare's verified bot signal — instant trust
        const cfVerifiedBot = req.headers.get("cf-verified-bot") === "true";
        if (cfVerifiedBot) {
          setCachedVerify(ip, true);
          return new Response(JSON.stringify({ verified: true, source: "cloudflare" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const verified = ip && ua ? await verifyLegitimateBot(ip, ua) : false;
        return new Response(JSON.stringify({ verified, source: "rdns" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

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

      // Rate limit check + auto-block (called from client before sensitive actions)
      if (action === "rate-limit") {
        const cfIp = req.headers.get("CF-Connecting-IP") || req.headers.get("X-Real-IP") || req.headers.get("X-Forwarded-For")?.split(",")[0]?.trim();
        const ip = cfIp || url.searchParams.get("ip") || "";
        const ua = url.searchParams.get("ua") || req.headers.get("user-agent") || "";

        if (!ip) {
          return new Response(JSON.stringify({ allowed: true, count: 0 }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Skip rate limiting for verified legitimate bots (SEO indexing)
        const cfVerifiedBot = req.headers.get("cf-verified-bot") === "true";
        const isLegitBot = cfVerifiedBot || (ua ? await verifyLegitimateBot(ip, ua) : false);
        if (isLegitBot) {
          return new Response(JSON.stringify({ allowed: true, count: 0, bot: true }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Already blocked?
        const { data: blocked } = await supabase
          .from("blocked_ips")
          .select("id")
          .eq("ip_address", ip)
          .maybeSingle();
        if (blocked) {
          return new Response(JSON.stringify({ allowed: false, blocked: true, reason: "ip_blocked" }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Increment counter for current minute
        const { data: countData, error: rpcErr } = await supabase.rpc("record_request_and_check", { _ip: ip });
        const count = (countData as number) || 0;

        // Opportunistic cleanup ~1% of the time
        if (Math.random() < 0.01) {
          await supabase.rpc("cleanup_old_request_counts");
        }

        const LIMIT = 60; // 60 requests / minute / IP
        if (!rpcErr && count > LIMIT) {
          await supabase.from("blocked_ips").upsert(
            { ip_address: ip, reason: `Auto-blocked: rate limit exceeded (${count} req/min)` },
            { onConflict: "ip_address" }
          );
          return new Response(JSON.stringify({ allowed: false, blocked: true, count, reason: "rate_limit" }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ allowed: true, count, limit: LIMIT }), {
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

    // Prefer Cloudflare headers for real IP, then fallback to body
    const cfIp = req.headers.get("CF-Connecting-IP") || req.headers.get("X-Real-IP") || req.headers.get("X-Forwarded-For")?.split(",")[0]?.trim();
    const cleanIp = cfIp || ip_address || "Unknown";

    const { error } = await supabase.from("visitor_logs").insert({
      ip_address: cleanIp,
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

    // Auto-block ONLY if confirmed bot AND not a verified legitimate crawler
    if (is_bot && cleanIp !== "Unknown" && cleanIp !== "Unable to detect") {
      const isLegit = user_agent ? await verifyLegitimateBot(cleanIp, user_agent) : false;
      if (!isLegit) {
        const reasons = Array.isArray(bot_reasons) ? bot_reasons.join(", ") : "bot-detected";
        await supabase.from("blocked_ips").upsert(
          { ip_address: cleanIp, reason: `Auto-blocked: ${reasons}` },
          { onConflict: "ip_address" }
        );
      }
    }

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
