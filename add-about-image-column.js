// Script to add about_image_url column to about_section table
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function addAboutImageColumn() {
  try {
    console.log('Adding about_image_url column to about_section table...');
    
    // Check if column already exists
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'about_section')
      .eq('column_name', 'about_image_url');
    
    if (columnsError) {
      console.log('Could not check existing columns (this is expected for security reasons)');
    }
    
    // Try to add the column (this will fail if it already exists, which is fine)
    const { error } = await supabase.rpc('exec_sql', {
      query: 'ALTER TABLE about_section ADD COLUMN IF NOT EXISTS about_image_url TEXT;'
    });
    
    if (error) {
      console.log('Note: Could not add column via RPC (expected for security). Column may need to be added manually.');
      console.log('SQL to run manually: ALTER TABLE about_section ADD COLUMN IF NOT EXISTS about_image_url TEXT;');
    } else {
      console.log('Successfully added about_image_url column');
    }
    
    // Test by trying to insert/update a record with the new field
    const { error: testError } = await supabase
      .from('about_section')
      .upsert({
        id: 'main',
        title: 'Test Title',
        about_image_url: 'test_url'
      });
    
    if (testError) {
      console.error('Error testing about_image_url field:', testError.message);
      if (testError.message.includes('about_image_url')) {
        console.log('The about_image_url column does not exist in the database.');
        console.log('Please add it manually with: ALTER TABLE about_section ADD COLUMN about_image_url TEXT;');
      }
    } else {
      console.log('about_image_url field is working correctly!');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

addAboutImageColumn();
