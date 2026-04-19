-- Singleton table for support widget settings
CREATE TABLE public.support_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  singleton boolean NOT NULL DEFAULT true UNIQUE,

  discord_url text DEFAULT 'https://discord.gg/ju7ADq4ZqY',
  discord_enabled boolean NOT NULL DEFAULT true,

  email_address text DEFAULT 'support@hoxta.com',
  email_enabled boolean NOT NULL DEFAULT true,

  live_chat_enabled boolean NOT NULL DEFAULT false,
  live_chat_label text DEFAULT 'Live Chat',
  live_chat_embed_script text DEFAULT '',

  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.support_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read support settings"
ON public.support_settings FOR SELECT
USING (true);

CREATE POLICY "Admins can insert support settings"
ON public.support_settings FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update support settings"
ON public.support_settings FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_support_settings_updated_at
BEFORE UPDATE ON public.support_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.support_settings (singleton) VALUES (true);