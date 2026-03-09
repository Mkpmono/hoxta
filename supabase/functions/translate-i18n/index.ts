import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  ro: "Romanian",
  de: "German",
  fr: "French",
  es: "Spanish",
  it: "Italian",
};

const TARGET_LANGS = ["en", "de", "fr", "es", "it"];

// Flatten nested JSON to dot-notation keys
function flatten(obj: Record<string, any>, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      Object.assign(result, flatten(value, newKey));
    } else {
      result[newKey] = String(value);
    }
  }
  return result;
}

// Unflatten dot-notation keys back to nested JSON
function unflatten(obj: Record<string, string>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const parts = key.split(".");
    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {};
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
  }
  return result;
}

// Split flat keys into chunks of maxSize
function chunkEntries(entries: [string, string][], maxSize: number): [string, string][][] {
  const chunks: [string, string][][] = [];
  for (let i = 0; i < entries.length; i += maxSize) {
    chunks.push(entries.slice(i, i + maxSize));
  }
  return chunks;
}

async function translateChunk(
  entries: [string, string][],
  targetLang: string,
  apiKey: string
): Promise<Record<string, string>> {
  const prompt = `You are a professional translator. Translate the following key-value pairs from Romanian to ${LANGUAGE_NAMES[targetLang]}.

The keys are identifiers - DO NOT translate them. Only translate the values.
Keep brand names like "Hoxta" unchanged.
Keep technical terms, URLs, and placeholders like {{variable}} unchanged.

Input (JSON):
${JSON.stringify(Object.fromEntries(entries), null, 2)}

Return ONLY a valid JSON object with the same keys and translated values. No markdown, no extra text.`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
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
    console.error(`AI error for ${targetLang}:`, errText);
    throw new Error(`Translation API failed for ${targetLang}`);
  }

  const data = await response.json();
  let text = data.choices?.[0]?.message?.content || "";
  text = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  return JSON.parse(text);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { roData, targetLangs } = await req.json();
    
    if (!roData || typeof roData !== "object") {
      return new Response(JSON.stringify({ error: "roData is required" }), {
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

    const langs = targetLangs || TARGET_LANGS;
    const flat = flatten(roData);
    const allEntries = Object.entries(flat);
    const CHUNK_SIZE = 80; // ~80 keys per chunk to stay within token limits
    const chunks = chunkEntries(allEntries, CHUNK_SIZE);

    console.log(`Translating ${allEntries.length} keys in ${chunks.length} chunks to ${langs.length} languages`);

    const results: Record<string, Record<string, any>> = {};

    // Translate each language sequentially, chunks in parallel per language
    for (const lang of langs) {
      console.log(`Translating to ${lang}...`);
      const chunkResults = await Promise.all(
        chunks.map((chunk) => translateChunk(chunk, lang, LOVABLE_API_KEY))
      );

      // Merge all chunks
      const mergedFlat: Record<string, string> = {};
      for (const chunkResult of chunkResults) {
        Object.assign(mergedFlat, chunkResult);
      }

      results[lang] = unflatten(mergedFlat);
      console.log(`✅ ${lang} done (${Object.keys(mergedFlat).length} keys)`);
    }

    // Also include ro
    results["ro"] = roData;

    return new Response(JSON.stringify({ translations: results }), {
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
