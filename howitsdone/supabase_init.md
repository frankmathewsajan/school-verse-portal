# Supabase Database Initialization Guide

## 🏗️ Complete Setup Instructions for St. G. D. Convent School Portal

### Project Information
- **Project URL**: https://plgjavfrwcphrehmthdv.supabase.co
- **Project Reference**: `plgjavfrwcphrehmthdv`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsZ2phdmZyd2NwaHJlaG10aGR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2ODE3ODcsImV4cCI6MjA2NzI1Nzc4N30.73hjYMk1hrqiuhFV-AoVtbRdYc6biciDqnFhtz4sq5o`

---

## 📋 Step-by-Step Setup Checklist

### 1. **Authentication Configuration**
Navigate to **Authentication > Settings** in your Supabase dashboard:

#### Enable Email Authentication
- [x] Email authentication should be enabled by default
- [x] **Site URL**: Set to your deployment URL (e.g., `https://yourdomain.com`)
- [x] **Redirect URLs**: Add your local development URL: `http://localhost:8081/admin/login`

#### Email Templates (Optional but Recommended)
- Navigate to **Authentication > Email Templates**
- Customize the email templates for:
  - **Confirm signup**: Welcome email for new admin users
  - **Reset password**: Password reset instructions
  - **Magic link**: If you plan to use magic links

---

### 2. **Database Schema Setup**

Go to **SQL Editor** in your Supabase dashboard and run the following SQL scripts:

#### 2.1 Create Admin Users Table
```sql
-- Create admin_users table for role management
CREATE TABLE public.admin_users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role text DEFAULT 'admin'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT admin_users_pkey PRIMARY KEY (id),
  CONSTRAINT admin_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create unique index to prevent duplicate admin users
CREATE UNIQUE INDEX admin_users_user_id_key ON public.admin_users(user_id);
```

#### 2.2 Create Announcements Table
```sql
-- Create announcements table for school announcements
CREATE TABLE public.announcements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text DEFAULT 'general'::text,
  type text DEFAULT 'info'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT announcements_pkey PRIMARY KEY (id)
);

-- Create index for category filtering
CREATE INDEX announcements_category_idx ON public.announcements(category);
-- Create index for type filtering
CREATE INDEX announcements_type_idx ON public.announcements(type);
```

#### 2.3 Create Leadership Team Table
```sql
-- Create leadership_team table for staff profiles
CREATE TABLE public.leadership_team (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  position text NOT NULL,
  bio text,
  qualifications text,
  email text,
  phone text,
  image_url text,
  display_order integer,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT leadership_team_pkey PRIMARY KEY (id)
);

-- Create index for display order
CREATE INDEX leadership_team_display_order_idx ON public.leadership_team(display_order);
```

#### 2.4 Create Learning Materials Table
```sql
-- Create learning_materials table for educational resources
CREATE TABLE public.learning_materials (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  subject text NOT NULL,
  class_level text NOT NULL,
  file_type text NOT NULL,
  file_url text NOT NULL,
  file_size text,
  downloads integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT learning_materials_pkey PRIMARY KEY (id)
);

-- Create indexes for filtering
CREATE INDEX learning_materials_subject_idx ON public.learning_materials(subject);
CREATE INDEX learning_materials_class_level_idx ON public.learning_materials(class_level);
CREATE INDEX learning_materials_file_type_idx ON public.learning_materials(file_type);
```

#### 2.5 Create School Life Gallery Table
```sql
-- Create school_life_gallery table for photo gallery
CREATE TABLE public.school_life_gallery (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  category text DEFAULT 'general'::text,
  date_taken date,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT school_life_gallery_pkey PRIMARY KEY (id)
);

-- Create index for category filtering
CREATE INDEX school_life_gallery_category_idx ON public.school_life_gallery(category);
-- Create index for date filtering
CREATE INDEX school_life_gallery_date_taken_idx ON public.school_life_gallery(date_taken);
```

#### 2.6 Create Admin Status Check Function
```sql
-- Create function to check admin status
CREATE OR REPLACE FUNCTION public.check_admin_status(user_uuid uuid DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF user_uuid IS NULL THEN
    user_uuid := auth.uid();
  END IF;
  
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = user_uuid
  );
END;
$$;
```

---

### 3. **Row Level Security (RLS) Configuration**

#### 3.1 Enable RLS on All Tables
```sql
-- Enable RLS on all tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leadership_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_life_gallery ENABLE ROW LEVEL SECURITY;
```

#### 3.2 Create Public Read Access Policies
```sql
-- Public read access for website visitors
CREATE POLICY "Public read access for announcements" 
ON public.announcements FOR SELECT 
USING (true);

CREATE POLICY "Public read access for leadership" 
ON public.leadership_team FOR SELECT 
USING (true);

CREATE POLICY "Public read access for materials" 
ON public.learning_materials FOR SELECT 
USING (true);

CREATE POLICY "Public read access for gallery" 
ON public.school_life_gallery FOR SELECT 
USING (true);
```

#### 3.3 Create Admin-Only Modification Policies
```sql
-- Admin-only policies for announcements
CREATE POLICY "Admin can insert announcements" 
ON public.announcements FOR INSERT 
WITH CHECK (public.check_admin_status());

CREATE POLICY "Admin can update announcements" 
ON public.announcements FOR UPDATE 
USING (public.check_admin_status());

CREATE POLICY "Admin can delete announcements" 
ON public.announcements FOR DELETE 
USING (public.check_admin_status());

-- Admin-only policies for leadership team
CREATE POLICY "Admin can insert leadership" 
ON public.leadership_team FOR INSERT 
WITH CHECK (public.check_admin_status());

CREATE POLICY "Admin can update leadership" 
ON public.leadership_team FOR UPDATE 
USING (public.check_admin_status());

CREATE POLICY "Admin can delete leadership" 
ON public.leadership_team FOR DELETE 
USING (public.check_admin_status());

-- Admin-only policies for learning materials
CREATE POLICY "Admin can insert materials" 
ON public.learning_materials FOR INSERT 
WITH CHECK (public.check_admin_status());

CREATE POLICY "Admin can update materials" 
ON public.learning_materials FOR UPDATE 
USING (public.check_admin_status());

CREATE POLICY "Admin can delete materials" 
ON public.learning_materials FOR DELETE 
USING (public.check_admin_status());

-- Admin-only policies for gallery
CREATE POLICY "Admin can insert gallery" 
ON public.school_life_gallery FOR INSERT 
WITH CHECK (public.check_admin_status());

CREATE POLICY "Admin can update gallery" 
ON public.school_life_gallery FOR UPDATE 
USING (public.check_admin_status());

CREATE POLICY "Admin can delete gallery" 
ON public.school_life_gallery FOR DELETE 
USING (public.check_admin_status());

-- Admin users table policies
CREATE POLICY "Admin users can read own record" 
ON public.admin_users FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert admin users" 
ON public.admin_users FOR INSERT 
WITH CHECK (true);
```

---

### 4. **Storage Configuration (For File Uploads)**

#### 4.1 Create Storage Buckets
Navigate to **Storage** in your Supabase dashboard and create the following buckets:

1. **gallery-images**
   - Public bucket for school gallery photos
   - Allowed file types: `image/jpeg`, `image/png`, `image/gif`, `image/webp`
   - Max file size: 10MB

2. **learning-materials**
   - Public bucket for educational files
   - Allowed file types: `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `application/vnd.ms-powerpoint`, `application/vnd.openxmlformats-officedocument.presentationml.presentation`
   - Max file size: 50MB

3. **leadership-photos**
   - Public bucket for staff profile photos
   - Allowed file types: `image/jpeg`, `image/png`, `image/webp`
   - Max file size: 5MB

#### 4.2 Storage Policies
```sql
-- Gallery images bucket policies
CREATE POLICY "Public can view gallery images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'gallery-images');

CREATE POLICY "Admin can upload gallery images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'gallery-images' AND public.check_admin_status());

CREATE POLICY "Admin can update gallery images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'gallery-images' AND public.check_admin_status());

CREATE POLICY "Admin can delete gallery images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'gallery-images' AND public.check_admin_status());

-- Learning materials bucket policies
CREATE POLICY "Public can view learning materials" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'learning-materials');

CREATE POLICY "Admin can upload learning materials" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'learning-materials' AND public.check_admin_status());

CREATE POLICY "Admin can update learning materials" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'learning-materials' AND public.check_admin_status());

CREATE POLICY "Admin can delete learning materials" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'learning-materials' AND public.check_admin_status());

-- Leadership photos bucket policies
CREATE POLICY "Public can view leadership photos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'leadership-photos');

CREATE POLICY "Admin can upload leadership photos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'leadership-photos' AND public.check_admin_status());

CREATE POLICY "Admin can update leadership photos" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'leadership-photos' AND public.check_admin_status());

CREATE POLICY "Admin can delete leadership photos" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'leadership-photos' AND public.check_admin_status());
```

---

### 5. **Sample Data (Optional)**

#### 5.1 Insert Sample Announcements
```sql
-- Insert sample announcements
INSERT INTO public.announcements (title, content, category, type) VALUES
('Welcome to New Academic Year', 'We are excited to welcome all students and parents to the new academic year 2025-26. Classes will begin on July 15th, 2025.', 'academic', 'info'),
('School Sports Day', 'Annual Sports Day will be held on August 20th, 2025. All students are encouraged to participate in various sporting events.', 'event', 'event'),
('Parent-Teacher Meeting', 'The next Parent-Teacher meeting is scheduled for July 25th, 2025 from 10:00 AM to 2:00 PM.', 'general', 'important');
```

#### 5.2 Insert Sample Leadership Team
```sql
-- Insert sample leadership team members
INSERT INTO public.leadership_team (name, position, bio, qualifications, email, phone, display_order) VALUES
('Sr. Mary Joseph', 'Principal', 'Sr. Mary Joseph has been serving as the Principal of St. G. D. Convent School for over 15 years. She is dedicated to providing quality education and moral values to all students.', 'M.Ed., B.Ed., M.A. in English', 'principal@stgdconvent.edu', '+91-9876543210', 1),
('Mrs. Sarah Johnson', 'Vice Principal', 'Mrs. Sarah Johnson oversees the academic activities and student welfare programs. She has been with the school for 12 years.', 'M.Ed., B.Sc. in Mathematics', 'vp@stgdconvent.edu', '+91-9876543211', 2),
('Mr. David Wilson', 'Academic Coordinator', 'Mr. David Wilson coordinates the academic curriculum and ensures high standards of teaching across all grades.', 'M.Ed., M.A. in History', 'academic@stgdconvent.edu', '+91-9876543212', 3);
```

#### 5.3 Insert Sample Learning Materials
```sql
-- Insert sample learning materials
INSERT INTO public.learning_materials (title, description, subject, class_level, file_type, file_url, file_size) VALUES
('Mathematics Workbook - Grade 5', 'Comprehensive mathematics workbook covering all topics for Grade 5 students', 'mathematics', '5', 'pdf', 'https://example.com/math-grade5.pdf', '2.5 MB'),
('Science Activity Book - Grade 7', 'Hands-on science activities and experiments for Grade 7 students', 'science', '7', 'pdf', 'https://example.com/science-grade7.pdf', '4.1 MB'),
('English Grammar Guide - Grade 10', 'Complete English grammar reference guide for Grade 10 students', 'english', '10', 'pdf', 'https://example.com/english-grade10.pdf', '1.8 MB');
```

#### 5.4 Insert Sample Gallery Items
```sql
-- Insert sample gallery items
INSERT INTO public.school_life_gallery (title, description, image_url, category, date_taken) VALUES
('Annual Sports Day 2024', 'Students participating in various sports activities during the annual sports day', 'https://example.com/sports-day-2024.jpg', 'sports', '2024-08-20'),
('Science Fair 2024', 'Students presenting their innovative science projects', 'https://example.com/science-fair-2024.jpg', 'academic', '2024-09-15'),
('Cultural Program 2024', 'Students performing traditional dances and songs', 'https://example.com/cultural-program-2024.jpg', 'cultural', '2024-10-02');
```

---

### 6. **Testing the Setup**

#### 6.1 Test Database Connection
1. Go to **SQL Editor** in Supabase
2. Run this query to test the setup:
```sql
-- Test query to verify all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('admin_users', 'announcements', 'leadership_team', 'learning_materials', 'school_life_gallery');
```

#### 6.2 Test Admin Function
```sql
-- Test admin function (should return false for non-admin users)
SELECT public.check_admin_status();
```

#### 6.3 Test RLS Policies
```sql
-- Test public read access
SELECT COUNT(*) FROM public.announcements;
SELECT COUNT(*) FROM public.leadership_team;
SELECT COUNT(*) FROM public.learning_materials;
SELECT COUNT(*) FROM public.school_life_gallery;
```

---

### 7. **Environment Variables Setup**

For production deployment, create these environment variables:

```bash
# Production Environment Variables
VITE_SUPABASE_URL=https://plgjavfrwcphrehmthdv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsZ2phdmZyd2NwaHJlaG10aGR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2ODE3ODcsImV4cCI6MjA2NzI1Nzc4N30.73hjYMk1hrqiuhFV-AoVtbRdYc6biciDqnFhtz4sq5o
VITE_ADMIN_PASSKEY=143143
```

---

### 8. **Final Checklist**

Before going live, ensure:

- [ ] All tables are created and indexed
- [ ] RLS policies are enabled and configured
- [ ] Storage buckets are created with proper policies
- [ ] Authentication is configured correctly
- [ ] Sample data is inserted (if needed)
- [ ] Admin function is working
- [ ] All policies are tested
- [ ] Environment variables are set
- [ ] Site URL and redirect URLs are configured

---

### 9. **Common Issues and Solutions**

#### Issue: "Admin function not working"
**Solution**: Ensure the function is created with `SECURITY DEFINER` and the admin_users table has proper foreign key constraints.

#### Issue: "RLS policies blocking access"
**Solution**: Check that the policies are correctly written and the admin function returns the expected boolean value.

#### Issue: "File upload not working"
**Solution**: Verify storage buckets exist and have proper INSERT policies for authenticated users.

#### Issue: "Authentication redirect not working"
**Solution**: Check that the Site URL and Redirect URLs are correctly configured in Authentication settings.

---

### 🎉 **Setup Complete!**

Once all these steps are completed, your Supabase database will be fully configured to support the St. G. D. Convent School portal with:

- ✅ Secure authentication system
- ✅ Content management capabilities
- ✅ File upload and storage
- ✅ Role-based access control
- ✅ Public content access
- ✅ Admin-only modification rights

The application will be ready to handle all the features described in the authentication documentation!
