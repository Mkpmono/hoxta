
-- Fix Security Definer View - use security_invoker
DROP VIEW IF EXISTS public.status_monitors_public;

CREATE VIEW public.status_monitors_public
WITH (security_invoker = true)
AS
SELECT id, name, category, is_active, sort_order, created_at, updated_at
FROM public.status_monitors
WHERE is_active = true;

GRANT SELECT ON public.status_monitors_public TO anon, authenticated;
