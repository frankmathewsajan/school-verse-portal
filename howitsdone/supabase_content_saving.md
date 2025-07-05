# Supabase Content Management Setup

This document describes the database schema and manual setup required for the dynamic content management system.

## Database Tables Required

You need to create the following tables in your Supabase database:

### 1. Hero Section Table
```sql
CREATE TABLE public.hero_section (
    id text NOT NULL DEFAULT 'main'::text,
    title text NOT NULL,
    subtitle text NOT NULL,
    description text,
    image_url text,
    image_description text,
    primary_button_text text,
    primary_button_link text,
    secondary_button_text text,
    secondary_button_link text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT hero_section_pkey PRIMARY KEY (id)
);
```

### 2. About Section Table
```sql
CREATE TABLE public.about_section (
    id text NOT NULL DEFAULT 'main'::text,
    title text NOT NULL,
    subtitle text,
    main_content jsonb,
    principal_message text,
    principal_name text,
    principal_title text,
    principal_image_url text,
    school_founded_year integer,
    school_description text,
    features jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT about_section_pkey PRIMARY KEY (id)
);
```

### 3. Vision Section Table
```sql
CREATE TABLE public.vision_section (
    id text NOT NULL DEFAULT 'main'::text,
    title text NOT NULL,
    subtitle text,
    main_content text,
    principal_message text,
    principal_name text,
    principal_title text,
    features jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT vision_section_pkey PRIMARY KEY (id)
);
```

### 4. Announcements Table (Updated)
```sql
-- Update existing announcements table
ALTER TABLE public.announcements 
ADD COLUMN IF NOT EXISTS type text,
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();
```

### 5. School Life Gallery Table (Updated)
```sql
-- Verify the existing table has the right structure
-- No changes needed if it already exists from previous setup
```

### 6. Learning Materials Table (Updated)
```sql
-- Verify the existing table has the right structure
-- No changes needed if it already exists from previous setup
```

### 7. Leadership Team Table (Updated)
```sql
-- Verify the existing table has the right structure
-- No changes needed if it already exists from previous setup
```

## Row Level Security (RLS) Policies

Apply these RLS policies to secure the new tables:

### Hero Section RLS
```sql
-- Enable RLS
ALTER TABLE public.hero_section ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON public.hero_section
    FOR SELECT USING (true);

-- Allow admin write access
CREATE POLICY "Allow admin write access" ON public.hero_section
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE user_id = auth.uid()
        )
    );
```

### About Section RLS
```sql
-- Enable RLS
ALTER TABLE public.about_section ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON public.about_section
    FOR SELECT USING (true);

-- Allow admin write access
CREATE POLICY "Allow admin write access" ON public.about_section
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE user_id = auth.uid()
        )
    );
```

### Vision Section RLS
```sql
-- Enable RLS
ALTER TABLE public.vision_section ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON public.vision_section
    FOR SELECT USING (true);

-- Allow admin write access
CREATE POLICY "Allow admin write access" ON public.vision_section
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE user_id = auth.uid()
        )
    );
```

## Sample Data

Insert default data for the new sections:

### Hero Section Default Data
```sql
INSERT INTO public.hero_section (
    id, title, subtitle, description, image_url, image_description,
    primary_button_text, primary_button_link,
    secondary_button_text, secondary_button_link
) VALUES (
    'main',
    'Welcome to St. G. D. Convent School',
    'Empowering students through innovative education and comprehensive learning experiences. Discover a vibrant community dedicated to academic excellence.',
    null,
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    'Students learning together',
    'Explore Gallery',
    '/gallery',
    'Learning Materials',
    '/materials'
) ON CONFLICT (id) DO NOTHING;
```

### About Section Default Data
```sql
INSERT INTO public.about_section (
    id, title, subtitle, main_content, principal_message,
    principal_name, principal_title, principal_image_url,
    school_founded_year, features
) VALUES (
    'main',
    'About Our School',
    'Excellence in education through innovative teaching and comprehensive curriculum',
    '["St. G. D. Convent School is a leading educational institution committed to providing a balanced and stimulating learning environment where students can achieve academic excellence and personal growth.", "Our comprehensive curriculum is designed to develop critical thinking, creativity, and problem-solving skills, preparing students for success in higher education and beyond.", "We pride ourselves on small class sizes, dedicated teachers, and a supportive community that nurtures each student''s individual talents and abilities."]'::jsonb,
    'Education is not just about academic achievement, but about nurturing curious minds, compassionate hearts, and resilient spirits. At St. G. D. Convent School, we are committed to guiding each student on their unique journey of growth and discovery.',
    'Mr. Ashirwad Goyal',
    'Principal, St. G. D. Convent School',
    'https://randomuser.me/api/portraits/women/45.jpg',
    1985,
    '[{"title": "Founded in 1985", "description": "With decades of educational excellence and a strong foundation in values-based learning"}, {"title": "Diverse Community", "description": "Creating an inclusive environment where every student feels valued and empowered"}, {"title": "Comprehensive Curriculum", "description": "Balancing academic rigor with holistic development for well-rounded education"}, {"title": "Academic Excellence", "description": "Consistent record of outstanding achievements in academics and extracurriculars"}]'::jsonb
) ON CONFLICT (id) DO NOTHING;
```

### Vision Section Default Data
```sql
INSERT INTO public.vision_section (
    id, title, subtitle, main_content, principal_message,
    principal_name, principal_title, features
) VALUES (
    'main',
    'Our Vision & Mission',
    'Fostering a learning environment that nurtures excellence, character, and lifelong learning',
    'At SchoolVerse Academy, we believe in providing an education that goes beyond textbooks. Our vision is to create a nurturing environment where students can discover their potential, develop critical skills, and become responsible global citizens prepared for the challenges of tomorrow.',
    'Education is not just about academic achievement, but about nurturing curious minds, compassionate hearts, and resilient spirits. At SchoolVerse, we are committed to guiding each student on their unique journey of growth and discovery.',
    'Dr. Ashirwad Goel',
    'Principal, St.G.D.Convent School',
    '[{"title": "Academic Excellence", "description": "We maintain high academic standards through innovative teaching methods and comprehensive curriculum."}, {"title": "Inclusive Community", "description": "Our diverse and supportive environment ensures every student feels valued and empowered to succeed."}, {"title": "Holistic Development", "description": "We focus on developing well-rounded individuals through academic, social, and extracurricular activities."}, {"title": "Future-Ready Skills", "description": "Our programs equip students with critical thinking, creativity, and technological skills for future success."}]'::jsonb
) ON CONFLICT (id) DO NOTHING;
```

## Features Implemented

### Admin Dashboard Integration
- ✅ **Hero Section Editor**: Edit main title, subtitle, button texts and links, image settings
- ✅ **About Section Editor**: Edit school information, principal's message, features, and leadership team
- ✅ **Announcements Editor**: Create, edit, and delete school announcements with real-time sync
- ✅ **Gallery Editor**: Upload and manage school life photos with categories
- ✅ **Materials Editor**: Upload and manage learning materials by subject and grade
- ✅ **Real-time Sync**: All changes are immediately saved to Supabase and reflected on the homepage

### Frontend Integration
- ✅ **Dynamic Content Loading**: All home page sections load content from Supabase
- ✅ **Fallback Content**: Default content is shown if database is empty
- ✅ **Real-time Updates**: Content updates immediately when changed in admin panel
- ✅ **Responsive Design**: All sections maintain responsive design with dynamic content

### Security Features
- ✅ **Row Level Security**: Public read access, admin-only write access
- ✅ **Authentication Required**: Only authenticated admins can edit content
- ✅ **Input Validation**: Proper validation and error handling for all inputs
- ✅ **Safe JSON Handling**: Proper handling of JSON data for features and content arrays

## Admin Portal Access

1. **Login**: Visit `/admin/login`
2. **Sign Up**: Use allowed domains (gmail.com, outlook.com, hotmail.com)
3. **Verify Email**: Check email for verification link
4. **Enter Passkey**: Use `143143` for admin access
5. **Edit Content**: Use the tabbed interface to edit different sections:
   - **Hero**: Main homepage banner content
   - **About**: School information and leadership
   - **Announcements**: Latest news and updates
   - **Gallery**: Photo management
   - **Materials**: Learning resources
   - **Settings**: System configuration

## Database Migration Summary

If you're updating an existing system, you only need to:

1. Create the 3 new tables (hero_section, about_section, vision_section)
2. Apply RLS policies to the new tables
3. Insert default data
4. The existing tables (announcements, school_life_gallery, learning_materials, leadership_team) should work as-is

All sections are now fully editable through the admin portal and sync in real-time with the Supabase database!