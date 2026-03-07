
CREATE TABLE public.visitor_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL DEFAULT 'Unknown',
  country_code text,
  isp text,
  user_agent text,
  is_bot boolean NOT NULL DEFAULT false,
  bot_reasons text[] DEFAULT '{}',
  canvas_fingerprint text,
  ray_id text,
  result text NOT NULL DEFAULT 'passed',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.visitor_logs ENABLE ROW LEVEL SECURITY;

-- Admins can read all logs
CREATE POLICY "Admins can read visitor logs"
ON public.visitor_logs
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Service role / edge functions can insert
CREATE POLICY "Service can insert visitor logs"
ON public.visitor_logs
FOR INSERT
WITH CHECK (true);

-- Admins can delete logs
CREATE POLICY "Admins can delete visitor logs"
ON public.visitor_logs
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
