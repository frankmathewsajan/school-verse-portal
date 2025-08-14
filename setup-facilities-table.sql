-- School Facilities Table Setup
-- This script creates the school_facilities table and sets up the necessary policies and sample data

-- Create school_facilities table
CREATE TABLE IF NOT EXISTS school_facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to school_facilities table
DROP TRIGGER IF EXISTS update_school_facilities_updated_at ON school_facilities;
CREATE TRIGGER update_school_facilities_updated_at
    BEFORE UPDATE ON school_facilities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE school_facilities ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (for the About page)
DROP POLICY IF EXISTS "Enable read access for all users" ON school_facilities;
CREATE POLICY "Enable read access for all users" ON school_facilities
    FOR SELECT USING (true);

-- Create policy for authenticated admin access (for the admin panel)
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON school_facilities;
CREATE POLICY "Enable all operations for authenticated users" ON school_facilities
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert default facilities data (only if table is empty)
INSERT INTO school_facilities (title, description, image_url, display_order, is_active) 
SELECT * FROM (VALUES 
    ('Modern Library', 'Our extensive library houses over 20,000 books, digital resources, and quiet study spaces for students of all levels.', 'https://images.unsplash.com/photo-1517031350709-19e7df358b75?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80', 1, true),
    ('Science Laboratories', 'Fully equipped labs for physics, chemistry, and biology with modern experimental apparatus and safety equipment.', 'https://images.unsplash.com/photo-1564069114553-7215e1ff1890?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80', 2, true),
    ('Sports Complex', 'Indoor and outdoor sports facilities including a gymnasium, swimming pool, basketball court, and athletic fields.', 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1772&q=80', 3, true),
    ('Auditorium', 'A 500-seat auditorium equipped with modern sound and lighting systems for performances, assemblies, and community events.', 'https://images.unsplash.com/photo-1571260899304-425eee4c7efd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80', 4, true),
    ('Technology Center', 'Computer labs with the latest hardware and software for digital learning, coding, and research projects.', 'https://images.unsplash.com/photo-1589652717521-10c0d092dea9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80', 5, true),
    ('Arts Center', 'Studios for visual arts, music, and performing arts with professional equipment and dedicated practice rooms.', 'https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80', 6, true)
) AS v(title, description, image_url, display_order, is_active)
WHERE NOT EXISTS (SELECT 1 FROM school_facilities LIMIT 1);

-- Create function to get active facilities ordered by display_order
CREATE OR REPLACE FUNCTION get_active_facilities()
RETURNS TABLE(
    id UUID,
    title VARCHAR(255),
    description TEXT,
    image_url TEXT,
    display_order INTEGER,
    is_active BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT f.id, f.title, f.description, f.image_url, f.display_order, f.is_active, f.created_at, f.updated_at
    FROM school_facilities f
    WHERE f.is_active = true
    ORDER BY f.display_order ASC, f.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
