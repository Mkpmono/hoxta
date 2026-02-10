
-- Create game_servers table for dynamic game management
CREATE TABLE public.game_servers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  cover_image_url text,
  pricing_display text NOT NULL DEFAULT '$0.00/slot',
  price_value numeric(10,2) NOT NULL DEFAULT 0,
  pricing_unit text NOT NULL DEFAULT 'slot',
  short_description text NOT NULL DEFAULT '',
  full_description text NOT NULL DEFAULT '',
  tags text[] DEFAULT '{}'::text[],
  category text NOT NULL DEFAULT 'other',
  os text NOT NULL DEFAULT 'linux',
  popular boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT false,
  hero_points text[] DEFAULT '{}'::text[],
  features text[] DEFAULT '{}'::text[],
  plans jsonb NOT NULL DEFAULT '[]'::jsonb,
  faqs jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.game_servers ENABLE ROW LEVEL SECURITY;

-- Public can read published games
CREATE POLICY "Anyone can read published games"
  ON public.game_servers FOR SELECT
  USING (is_published = true OR has_role(auth.uid(), 'admin'::app_role));

-- Admins can manage games
CREATE POLICY "Admins can insert games"
  ON public.game_servers FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update games"
  ON public.game_servers FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete games"
  ON public.game_servers FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Auto-update timestamp
CREATE TRIGGER update_game_servers_updated_at
  BEFORE UPDATE ON public.game_servers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
