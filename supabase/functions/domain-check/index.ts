import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// RDAP bootstrap: map TLD to RDAP server
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
};

async function getRdapServer(tld: string): Promise<string | null> {
  // Check known servers first
  if (RDAP_SERVERS[tld]) return RDAP_SERVERS[tld];

  // Try IANA bootstrap
  try {
    const res = await fetch("https://data.iana.org/rdap/dns.json");
    const data = await res.json();
    for (const entry of data.services) {
      const tlds = entry[0] as string[];
      const urls = entry[1] as string[];
      if (tlds.includes(tld) && urls.length > 0) {
        return urls[0].replace(/\/$/, "");
      }
    }
  } catch {
    // fallback
  }
  return null;
}

async function checkDomain(
  domain: string
): Promise<{ domain: string; status: "available" | "registered" | "unknown" }> {
  const parts = domain.split(".");
  if (parts.length < 2) return { domain, status: "unknown" };

  const tld = parts.slice(1).join(".");
  const rdapBase = await getRdapServer(tld);

  if (!rdapBase) {
    // Fallback: DNS check
    try {
      const dnsRes = await fetch(
        `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`
      );
      const dnsData = await dnsRes.json();
      // Status 3 = NXDOMAIN (domain doesn't exist)
      if (dnsData.Status === 3) {
        return { domain, status: "available" };
      }
      return { domain, status: "registered" };
    } catch {
      return { domain, status: "unknown" };
    }
  }

  try {
    const res = await fetch(`${rdapBase}/domain/${domain}`, {
      headers: { Accept: "application/rdap+json" },
    });

    if (res.status === 404) {
      return { domain, status: "available" };
    }
    if (res.ok) {
      return { domain, status: "registered" };
    }
    return { domain, status: "unknown" };
  } catch {
    // Fallback to DNS
    try {
      const dnsRes = await fetch(
        `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`
      );
      const dnsData = await dnsRes.json();
      if (dnsData.Status === 3) {
        return { domain, status: "available" };
      }
      return { domain, status: "registered" };
    } catch {
      return { domain, status: "unknown" };
    }
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { domains } = await req.json();

    if (!Array.isArray(domains) || domains.length === 0) {
      return new Response(
        JSON.stringify({ error: "Provide a 'domains' array" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Limit to 10
    const toCheck = domains.slice(0, 10).map((d: string) => d.trim().toLowerCase());

    const results = await Promise.all(toCheck.map(checkDomain));

    return new Response(
      JSON.stringify({ ok: true, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("domain-check error:", err);
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
