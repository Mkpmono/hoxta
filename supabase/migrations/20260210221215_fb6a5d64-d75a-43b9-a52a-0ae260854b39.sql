
-- Create a public view that hides sensitive fields (url, check_type, check_interval)
CREATE VIEW public.status_monitors_public
WITH (security_invoker = on) AS
  SELECT id, name, category, is_active, sort_order, created_at, updated_at
  FROM public.status_monitors;

-- Drop the old permissive SELECT policy
DROP POLICY "Status monitors are publicly readable" ON public.status_monitors;

-- New SELECT: admins see everything, public uses the view
CREATE POLICY "Only admins can read monitors directly"
  ON public.status_monitors FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::app_role));
