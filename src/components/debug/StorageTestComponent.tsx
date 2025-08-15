import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

export function StorageTestComponent() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testStorageConnection = async () => {
    setLoading(true);
    setTestResults([]);
    
    try {
      addResult('Starting Supabase storage tests...');
      
      // Test 1: List buckets
      addResult('Testing bucket listing...');
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        addResult(`❌ Failed to list buckets: ${bucketsError.message}`);
      } else {
        addResult(`✅ Successfully listed ${buckets?.length || 0} buckets`);
        buckets?.forEach(bucket => {
          addResult(`  - Bucket: ${bucket.name} (public: ${bucket.public})`);
        });
      }
      
      // Test 2: Check if site-images bucket exists
      addResult('Checking for site-images bucket...');
      const siteImagesBucket = buckets?.find(b => b.name === 'site-images');
      if (siteImagesBucket) {
        addResult('✅ site-images bucket exists');
      } else {
        addResult('❌ site-images bucket NOT found - this is likely the issue!');
      }
      
      // Test 3: Try to list files in site-images bucket (if it exists)
      if (siteImagesBucket) {
        addResult('Testing file listing in site-images bucket...');
        const { data: files, error: filesError } = await supabase.storage
          .from('site-images')
          .list('', { limit: 5 });
          
        if (filesError) {
          addResult(`❌ Failed to list files in site-images: ${filesError.message}`);
        } else {
          addResult(`✅ Successfully listed files in site-images (${files?.length || 0} items)`);
        }
      }
      
      // Test 4: Check authentication status
      addResult('Checking authentication status...');
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        addResult(`❌ Auth error: ${authError.message}`);
      } else if (user) {
        addResult(`✅ User authenticated: ${user.email}`);
      } else {
        addResult('ℹ️ No user authenticated (anonymous)');
      }
      
      // Test 5: Test database connection with available tables
      addResult('Testing database connection...');
      const { data: aboutData, error: aboutError } = await supabase
        .from('about_section')
        .select('id, title')
        .limit(1);
        
      if (aboutError) {
        addResult(`❌ Failed to access database: ${aboutError.message}`);
      } else {
        addResult(`✅ Successfully accessed database (about_section table)`);
      }
      
      addResult('ℹ️ Note: school_facilities table might not be in TypeScript types yet');
      addResult('ℹ️ Check Supabase dashboard to confirm table exists and has correct structure');
      
    } catch (error) {
      addResult(`❌ Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Supabase Storage Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testStorageConnection} disabled={loading}>
          {loading ? 'Testing...' : 'Test Storage Connection'}
        </Button>
        
        {testResults.length > 0 && (
          <Alert>
            <AlertDescription>
              <div className="space-y-1 font-mono text-sm">
                {testResults.map((result, index) => (
                  <div key={index}>{result}</div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
