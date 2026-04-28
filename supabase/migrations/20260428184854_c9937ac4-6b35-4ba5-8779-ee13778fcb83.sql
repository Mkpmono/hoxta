-- 1. Site settings singleton
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  singleton boolean NOT NULL DEFAULT true UNIQUE,
  control_panel_url text NOT NULL DEFAULT 'https://billing.hoxta.com',
  control_panel_label text NOT NULL DEFAULT 'Control Panel',
  control_panel_label_translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  terms_url text NOT NULL DEFAULT '/terms',
  terms_label text NOT NULL DEFAULT 'Terms of Service',
  terms_label_translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  privacy_url text NOT NULL DEFAULT '/privacy',
  privacy_label text NOT NULL DEFAULT 'Privacy Policy',
  privacy_label_translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert site settings"
  ON public.site_settings FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update site settings"
  ON public.site_settings FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_settings (singleton) VALUES (true)
  ON CONFLICT DO NOTHING;

-- 2. Legal pages
CREATE TABLE IF NOT EXISTS public.legal_pages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.legal_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read legal pages"
  ON public.legal_pages FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert legal pages"
  ON public.legal_pages FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update legal pages"
  ON public.legal_pages FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete legal pages"
  ON public.legal_pages FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_legal_pages_updated_at
  BEFORE UPDATE ON public.legal_pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.legal_pages (slug, title, content) VALUES
  ('terms', 'Terms of Service', '# Terms of Service\n\nEdit this content from the admin panel.'),
  ('privacy', 'Privacy Policy', '# Privacy Policy\n\nEdit this content from the admin panel.')
ON CONFLICT (slug) DO NOTHING;