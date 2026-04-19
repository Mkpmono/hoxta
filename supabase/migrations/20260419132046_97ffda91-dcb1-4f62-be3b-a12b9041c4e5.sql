-- 1. Revoke direct anon SELECT pe status_monitors (expune coloana url cu IP-uri)
DROP POLICY IF EXISTS "Anon can read active monitors via view" ON public.status_monitors;

-- 2. Curăță orice policy vechi pe storage pentru article-images
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view article images" ON storage.objects;
DROP POLICY IF EXISTS "Public can list article images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view individual article images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload article images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update article images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete article images" ON storage.objects;

-- Re-creăm policy curat și consistent
CREATE POLICY "Public can view individual article images"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'article-images');

CREATE POLICY "Admins can upload article images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'article-images'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update article images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'article-images'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete article images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'article-images'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

-- Setăm bucket-ul ca privat pentru a bloca listarea anonimă
UPDATE storage.buckets SET public = false WHERE id = 'article-images';