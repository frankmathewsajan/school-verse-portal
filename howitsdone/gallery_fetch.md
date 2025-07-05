# Gallery Database Setup Guide

## Overview
This guide explains how to set up the gallery system in Supabase and integrate it with the React frontend.

## Database Setup

# Gallery Database Setup Guide

## Overview
This guide explains how to set up the gallery system in Supabase using the existing `school_life_gallery` table and integrate it with the React frontend.

## Prerequisites

### 1. Environment Variables Setup
Create a `.env` file in your project root with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project dashboard under Settings > API.

## Database Setup

### 1. Use Existing Gallery Table

The gallery system uses the existing `school_life_gallery` table in Supabase with the following structure:

```sql
-- The table already exists with this structure:
-- school_life_gallery (
--   id: string (UUID, Primary Key)
--   title: string (NOT NULL)
--   description: string (nullable)
--   image_url: string (NOT NULL)
--   category: string (nullable)
--   date_taken: string (nullable, ISO date)
--   created_at: string (nullable, ISO timestamp)
-- )
```

### 2. Insert Sample Data

Run the following SQL to populate the gallery with sample data:

```sql
-- Insert the gallery sample data
INSERT INTO school_life_gallery (title, description, image_url, category, date_taken) VALUES
('Science Exhibition', 'Students showcase their innovative science projects', 'https://images.unsplash.com/photo-1581812873626-cdc86de0d916?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80', 'Academic', '2025-03-15'),
('Annual Sports Day', 'Annual sports competition with various athletics events', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80', 'Sports', '2025-02-20'),
('Cultural Festival', 'Celebration of diverse cultures with performances and exhibitions', 'https://images.unsplash.com/photo-1511424400163-1c66a2d5b3ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80', 'Cultural', '2025-01-25'),
('Graduation Ceremony', 'Graduation ceremony for our accomplished students', 'https://images.unsplash.com/photo-1627556704302-624286467c65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80', 'Event', '2024-12-15'),
('Art Exhibition', 'Student artwork display showcasing creativity and talent', 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80', 'Arts', '2024-11-10'),
('Science Fair', 'Interactive science fair with experiments and demonstrations', 'https://images.unsplash.com/photo-1561525140-c2a4cc68e4bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80', 'Academic', '2024-10-05'),
('Music Concert', 'Musical performances by our talented students', 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80', 'Cultural', '2024-09-20'),
('Field Trip', 'Educational field trip to enhance learning experiences', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80', 'Excursion', '2024-08-15'),
('Basketball Tournament', 'Inter-school basketball championship tournament', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1780&q=80', 'Sports', '2024-07-10'),
('Robotics Workshop', 'Hands-on robotics workshop for STEM education', 'https://images.unsplash.com/photo-1671751412361-73ccaa653db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80', 'Academic', '2024-06-25'),
('Swimming Competition', 'Annual swimming competition with various stroke categories', 'https://images.unsplash.com/photo-1622629797619-c100e3e67e2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1776&q=80', 'Sports', '2024-05-20'),
('Drama Performance', 'Theatrical performance showcasing dramatic arts', 'https://images.unsplash.com/photo-1588680215558-d7343516c1c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1772&q=80', 'Cultural', '2024-04-15');
```

### 3. Enable Row Level Security (RLS) - Optional

If you want to restrict access, you can enable RLS:

```sql
-- Enable RLS on the school_life_gallery table
ALTER TABLE school_life_gallery ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Enable read access for all users" ON school_life_gallery
    FOR SELECT USING (true);

-- Create policy for authenticated users to manage gallery items (admin only)
CREATE POLICY "Enable full access for authenticated users" ON school_life_gallery
    FOR ALL USING (auth.role() = 'authenticated');
```

### 4. Populate Gallery Data (Optional)

A population script is provided to insert sample data:

```bash
# Install dependencies
npm install dotenv

# Run the population script
node scripts/populate-gallery.js
```

The script will:
- Check if the table already has data
- Insert all 12 sample gallery items if table is empty
- Skip population if data already exists

## Manual SQL Insert (Alternative)

If you prefer to insert data manually, run this SQL in your Supabase SQL editor:

## Frontend Integration

### 1. Gallery Data Type
The gallery items use the existing Supabase table structure:

```typescript
interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  date_taken: string | null;
  created_at: string | null;
}
```

### 2. Service Methods Available

The ContentService includes these methods:

```typescript
// Get all gallery items for public view
getGalleryItems(): Promise<GalleryItem[]>

// Get all gallery items for admin management
getAllGalleryItems(): Promise<GalleryItem[]>

// Create new gallery item
createGalleryItem(item: Omit<GalleryItem, 'id' | 'created_at'>): Promise<boolean>

// Update gallery item
updateGalleryItem(id: string, updates: Partial<GalleryItem>): Promise<boolean>

// Delete gallery item
deleteGalleryItem(id: string): Promise<boolean>
```

### 3. Real-time Updates

The gallery supports real-time updates using custom events:
- `galleryUpdated` - triggered when gallery items are modified
- Frontend components listen for these events to refresh data

## Usage in Components

### Gallery Page (Public View)
- Uses `getGalleryItems()` to fetch all gallery items
- Listens for `galleryUpdated` events to refresh data
- Supports filtering by category and search functionality
- Handles loading and error states

### Admin Gallery Editor
- Uses `getAllGalleryItems()` to show all items
- Provides CRUD operations for managing gallery items
- Supports image URL management
- Includes bulk operations capability

## Database Schema Summary

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | VARCHAR | Gallery item title |
| description | TEXT | Optional description |
| image_url | TEXT | URL to the image |
| category | VARCHAR | Category (Academic, Sports, Cultural, etc.) |
| date_taken | DATE | Event/photo date |
| created_at | TIMESTAMP | Creation timestamp |

## Categories Used
- Academic
- Sports
- Cultural
- Event
- Arts
- Excursion

## Notes
- Images are stored as URLs (external hosting like Unsplash or CDN)
- All dates are stored in ISO format for consistent sorting
- Gallery items are ordered by date_taken (newest first)
- RLS can be enabled for access control
- Frontend includes proper error handling and loading states
