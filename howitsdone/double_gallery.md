# 🖼️ Double Gallery System - Nested Gallery Implementation

## 📋 Overview
This system allows creating gallery groups (like "Jaipur Trip") that contain multiple images. Each group has a title, description, and contains multiple gallery items.

---

## 🗄️ Database Schema Changes

### 1. Create Gallery Groups Table
```sql
-- Create gallery_groups table for organizing collections of images
CREATE TABLE gallery_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    category VARCHAR(100),
    date_taken DATE,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add index for better performance
CREATE INDEX idx_gallery_groups_category ON gallery_groups(category);
CREATE INDEX idx_gallery_groups_display_order ON gallery_groups(display_order);
CREATE INDEX idx_gallery_groups_date_taken ON gallery_groups(date_taken);
```

### 2. Create Gallery Items Table (Images within groups)
```sql
-- Create gallery_items table for individual images within groups
CREATE TABLE gallery_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES gallery_groups(id) ON DELETE CASCADE,
    title VARCHAR(255),
    description TEXT,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX idx_gallery_items_group_id ON gallery_items(group_id);
CREATE INDEX idx_gallery_items_display_order ON gallery_items(display_order);
```

### 3. Enable Row Level Security
```sql
-- Enable RLS on new tables
ALTER TABLE gallery_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON gallery_groups
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON gallery_items
    FOR SELECT USING (true);

-- Create policies for authenticated admin access
CREATE POLICY "Enable all operations for authenticated users" ON gallery_groups
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON gallery_items
    FOR ALL USING (auth.role() = 'authenticated');
```

### 4. Create Storage Buckets for Gallery Groups
```sql
-- Insert new storage buckets for gallery groups
INSERT INTO storage.buckets (id, name, public) VALUES 
('gallery-groups', 'gallery-groups', true),
('gallery-items', 'gallery-items', true);

-- Create storage policies for gallery groups
CREATE POLICY "Gallery group images are publicly accessible" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'gallery-groups');

CREATE POLICY "Anyone can upload gallery group images" 
    ON storage.objects FOR INSERT 
    WITH CHECK (bucket_id = 'gallery-groups');

CREATE POLICY "Anyone can update gallery group images" 
    ON storage.objects FOR UPDATE 
    USING (bucket_id = 'gallery-groups');

CREATE POLICY "Anyone can delete gallery group images" 
    ON storage.objects FOR DELETE 
    USING (bucket_id = 'gallery-groups');

-- Create storage policies for gallery items
CREATE POLICY "Gallery item images are publicly accessible" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'gallery-items');

CREATE POLICY "Anyone can upload gallery item images" 
    ON storage.objects FOR INSERT 
    WITH CHECK (bucket_id = 'gallery-items');

CREATE POLICY "Anyone can update gallery item images" 
    ON storage.objects FOR UPDATE 
    USING (bucket_id = 'gallery-items');

CREATE POLICY "Anyone can delete gallery item images" 
    ON storage.objects FOR DELETE 
    USING (bucket_id = 'gallery-items');
```

### 5. Insert Sample Data
```sql
-- Insert sample gallery groups
INSERT INTO gallery_groups (title, description, category, date_taken, display_order) VALUES 
('Jaipur Educational Trip', 'Students visit to Pink City exploring historical monuments and cultural heritage', 'Educational Trips', '2024-03-15', 1),
('Annual Sports Day 2024', 'Inter-house sports competition showcasing student athletic talents', 'Sports Events', '2024-02-28', 2),
('Science Exhibition', 'Student projects and experiments displayed for school community', 'Academic Events', '2024-01-20', 3),
('Cultural Fest Celebration', 'Traditional dance, music and drama performances by students', 'Cultural Events', '2024-12-15', 4),
('Republic Day Celebration', 'Patriotic celebration with flag hoisting and cultural programs', 'National Events', '2024-01-26', 5),
('Graduation Ceremony', 'Farewell ceremony for outgoing senior students', 'Ceremonies', '2024-04-10', 6);

-- Insert sample gallery items for Jaipur trip
INSERT INTO gallery_items (group_id, title, description, image_url, display_order) VALUES 
((SELECT id FROM gallery_groups WHERE title = 'Jaipur Educational Trip'), 'Hawa Mahal Visit', 'Students exploring the Palace of Winds', 'https://images.unsplash.com/photo-1599661046289-e31897846e41?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 1),
((SELECT id FROM gallery_groups WHERE title = 'Jaipur Educational Trip'), 'City Palace Tour', 'Group photo at the magnificent City Palace', 'https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 2),
((SELECT id FROM gallery_groups WHERE title = 'Jaipur Educational Trip'), 'Amber Fort Exploration', 'Students learning about Rajput architecture', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 3),
((SELECT id FROM gallery_groups WHERE title = 'Jaipur Educational Trip'), 'Local Market Experience', 'Students experiencing local culture and crafts', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 4);

-- Insert sample gallery items for Sports Day
INSERT INTO gallery_items (group_id, title, description, image_url, display_order) VALUES 
((SELECT id FROM gallery_groups WHERE title = 'Annual Sports Day 2024'), 'Opening Ceremony', 'Sports day inauguration with torch lighting', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 1),
((SELECT id FROM gallery_groups WHERE title = 'Annual Sports Day 2024'), '100m Sprint Race', 'Students competing in track events', 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 2),
((SELECT id FROM gallery_groups WHERE title = 'Annual Sports Day 2024'), 'Medal Ceremony', 'Winners receiving their well-deserved medals', 'https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 3);
```

### 6. Create Helper Functions
```sql
-- Function to get all active gallery groups with their item count
CREATE OR REPLACE FUNCTION get_gallery_groups_with_count()
RETURNS TABLE(
    id UUID,
    title VARCHAR(255),
    description TEXT,
    cover_image_url TEXT,
    category VARCHAR(100),
    date_taken DATE,
    display_order INTEGER,
    item_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        gg.id,
        gg.title,
        gg.description,
        gg.cover_image_url,
        gg.category,
        gg.date_taken,
        gg.display_order,
        COUNT(gi.id) as item_count
    FROM gallery_groups gg
    LEFT JOIN gallery_items gi ON gg.id = gi.group_id AND gi.is_active = true
    WHERE gg.is_active = true
    GROUP BY gg.id, gg.title, gg.description, gg.cover_image_url, gg.category, gg.date_taken, gg.display_order
    ORDER BY gg.display_order ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to get all items in a gallery group
CREATE OR REPLACE FUNCTION get_gallery_items_by_group(group_uuid UUID)
RETURNS TABLE(
    id UUID,
    title VARCHAR(255),
    description TEXT,
    image_url TEXT,
    alt_text VARCHAR(255),
    display_order INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        gi.id,
        gi.title,
        gi.description,
        gi.image_url,
        gi.alt_text,
        gi.display_order
    FROM gallery_items gi
    WHERE gi.group_id = group_uuid AND gi.is_active = true
    ORDER BY gi.display_order ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to update display orders
CREATE OR REPLACE FUNCTION update_gallery_group_order(group_ids UUID[], new_orders INTEGER[])
RETURNS VOID AS $$
DECLARE
    i INTEGER;
BEGIN
    FOR i IN 1..array_length(group_ids, 1) LOOP
        UPDATE gallery_groups 
        SET display_order = new_orders[i], updated_at = CURRENT_TIMESTAMP
        WHERE id = group_ids[i];
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to update gallery item orders within a group
CREATE OR REPLACE FUNCTION update_gallery_item_order(item_ids UUID[], new_orders INTEGER[])
RETURNS VOID AS $$
DECLARE
    i INTEGER;
BEGIN
    FOR i IN 1..array_length(item_ids, 1) LOOP
        UPDATE gallery_items 
        SET display_order = new_orders[i], updated_at = CURRENT_TIMESTAMP
        WHERE id = item_ids[i];
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```

### 7. Migration from Existing Gallery (Optional)
```sql
-- If you want to migrate existing gallery items to the new structure
-- First, create a default group for existing items
INSERT INTO gallery_groups (id, title, description, category, display_order) 
VALUES ('00000000-0000-0000-0000-000000000001', 'Legacy Gallery', 'Migrated from old gallery system', 'General', 0);

-- Then migrate existing items (uncomment if needed)
-- INSERT INTO gallery_items (group_id, title, description, image_url, display_order)
-- SELECT 
--     '00000000-0000-0000-0000-000000000001'::UUID,
--     title,
--     description,
--     image_url,
--     ROW_NUMBER() OVER (ORDER BY created_at)
-- FROM school_life_gallery
-- WHERE created_at < CURRENT_TIMESTAMP;
```

### 8. Add Triggers for Updated_at
```sql
-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for both tables
CREATE TRIGGER update_gallery_groups_updated_at
    BEFORE UPDATE ON gallery_groups
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_items_updated_at
    BEFORE UPDATE ON gallery_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

---

## 🔧 TypeScript Types Update

After running the SQL commands, update your TypeScript types:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/integrations/supabase/types.ts
```

---

## 📋 Implementation Checklist

### Database Setup:
- [ ] Run gallery_groups table creation
- [ ] Run gallery_items table creation  
- [ ] Enable RLS policies
- [ ] Create storage buckets
- [ ] Insert sample data
- [ ] Create helper functions
- [ ] Add triggers for updated_at
- [ ] Regenerate TypeScript types

### Admin Dashboard Updates Needed:
- [ ] Update GalleryEditor component to handle groups
- [ ] Add group creation and management UI
- [ ] Add multiple image upload within groups
- [ ] Add drag-and-drop reordering
- [ ] Update ContentService with new methods
- [ ] Add group preview functionality

### Frontend Gallery Updates:
- [ ] Update Gallery page to show groups
- [ ] Add group detail view
- [ ] Add image lightbox/carousel
- [ ] Update responsive design

---

## 🚀 Benefits of This Structure

1. **Organized Content**: Group related images together (trips, events, etc.)
2. **Better Navigation**: Users can browse by event/category
3. **Scalable**: Easy to add new groups and manage large numbers of images
4. **SEO Friendly**: Better organization for search engines
5. **Admin Friendly**: Easier content management for school staff
6. **Performance**: Better loading with grouped content

---

## 📱 User Experience Flow

1. **Admin Creates Group**: "Jaipur Trip" with description and cover image
2. **Admin Uploads Images**: Multiple images to the group with individual titles
3. **Admin Organizes**: Drag and drop to reorder images within group
4. **Public Views Groups**: Gallery page shows event cards with cover images
5. **Public Views Details**: Click to see all images in that group/event
6. **Public Browses**: Navigate between different groups/events

This structure provides a much more organized and scalable gallery system that matches how schools actually organize and present their photo content!
