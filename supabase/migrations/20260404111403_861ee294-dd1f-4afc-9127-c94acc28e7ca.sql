
-- Fix 1: Drop and recreate status_monitors_public view with security_invoker
DROP VIEW IF EXISTS public.status_monitors_public;

CREATE VIEW public.status_monitors_public
WITH (security_invoker=on) AS
  SELECT id, name, category, is_active, sort_order, created_at, updated_at
  FROM public.status_monitors
  WHERE is_active = true;

-- Fix 2: Add a SELECT policy on status_monitors for anon so the view works for public users
CREATE POLICY "Anon can read active monitors via view"
  ON public.status_monitors
  FOR SELECT
  TO anon
  USING (is_active = true);
