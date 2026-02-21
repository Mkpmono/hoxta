
-- Fix status_monitors: drop restrictive, create permissive
DROP POLICY IF EXISTS "Admins can manage monitors" ON public.status_monitors;
CREATE POLICY "Admins can manage monitors"
ON public.status_monitors AS PERMISSIVE FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Fix status_checks: drop restrictive, create permissive
DROP POLICY IF EXISTS "Status checks are publicly readable" ON public.status_checks;
CREATE POLICY "Status checks are publicly readable"
ON public.status_checks AS PERMISSIVE FOR SELECT TO public
USING (true);

DROP POLICY IF EXISTS "Service role can insert checks" ON public.status_checks;
CREATE POLICY "Service role can insert checks"
ON public.status_checks AS PERMISSIVE FOR INSERT TO service_role
WITH CHECK (true);

-- Fix blog_posts
DROP POLICY IF EXISTS "Anyone can read published blog posts" ON public.blog_posts;
CREATE POLICY "Anyone can read published blog posts"
ON public.blog_posts AS PERMISSIVE FOR SELECT TO public
USING ((is_published = true) OR public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can insert blog posts" ON public.blog_posts;
CREATE POLICY "Admins can insert blog posts"
ON public.blog_posts AS PERMISSIVE FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update blog posts" ON public.blog_posts;
CREATE POLICY "Admins can update blog posts"
ON public.blog_posts AS PERMISSIVE FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete blog posts" ON public.blog_posts;
CREATE POLICY "Admins can delete blog posts"
ON public.blog_posts AS PERMISSIVE FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Fix kb_articles
DROP POLICY IF EXISTS "Anyone can read published articles" ON public.kb_articles;
CREATE POLICY "Anyone can read published articles"
ON public.kb_articles AS PERMISSIVE FOR SELECT TO public
USING ((is_published = true) OR public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can insert articles" ON public.kb_articles;
CREATE POLICY "Admins can insert articles"
ON public.kb_articles AS PERMISSIVE FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update articles" ON public.kb_articles;
CREATE POLICY "Admins can update articles"
ON public.kb_articles AS PERMISSIVE FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete articles" ON public.kb_articles;
CREATE POLICY "Admins can delete articles"
ON public.kb_articles AS PERMISSIVE FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Fix kb_categories
DROP POLICY IF EXISTS "Anyone can read categories" ON public.kb_categories;
CREATE POLICY "Anyone can read categories"
ON public.kb_categories AS PERMISSIVE FOR SELECT TO public
USING (true);

DROP POLICY IF EXISTS "Admins can insert categories" ON public.kb_categories;
CREATE POLICY "Admins can insert categories"
ON public.kb_categories AS PERMISSIVE FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update categories" ON public.kb_categories;
CREATE POLICY "Admins can update categories"
ON public.kb_categories AS PERMISSIVE FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete categories" ON public.kb_categories;
CREATE POLICY "Admins can delete categories"
ON public.kb_categories AS PERMISSIVE FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Fix game_servers
DROP POLICY IF EXISTS "Anyone can read published games" ON public.game_servers;
CREATE POLICY "Anyone can read published games"
ON public.game_servers AS PERMISSIVE FOR SELECT TO public
USING ((is_published = true) OR public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can insert games" ON public.game_servers;
CREATE POLICY "Admins can insert games"
ON public.game_servers AS PERMISSIVE FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update games" ON public.game_servers;
CREATE POLICY "Admins can update games"
ON public.game_servers AS PERMISSIVE FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete games" ON public.game_servers;
CREATE POLICY "Admins can delete games"
ON public.game_servers AS PERMISSIVE FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Fix user_roles
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles"
ON public.user_roles AS PERMISSIVE FOR SELECT TO authenticated
USING (auth.uid() = user_id);
