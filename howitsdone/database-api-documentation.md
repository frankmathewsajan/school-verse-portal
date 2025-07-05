# Database Schema & API Documentation

## 🗄️ Database Architecture Overview

The School-Verse-Portal uses Supabase (PostgreSQL) as its backend database with a well-structured schema designed for content management, scalability, and performance.

## 📊 Database Schema

### **Core Tables Structure**

```sql
-- Table relationships and constraints
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Core content tables with audit fields
```

## 📋 Table Definitions

### **1. Hero Section** (`hero_section`)

**Purpose**: Stores main banner content for the homepage

```sql
CREATE TABLE hero_section (
    id TEXT PRIMARY KEY DEFAULT 'main',
    title TEXT NOT NULL DEFAULT 'Welcome to St. G. D. Convent School',
    subtitle TEXT DEFAULT 'Empowering students through innovative education',
    description TEXT,
    image_url TEXT,
    image_description TEXT,
    primary_button_text TEXT,
    primary_button_link TEXT,
    secondary_button_text TEXT,
    secondary_button_link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Features**:
- **Singleton Pattern**: Only one record with id='main'
- **Flexible CTAs**: Two customizable call-to-action buttons
- **Image Management**: URL and alt text storage
- **Audit Trail**: Created and updated timestamps

**Constraints**:
- Primary key ensures single record
- NOT NULL on essential fields
- Default values for common content

---

### **2. About Section** (`about_section`)

**Purpose**: School information, principal details, and features

```sql
CREATE TABLE about_section (
    id TEXT PRIMARY KEY DEFAULT 'main',
    title TEXT NOT NULL DEFAULT 'About Our School',
    subtitle TEXT,
    main_content JSONB,
    principal_message TEXT,
    principal_name TEXT,
    principal_title TEXT,
    principal_image_url TEXT,
    school_founded_year INTEGER,
    school_description TEXT,
    features JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**JSON Fields Structure**:
```typescript
// main_content structure
{
  "introduction": "School overview text",
  "history": "School history and background",
  "achievements": ["Achievement 1", "Achievement 2"],
  "mission_statement": "Core mission text"
}

// features structure
{
  "academic_excellence": {
    "title": "Academic Excellence",
    "description": "Description text",
    "icon": "book"
  },
  "extracurricular": {
    "title": "Extracurricular Activities",
    "description": "Description text",
    "icon": "activity"
  }
}
```

---

### **3. Vision Section** (`vision_section`)

**Purpose**: Mission, vision, and core values content

```sql
CREATE TABLE vision_section (
    id TEXT PRIMARY KEY DEFAULT 'main',
    title TEXT NOT NULL DEFAULT 'Our Vision & Mission',
    subtitle TEXT,
    main_content TEXT,
    principal_message TEXT,
    principal_name TEXT,
    principal_title TEXT,
    features JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Features JSON Structure**:
```typescript
{
  "mission": {
    "title": "Our Mission",
    "content": "Mission statement text",
    "icon": "target"
  },
  "vision": {
    "title": "Our Vision", 
    "content": "Vision statement text",
    "icon": "eye"
  },
  "values": [
    {
      "name": "Excellence",
      "description": "Striving for excellence in all we do",
      "icon": "star"
    }
  ]
}
```

---

### **4. Announcements** (`announcements`)

**Purpose**: School news, updates, and important notices

```sql
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    is_active BOOLEAN DEFAULT true,
    start_date DATE,
    end_date DATE,
    target_audience TEXT DEFAULT 'all',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_announcements_active ON announcements(is_active);
CREATE INDEX idx_announcements_category ON announcements(category);
CREATE INDEX idx_announcements_priority ON announcements(priority);
CREATE INDEX idx_announcements_dates ON announcements(start_date, end_date);
```

**Category Types**:
- `general`: General school news
- `academic`: Academic-related announcements
- `events`: School events and activities
- `holidays`: Holiday and break notices
- `emergency`: Urgent notifications

**Priority Levels**:
- `low`: Regular updates
- `medium`: Important notices
- `high`: Urgent announcements

---

### **5. School Life Gallery** (`school_life_gallery`)

**Purpose**: Photo galleries showcasing school activities

```sql
CREATE TABLE school_life_gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    is_featured BOOLEAN DEFAULT false,
    tags TEXT[],
    event_date DATE,
    photographer TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for gallery management
CREATE INDEX idx_gallery_category ON school_life_gallery(category);
CREATE INDEX idx_gallery_featured ON school_life_gallery(is_featured);
CREATE INDEX idx_gallery_tags ON school_life_gallery USING GIN(tags);
CREATE INDEX idx_gallery_event_date ON school_life_gallery(event_date);
```

**Gallery Categories**:
- `sports`: Athletic activities and competitions
- `academics`: Classroom and learning activities
- `events`: School events and celebrations
- `facilities`: Campus and infrastructure
- `achievements`: Awards and recognitions

**Tagging System**:
- Array of text tags for flexible categorization
- GIN index for efficient tag searching
- Support for multiple tags per image

---

### **6. Learning Materials** (`learning_materials`)

**Purpose**: Educational resources and downloadable content

```sql
CREATE TABLE learning_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER,
    category TEXT NOT NULL,
    subject TEXT,
    grade_level TEXT,
    is_featured BOOLEAN DEFAULT false,
    download_count INTEGER DEFAULT 0,
    requires_login BOOLEAN DEFAULT false,
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for material management
CREATE INDEX idx_materials_category ON learning_materials(category);
CREATE INDEX idx_materials_subject ON learning_materials(subject);
CREATE INDEX idx_materials_grade ON learning_materials(grade_level);
CREATE INDEX idx_materials_featured ON learning_materials(is_featured);
```

**File Types Supported**:
- `pdf`: PDF documents
- `doc/docx`: Word documents
- `ppt/pptx`: PowerPoint presentations
- `xlsx`: Excel spreadsheets
- `jpg/png`: Images
- `mp4`: Video files

**Categories**:
- `textbooks`: Course textbooks
- `worksheets`: Practice materials
- `presentations`: Educational slides
- `assignments`: Homework and projects
- `references`: Additional reading materials

---

### **7. Leadership Team** (`leadership_team`)

**Purpose**: School staff and administration information

```sql
CREATE TABLE leadership_team (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    department TEXT,
    bio TEXT,
    image_url TEXT,
    email TEXT,
    phone TEXT,
    office_location TEXT,
    qualifications TEXT[],
    experience_years INTEGER,
    specializations TEXT[],
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for staff management
CREATE INDEX idx_leadership_department ON leadership_team(department);
CREATE INDEX idx_leadership_active ON leadership_team(is_active);
CREATE INDEX idx_leadership_order ON leadership_team(display_order);
```

**Department Categories**:
- `administration`: Principal, Vice-principal
- `academic`: Department heads, coordinators
- `support`: Administrative staff
- `special`: Counselors, librarians

## 🔐 Row Level Security (RLS)

### **Security Policies**

```sql
-- Enable RLS on all tables
ALTER TABLE hero_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE vision_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_life_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE leadership_team ENABLE ROW LEVEL SECURITY;

-- Public read access for main content
CREATE POLICY "Public read access" ON hero_section
    FOR SELECT USING (true);

CREATE POLICY "Public read access" ON about_section
    FOR SELECT USING (true);

CREATE POLICY "Public read access" ON vision_section
    FOR SELECT USING (true);

-- Active announcements public read
CREATE POLICY "Public read active announcements" ON announcements
    FOR SELECT USING (is_active = true AND 
                     (start_date IS NULL OR start_date <= CURRENT_DATE) AND
                     (end_date IS NULL OR end_date >= CURRENT_DATE));

-- Gallery public read
CREATE POLICY "Public read gallery" ON school_life_gallery
    FOR SELECT USING (true);

-- Materials read (with optional login requirement)
CREATE POLICY "Public read materials" ON learning_materials
    FOR SELECT USING (requires_login = false OR auth.uid() IS NOT NULL);

-- Leadership public read
CREATE POLICY "Public read leadership" ON leadership_team
    FOR SELECT USING (is_active = true);

-- Admin write access (authenticated users only)
CREATE POLICY "Admin write access" ON hero_section
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin write access" ON about_section
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Repeat for all tables...
```

## 🚀 API Service Layer

### **ContentService Class** (`services/contentService.ts`)

The ContentService provides a clean abstraction layer over Supabase operations.

### **Core Methods**

#### **Hero Section Methods**
```typescript
class ContentService {
  // Get hero section content
  static async getHeroSection(): Promise<HeroSection | null> {
    const { data, error } = await supabase
      .from('hero_section')
      .select('*')
      .single();
    
    if (error) {
      console.error('Error fetching hero section:', error);
      return null;
    }
    
    return data;
  }

  // Update hero section content
  static async updateHeroSection(heroData: Partial<HeroSection>): Promise<boolean> {
    const { error } = await supabase
      .from('hero_section')
      .upsert({
        id: 'main',
        ...heroData,
        updated_at: new Date().toISOString()
      });
    
    return !error;
  }
}
```

#### **Announcements Methods**
```typescript
// Get all active announcements
static async getAnnouncements(): Promise<Announcement[]> {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }
  
  return data || [];
}

// Create new announcement
static async createAnnouncement(announcement: Omit<Announcement, 'id' | 'created_at'>): Promise<boolean> {
  const { error } = await supabase
    .from('announcements')
    .insert([announcement]);
  
  return !error;
}

// Update announcement
static async updateAnnouncement(id: string, announcement: Partial<Announcement>): Promise<boolean> {
  const { error } = await supabase
    .from('announcements')
    .update({
      ...announcement,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);
  
  return !error;
}

// Delete announcement
static async deleteAnnouncement(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('announcements')
    .delete()
    .eq('id', id);
  
  return !error;
}
```

#### **Gallery Methods**
```typescript
// Get gallery items
static async getGalleryItems(category?: string): Promise<GalleryItem[]> {
  let query = supabase
    .from('school_life_gallery')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching gallery items:', error);
    return [];
  }
  
  return data || [];
}

// Get featured gallery items
static async getFeaturedGalleryItems(): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from('school_life_gallery')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false });
  
  return data || [];
}
```

#### **Learning Materials Methods**
```typescript
// Get learning materials
static async getLearningMaterials(grade?: string, subject?: string): Promise<LearningMaterial[]> {
  let query = supabase
    .from('learning_materials')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (grade) {
    query = query.eq('grade_level', grade);
  }
  
  if (subject) {
    query = query.eq('subject', subject);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching learning materials:', error);
    return [];
  }
  
  return data || [];
}

// Increment download count
static async incrementDownloadCount(id: string): Promise<boolean> {
  const { error } = await supabase.rpc('increment_download_count', {
    material_id: id
  });
  
  return !error;
}
```

## 🔄 Real-time Subscriptions

### **Live Data Updates**
```typescript
// Subscribe to announcements changes
const subscribeToAnnouncements = (callback: (announcements: Announcement[]) => void) => {
  return supabase
    .channel('announcements')
    .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'announcements' },
        () => {
          // Refetch data when changes occur
          ContentService.getAnnouncements().then(callback);
        }
    )
    .subscribe();
};

// Subscribe to gallery changes
const subscribeToGallery = (callback: (items: GalleryItem[]) => void) => {
  return supabase
    .channel('gallery')
    .on('postgres_changes',
        { event: '*', schema: 'public', table: 'school_life_gallery' },
        () => {
          ContentService.getGalleryItems().then(callback);
        }
    )
    .subscribe();
};
```

## 🔧 Database Functions

### **Custom PostgreSQL Functions**
```sql
-- Increment download count atomically
CREATE OR REPLACE FUNCTION increment_download_count(material_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE learning_materials 
    SET download_count = download_count + 1,
        updated_at = NOW()
    WHERE id = material_id;
END;
$$ LANGUAGE plpgsql;

-- Get announcement statistics
CREATE OR REPLACE FUNCTION get_announcement_stats()
RETURNS TABLE(
    total_count BIGINT,
    active_count BIGINT,
    high_priority_count BIGINT,
    recent_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_count,
        COUNT(*) FILTER (WHERE is_active = true) as active_count,
        COUNT(*) FILTER (WHERE priority = 'high' AND is_active = true) as high_priority_count,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as recent_count
    FROM announcements;
END;
$$ LANGUAGE plpgsql;

-- Clean up expired announcements
CREATE OR REPLACE FUNCTION cleanup_expired_announcements()
RETURNS INTEGER AS $$
DECLARE
    affected_count INTEGER;
BEGIN
    UPDATE announcements 
    SET is_active = false,
        updated_at = NOW()
    WHERE end_date < CURRENT_DATE 
    AND is_active = true;
    
    GET DIAGNOSTICS affected_count = ROW_COUNT;
    RETURN affected_count;
END;
$$ LANGUAGE plpgsql;
```

## 📈 Performance Optimization

### **Database Indexes**
- **Composite Indexes**: For multi-column queries
- **Partial Indexes**: For filtered queries (active records)
- **GIN Indexes**: For array and JSONB fields
- **Text Search**: Full-text search capabilities

### **Query Optimization**
- **Eager Loading**: Join related data in single queries
- **Pagination**: Limit result sets for large tables
- **Caching**: Application-level caching for frequently accessed data
- **Connection Pooling**: Efficient database connection management

This comprehensive database schema and API design ensures scalable, maintainable, and performant data management for the school website system.
