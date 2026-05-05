/**
 * Supabase auth helpers for edge functions
 * Validates the caller's Supabase JWT and (optionally) admin role.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

export interface SupabaseUserContext {
  userId: string;
  email: string | null;
  isAdmin: boolean;
}

export async function getSupabaseUser(req: Request): Promise<SupabaseUserContext | null> {
  const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
  if (!authHeader) return null;
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const ANON = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;
  const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const userClient = createClient(SUPABASE_URL, ANON, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: userData, error } = await userClient.auth.getUser(token);
  if (error || !userData?.user) return null;

  // Check admin role using service role to bypass any RLS gymnastics
  const admin = createClient(SUPABASE_URL, SERVICE);
  const { data: roleRow } = await admin
    .from("user_roles")
    .select("role")
    .eq("user_id", userData.user.id)
    .eq("role", "admin")
    .maybeSingle();

  return {
    userId: userData.user.id,
    email: userData.user.email ?? null,
    isAdmin: !!roleRow,
  };
}

export async function requireAdmin(req: Request): Promise<{ ok: true; ctx: SupabaseUserContext } | { ok: false; response: Response }> {
  const ctx = await getSupabaseUser(req);
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };
  if (!ctx) {
    return { ok: false, response: new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders }) };
  }
  if (!ctx.isAdmin) {
    return { ok: false, response: new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders }) };
  }
  return { ok: true, ctx };
}

/**
 * Database-backed per-IP rate limit using existing record_request_and_check RPC.
 * Returns { allowed, count } based on requests per current minute window.
 */
export async function dbRateLimit(ip: string, limit: number, prefix = ""): Promise<{ allowed: boolean; count: number }> {
  if (!ip) return { allowed: true, count: 0 };
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(SUPABASE_URL, SERVICE);
  const key = prefix ? `${prefix}:${ip}` : ip;
  const { data, error } = await admin.rpc("record_request_and_check", { _ip: key });
  if (error) return { allowed: true, count: 0 };
  const count = (data as number) || 0;
  return { allowed: count <= limit, count };
}

export function getClientIp(req: Request): string {
  return (
    req.headers.get("CF-Connecting-IP") ||
    req.headers.get("X-Real-IP") ||
    req.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    ""
  );
}
