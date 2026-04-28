-- Revoke public EXECUTE on internal SECURITY DEFINER functions.
-- These should not be callable by anon/authenticated clients via PostgREST.

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.jsonb_deep_merge(jsonb, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.record_request_and_check(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.cleanup_old_request_counts() FROM PUBLIC, anon, authenticated;

-- jsonb_deep_merge doesn't need elevated privileges - make it SECURITY INVOKER
ALTER FUNCTION public.jsonb_deep_merge(jsonb, jsonb) SECURITY INVOKER;

-- Ensure service_role retains access where needed
GRANT EXECUTE ON FUNCTION public.record_request_and_check(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.cleanup_old_request_counts() TO service_role;