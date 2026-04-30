// Hybrid domain check:
//  • Availability via RDAP (no auth, no IP whitelist required)
//  • Optional pricing via WHMCS PHP proxy (server with IP whitelisted)
//  • Frontend has static price fallback if pricing unavailable
//
// This avoids WHMCS API IP restrictions on Supabase Edge runtimes.

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

// ---------- RDAP ----------
const RDAP_SERVERS: Record<string, string> = {
  com: "https://rdap.verisign.com/com/v1",
  net: "https://rdap.verisign.com/net/v1",
  org: "https://rdap.org/org/v1",
  io: "https://rdap.nic.io/v1",
  dev: "https://rdap.nic.google/v1",
  app: "https://rdap.nic.google/v1",
  xyz: "https://rdap.nic.xyz/v1",
  online: "https://rdap.nic.online/v1",
  store: "https://rdap.nic.store/v1",
  tech: "https://rdap.nic.tech/v1",
  info: "https://rdap.nic.info/v1",
  eu: "https://rdap.eu.org/v1",
};

let ianaCache: { fetched: number; map: Record<string, string> } | null = null;

async function getRdapServer(tld: string): Promise<string | null> {
  if (RDAP_SERVERS[tld]) return RDAP_SERVERS[tld];

  try {
    if (!ianaCache || Date.now() - ianaCache.fetched > 6 * 3600_000) {
      const res = await fetch("https://data.iana.org/rdap/dns.json");
      const data = await res.json();
      const map: Record<string, string> = {};
      for (const entry of data.services ?? []) {
        const tlds = entry[0] as string[];
        const urls = entry[1] as string[];
        if (urls?.length) {
          for (const t of tlds) map[t] = urls[0].replace(/\/$/, "");
        }
      }
      ianaCache = { fetched: Date.now(), map };
    }
    return ianaCache.map[tld] ?? null;
  } catch {
    return null;
  }
}

async function checkAvailability(domain: string): Promise<boolean | null> {
  const parts = domain.split(".");
  if (parts.length < 2) return null;
  const tld = parts.slice(1).join(".");

  const rdapBase = await getRdapServer(tld);
  if (rdapBase) {
    try {
      const res = await fetch(`${rdapBase}/domain/${domain}`, {
        headers: { Accept: "application/rdap+json" },
      });
      // consume body to free socket
      await res.arrayBuffer().catch(() => {});
      if (res.status === 404) return true;   // free
      if (res.ok) return false;              // taken
    } catch {
      /* fall through to DNS */
    }
  }

  // DNS fallback
  try {
    const dnsRes = await fetch(
      `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`
    );
    const dnsData = await dnsRes.json();
    if (dnsData.Status === 3) return true;
    if (Array.isArray(dnsData.Answer) && dnsData.Answer.length > 0) return false;
    // No record but exists → likely registered (parked)
    return false;
  } catch {
    return null;
  }
}

// ---------- Optional WHMCS pricing via PHP proxy ----------
async function fetchPricing(): Promise<Record<string, { price: string; currency: string }>> {
  const proxyBase = Deno.env.get("WHMCS_PROXY_URL"); // e.g. https://hoxta.com/api-backend
  if (!proxyBase) return {};

  try {
    const res = await fetch(`${proxyBase.replace(/\/$/, "")}/whmcs/tld_pricing.php`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return {};
    const data = await res.json();
    return data?.pricing ?? {};
  } catch {
    return {};
  }
}

// ---------- Server ----------
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

    const cartBase =
      (Deno.env.get("WHMCS_CART_URL") ?? "https://billing.hoxta.com").replace(/\/$/, "") +
      "/cart.php";

    // Fire pricing + availability in parallel
    const [pricing, availabilities] = await Promise.all([
      fetchPricing(),
      Promise.all(
        domains.map((raw: string) =>
          checkAvailability(String(raw).trim().toLowerCase())
        )
      ),
    ]);

    const results: DomainResult[] = domains.map((raw: string, i: number) => {
      const domain = String(raw).trim().toLowerCase();
      const available = availabilities[i] === true;
      const ext = "." + domain.split(".").slice(1).join(".");
      const tldPrice = pricing[ext];

      const result: DomainResult = { domain, available };
      if (available) {
        if (tldPrice) {
          result.price = tldPrice.price;
          result.currency = tldPrice.currency;
        }
        result.registerUrl = `${cartBase}?a=add&domain=register&query=${encodeURIComponent(domain)}&period=1`;
      }
      return result;
    });

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
