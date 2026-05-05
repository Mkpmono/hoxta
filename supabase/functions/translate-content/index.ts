import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { requireAdmin } from "../_shared/auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPPORTED_LANGUAGES = ["en", "ro", "de", "fr", "es", "it"];
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

  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const { fields, sourceLang = "en" } = await req.json();
    
    // fields: { title: "...", excerpt: "...", content: "..." }
    if (!fields || typeof fields !== "object") {
      return new Response(JSON.stringify({ error: "fields is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const targetLangs = SUPPORTED_LANGUAGES.filter(l => l !== sourceLang);
    const fieldNames = Object.keys(fields);
    
    const prompt = `You are a professional translator. Translate the following content from ${LANGUAGE_NAMES[sourceLang] || "English"} to these languages: ${targetLangs.map(l => LANGUAGE_NAMES[l]).join(", ")}.

The content has these fields:
${fieldNames.map(f => `- ${f}: """${fields[f]}"""`).join("\n")}

IMPORTANT RULES:
- Keep all Markdown formatting, HTML tags, URLs, code blocks, and technical terms exactly as they are
- Keep brand names like "Hoxta" unchanged
- Maintain the same tone and style
- For the "content" field, preserve all Markdown structure (headings, lists, code blocks, links, images)

Return ONLY a valid JSON object with this exact structure (no markdown code blocks, no extra text):
{
${targetLangs.map(lang => `  "${lang}": { ${fieldNames.map(f => `"${f}": "translated ${f}"`).join(", ")} }`).join(",\n")}
}`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a professional multilingual translator. Return only valid JSON." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI API error:", errText);
      return new Response(JSON.stringify({ error: "Translation API failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    let translationText = aiData.choices?.[0]?.message?.content || "";
    
    // Clean up markdown code blocks if present
    translationText = translationText.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    
    // Parse translations
    const translations = JSON.parse(translationText);
    
    // Add source language
    const result: Record<string, Record<string, string>> = {
      [sourceLang]: { ...fields },
      ...translations,
    };

    return new Response(JSON.stringify({ translations: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Translation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
