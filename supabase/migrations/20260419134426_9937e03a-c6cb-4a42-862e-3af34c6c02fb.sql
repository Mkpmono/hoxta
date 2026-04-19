CREATE OR REPLACE FUNCTION public.jsonb_deep_merge(a jsonb, b jsonb)
RETURNS jsonb LANGUAGE sql IMMUTABLE
SET search_path = public
AS $$
  SELECT CASE
    WHEN jsonb_typeof(a) = 'object' AND jsonb_typeof(b) = 'object' THEN
      (SELECT jsonb_object_agg(key,
        CASE
          WHEN a ? key AND b ? key THEN public.jsonb_deep_merge(a->key, b->key)
          WHEN b ? key THEN b->key
          ELSE a->key
        END)
       FROM (SELECT jsonb_object_keys(a) AS key UNION SELECT jsonb_object_keys(b) AS key) k)
    ELSE COALESCE(b, a)
  END;
$$;