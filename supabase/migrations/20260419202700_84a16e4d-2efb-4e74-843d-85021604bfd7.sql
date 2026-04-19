CREATE TABLE public.site_languages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  flag_code text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_languages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read enabled languages"
  ON public.site_languages FOR SELECT
  USING (is_enabled = true OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert languages"
  ON public.site_languages FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update languages"
  ON public.site_languages FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete languages"
  ON public.site_languages FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_site_languages_updated_at
  BEFORE UPDATE ON public.site_languages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_languages (code, name, flag_code, sort_order) VALUES
  ('en', 'English', 'gb', 1),
  ('ro', 'Română', 'ro', 2),
  ('de', 'Deutsch', 'de', 3),
  ('fr', 'Français', 'fr', 4),
  ('es', 'Español', 'es', 5),
  ('it', 'Italiano', 'it', 6),
  ('nl', 'Nederlands', 'nl', 7)
ON CONFLICT (code) DO NOTHING;