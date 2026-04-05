
-- Fix 1: Recreate public view WITHOUT the url column (hides internal IPs)
DROP VIEW IF EXISTS public.status_monitors_public;

CREATE VIEW public.status_monitors_public
WITH (security_invoker=on) AS
  SELECT id, name, category, is_active, sort_order, created_at, updated_at
  FROM public.status_monitors
  WHERE is_active = true;

-- Fix 2: Only admins can insert into user_roles
CREATE POLICY "Only admins can insert roles"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Fix 3: Only admins can update/delete roles
CREATE POLICY "Only admins can update roles"
  ON public.user_roles
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles"
  ON public.user_roles
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
