import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://plgjavfrwcphrehmthdv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsZ2phdmZyd2NwaHJlaG10aGR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2ODE3ODcsImV4cCI6MjA2NzI1Nzc4N30.73hjYMk1hrqiuhFV-AoVtbRdYc6biciDqnFhtz4sq5o";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testFacilitiesTable() {
  try {
    console.log('🧪 Testing facilities table...');
    
    // Test if the table exists by trying to fetch data
    const { data, error } = await supabase
      .from('school_facilities')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Table does not exist yet:', error.message);
      console.log('\n📋 Please run the following SQL in your Supabase dashboard:');
      console.log('=====================================');
      console.log(`
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

-- Create policy for public read access
DROP POLICY IF EXISTS "Enable read access for all users" ON school_facilities;
CREATE POLICY "Enable read access for all users" ON school_facilities
    FOR SELECT USING (true);

-- Create policy for authenticated admin access
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON school_facilities;
CREATE POLICY "Enable all operations for authenticated users" ON school_facilities
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample data
INSERT INTO school_facilities (title, description, image_url, display_order, is_active) VALUES 
('Modern Library', 'Our extensive library houses over 20,000 books, digital resources, and quiet study spaces for students of all levels.', 'https://images.unsplash.com/photo-1517031350709-19e7df358b75?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80', 1, true),
('Science Laboratories', 'Fully equipped labs for physics, chemistry, and biology with modern experimental apparatus and safety equipment.', 'https://images.unsplash.com/photo-1564069114553-7215e1ff1890?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80', 2, true),
('Sports Complex', 'Indoor and outdoor sports facilities including a gymnasium, swimming pool, basketball court, and athletic fields.', 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1772&q=80', 3, true),
('Auditorium', 'A 500-seat auditorium equipped with modern sound and lighting systems for performances, assemblies, and community events.', 'https://images.unsplash.com/photo-1571260899304-425eee4c7efd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80', 4, true),
('Technology Center', 'Computer labs with the latest hardware and software for digital learning, coding, and research projects.', 'https://images.unsplash.com/photo-1589652717521-10c0d092dea9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80', 5, true),
('Arts Center', 'Studios for visual arts, music, and performing arts with professional equipment and dedicated practice rooms.', 'https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80', 6, true);
      `);
      console.log('=====================================');
      console.log('\n🔗 Go to: https://plgjavfrwcphrehmthdv.supabase.co/project/plgjavfrwcphrehmthdv/sql');
      
      return false;
    }
    
    console.log('✅ Facilities table exists!');
    console.log(`📊 Found ${data?.length || 0} facilities in the table`);
    
    if (data && data.length > 0) {
      console.log('🏢 Sample facilities:');
      data.forEach((facility) => {
        console.log(`  - ${facility.title}`);
      });
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

testFacilitiesTable().then((success) => {
  process.exit(success ? 0 : 1);
});
