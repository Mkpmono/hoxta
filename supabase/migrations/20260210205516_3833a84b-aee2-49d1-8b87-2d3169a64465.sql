
-- Create storage bucket for article images
INSERT INTO storage.buckets (id, name, public) VALUES ('article-images', 'article-images', true);

-- Storage policies
CREATE POLICY "Anyone can view article images"
ON storage.objects FOR SELECT
USING (bucket_id = 'article-images');

CREATE POLICY "Admins can upload article images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'article-images' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update article images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'article-images' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete article images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'article-images' AND public.has_role(auth.uid(), 'admin'::app_role));

-- Add image_url to kb_articles
ALTER TABLE public.kb_articles ADD COLUMN IF NOT EXISTS image_url text;

-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL DEFAULT '',
  excerpt text,
  category text NOT NULL DEFAULT 'General',
  author text NOT NULL DEFAULT 'Hoxta Team',
  author_role text DEFAULT 'Team',
  image_url text,
  tags text[] DEFAULT '{}',
  is_published boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  views integer NOT NULL DEFAULT 0,
  read_time text DEFAULT '5 min read',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on blog_posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- RLS for blog_posts
CREATE POLICY "Anyone can read published blog posts"
ON public.blog_posts FOR SELECT
USING (is_published = true OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert blog posts"
ON public.blog_posts FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update blog posts"
ON public.blog_posts FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete blog posts"
ON public.blog_posts FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Update trigger for blog_posts
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
