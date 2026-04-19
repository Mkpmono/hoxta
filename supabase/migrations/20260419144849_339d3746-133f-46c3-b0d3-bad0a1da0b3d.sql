-- Hosting plans table (all categories: web, reseller, vps, dedicated, domains, discord-bot, teamspeak, colocation)
CREATE TABLE public.hosting_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  slug text NOT NULL,
  name text NOT NULL,
  short_description text NOT NULL DEFAULT '',
  full_description text NOT NULL DEFAULT '',
  price_value numeric NOT NULL DEFAULT 0,
  pricing_display text NOT NULL DEFAULT '',
  billing_cycle text NOT NULL DEFAULT 'monthly',
  cpu text,
  ram text,
  storage text,
  bandwidth text,
  locations text[] DEFAULT '{}',
  os text,
  features text[] NOT NULL DEFAULT '{}',
  hero_points text[] DEFAULT '{}',
  faqs jsonb NOT NULL DEFAULT '[]'::jsonb,
  order_url text,
  cover_image_url text,
  tags text[] DEFAULT '{}',
  popular boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT false,
  sort_order integer DEFAULT 0,
  translations jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (category, slug)
);

CREATE INDEX hosting_plans_category_idx ON public.hosting_plans (category, sort_order);
CREATE INDEX hosting_plans_published_idx ON public.hosting_plans (is_published);

ALTER TABLE public.hosting_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published plans"
  ON public.hosting_plans FOR SELECT
  USING (is_published = true OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert plans"
  ON public.hosting_plans FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update plans"
  ON public.hosting_plans FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete plans"
  ON public.hosting_plans FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_hosting_plans_updated_at
  BEFORE UPDATE ON public.hosting_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();