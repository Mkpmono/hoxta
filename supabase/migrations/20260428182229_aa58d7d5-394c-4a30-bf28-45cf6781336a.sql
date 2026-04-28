CREATE TABLE public.custom_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  menu_label TEXT,
  menu_description TEXT DEFAULT '',
  menu_icon TEXT DEFAULT 'Sparkles',
  menu_group TEXT NOT NULL DEFAULT 'more',
  category TEXT NOT NULL DEFAULT 'General',
  tags TEXT[] DEFAULT '{}',
  cover_image_url TEXT,
  short_description TEXT DEFAULT '',
  sections JSONB NOT NULL DEFAULT '{
    "hero": {"enabled": true, "title": "", "subtitle": "", "ctaLabel": "Get Started", "ctaUrl": "/order"},
    "features": {"enabled": true, "title": "Features", "items": []},
    "plans": {"enabled": false, "title": "Plans", "items": []},
    "content": {"enabled": false, "title": "", "markdown": ""},
    "faq": {"enabled": true, "title": "FAQ", "items": []},
    "cta": {"enabled": true, "title": "Ready to start?", "subtitle": "", "ctaLabel": "Order now", "ctaUrl": "/order"}
  }'::jsonb,
  translations JSONB DEFAULT '{}'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT false,
  show_in_menu BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_custom_services_published ON public.custom_services(is_published, sort_order);
CREATE INDEX idx_custom_services_menu ON public.custom_services(show_in_menu, menu_group, sort_order);

ALTER TABLE public.custom_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published services"
ON public.custom_services FOR SELECT
USING ((is_published = true) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert services"
ON public.custom_services FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update services"
ON public.custom_services FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete services"
ON public.custom_services FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_custom_services_updated_at
BEFORE UPDATE ON public.custom_services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();