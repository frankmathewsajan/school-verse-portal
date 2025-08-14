import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://plgjavfrwcphrehmthdv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsZ2phdmZyd2NwaHJlaG10aGR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2ODE3ODcsImV4cCI6MjA2NzI1Nzc4N30.73hjYMk1hrqiuhFV-AoVtbRdYc6biciDqnFhtz4sq5o";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const sampleFacilities = [
  {
    title: 'Modern Library',
    description: 'Our extensive library houses over 20,000 books, digital resources, and quiet study spaces for students of all levels.',
    image_url: 'https://images.unsplash.com/photo-1517031350709-19e7df358b75?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    display_order: 1,
    is_active: true
  },
  {
    title: 'Science Laboratories',
    description: 'Fully equipped labs for physics, chemistry, and biology with modern experimental apparatus and safety equipment.',
    image_url: 'https://images.unsplash.com/photo-1564069114553-7215e1ff1890?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80',
    display_order: 2,
    is_active: true
  },
  {
    title: 'Sports Complex',
    description: 'Indoor and outdoor sports facilities including a gymnasium, swimming pool, basketball court, and athletic fields.',
    image_url: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1772&q=80',
    display_order: 3,
    is_active: true
  },
  {
    title: 'Auditorium',
    description: 'A 500-seat auditorium equipped with modern sound and lighting systems for performances, assemblies, and community events.',
    image_url: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    display_order: 4,
    is_active: true
  },
  {
    title: 'Technology Center',
    description: 'Computer labs with the latest hardware and software for digital learning, coding, and research projects.',
    image_url: 'https://images.unsplash.com/photo-1589652717521-10c0d092dea9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    display_order: 5,
    is_active: true
  },
  {
    title: 'Arts Center',
    description: 'Studios for visual arts, music, and performing arts with professional equipment and dedicated practice rooms.',
    image_url: 'https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80',
    display_order: 6,
    is_active: true
  }
];

async function populateFacilities() {
  try {
    console.log('🏢 Populating facilities table...');
    
    // Check if table is already populated
    const { data: existingData, error: checkError } = await supabase
      .from('school_facilities')
      .select('id')
      .limit(1);
    
    if (checkError) {
      console.error('❌ Error checking existing data:', checkError.message);
      return false;
    }
    
    if (existingData && existingData.length > 0) {
      console.log('ℹ️  Table already has data. Skipping population.');
      return true;
    }
    
    // Insert sample facilities
    const { data, error } = await supabase
      .from('school_facilities')
      .insert(sampleFacilities)
      .select();
    
    if (error) {
      console.error('❌ Error inserting facilities:', error.message);
      return false;
    }
    
    console.log(`✅ Successfully inserted ${data?.length || 0} facilities!`);
    
    // Verify by fetching all facilities
    const { data: allFacilities, error: fetchError } = await supabase
      .from('school_facilities')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (fetchError) {
      console.error('❌ Error fetching facilities:', fetchError.message);
      return false;
    }
    
    console.log('\n🏢 Current facilities in database:');
    allFacilities?.forEach((facility, index) => {
      console.log(`  ${index + 1}. ${facility.title}`);
    });
    
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

populateFacilities().then((success) => {
  console.log(success ? '\n🎉 Facilities setup completed!' : '\n❌ Facilities setup failed!');
  process.exit(success ? 0 : 1);
});
