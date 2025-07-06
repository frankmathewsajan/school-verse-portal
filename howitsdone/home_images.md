# Database Setup Instructions for Image Management

This document provides detailed SQL commands to set up the database structure for managing all images used in the School Verse Portal home page sections.

## Overview

The following changes enable complete image management through the admin dashboard:

1. **Hero Section**: Upload hero background image
2. **About Section**: Upload about section image and principal's photo
3. **Vision Section**: Already supports text content (principal message removed)
4. **Gallery/Materials**: Already implemented with existing upload functionality

## Required Database Changes

### 1. Create Storage Bucket for Site Images

First, you need to create a storage bucket for general site images in Supabase:

```sql
-- Create storage bucket for site images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-images',
  'site-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);
```

### 2. Set Storage Policies

Add RLS (Row Level Security) policies for the storage bucket:

```sql
-- Allow public read access to site images
CREATE POLICY "Allow public read access on site-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'site-images');

-- Allow authenticated users to upload site images
CREATE POLICY "Allow authenticated users to upload site images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'site-images');

-- Allow authenticated users to update site images
CREATE POLICY "Allow authenticated users to update site images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'site-images');

-- Allow authenticated users to delete site images
CREATE POLICY "Allow authenticated users to delete site images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'site-images');
```

### 3. Update About Section Table

Add the `about_image_url` column to the `about_section` table:

```sql
-- Add about_image_url column to about_section table
ALTER TABLE about_section 
ADD COLUMN about_image_url TEXT;

-- Update the existing row with a default image
UPDATE about_section 
SET about_image_url = 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'
WHERE id = 'main';
```

### 4. Verify Existing Tables

Ensure the following tables exist with proper structure:

#### Hero Section Table
```sql
-- Verify hero_section table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'hero_section'
ORDER BY ordinal_position;

-- If the table doesn't exist, create it:
CREATE TABLE IF NOT EXISTS hero_section (
  id TEXT PRIMARY KEY DEFAULT 'main',
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  image_description TEXT,
  primary_button_text TEXT,
  primary_button_link TEXT,
  secondary_button_text TEXT,
  secondary_button_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default data if table is empty
INSERT INTO hero_section (id, title, subtitle, image_url, image_description, primary_button_text, primary_button_link, secondary_button_text, secondary_button_link)
VALUES (
  'main',
  'Welcome to St. G. D. Convent School',
  'Empowering students through innovative education and comprehensive learning experiences. Discover a vibrant community dedicated to academic excellence.',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
  'Students learning together',
  'Explore Gallery',
  '/gallery',
  'Learning Materials',
  '/materials'
) ON CONFLICT (id) DO NOTHING;
```

#### About Section Table
```sql
-- Verify about_section table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'about_section'
ORDER BY ordinal_position;

-- If the table doesn't exist, create it:
CREATE TABLE IF NOT EXISTS about_section (
  id TEXT PRIMARY KEY DEFAULT 'main',
  title TEXT NOT NULL,
  subtitle TEXT,
  main_content JSON,
  principal_message TEXT,
  principal_name TEXT,
  principal_title TEXT,
  principal_image_url TEXT,
  about_image_url TEXT,
  school_founded_year INTEGER,
  school_description TEXT,
  features JSON,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default data if table is empty
INSERT INTO about_section (
  id, title, subtitle, main_content, principal_message, principal_name, 
  principal_title, principal_image_url, about_image_url, school_founded_year, features
)
VALUES (
  'main',
  'About Our School',
  'Excellence in education through innovative teaching and comprehensive curriculum',
  '["St. G. D. Convent School is a leading educational institution committed to providing a balanced and stimulating learning environment where students can achieve academic excellence and personal growth.", "Our comprehensive curriculum is designed to develop critical thinking, creativity, and problem-solving skills, preparing students for success in higher education and beyond.", "We pride ourselves on small class sizes, dedicated teachers, and a supportive community that nurtures each student''s individual talents and abilities."]',
  'Education is not just about academic achievement, but about nurturing curious minds, compassionate hearts, and resilient spirits. At St. G. D. Convent School, we are committed to guiding each student on their unique journey of growth and discovery.',
  'Mr. Ashirwad Goyal',
  'Principal, St. G. D. Convent School',
  'https://randomuser.me/api/portraits/women/45.jpg',
  'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
  1985,
  '[{"title": "Founded in 1985", "description": "With decades of educational excellence and a strong foundation in values-based learning"}, {"title": "Diverse Community", "description": "Creating an inclusive environment where every student feels valued and empowered"}, {"title": "Comprehensive Curriculum", "description": "Balancing academic rigor with holistic development for well-rounded education"}, {"title": "Academic Excellence", "description": "Consistent record of outstanding achievements in academics and extracurriculars"}]'
) ON CONFLICT (id) DO NOTHING;
```

#### Vision Section Table
```sql
-- Verify vision_section table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'vision_section'
ORDER BY ordinal_position;

-- If the table doesn't exist, create it:
CREATE TABLE IF NOT EXISTS vision_section (
  id TEXT PRIMARY KEY DEFAULT 'main',
  title TEXT NOT NULL,
  subtitle TEXT,
  main_content TEXT,
  principal_message TEXT,
  principal_name TEXT,
  principal_title TEXT,
  features JSON,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default data if table is empty
INSERT INTO vision_section (id, title, subtitle, main_content, features)
VALUES (
  'main',
  'Our Vision & Mission',
  'Fostering a learning environment that nurtures excellence, character, and lifelong learning',
  'At SchoolVerse Academy, we believe in providing an education that goes beyond textbooks. Our vision is to create a nurturing environment where students can discover their potential, develop critical skills, and become responsible global citizens prepared for the challenges of tomorrow.',
  '[{"title": "Academic Excellence", "description": "We maintain high academic standards through innovative teaching methods and comprehensive curriculum."}, {"title": "Inclusive Community", "description": "Our diverse and supportive environment ensures every student feels valued and empowered to succeed."}, {"title": "Holistic Development", "description": "We focus on developing well-rounded individuals through academic, social, and extracurricular activities."}, {"title": "Future-Ready Skills", "description": "Our programs equip students with critical thinking, creativity, and technological skills for future success."}]'
) ON CONFLICT (id) DO NOTHING;
```

### 5. Enable Row Level Security (RLS)

Enable RLS on all content tables:

```sql
-- Enable RLS on content tables
ALTER TABLE hero_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE vision_section ENABLE ROW LEVEL SECURITY;

-- Create policies for content tables
-- Allow public read access
CREATE POLICY "Allow public read access on hero_section"
ON hero_section FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public read access on about_section"
ON about_section FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public read access on vision_section"
ON vision_section FOR SELECT
TO public
USING (true);

-- Allow authenticated users to update content
CREATE POLICY "Allow authenticated users to update hero_section"
ON hero_section FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to update about_section"
ON about_section FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to update vision_section"
ON vision_section FOR UPDATE
TO authenticated
USING (true);
```

### 6. Create Update Functions (Optional)

Create functions to automatically update the `updated_at` timestamp:

```sql
-- Create or replace function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_hero_section_updated_at
  BEFORE UPDATE ON hero_section
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_about_section_updated_at
  BEFORE UPDATE ON about_section
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vision_section_updated_at
  BEFORE UPDATE ON vision_section
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 7. Verify Setup

Run these queries to verify everything is set up correctly:

```sql
-- Check if all tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('hero_section', 'about_section', 'vision_section');

-- Check if storage bucket exists
SELECT name, public, file_size_limit, allowed_mime_types
FROM storage.buckets
WHERE name = 'site-images';

-- Check if all content tables have data
SELECT 'hero_section' as table_name, count(*) as record_count FROM hero_section
UNION ALL
SELECT 'about_section' as table_name, count(*) as record_count FROM about_section
UNION ALL
SELECT 'vision_section' as table_name, count(*) as record_count FROM vision_section;
```

## Admin Dashboard Features

After implementing these database changes, the admin dashboard will support:

### Hero Section Management
- ✅ Upload hero background image
- ✅ Edit hero title and subtitle
- ✅ Configure call-to-action buttons
- ✅ Set image alt text for accessibility

### About Section Management
- ✅ Upload about section image
- ✅ Upload principal's photo
- ✅ Edit principal's message and details
- ✅ Manage main content paragraphs
- ✅ Configure school features

### Vision Section Management
- ✅ Edit vision and mission content
- ✅ Manage vision features
- ✅ Configure section title and subtitle
- ❌ Principal message removed (to avoid duplication)

### Gallery & Materials
- ✅ Already implemented with existing upload functionality

## File Organization

Images will be organized in the `site-images` bucket with the following folder structure:
- `hero/` - Hero section images
- `about/` - About section images  
- `principal/` - Principal photos
- `images/` - General site images

## Security Considerations

1. **File Size Limits**: Images are limited to 10MB to prevent storage abuse
2. **File Type Restrictions**: Only image formats (JPEG, PNG, WebP, GIF) are allowed
3. **Authentication**: Upload/update/delete operations require user authentication
4. **Public Access**: Images are publicly accessible for website display

## Testing

After implementing these changes:

1. Test image uploads in each admin section
2. Verify images display correctly on the homepage
3. Test image replacement functionality
4. Verify manual URL input still works
5. Test responsive image display on different devices

### Integration Test Suite

The comprehensive integration test suite now includes tests for all new image upload functionality:

#### New Test Categories Added:

**Admin Dashboard Integration Tests:**
- ✅ ImageUpload Component Test - Tests the new ImageUpload UI component
- ✅ Hero Image Upload Integration Test - Tests hero section image management
- ✅ About Image Upload Integration Test - Tests about section and principal image management
- ✅ Vision Section Management Test - Tests vision section (confirms no duplicate principal message)
- ✅ Admin Dashboard Integration Test - Tests complete dashboard functionality

**Enhanced Upload Service Tests:**
- ✅ Image Upload Functionality Test - Tests all image upload validations
- ✅ Learning Material Upload Functionality Test - Tests document upload validations
- ✅ Upload Service Error Handling Test - Tests error scenarios and edge cases

#### Test Coverage:

**Image Upload Features:**
- File type validation (JPEG, PNG, WebP, GIF)
- File size validation (configurable limits)
- Image preview functionality
- Manual URL input option
- Upload service integration
- Error handling and user feedback

**Admin Dashboard Features:**
- All 7 admin tabs (Hero, About, Vision, Announcements, Gallery, Materials, Footer)
- Image upload integration in editors
- Component imports and dependencies
- Dashboard statistics loading
- Tab navigation structure

**Database Integration:**
- Hero section image URL updates
- About section image and principal photo updates
- Vision section management (no principal message duplication)
- Data persistence and retrieval
- Error handling and rollback

#### Running the Tests:

1. Navigate to `/test/integration` in your application
2. Click "Run All Tests" to execute the complete test suite
3. Or run individual tests using the specific test buttons
4. Monitor performance metrics and error reporting
5. Use "Reset Data" to restore original values after testing

The test suite now includes **18 total tests** covering all aspects of the image upload functionality and admin dashboard integration.

## Maintenance

- Monitor storage usage in the Supabase dashboard
- Periodically clean up unused images
- Consider implementing automatic image optimization
- Review file size limits as needed