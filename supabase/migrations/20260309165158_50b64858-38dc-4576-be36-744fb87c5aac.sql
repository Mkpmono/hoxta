CREATE TABLE public.site_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lang text NOT NULL UNIQUE,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.site_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read translations" ON public.site_translations
  FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage translations" ON public.site_translations
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));