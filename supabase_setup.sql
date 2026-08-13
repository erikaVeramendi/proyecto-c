-- Copy and paste this script in your Supabase SQL Editor

-- 1. Create Categories Table
CREATE TABLE categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  icon text,
  color text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Products Table
CREATE TABLE products (
  id text PRIMARY KEY,
  category_id text REFERENCES categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  price numeric NOT NULL,
  emoji text,
  image text,
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Store Info Table (Key-Value store for settings)
CREATE TABLE store_info (
  key text PRIMARY KEY,
  value text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert initial store info
INSERT INTO store_info (key, value) VALUES
  ('whatsapp_number', '59176446793'),
  ('address', 'General Díaz Porlier, 21'),
  ('city_zip', '28001 Madrid, España'),
  ('store_name', 'Carnicería Hermanos Gómez'),
  ('map_embed_url', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3036.754!2d-3.6742!3d40.4281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd42288f00000001%3A0x0!2sGeneral+D%C3%ADaz+Porlier%2C+21%2C+28001+Madrid%2C+Spain!5e0!3m2!1ses!2ses!4v1620000000000!5m2!1ses!2ses');

-- 4. Set RLS (Row Level Security) Policies
-- Enforce everyone can READ, but only authenticated users can INSERT, UPDATE, DELETE

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_info ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public profiles are viewable by everyone." ON categories FOR SELECT USING (true);
CREATE POLICY "Public products are viewable by everyone." ON products FOR SELECT USING (true);
CREATE POLICY "Public store info is viewable by everyone." ON store_info FOR SELECT USING (true);

-- Allow authenticated users (Admin) full access
CREATE POLICY "Users can insert categories if authenticated." ON categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update categories if authenticated." ON categories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete categories if authenticated." ON categories FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert products if authenticated." ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update products if authenticated." ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete products if authenticated." ON products FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert store_info if authenticated." ON store_info FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update store_info if authenticated." ON store_info FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete store_info if authenticated." ON store_info FOR DELETE USING (auth.role() = 'authenticated');

-- 5. Storage (for product images)
-- You may need to create the bucket manually if this errors, or run this:
INSERT INTO storage.buckets (id, name, public) VALUES ('product_images', 'product_images', true);

CREATE POLICY "Images are publicly accessible." ON storage.objects FOR SELECT USING (bucket_id = 'product_images');
CREATE POLICY "Authenticated users can upload images." ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product_images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update images." ON storage.objects FOR UPDATE USING (bucket_id = 'product_images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete images." ON storage.objects FOR DELETE USING (bucket_id = 'product_images' AND auth.role() = 'authenticated');
