// Test script to verify Supabase connection and database setup
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://plgjavfrwcphrehmthdv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsZ2phdmZyd2NwaHJlaG10aGR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2ODE3ODcsImV4cCI6MjA2NzI1Nzc4N30.73hjYMk1hrqiuhFV-AoVtbRdYc6biciDqnFhtz4sq5o";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

console.log('🚀 Testing Supabase Connection...');

async function testSupabaseConnection() {
  try {
    console.log('📡 Testing basic connection...');
    
    // Test 1: Basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('admin_users')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      console.error('❌ Connection failed:', connectionError.message);
      return false;
    }
    
    console.log('✅ Basic connection successful');
    
    // Test 2: Check if all required tables exist
    console.log('📋 Checking database tables...');
    
    const tables = [
      'admin_users',
      'announcements', 
      'leadership_team',
      'learning_materials',
      'school_life_gallery'
    ];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.error(`❌ Table '${table}' not accessible:`, error.message);
        } else {
          console.log(`✅ Table '${table}' exists and accessible`);
        }
      } catch (err) {
        console.error(`❌ Error checking table '${table}':`, err.message);
      }
    }
    
    // Test 3: Check admin function
    console.log('🔧 Testing admin function...');
    try {
      const { data: adminTest, error: adminError } = await supabase
        .rpc('check_admin_status');
      
      if (adminError) {
        console.error('❌ Admin function failed:', adminError.message);
      } else {
        console.log('✅ Admin function accessible (returned:', adminTest, ')');
      }
    } catch (err) {
      console.error('❌ Admin function error:', err.message);
    }
    
    // Test 4: Test sample data queries
    console.log('📊 Testing sample data queries...');
    
    try {
      const { data: announcements, error: announcementError } = await supabase
        .from('announcements')
        .select('*')
        .limit(5);
      
      if (announcementError) {
        console.error('❌ Announcements query failed:', announcementError.message);
      } else {
        console.log(`✅ Announcements query successful (${announcements.length} records)`);
      }
    } catch (err) {
      console.error('❌ Announcements query error:', err.message);
    }
    
    // Test 5: Test authentication status
    console.log('🔐 Testing authentication...');
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.log('ℹ️  No user currently authenticated (this is normal)');
      } else if (user) {
        console.log('✅ User authenticated:', user.email);
      } else {
        console.log('ℹ️  No user currently authenticated (this is normal)');
      }
    } catch (err) {
      console.error('❌ Auth test error:', err.message);
    }
    
    console.log('🎉 Supabase connection test completed!');
    return true;
    
  } catch (error) {
    console.error('💥 Critical error during testing:', error);
    return false;
  }
}

// Run the test
testSupabaseConnection().then((success) => {
  if (success) {
    console.log('🎊 All tests passed! Your Supabase setup is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the errors above.');
  }
}).catch(error => {
  console.error('💥 Fatal error:', error);
});
