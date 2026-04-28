-- Create editable_pages table for fully admin-editable pages (Contact, About)
CREATE TABLE public.editable_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  translations JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.editable_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read editable pages"
  ON public.editable_pages FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert editable pages"
  ON public.editable_pages FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update editable pages"
  ON public.editable_pages FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete editable pages"
  ON public.editable_pages FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_editable_pages_updated_at
  BEFORE UPDATE ON public.editable_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed Contact page
INSERT INTO public.editable_pages (slug, content) VALUES (
  'contact',
  jsonb_build_object(
    'badge', '24/7 Support',
    'titlePart1', 'Get in',
    'titlePart2', 'Touch',
    'subtitle', 'We''re here to help. Contact our team anytime — we respond in hours, not days.',
    'actionCards', jsonb_build_array(
      jsonb_build_object('icon', 'Ticket', 'title', 'Support Ticket', 'description', 'Technical issues? Open a ticket and our experts will help you solve them quickly.', 'ctaLabel', 'Open Ticket', 'ctaUrl', 'https://billing.hoxta.com/submitticket.php'),
      jsonb_build_object('icon', 'MessageCircle', 'title', 'Live Chat', 'description', 'Need quick help? Chat with our team in real-time.', 'ctaLabel', 'Start Chat', 'ctaUrl', '#live-chat'),
      jsonb_build_object('icon', 'Briefcase', 'title', 'Sales Inquiry', 'description', 'Custom solutions or enterprise pricing? Let''s discuss your needs.', 'ctaLabel', 'Email Sales', 'ctaUrl', 'mailto:sales@hoxta.com')
    ),
    'formTitle', 'Send Us a Message',
    'formSubtitle', 'Fill out the form below and we will contact you within 24 hours.',
    'formNameLabel', 'Your Name',
    'formNamePlaceholder', 'John Doe',
    'formEmailLabel', 'Email Address',
    'formEmailPlaceholder', 'john@example.com',
    'formSubjectLabel', 'Subject',
    'formSubjectPlaceholder', 'Select a topic',
    'formSubjectOptions', jsonb_build_array('General Inquiry', 'Technical Support', 'Sales Question', 'Billing Issue', 'Partnership'),
    'formMessageLabel', 'Message',
    'formMessagePlaceholder', 'Describe your question or issue...',
    'formSubmitLabel', 'Send Message',
    'formSuccessMessage', 'Your message has been sent! We will get back to you within 24 hours.',
    'infoCards', jsonb_build_array(
      jsonb_build_object('icon', 'Mail', 'title', 'Email', 'rows', jsonb_build_array(
        jsonb_build_object('label', 'General', 'value', 'info@hoxta.com', 'href', 'mailto:info@hoxta.com'),
        jsonb_build_object('label', 'Support', 'value', 'support@hoxta.com', 'href', 'mailto:support@hoxta.com'),
        jsonb_build_object('label', 'Sales', 'value', 'sales@hoxta.com', 'href', 'mailto:sales@hoxta.com')
      )),
      jsonb_build_object('icon', 'Clock', 'title', 'Support Hours', 'rows', jsonb_build_array(
        jsonb_build_object('label', 'Technical Support', 'value', '24/7/365', 'href', ''),
        jsonb_build_object('label', 'Sales', 'value', 'Mon-Fri 9AM-6PM EST', 'href', ''),
        jsonb_build_object('label', 'Billing Question', 'value', 'Mon-Fri 9AM-6PM EST', 'href', '')
      )),
      jsonb_build_object('icon', 'Globe', 'title', 'Connect', 'rows', jsonb_build_array(
        jsonb_build_object('label', 'Discord', 'value', 'Community', 'href', 'https://discord.gg/ju7ADq4ZqY'),
        jsonb_build_object('label', 'Twitter / X', 'value', '@hoxta', 'href', 'https://twitter.com/hoxta'),
        jsonb_build_object('label', 'Status Page', 'value', 'status.hoxta.com', 'href', '/status')
      ))
    ),
    'trustItems', jsonb_build_array(
      jsonb_build_object('icon', 'Shield', 'label', '99.9% Uptime SLA'),
      jsonb_build_object('icon', 'Clock', 'label', '< 15min Response'),
      jsonb_build_object('icon', 'Headphones', 'label', '24/7/365 Support'),
      jsonb_build_object('icon', 'MapPin', 'label', 'Bucharest, RO')
    )
  )
);

-- Seed About page
INSERT INTO public.editable_pages (slug, content) VALUES (
  'about',
  jsonb_build_object(
    'badge', 'About',
    'titlePart1', 'Premium Hosting',
    'titlePart2', 'Built for Performance',
    'subtitle', 'We provide reliable, high-performance hosting infrastructure for gamers, developers, and businesses worldwide.',
    'stats', jsonb_build_array(
      jsonb_build_object('icon', 'Users', 'value', '10,000+', 'label', 'Active Customers'),
      jsonb_build_object('icon', 'Award', 'value', '99.9%', 'label', 'Uptime SLA'),
      jsonb_build_object('icon', 'Globe', 'value', '5', 'label', 'Data Centers'),
      jsonb_build_object('icon', 'Zap', 'value', '24/7', 'label', 'Expert Support')
    ),
    'missionTitle', 'Our Mission',
    'missionText', 'To provide the most reliable, high-performance hosting infrastructure that empowers gamers and developers to build amazing experiences — without worrying about servers.',
    'visionTitle', 'Our Vision',
    'visionText', 'To become the most trusted hosting provider in Europe — known for speed, transparency, and a community-driven approach.',
    'valuesTitle', 'What Drives Us',
    'valuesSubtitle', 'The principles behind every server we deploy and every client we support.',
    'values', jsonb_build_array(
      jsonb_build_object('icon', 'Shield', 'title', 'Security First', 'description', 'DDoS protection and proactive monitoring on every service.'),
      jsonb_build_object('icon', 'Cpu', 'title', 'High Performance', 'description', 'NVMe storage, AMD EPYC processors, and low-latency networks.'),
      jsonb_build_object('icon', 'Heart', 'title', 'Client Focused', 'description', 'Your success is our priority. We listen, adapt, and deliver.'),
      jsonb_build_object('icon', 'Clock', 'title', 'Instant Deployment', 'description', 'Services provisioned in minutes, not hours. No waiting.'),
      jsonb_build_object('icon', 'Headphones', 'title', 'Expert Support', 'description', 'Real people, real solutions. Available 24/7.'),
      jsonb_build_object('icon', 'Rocket', 'title', 'Always Innovating', 'description', 'Constantly upgrading our infrastructure and adding new features.')
    ),
    'timelineTitle', 'Our Journey',
    'timelineSubtitle', 'From a small idea to thousands of happy customers.',
    'timeline', jsonb_build_array(
      jsonb_build_object('year', '2022', 'title', 'Founded', 'description', 'Hoxta was born from a passion for reliable and accessible hosting.'),
      jsonb_build_object('year', '2023', 'title', '1,000 Clients', 'description', 'We reached our first major milestone with a growing community.'),
      jsonb_build_object('year', '2024', 'title', 'Global Expansion', 'description', 'Opened new data centers across Europe to serve clients better.'),
      jsonb_build_object('year', '2025', 'title', '10,000+ Clients', 'description', 'Trusted by thousands of gamers, developers, and businesses.'),
      jsonb_build_object('year', '2026', 'title', 'Always Improving', 'description', 'Continuing to innovate and deliver the best hosting experience.')
    )
  )
);
