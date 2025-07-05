#!/usr/bin/env node

/**
 * Simple Node.js script to test Supabase connection and content service
 * Run with: node test-content-integration.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase environment variables not found!');
  console.log('Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔄 Testing Supabase connection...\n');
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('hero_section')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    return false;
  }
}

async function testTables() {
  console.log('\n🔄 Testing database tables...\n');
  
  const tables = [
    'hero_section',
    'about_section', 
    'vision_section',
    'announcements',
    'school_life_gallery',
    'learning_materials',
    'leadership_team'
  ];
  
  const results = {};
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
        results[table] = false;
      } else {
        console.log(`✅ ${table}: Table accessible`);
        results[table] = true;
      }
    } catch (error) {
      console.log(`❌ ${table}: ${error.message}`);
      results[table] = false;
    }
  }
  
  return results;
}

async function testCRUD() {
  console.log('\n🔄 Testing CRUD operations...\n');
  
  try {
    // Test announcement creation
    const { data: createData, error: createError } = await supabase
      .from('announcements')
      .insert({
        title: 'TEST: Connection Test',
        content: 'This is a test announcement to verify CRUD operations.',
        category: 'Test'
      })
      .select()
      .single();
    
    if (createError) {
      console.log('❌ Create operation failed:', createError.message);
      return false;
    }
    
    console.log('✅ Create operation successful');
    
    // Test read operation
    const { data: readData, error: readError } = await supabase
      .from('announcements')
      .select('*')
      .eq('id', createData.id)
      .single();
    
    if (readError) {
      console.log('❌ Read operation failed:', readError.message);
      return false;
    }
    
    console.log('✅ Read operation successful');
    
    // Test update operation
    const { data: updateData, error: updateError } = await supabase
      .from('announcements')
      .update({ content: 'Updated test content' })
      .eq('id', createData.id)
      .select()
      .single();
    
    if (updateError) {
      console.log('❌ Update operation failed:', updateError.message);
      return false;
    }
    
    console.log('✅ Update operation successful');
    
    // Test delete operation
    const { error: deleteError } = await supabase
      .from('announcements')
      .delete()
      .eq('id', createData.id);
    
    if (deleteError) {
      console.log('❌ Delete operation failed:', deleteError.message);
      return false;
    }
    
    console.log('✅ Delete operation successful');
    console.log('✅ All CRUD operations working correctly');
    
    return true;
  } catch (error) {
    console.log('❌ CRUD test failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🧪 CONTENT INTEGRATION TEST\n');
  console.log('===============================\n');
  
  const connectionResult = await testConnection();
  if (!connectionResult) {
    console.log('\n❌ Tests failed: Cannot connect to Supabase');
    process.exit(1);
  }
  
  const tableResults = await testTables();
  const allTablesWorking = Object.values(tableResults).every(result => result === true);
  
  if (!allTablesWorking) {
    console.log('\n⚠️  Some tables are not accessible. Please check your database setup.');
    console.log('Refer to supabase_content_saving.md for setup instructions.');
  }
  
  const crudResult = await testCRUD();
  
  console.log('\n===============================');
  console.log('📊 TEST SUMMARY\n');
  console.log(`Connection: ${connectionResult ? '✅ Pass' : '❌ Fail'}`);
  console.log(`Tables: ${allTablesWorking ? '✅ Pass' : '❌ Fail'}`);
  console.log(`CRUD Operations: ${crudResult ? '✅ Pass' : '❌ Fail'}`);
  
  if (connectionResult && allTablesWorking && crudResult) {
    console.log('\n🎉 All tests passed! Your Supabase integration is working correctly.');
    console.log('\n📋 Next steps:');
    console.log('1. Visit http://localhost:8080/test/integration to test the UI');
    console.log('2. Visit http://localhost:8080/admin/login to access the admin panel');
    console.log('3. Make some changes and verify they appear on the homepage');
  } else {
    console.log('\n⚠️  Some tests failed. Please check your setup and try again.');
  }
}

// Run the tests
runTests().catch(console.error);
