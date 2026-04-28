DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;

CREATE POLICY "Service role can insert contact messages"
  ON public.contact_messages FOR INSERT
  TO service_role
  WITH CHECK (true);