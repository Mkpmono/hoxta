-- 1. Remove public SELECT on blocked_ips (exposes real IPs and admin UUIDs)
DROP POLICY IF EXISTS "Anyone can read blocked IPs" ON public.blocked_ips;

-- 2. Restrict visitor_logs INSERT to service_role only
DROP POLICY IF EXISTS "Service can insert visitor logs" ON public.visitor_logs;
CREATE POLICY "Service role can insert visitor logs"
  ON public.visitor_logs
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- 3. Fix status_checks INSERT to service_role only
DROP POLICY IF EXISTS "Service role can insert checks" ON public.status_checks;
CREATE POLICY "Service role can insert checks"
  ON public.status_checks
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- 4. Drop the security definer view and recreate as invoker view
DROP VIEW IF EXISTS public.status_monitors_public;
CREATE VIEW public.status_monitors_public
  WITH (security_invoker = true)
  AS SELECT id, name, category, is_active, created_at, updated_at, sort_order
     FROM public.status_monitors
     WHERE is_active = true;

-- 5. Grant read on the view
GRANT SELECT ON public.status_monitors_public TO anon, authenticated;

-- 6. Add permissive SELECT policy on status_monitors for public access to active ones
CREATE POLICY "Anyone can read active monitors via view"
  ON public.status_monitors
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);