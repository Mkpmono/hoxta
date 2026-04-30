// WHMCS DomainWhois — checks availability + price for a list of domains
// via the official WHMCS API (action=DomainWhois + action=GetTLDPricing).

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface DomainResult {
  domain: string;
  available: boolean;
  price?: string;
  currency?: string;
  registerUrl?: string;
}

async function whmcsCall(action: string, extraParams: Record<string, string>) {
  const rawUrl = Deno.env.get("WHMCS_API_URL");
  const identifier = Deno.env.get("WHMCS_API_IDENTIFIER");
  const secret = Deno.env.get("WHMCS_API_SECRET");

  if (!rawUrl || !identifier || !secret) {
    throw new Error("WHMCS credentials are not configured");
  }

  // Auto-append /includes/api.php if user provided only the base URL
  const url = /\/includes\/api\.php$/.test(rawUrl)
    ? rawUrl
    : rawUrl.replace(/\/$/, "") + "/includes/api.php";

  const body = new URLSearchParams({
    identifier,
    secret,
    action,
    responsetype: "json",
    ...extraParams,
  });

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`WHMCS HTTP ${res.status}: ${text.substring(0, 200)}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `WHMCS returned non-JSON (likely wrong URL, got HTML). URL used: ${url}. First 200 chars: ${text.substring(0, 200)}`
    );
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { domains } = await req.json();

    if (!Array.isArray(domains) || domains.length === 0 || domains.length > 20) {
      return new Response(
        JSON.stringify({ error: "Provide 1-20 domains" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Fetch TLD pricing once (cached per-call) — gives register price per TLD
    let pricing: Record<string, { price: string; currency: string }> = {};
    try {
      const pricingRes = await whmcsCall("GetTLDPricing", { currencyid: "1" });
      const list = pricingRes?.pricing ?? {};
      const currency = pricingRes?.currency?.code ?? "EUR";
      for (const tld in list) {
        const reg = list[tld]?.register?.["1"]; // 1-year registration
        if (reg) pricing[`.${tld}`] = { price: reg, currency };
      }
    } catch (e) {
      console.warn("GetTLDPricing failed, continuing without prices", e);
    }

    // 2. Check availability for each domain in parallel
    const cartBase =
      (Deno.env.get("WHMCS_CART_URL") ?? "https://billing.hoxta.com").replace(/\/$/, "") +
      "/cart.php";

    const results: DomainResult[] = await Promise.all(
      domains.map(async (raw: string): Promise<DomainResult> => {
        const domain = String(raw).trim().toLowerCase();
        const ext = "." + domain.split(".").slice(1).join(".");
        const tldPrice = pricing[ext];

        try {
          const whois = await whmcsCall("DomainWhois", { domain });
          console.log(`[DomainWhois] ${domain} →`, JSON.stringify(whois));
          // WHMCS DomainWhois returns status: "available" | "unavailable" | sometimes numeric / other
          const statusStr = String(whois?.status ?? "").toLowerCase();
          const available = statusStr === "available" || statusStr === "y";
          const result: DomainResult = { domain, available };
          if (available && tldPrice) {
            result.price = tldPrice.price;
            result.currency = tldPrice.currency;
            result.registerUrl = `${cartBase}?a=add&domain=register&query=${encodeURIComponent(domain)}&period=1`;
          }
          return result;
        } catch (e) {
          console.error(`Whois failed for ${domain}`, e);
          return { domain, available: false };
        }
      })
    );

    return new Response(
      JSON.stringify({ results }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("whmcs-domain-check error", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
