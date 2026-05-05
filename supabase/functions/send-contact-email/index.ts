import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { dbRateLimit, getClientIp } from "../_shared/auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Body {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = (await req.json()) as Body;
    const name = (body.name || "").trim().slice(0, 200);
    const email = (body.email || "").trim().slice(0, 255);
    const subject = (body.subject || "General").trim().slice(0, 200);
    const message = (body.message || "").trim().slice(0, 5000);

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Name, email and message are required." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email address." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    // Get destination email + email_enabled from support_settings
    const { data: support } = await supabase
      .from("support_settings")
      .select("email_address, email_enabled")
      .limit(1)
      .maybeSingle();

    const destination = support?.email_address || "support@hoxta.com";
    const emailEnabled = !!support?.email_enabled;

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;

    let emailSent = false;
    let emailError: string | null = null;

    const RESEND_KEY = Deno.env.get("RESEND_API_KEY");
    if (emailEnabled && RESEND_KEY) {
      try {
        const html = `
          <h2>New contact message from ${escapeHtml(name)}</h2>
          <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <hr/>
          <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
          <hr/>
          <p style="color:#888;font-size:12px">Submitted via hoxta.com contact form${ip ? ` · IP: ${escapeHtml(ip)}` : ""}</p>`;

        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Hoxta Contact <onboarding@resend.dev>",
            to: [destination],
            reply_to: email,
            subject: `[Contact] ${subject} — ${name}`,
            html,
          }),
        });
        if (resendRes.ok) {
          emailSent = true;
        } else {
          emailError = `Resend ${resendRes.status}: ${await resendRes.text()}`;
          console.error(emailError);
        }
      } catch (e) {
        emailError = (e as Error).message;
        console.error("Resend error:", emailError);
      }
    } else if (!RESEND_KEY) {
      emailError = "RESEND_API_KEY not configured — message stored in DB only";
    } else {
      emailError = "Email sending disabled in support settings";
    }

    // Always save to DB as backup
    const { error: insertError } = await supabase.from("contact_messages").insert({
      name, email, subject, message,
      email_sent: emailSent,
      email_error: emailError,
      ip_address: ip,
    });
    if (insertError) {
      console.error("DB insert failed:", insertError);
    }

    return new Response(JSON.stringify({ ok: true, emailSent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-contact-email error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
