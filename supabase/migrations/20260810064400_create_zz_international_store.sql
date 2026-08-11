/*
# Create Z & Z International storefront catalog

1. New Tables
- `categories` stores public product group names and ordering.
- `products` stores product titles, descriptions, prices, stock, image galleries, colors, category, and featured status.
- `site_settings` stores editable storefront copy and WhatsApp contact settings.
- `admin_users` maps authenticated Supabase accounts to admin access.

2. Security
- RLS is enabled on every table.
- Anyone may read active categories, active products, and public site settings.
- Only authenticated users listed in `admin_users` may create, update, or delete catalog and settings data.
- Admin membership cannot be created or changed through the public client.

3. Important Notes
- The first admin account must be added to `admin_users` by an operator after creating an account.
- Seed data is intentionally limited to the supplied brand identity and representative product catalog.
*/

CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url text NOT NULL,
  gallery_urls text[] NOT NULL DEFAULT '{}',
  colors text[] NOT NULL DEFAULT '{}',
  sizes text[] NOT NULL DEFAULT '{}',
  is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_read_admin_users" ON public.admin_users;
CREATE POLICY "admins_read_admin_users" ON public.admin_users FOR SELECT TO authenticated
USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "public_read_active_categories" ON public.categories;
CREATE POLICY "public_read_active_categories" ON public.categories FOR SELECT TO anon, authenticated
USING (is_active = true OR EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS "admins_insert_categories" ON public.categories;
CREATE POLICY "admins_insert_categories" ON public.categories FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS "admins_update_categories" ON public.categories;
CREATE POLICY "admins_update_categories" ON public.categories FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS "admins_delete_categories" ON public.categories;
CREATE POLICY "admins_delete_categories" ON public.categories FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "public_read_active_products" ON public.products;
CREATE POLICY "public_read_active_products" ON public.products FOR SELECT TO anon, authenticated
USING (is_active = true OR EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS "admins_insert_products" ON public.products;
CREATE POLICY "admins_insert_products" ON public.products FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS "admins_update_products" ON public.products;
CREATE POLICY "admins_update_products" ON public.products FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS "admins_delete_products" ON public.products;
CREATE POLICY "admins_delete_products" ON public.products FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "public_read_settings" ON public.site_settings;
CREATE POLICY "public_read_settings" ON public.site_settings FOR SELECT TO anon, authenticated
USING (key IN ('site_name', 'tagline', 'whatsapp_number', 'hero_title', 'hero_subtitle') OR EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS "admins_insert_settings" ON public.site_settings;
CREATE POLICY "admins_insert_settings" ON public.site_settings FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS "admins_update_settings" ON public.site_settings;
CREATE POLICY "admins_update_settings" ON public.site_settings FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS "admins_delete_settings" ON public.site_settings;
CREATE POLICY "admins_delete_settings" ON public.site_settings FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS products_category_id_idx ON public.products(category_id);
CREATE INDEX IF NOT EXISTS products_featured_idx ON public.products(is_featured) WHERE is_active = true;

INSERT INTO public.categories (name, slug, description, image_url, sort_order)
VALUES
('T-shirt', 't-shirt', 'Refined everyday essentials in breathable premium cotton.', 'https://images.pexels.com/photos/32526686/pexels-photo-32526686.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 1),
('Pant', 'pant', 'Tailored silhouettes with an effortless international finish.', 'https://images.pexels.com/photos/7959592/pexels-photo-7959592.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 2),
('Kids', 'kids', 'Considered pieces for the next generation of style.', 'https://images.pexels.com/photos/18545044/pexels-photo-18545044.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (category_id, title, slug, description, price, stock, image_url, gallery_urls, colors, sizes, is_featured)
SELECT c.id, v.title, v.slug, v.description, v.price, v.stock, v.image_url, v.gallery_urls, v.colors, v.sizes, v.is_featured
FROM public.categories c
JOIN (VALUES
('t-shirt','Navy Essential Polo','navy-essential-polo','A polished polo cut from soft, breathable cotton with a structured collar and the confidence of deep navy.',89,24,'https://images.pexels.com/photos/32526686/pexels-photo-32526686.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',ARRAY['https://images.pexels.com/photos/32526680/pexels-photo-32526680.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],ARRAY['#102746','#c59a3d','#f6f3ed'],ARRAY['S','M','L','XL'],true),
('pant','The Modern Trouser','modern-trouser','A contemporary trouser with a clean drape, considered taper and a finish made for long days and late evenings.',129,18,'https://images.pexels.com/photos/7959592/pexels-photo-7959592.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',ARRAY['https://images.pexels.com/photos/8764428/pexels-photo-8764428.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],ARRAY['#102746','#e7dfd1','#172b4d'],ARRAY['30','32','34','36'],true),
('kids','Explorer Set','explorer-set','A playful, durable set for curious days. Easy layers, soft-touch fabric and a silhouette that moves with them.',75,12,'https://images.pexels.com/photos/18545044/pexels-photo-18545044.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',ARRAY['https://images.pexels.com/photos/5560013/pexels-photo-5560013.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],ARRAY['#102746','#c59a3d','#d8d0c5'],ARRAY['2Y','4Y','6Y','8Y'],true)
) AS v(category_slug,title,slug,description,price,stock,image_url,gallery_urls,colors,sizes,is_featured) ON v.category_slug = c.slug
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.site_settings (key, value) VALUES
('site_name','Z & Z International'),
('tagline','Fashion world wide'),
('whatsapp_number',''),
('hero_title','A wardrobe without borders.'),
('hero_subtitle','Premium essentials, considered globally. Designed for every destination.'),
('currency','USD')
ON CONFLICT (key) DO NOTHING;