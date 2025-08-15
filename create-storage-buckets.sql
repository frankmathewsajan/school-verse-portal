-- Create Storage Buckets for School Verse Portal
-- Run this in your Supabase SQL Editor

-- 1. Create site-images bucket for general site images (hero, about, facilities, etc.)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-images',
  'site-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- 2. Create gallery-images bucket for gallery content
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery-images',
  'gallery-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- 3. Create learning-materials bucket for educational content
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'learning-materials',
  'learning-materials',
  true,
  52428800, -- 50MB limit for documents
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/zip', 'text/plain', 'image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- 4. Create gallery-groups bucket for gallery group images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery-groups',
  'gallery-groups',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- 5. Create gallery-items bucket for individual gallery item images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery-items',
  'gallery-items',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Set up RLS (Row Level Security) policies for all buckets

-- Policies for site-images bucket
CREATE POLICY "Allow public read access on site-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'site-images');

CREATE POLICY "Allow authenticated users to upload site images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'site-images');

CREATE POLICY "Allow authenticated users to update site images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'site-images');

CREATE POLICY "Allow authenticated users to delete site images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'site-images');

-- Policies for gallery-images bucket
CREATE POLICY "Allow public read access on gallery-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'gallery-images');

CREATE POLICY "Allow authenticated users to upload gallery images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery-images');

CREATE POLICY "Allow authenticated users to update gallery images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'gallery-images');

CREATE POLICY "Allow authenticated users to delete gallery images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'gallery-images');

-- Policies for learning-materials bucket
CREATE POLICY "Allow public read access on learning-materials"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'learning-materials');

CREATE POLICY "Allow authenticated users to upload learning materials"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'learning-materials');

CREATE POLICY "Allow authenticated users to update learning materials"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'learning-materials');

CREATE POLICY "Allow authenticated users to delete learning materials"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'learning-materials');

-- Policies for gallery-groups bucket
CREATE POLICY "Allow public read access on gallery-groups"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'gallery-groups');

CREATE POLICY "Allow authenticated users to upload gallery group images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery-groups');

CREATE POLICY "Allow authenticated users to update gallery group images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'gallery-groups');

CREATE POLICY "Allow authenticated users to delete gallery group images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'gallery-groups');

-- Policies for gallery-items bucket
CREATE POLICY "Allow public read access on gallery-items"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'gallery-items');

CREATE POLICY "Allow authenticated users to upload gallery item images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery-items');

CREATE POLICY "Allow authenticated users to update gallery item images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'gallery-items');

CREATE POLICY "Allow authenticated users to delete gallery item images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'gallery-items');
