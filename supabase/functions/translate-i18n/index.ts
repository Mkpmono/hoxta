import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  ro: "Romanian",
  de: "German",
  fr: "French",
  es: "Spanish",
  it: "Italian",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { chunk, targetLang, sourceLang } = await req.json();
    const srcLang = sourceLang || "ro";
    const srcName = LANGUAGE_NAMES[srcLang] || srcLang;

    if (!chunk || !targetLang || typeof chunk !== "object") {
      return new Response(JSON.stringify({ error: "chunk and targetLang required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const langName = LANGUAGE_NAMES[targetLang] || targetLang;

    const prompt = `You are a professional translator. Translate the following key-value pairs from ${srcName} to ${langName}.

The keys are identifiers - DO NOT translate them. Only translate the values.
Keep brand names like "Hoxta" unchanged.
Keep technical terms, URLs, and placeholders like {{variable}} unchanged.
Keep commas in values that are comma-separated lists (they are used as delimiters).

Input (JSON):
${JSON.stringify(chunk, null, 2)}

Return ONLY a valid JSON object with the same keys and translated values. No markdown, no extra text.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a professional translator. Return only valid JSON." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`AI error for ${targetLang}:`, response.status, errText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please wait and retry." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: `Translation API failed: ${response.status}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    let text = data.choices?.[0]?.message?.content || "";
    text = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    
    const translated = JSON.parse(text);

    return new Response(JSON.stringify({ translated }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("translate-i18n error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
