-- Restrict anon SELECT on status_checks to last 30 days only (reduces bulk exposure)
DROP POLICY IF EXISTS "Anon can read status checks" ON public.status_checks;
CREATE POLICY "Anon can read recent status checks"
ON public.status_checks
FOR SELECT
TO anon, authenticated
USING (checked_at > (now() - interval '30 days'));