
-- Drop restrictive policies
DROP POLICY IF EXISTS "Admins can manage monitors" ON public.status_monitors;
DROP POLICY IF EXISTS "Only admins can read monitors directly" ON public.status_monitors;

-- Recreate as PERMISSIVE
CREATE POLICY "Admins can manage monitors"
ON public.status_monitors
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
