-- Create footer_sections table
CREATE TABLE IF NOT EXISTS footer_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  section_type VARCHAR(50) NOT NULL, -- 'links', 'contact', 'social', 'custom'
  content JSONB NOT NULL DEFAULT '{}',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_footer_sections_active ON footer_sections(is_active);
CREATE INDEX IF NOT EXISTS idx_footer_sections_order ON footer_sections(display_order);
CREATE INDEX IF NOT EXISTS idx_footer_sections_type ON footer_sections(section_type);

-- Insert default footer sections
INSERT INTO footer_sections (title, section_type, content, display_order, is_active) VALUES
('Quick Links', 'links', '{"items": [{"label": "Home", "url": "/"}, {"label": "About", "url": "/about"}, {"label": "Gallery", "url": "/gallery"}, {"label": "Materials", "url": "/materials"}]}', 1, true),
('Contact Info', 'contact', '{"email": "info@schoolverse.edu", "phone": "+1-555-0123", "address": "123 Education St, Learning City, LC 12345"}', 2, true),
('Social Media', 'social', '{"platforms": [{"name": "Facebook", "url": "https://facebook.com/schoolverse", "icon": "facebook"}, {"name": "Twitter", "url": "https://twitter.com/schoolverse", "icon": "twitter"}, {"name": "Instagram", "url": "https://instagram.com/schoolverse", "icon": "instagram"}]}', 3, true),
('About School', 'custom', '{"text": "School Verse Portal is dedicated to providing quality education and fostering a community of learning and growth."}', 4, true)
ON CONFLICT (id) DO NOTHING;

-- Update the updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_footer_sections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_footer_sections_updated_at
    BEFORE UPDATE ON footer_sections
    FOR EACH ROW
    EXECUTE FUNCTION update_footer_sections_updated_at();
