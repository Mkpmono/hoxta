import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { requireAdmin } from "../_shared/auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPPORTED = ["en", "ro", "de", "fr", "es", "it"];
const NAMES: Record<string, string> = {
  en: "English", ro: "Romanian", de: "German", fr: "French", es: "Spanish", it: "Italian",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const { content, sourceLang = "en" } = await req.json();
    if (!content || typeof content !== "object") {
      return new Response(JSON.stringify({ error: "content (object) is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const targetLangs = SUPPORTED.filter((l) => l !== sourceLang);
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const translations: Record<string, any> = { [sourceLang]: content };

    // Translate one language at a time for reliability with deeply nested JSON.
    for (const lang of targetLangs) {
      const prompt = `You are a professional translator. Translate every human-readable string value inside the following JSON object from ${NAMES[sourceLang]} to ${NAMES[lang]}.

STRICT RULES:
- Preserve the EXACT JSON structure (same keys, same array order, same shape).
- Translate ONLY string values that are user-facing copy (titles, descriptions, labels, button text).
- DO NOT translate URLs, emails, hex colors, icon names (e.g. "Mail", "Globe", "Shield", "Ticket"), CSS class names, slugs, or technical identifiers.
- DO NOT translate brand names: "Hoxta", "Discord", "Twitter", "X", "Stripe", "PayPal", "WHMCS", "Bitcoin", etc.
- Keep numbers, percentages, dates and time formats unchanged (e.g. "10,000+", "99.9%", "24/7", "Mon-Fri 9AM-6PM EST", "2022").
- Return ONLY the translated JSON object. No markdown fences, no commentary.

INPUT:
${JSON.stringify(content)}

OUTPUT (translated JSON only):`;

      const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: "You are a professional multilingual translator. You output only valid JSON." },
            { role: "user", content: prompt },
          ],
          temperature: 0.2,
        }),
      });

      if (!aiRes.ok) {
        const errText = await aiRes.text();
        console.error(`AI error for ${lang}:`, errText);
        if (aiRes.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit reached. Please wait a moment." }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (aiRes.status === 402) {
          return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits in Settings." }), {
            status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        continue;
      }

      const data = await aiRes.json();
      let text = data.choices?.[0]?.message?.content || "";
      text = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
      try {
        translations[lang] = JSON.parse(text);
      } catch (e) {
        console.error(`Parse error for ${lang}:`, e, "raw:", text.slice(0, 500));
      }
    }

    return new Response(JSON.stringify({ translations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("translate-page error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
