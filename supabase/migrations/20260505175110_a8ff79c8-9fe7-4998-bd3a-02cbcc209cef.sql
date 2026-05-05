REVOKE EXECUTE ON FUNCTION public.record_request_and_check(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.cleanup_old_request_counts() FROM PUBLIC, anon, authenticated;