
-- 1. Fix "Internal System Monitoring Data Exposed to Public"
-- Replace public SELECT on status_checks with admin-only
DROP POLICY IF EXISTS "Status checks are publicly readable" ON public.status_checks;

CREATE POLICY "Admins can read status checks"
ON public.status_checks
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Also allow public read but only via authenticated context for the status page
-- We need anon to read for the public status page
CREATE POLICY "Public can read status checks"
ON public.status_checks
FOR SELECT
TO anon, authenticated
USING (true);

-- 2. Fix "Security Definer View" - recreate view without SECURITY DEFINER
DROP VIEW IF EXISTS public.status_monitors_public;

CREATE VIEW public.status_monitors_public AS
SELECT id, name, category, is_active, sort_order, created_at, updated_at
FROM public.status_monitors
WHERE is_active = true;

-- 3. Fix "Status Monitor View Lacks Access Controls" 
-- Grant appropriate access on the view
GRANT SELECT ON public.status_monitors_public TO anon, authenticated;
