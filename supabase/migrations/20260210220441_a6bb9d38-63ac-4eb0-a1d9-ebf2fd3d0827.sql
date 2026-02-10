
-- Monitors: what services to check
CREATE TABLE public.status_monitors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT,
  category TEXT NOT NULL DEFAULT 'Services',
  check_type TEXT NOT NULL DEFAULT 'http',
  check_interval_seconds INT NOT NULL DEFAULT 60,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Status checks: individual ping results
CREATE TABLE public.status_checks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  monitor_id UUID NOT NULL REFERENCES public.status_monitors(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'up',
  response_time_ms INT,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_status_checks_monitor_time ON public.status_checks(monitor_id, checked_at DESC);
CREATE INDEX idx_status_checks_checked_at ON public.status_checks(checked_at DESC);

ALTER TABLE public.status_monitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Status monitors are publicly readable"
  ON public.status_monitors FOR SELECT USING (true);

CREATE POLICY "Status checks are publicly readable"
  ON public.status_checks FOR SELECT USING (true);

CREATE POLICY "Admins can manage monitors"
  ON public.status_monitors FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service can insert checks"
  ON public.status_checks FOR INSERT
  WITH CHECK (true);

INSERT INTO public.status_monitors (name, url, category, sort_order) VALUES
  ('Website', 'https://hoxta.lovable.app', 'Services', 1),
  ('Game Servers', NULL, 'Services', 2),
  ('VPS Hosting', NULL, 'Services', 3),
  ('Web Hosting', NULL, 'Services', 4),
  ('DDoS Protection', NULL, 'Infrastructure', 5),
  ('Control Panel', NULL, 'Infrastructure', 6);
