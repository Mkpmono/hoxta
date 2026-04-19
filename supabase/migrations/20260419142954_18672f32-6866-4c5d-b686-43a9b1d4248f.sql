-- Rate limiting infrastructure
CREATE TABLE public.request_counts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  window_start timestamptz NOT NULL,
  request_count integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX request_counts_ip_window_idx ON public.request_counts(ip_address, window_start);
CREATE INDEX request_counts_window_idx ON public.request_counts(window_start);

ALTER TABLE public.request_counts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read request counts"
  ON public.request_counts FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can manage request counts"
  ON public.request_counts FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Records a hit and returns the count in the current 1-minute window
CREATE OR REPLACE FUNCTION public.record_request_and_check(_ip text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _window timestamptz := date_trunc('minute', now());
  _count integer;
BEGIN
  INSERT INTO public.request_counts (ip_address, window_start, request_count)
  VALUES (_ip, _window, 1)
  ON CONFLICT (ip_address, window_start)
  DO UPDATE SET request_count = public.request_counts.request_count + 1
  RETURNING request_count INTO _count;

  RETURN _count;
END;
$$;

-- Cleans up rows older than 10 minutes (called opportunistically)
CREATE OR REPLACE FUNCTION public.cleanup_old_request_counts()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.request_counts WHERE window_start < (now() - interval '10 minutes');
$$;