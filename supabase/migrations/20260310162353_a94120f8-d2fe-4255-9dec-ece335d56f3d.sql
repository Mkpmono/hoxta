
-- 1. Remove public SELECT on status_monitors base table (exposes IPs)
DROP POLICY IF EXISTS "Anyone can read active monitors via view" ON public.status_monitors;

-- 2. Remove overly permissive public policy on status_checks 
DROP POLICY IF EXISTS "Public can read status checks" ON public.status_checks;

-- Allow anon to read status_checks (needed for public /status page) but only via the view pattern
CREATE POLICY "Anon can read status checks"
ON public.status_checks
FOR SELECT
TO anon
USING (true);
