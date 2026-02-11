-- 1. Fix status_checks: restrict INSERT to service role only (not public)
DROP POLICY IF EXISTS "Service can insert checks" ON public.status_checks;

CREATE POLICY "Service role can insert checks"
  ON public.status_checks
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- 2. Recreate status_monitors_public view with security_invoker OFF 
-- so it can bypass the admin-only RLS on status_monitors base table
DROP VIEW IF EXISTS public.status_monitors_public;

CREATE VIEW public.status_monitors_public 
WITH (security_invoker = false)
AS
SELECT 
  id,
  name,
  category,
  is_active,
  created_at,
  updated_at,
  sort_order
FROM public.status_monitors
WHERE is_active = true;

-- Grant SELECT on the view to anon and authenticated
GRANT SELECT ON public.status_monitors_public TO anon, authenticated;
