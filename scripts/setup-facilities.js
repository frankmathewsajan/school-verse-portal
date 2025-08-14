import { supabase } from '../src/integrations/supabase/client.ts';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function setupFacilitiesTable() {
  try {
    console.log('🏗️  Setting up school_facilities table...');
    
    // Read the SQL file
    const sqlContent = readFileSync(join(__dirname, '..', 'setup-facilities-table.sql'), 'utf8');
    
    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      console.error('❌ Error setting up facilities table:', error);
      
      // Try alternative approach - execute each statement separately
      console.log('🔄 Trying alternative approach...');
      
      // Split the SQL into individual statements
      const statements = sqlContent
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
      
      for (const statement of statements) {
        if (statement.trim()) {
          console.log(`Executing: ${statement.substring(0, 50)}...`);
          const { error: stmtError } = await supabase.rpc('exec_sql', { sql: statement + ';' });
          if (stmtError) {
            console.warn(`Warning for statement: ${stmtError.message}`);
          }
        }
      }
    }
    
    // Verify the table was created by fetching data
    console.log('✅ Verifying table creation...');
    const { data, error: fetchError } = await supabase
      .from('school_facilities')
      .select('*')
      .limit(1);
    
    if (fetchError) {
      console.error('❌ Error verifying table:', fetchError);
      return false;
    }
    
    console.log('🎉 Facilities table setup completed successfully!');
    console.log(`📊 Found ${data?.length || 0} sample facilities`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

// Run the setup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupFacilitiesTable().then((success) => {
    process.exit(success ? 0 : 1);
  });
}

export { setupFacilitiesTable };
