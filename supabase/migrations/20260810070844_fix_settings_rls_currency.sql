-- Fix: include 'currency' in the public settings read policy
DROP POLICY IF EXISTS "public_read_settings" ON public.site_settings;
CREATE POLICY "public_read_settings" ON public.site_settings FOR SELECT TO anon, authenticated
USING (key IN ('site_name', 'tagline', 'whatsapp_number', 'hero_title', 'hero_subtitle', 'currency') OR EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));
