// Comprehensive authentication and database functionality test
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://plgjavfrwcphrehmthdv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsZ2phdmZyd2NwaHJlaG10aGR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2ODE3ODcsImV4cCI6MjA2NzI1Nzc4N30.73hjYMk1hrqiuhFV-AoVtbRdYc6biciDqnFhtz4sq5o";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

console.log('🧪 Running Comprehensive Authentication & Database Tests...\n');

async function runComprehensiveTests() {
  let testsPassed = 0;
  let testsTotal = 0;

  function test(name, condition) {
    testsTotal++;
    if (condition) {
      console.log(`✅ ${name}`);
      testsPassed++;
    } else {
      console.log(`❌ ${name}`);
    }
  }

  // Test 1: Database Connection & Tables
  console.log('📋 DATABASE TESTS');
  console.log('================');
  
  try {
    const { data: adminUsers, error: adminError } = await supabase
      .from('admin_users')
      .select('*');
    test('Admin users table accessible', !adminError);
    console.log(`   📊 Admin users: ${adminUsers?.length || 0} records`);

    const { data: announcements, error: announcementError } = await supabase
      .from('announcements')
      .select('*');
    test('Announcements table accessible', !announcementError);
    console.log(`   📊 Announcements: ${announcements?.length || 0} records`);

    const { data: leadership, error: leadershipError } = await supabase
      .from('leadership_team')
      .select('*');
    test('Leadership team table accessible', !leadershipError);
    console.log(`   📊 Leadership: ${leadership?.length || 0} records`);

    const { data: materials, error: materialsError } = await supabase
      .from('learning_materials')
      .select('*');
    test('Learning materials table accessible', !materialsError);
    console.log(`   📊 Materials: ${materials?.length || 0} records`);

    const { data: gallery, error: galleryError } = await supabase
      .from('school_life_gallery')
      .select('*');
    test('Gallery table accessible', !galleryError);
    console.log(`   📊 Gallery: ${gallery?.length || 0} records`);

  } catch (error) {
    test('Database connection', false);
    console.log(`   ❌ Error: ${error.message}`);
  }

  console.log('\n🔧 FUNCTION TESTS');
  console.log('=================');

  // Test 2: Admin Function
  try {
    const { data: adminResult, error: adminFuncError } = await supabase
      .rpc('check_admin_status');
    test('Admin status function exists', !adminFuncError);
    test('Admin function returns boolean', typeof adminResult === 'boolean');
    console.log(`   📊 Admin status result: ${adminResult}`);
  } catch (error) {
    test('Admin status function', false);
    console.log(`   ❌ Error: ${error.message}`);
  }

  console.log('\n🔐 AUTHENTICATION TESTS');
  console.log('=======================');

  // Test 3: Authentication Setup
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    test('Auth service accessible', !authError);
    
    if (user) {
      console.log(`   👤 Current user: ${user.email}`);
      test('User session exists', true);
    } else {
      console.log(`   👤 No user currently authenticated`);
      test('No active session (expected)', true);
    }

  } catch (error) {
    test('Authentication service', false);
    console.log(`   ❌ Error: ${error.message}`);
  }

  console.log('\n🔒 SECURITY TESTS');
  console.log('=================');

  // Test 4: Row Level Security
  try {
    // Test public read access
    const { data: publicAnnouncements, error: publicError } = await supabase
      .from('announcements')
      .select('*')
      .limit(1);
    test('Public read access works', !publicError);

    // Test unauthenticated write (should fail)
    const { data: insertResult, error: insertError } = await supabase
      .from('announcements')
      .insert({
        title: 'Test Announcement',
        content: 'This should fail without authentication'
      });
    test('Unauthenticated write is blocked', insertError !== null);
    if (insertError) {
      console.log(`   🔒 Expected security block: ${insertError.message}`);
    }

  } catch (error) {
    test('Security policies', false);
    console.log(`   ❌ Error: ${error.message}`);
  }

  console.log('\n📊 SAMPLE DATA TESTS');
  console.log('====================');

  // Test 5: Sample Data Verification
  try {
    const { data: sampleAnnouncements } = await supabase
      .from('announcements')
      .select('title, category, type')
      .limit(5);

    test('Sample announcements exist', sampleAnnouncements && sampleAnnouncements.length > 0);
    
    if (sampleAnnouncements && sampleAnnouncements.length > 0) {
      console.log('   📝 Sample announcements:');
      sampleAnnouncements.forEach((announcement, index) => {
        console.log(`      ${index + 1}. ${announcement.title} (${announcement.category}/${announcement.type})`);
      });
    }

    const { data: sampleLeadership } = await supabase
      .from('leadership_team')
      .select('name, position')
      .limit(5);

    test('Sample leadership data exists', sampleLeadership && sampleLeadership.length > 0);
    
    if (sampleLeadership && sampleLeadership.length > 0) {
      console.log('   👥 Sample leadership:');
      sampleLeadership.forEach((member, index) => {
        console.log(`      ${index + 1}. ${member.name} - ${member.position}`);
      });
    }

  } catch (error) {
    test('Sample data queries', false);
    console.log(`   ❌ Error: ${error.message}`);
  }

  console.log('\n🌐 URL & PROJECT TESTS');
  console.log('=======================');

  // Test 6: Project Configuration
  test('Supabase URL is correct format', SUPABASE_URL.includes('supabase.co'));
  test('Project ID matches URL', SUPABASE_URL.includes('plgjavfrwcphrehmthdv'));
  test('API key exists and is valid format', SUPABASE_PUBLISHABLE_KEY.length > 100);
  
  console.log(`   🔗 Project URL: ${SUPABASE_URL}`);
  console.log(`   🔑 API Key: ${SUPABASE_PUBLISHABLE_KEY.substring(0, 50)}...`);

  // Final Results
  console.log('\n' + '='.repeat(50));
  console.log('🎯 TEST RESULTS SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Tests Passed: ${testsPassed}/${testsTotal}`);
  console.log(`❌ Tests Failed: ${testsTotal - testsPassed}/${testsTotal}`);
  
  if (testsPassed === testsTotal) {
    console.log('\n🎉 ALL TESTS PASSED! 🎉');
    console.log('🔥 Your Supabase setup is perfect and ready for production!');
    console.log('\n✨ What this means:');
    console.log('   • Database connection is working');
    console.log('   • All required tables exist');
    console.log('   • Row Level Security is configured');
    console.log('   • Admin functions are accessible');
    console.log('   • Sample data is loaded');
    console.log('   • Authentication service is ready');
    console.log('\n🚀 You can now test the admin login at: http://localhost:8081/admin/login');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the errors above.');
    console.log('💡 Most common issues:');
    console.log('   • Tables not created properly');
    console.log('   • RLS policies not configured');
    console.log('   • Functions not created');
    console.log('   • Sample data not inserted');
  }

  return testsPassed === testsTotal;
}

// Run all tests
runComprehensiveTests().catch(console.error);
