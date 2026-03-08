ALTER TABLE public.kb_articles ADD COLUMN IF NOT EXISTS translations jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS translations jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.game_servers ADD COLUMN IF NOT EXISTS translations jsonb DEFAULT '{}'::jsonb;