import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample gallery data
const galleryData = [
  {
    title: "Science Exhibition",
    description: "Students showcase their innovative science projects",
    image_url: "https://images.unsplash.com/photo-1581812873626-cdc86de0d916?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    category: "Academic",
    date_taken: "2025-03-15"
  },
  {
    title: "Annual Sports Day",
    description: "Annual sports competition with various athletics events",
    image_url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    category: "Sports",
    date_taken: "2025-02-20"
  },
  {
    title: "Cultural Festival",
    description: "Celebration of diverse cultures with performances and exhibitions",
    image_url: "https://images.unsplash.com/photo-1511424400163-1c66a2d5b3ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    category: "Cultural",
    date_taken: "2025-01-25"
  },
  {
    title: "Graduation Ceremony",
    description: "Graduation ceremony for our accomplished students",
    image_url: "https://images.unsplash.com/photo-1627556704302-624286467c65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    category: "Event",
    date_taken: "2024-12-15"
  },
  {
    title: "Art Exhibition",
    description: "Student artwork display showcasing creativity and talent",
    image_url: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    category: "Arts",
    date_taken: "2024-11-10"
  },
  {
    title: "Science Fair",
    description: "Interactive science fair with experiments and demonstrations",
    image_url: "https://images.unsplash.com/photo-1561525140-c2a4cc68e4bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    category: "Academic",
    date_taken: "2024-10-05"
  },
  {
    title: "Music Concert",
    description: "Musical performances by our talented students",
    image_url: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    category: "Cultural",
    date_taken: "2024-09-20"
  },
  {
    title: "Field Trip",
    description: "Educational field trip to enhance learning experiences",
    image_url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    category: "Excursion",
    date_taken: "2024-08-15"
  },
  {
    title: "Basketball Tournament",
    description: "Inter-school basketball championship tournament",
    image_url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1780&q=80",
    category: "Sports",
    date_taken: "2024-07-10"
  },
  {
    title: "Robotics Workshop",
    description: "Hands-on robotics workshop for STEM education",
    image_url: "https://images.unsplash.com/photo-1671751412361-73ccaa653db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    category: "Academic",
    date_taken: "2024-06-25"
  },
  {
    title: "Swimming Competition",
    description: "Annual swimming competition with various stroke categories",
    image_url: "https://images.unsplash.com/photo-1622629797619-c100e3e67e2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1776&q=80",
    category: "Sports",
    date_taken: "2024-05-20"
  },
  {
    title: "Drama Performance",
    description: "Theatrical performance showcasing dramatic arts",
    image_url: "https://images.unsplash.com/photo-1588680215558-d7343516c1c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1772&q=80",
    category: "Cultural",
    date_taken: "2024-04-15"
  }
];

async function populateGallery() {
  try {
    console.log('🚀 Starting gallery population...');
    
    // Check if table exists and has data
    const { data: existingData, error: checkError } = await supabase
      .from('school_life_gallery')
      .select('id')
      .limit(1);
    
    if (checkError) {
      console.error('❌ Error checking existing data:', checkError);
      return;
    }
    
    if (existingData && existingData.length > 0) {
      console.log('⚠️  Gallery table already has data. Skipping population.');
      console.log('   If you want to repopulate, please clear the table first.');
      return;
    }
    
    // Insert all gallery items
    const { data, error } = await supabase
      .from('school_life_gallery')
      .insert(galleryData)
      .select();
    
    if (error) {
      console.error('❌ Error inserting gallery data:', error);
      return;
    }
    
    console.log('✅ Successfully inserted', data.length, 'gallery items');
    console.log('🎉 Gallery population complete!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the script
populateGallery();
