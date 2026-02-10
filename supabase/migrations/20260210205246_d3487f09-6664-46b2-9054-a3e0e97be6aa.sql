
-- Drop the restrictive policy that causes recursion
DROP POLICY IF EXISTS "Admins can view roles" ON public.user_roles;

-- Create a permissive policy: users can read their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
