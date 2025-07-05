import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Save, Loader2, CheckCircle, XCircle, RefreshCw, Database, 
  AlertTriangle, Info, Clock, FileText, Image, Book, Users,
  Target, MessageSquare, Settings, TestTube, Activity, BarChart3
} from 'lucide-react';
import { ContentService, FooterSection } from '@/services/contentService';
import type { Database as DatabaseType } from '@/integrations/supabase/types';

type HeroSection = DatabaseType['public']['Tables']['hero_section']['Row'];
type AboutSection = DatabaseType['public']['Tables']['about_section']['Row'];
type VisionSection = DatabaseType['public']['Tables']['vision_section']['Row'];
type Announcement = DatabaseType['public']['Tables']['announcements']['Row'];
type GalleryItem = DatabaseType['public']['Tables']['school_life_gallery']['Row'];
type LearningMaterial = DatabaseType['public']['Tables']['learning_materials']['Row'];
type LeadershipMember = DatabaseType['public']['Tables']['leadership_team']['Row'];

interface TestResult {
  test: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  details?: string;
  timestamp?: string;
  duration?: number;
}

interface DatabaseStats {
  hero_sections: number;
  about_sections: number;
  vision_sections: number;
  announcements: number;
  gallery_items: number;
  learning_materials: number;
  leadership_members: number;
  footer_sections: number;
  total_records: number;
}

interface ComponentTestResult {
  component: string;
  tests_passed: number;
  tests_failed: number;
  total_tests: number;
  status: 'pass' | 'fail' | 'partial';
}

export function ContentIntegrationTest() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [componentResults, setComponentResults] = useState<ComponentTestResult[]>([]);
  const [testProgress, setTestProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState('');
  
  // All data state
  const [heroData, setHeroData] = useState<HeroSection | null>(null);
  const [aboutData, setAboutData] = useState<AboutSection | null>(null);
  const [visionData, setVisionData] = useState<VisionSection | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [learningMaterials, setLearningMaterials] = useState<LearningMaterial[]>([]);
  const [leadershipMembers, setLeadershipMembers] = useState<LeadershipMember[]>([]);
  const [footerSections, setFooterSections] = useState<FooterSection[]>([]);
  
  // Database stats
  const [dbStats, setDbStats] = useState<DatabaseStats>({
    hero_sections: 0,
    about_sections: 0,
    vision_sections: 0,
    announcements: 0,
    gallery_items: 0,
    learning_materials: 0,
    leadership_members: 0,
    footer_sections: 0,
    total_records: 0
  });
  
  // Test configurations
  const [testConfig, setTestConfig] = useState({
    testHeroTitle: 'TEST: Advanced Hero Title Update',
    testAboutTitle: 'TEST: Advanced About Title Update',
    testVisionTitle: 'TEST: Advanced Vision Title Update',
    testAnnouncementTitle: 'TEST: Advanced Announcement Creation',
    testGalleryTitle: 'TEST: Advanced Gallery Item',
    testMaterialTitle: 'TEST: Advanced Learning Material',
    testLeadershipName: 'TEST: Advanced Leadership Member',
    testFooterSectionTitle: 'TEST: Advanced Footer Section',
    performanceThreshold: 1000, // milliseconds
    enablePerformanceTests: true,
    enableStressTests: false
  });

  const addTestResult = (test: string, status: 'success' | 'error' | 'warning', message: string, details?: string, duration?: number) => {
    setTestResults(prev => [...prev, {
      test,
      status,
      message,
      details,
      timestamp: new Date().toLocaleTimeString(),
      duration
    }]);
  };

  const updateComponentResult = (component: string, passed: boolean) => {
    setComponentResults(prev => {
      const existing = prev.find(r => r.component === component);
      if (existing) {
        const updated = {
          ...existing,
          tests_passed: passed ? existing.tests_passed + 1 : existing.tests_passed,
          tests_failed: passed ? existing.tests_failed : existing.tests_failed + 1,
          total_tests: existing.total_tests + 1
        };
        updated.status = updated.tests_failed === 0 ? 'pass' : 
                        updated.tests_passed > 0 ? 'partial' : 'fail';
        return prev.map(r => r.component === component ? updated : r);
      } else {
        return [...prev, {
          component,
          tests_passed: passed ? 1 : 0,
          tests_failed: passed ? 0 : 1,
          total_tests: 1,
          status: passed ? 'pass' : 'fail'
        }];
      }
    });
  };

  // Load all current data
  const loadAllData = async () => {
    setLoading(true);
    setCurrentTest('Data Loading');
    const startTime = Date.now();
    
    try {
      const [hero, about, vision, announcementList, galleryItemsList, learningMaterialsList, leadershipMembersList, footerSectionsList] = await Promise.all([
        ContentService.getHeroSection(),
        ContentService.getAboutSection(),
        ContentService.getVisionSection(),
        ContentService.getAnnouncements(),
        ContentService.getGalleryItems(),
        ContentService.getLearningMaterials(),
        ContentService.getLeadershipTeam(),
        ContentService.getFooterSections()
      ]);
      
      setHeroData(hero);
      setAboutData(about);
      setVisionData(vision);
      setAnnouncements(announcementList);
      setGalleryItems(galleryItemsList);
      setLearningMaterials(learningMaterialsList);
      setLeadershipMembers(leadershipMembersList);
      setFooterSections(footerSectionsList);
      
      const duration = Date.now() - startTime;
      addTestResult('Data Loading', 'success', 'All content sections loaded successfully', 
        `Performance: ${duration}ms`, duration);
      
      // Load database statistics
      await loadDatabaseStats();
      
    } catch (error) {
      const duration = Date.now() - startTime;
      addTestResult('Data Loading', 'error', `Failed to load data: ${error}`, 
        `Duration: ${duration}ms`, duration);
    }
    setLoading(false);
  };

  // Load database statistics
  const loadDatabaseStats = async () => {
    setCurrentTest('Database Statistics');
    const startTime = Date.now();
    
    try {
      const stats = {
        hero_sections: heroData ? 1 : 0,
        about_sections: aboutData ? 1 : 0,
        vision_sections: visionData ? 1 : 0,
        announcements: announcements.length,
        gallery_items: galleryItems.length,
        learning_materials: learningMaterials.length,
        leadership_members: leadershipMembers.length,
        footer_sections: footerSections.length,
        total_records: (heroData ? 1 : 0) + (aboutData ? 1 : 0) + (visionData ? 1 : 0) + 
                     announcements.length + galleryItems.length + learningMaterials.length + leadershipMembers.length + footerSections.length
      };
      
      setDbStats(stats);
      
      const duration = Date.now() - startTime;
      addTestResult('Database Statistics', 'success', 
        `Loaded statistics for ${stats.total_records} total records across 8 tables`, 
        `Performance: ${duration}ms`, duration);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      addTestResult('Database Statistics', 'error', `Failed to load database statistics: ${error}`, 
        `Duration: ${duration}ms`, duration);
    }
  };

  // Test Hero Section Update
  const testHeroUpdate = async () => {
    setLoading(true);
    setCurrentTest('Hero Section Update');
    const startTime = Date.now();
    
    try {
      const originalTitle = heroData?.title || '';
      
      // Update hero section - just pass the title we want to change
      const success = await ContentService.updateHeroSection({
        title: testConfig.testHeroTitle,
        subtitle: heroData?.subtitle,
        description: heroData?.description,
        image_url: heroData?.image_url,
        image_description: heroData?.image_description,
        primary_button_text: heroData?.primary_button_text,
        primary_button_link: heroData?.primary_button_link,
        secondary_button_text: heroData?.secondary_button_text,
        secondary_button_link: heroData?.secondary_button_link
      });
      
      const duration = Date.now() - startTime;
      
      if (success) {
        // Verify the update by fetching fresh data
        const updatedHero = await ContentService.getHeroSection();
        
        if (updatedHero?.title === testConfig.testHeroTitle) {
          setHeroData(updatedHero);
          addTestResult('Hero Section Update', 'success', 
            `Title successfully updated from "${originalTitle}" to "${testConfig.testHeroTitle}"`, 
            `Performance: ${duration}ms`, duration);
          updateComponentResult('Hero Section', true);
        } else {
          addTestResult('Hero Section Update', 'error', 'Update succeeded but data verification failed', 
            `Duration: ${duration}ms`, duration);
          updateComponentResult('Hero Section', false);
        }
      } else {
        addTestResult('Hero Section Update', 'error', 'Failed to update hero section', 
          `Duration: ${duration}ms`, duration);
        updateComponentResult('Hero Section', false);
      }
      
      // Performance warning
      if (testConfig.enablePerformanceTests && duration > testConfig.performanceThreshold) {
        addTestResult('Hero Section Performance', 'warning', 
          `Update took ${duration}ms (threshold: ${testConfig.performanceThreshold}ms)`, 
          'Consider optimizing database queries');
      }
      
    } catch (error) {
      const duration = Date.now() - startTime;
      addTestResult('Hero Section Update', 'error', `Error: ${error}`, `Duration: ${duration}ms`, duration);
      updateComponentResult('Hero Section', false);
    }
    setLoading(false);
  };

  // Test About Section Update
  const testAboutUpdate = async () => {
    setLoading(true);
    setCurrentTest('About Section Update');
    const startTime = Date.now();
    
    try {
      const originalTitle = aboutData?.title || '';
      
      const success = await ContentService.updateAboutSection({
        title: testConfig.testAboutTitle,
        subtitle: aboutData?.subtitle,
        main_content: aboutData?.main_content,
        principal_message: aboutData?.principal_message,
        principal_name: aboutData?.principal_name,
        principal_title: aboutData?.principal_title,
        principal_image_url: aboutData?.principal_image_url,
        school_founded_year: aboutData?.school_founded_year,
        school_description: aboutData?.school_description,
        features: aboutData?.features
      });
      
      const duration = Date.now() - startTime;
      
      if (success) {
        const updatedAbout = await ContentService.getAboutSection();
        
        if (updatedAbout?.title === testConfig.testAboutTitle) {
          setAboutData(updatedAbout);
          addTestResult('About Section Update', 'success', 
            `Title successfully updated from "${originalTitle}" to "${testConfig.testAboutTitle}"`, 
            `Performance: ${duration}ms`, duration);
          updateComponentResult('About Section', true);
        } else {
          addTestResult('About Section Update', 'error', 'Update succeeded but data verification failed', 
            `Duration: ${duration}ms`, duration);
          updateComponentResult('About Section', false);
        }
      } else {
        addTestResult('About Section Update', 'error', 'Failed to update about section', 
          `Duration: ${duration}ms`, duration);
        updateComponentResult('About Section', false);
      }
      
      if (testConfig.enablePerformanceTests && duration > testConfig.performanceThreshold) {
        addTestResult('About Section Performance', 'warning', 
          `Update took ${duration}ms (threshold: ${testConfig.performanceThreshold}ms)`);
      }
      
    } catch (error) {
      const duration = Date.now() - startTime;
      addTestResult('About Section Update', 'error', `Error: ${error}`, `Duration: ${duration}ms`, duration);
      updateComponentResult('About Section', false);
    }
    setLoading(false);
  };

  // Test Vision Section Update
  const testVisionUpdate = async () => {
    setLoading(true);
    setCurrentTest('Vision Section Update');
    const startTime = Date.now();
    
    try {
      const originalTitle = visionData?.title || '';
      
      const success = await ContentService.updateVisionSection({
        title: testConfig.testVisionTitle,
        subtitle: visionData?.subtitle,
        main_content: visionData?.main_content,
        principal_message: visionData?.principal_message,
        principal_name: visionData?.principal_name,
        principal_title: visionData?.principal_title,
        features: visionData?.features
      });
      
      const duration = Date.now() - startTime;
      
      if (success) {
        const updatedVision = await ContentService.getVisionSection();
        
        if (updatedVision?.title === testConfig.testVisionTitle) {
          setVisionData(updatedVision);
          addTestResult('Vision Section Update', 'success', 
            `Title successfully updated from "${originalTitle}" to "${testConfig.testVisionTitle}"`, 
            `Performance: ${duration}ms`, duration);
          updateComponentResult('Vision Section', true);
        } else {
          addTestResult('Vision Section Update', 'error', 'Update succeeded but data verification failed', 
            `Duration: ${duration}ms`, duration);
          updateComponentResult('Vision Section', false);
        }
      } else {
        addTestResult('Vision Section Update', 'error', 'Failed to update vision section', 
          `Duration: ${duration}ms`, duration);
        updateComponentResult('Vision Section', false);
      }
      
      if (testConfig.enablePerformanceTests && duration > testConfig.performanceThreshold) {
        addTestResult('Vision Section Performance', 'warning', 
          `Update took ${duration}ms (threshold: ${testConfig.performanceThreshold}ms)`);
      }
      
    } catch (error) {
      const duration = Date.now() - startTime;
      addTestResult('Vision Section Update', 'error', `Error: ${error}`, `Duration: ${duration}ms`, duration);
      updateComponentResult('Vision Section', false);
    }
    setLoading(false);
  };

  // Test Announcement Creation
  const testAnnouncementCreate = async () => {
    setLoading(true);
    setCurrentTest('Announcement Creation');
    const startTime = Date.now();
    
    try {
      const newAnnouncement = {
        title: testConfig.testAnnouncementTitle,
        content: 'This is a test announcement to verify the integration is working correctly.',
        category: 'Test',
        type: 'info'
      };
      
      const success = await ContentService.createAnnouncement(newAnnouncement);
      
      const duration = Date.now() - startTime;
      
      if (success) {
        const updatedAnnouncements = await ContentService.getAnnouncements();
        const createdAnnouncement = updatedAnnouncements.find(a => a.title === testConfig.testAnnouncementTitle);
        
        if (createdAnnouncement) {
          setAnnouncements(updatedAnnouncements);
          addTestResult('Announcement Creation', 'success', 
            `Announcement "${testConfig.testAnnouncementTitle}" created successfully`, 
            `Performance: ${duration}ms`, duration);
          updateComponentResult('Announcements', true);
        } else {
          addTestResult('Announcement Creation', 'error', 'Creation succeeded but announcement not found in list', 
            `Duration: ${duration}ms`, duration);
          updateComponentResult('Announcements', false);
        }
      } else {
        addTestResult('Announcement Creation', 'error', 'Failed to create announcement', 
          `Duration: ${duration}ms`, duration);
        updateComponentResult('Announcements', false);
      }
      
      if (testConfig.enablePerformanceTests && duration > testConfig.performanceThreshold) {
        addTestResult('Announcement Performance', 'warning', 
          `Creation took ${duration}ms (threshold: ${testConfig.performanceThreshold}ms)`);
      }
      
    } catch (error) {
      const duration = Date.now() - startTime;
      addTestResult('Announcement Creation', 'error', `Error: ${error}`, `Duration: ${duration}ms`, duration);
      updateComponentResult('Announcements', false);
    }
    setLoading(false);
  };

  // Run all tests
  // Run all tests with progress tracking
  const runAllTests = async () => {
    setTestResults([]);
    setComponentResults([]);
    setTestProgress(0);
    setCurrentTest('Starting Tests...');
    
    const totalTests = 10; // Updated to include footer tests
    let currentTestIndex = 0;
    
    const updateProgress = () => {
      currentTestIndex++;
      setTestProgress(Math.round((currentTestIndex / totalTests) * 100));
    };
    
    try {
      // Load all data first
      await loadAllData();
      updateProgress();
      
      // Run all component tests
      await testHeroUpdate();
      updateProgress();
      
      await testAboutUpdate();
      updateProgress();
      
      await testVisionUpdate();
      updateProgress();
      
      await testAnnouncementCreate();
      updateProgress();
      
      // Test additional components
      await testGalleryItems();
      updateProgress();
      
      await testLearningMaterials();
      updateProgress();
      
      await testLeadershipMembers();
      updateProgress();
      
      // Test footer sections
      await testFooterSections();
      updateProgress();
      
      await testFooterAdminSections();
      updateProgress();
      
      await testFooterSectionCRUD();
      updateProgress();
      
      setCurrentTest('Tests Complete');
      
      // Calculate summary
      const totalTestResults = testResults.length;
      const successfulTests = testResults.filter(r => r.status === 'success').length;
      const failedTests = testResults.filter(r => r.status === 'error').length;
      const warningTests = testResults.filter(r => r.status === 'warning').length;
      
      toast({
        title: "Integration Tests Completed",
        description: `${successfulTests} passed, ${failedTests} failed, ${warningTests} warnings out of ${totalTestResults} total tests`,
      });
      
    } catch (error) {
      addTestResult('Test Suite', 'error', `Test suite failed: ${error}`);
      setCurrentTest('Test Suite Failed');
    }
  };

  // Test all gallery items
  const testGalleryItems = async () => {
    setCurrentTest('Gallery Items Test');
    const startTime = Date.now();
    
    try {
      const items = await ContentService.getGalleryItems();
      setGalleryItems(items);
      
      const duration = Date.now() - startTime;
      addTestResult('Gallery Items Test', 'success', 
        `Loaded ${items.length} gallery items successfully`, 
        `Performance: ${duration}ms`, duration);
      updateComponentResult('Gallery', true);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      addTestResult('Gallery Items Test', 'error', `Failed to load gallery items: ${error}`, 
        `Duration: ${duration}ms`, duration);
      updateComponentResult('Gallery', false);
    }
  };

  // Test all learning materials
  const testLearningMaterials = async () => {
    setCurrentTest('Learning Materials Test');
    const startTime = Date.now();
    
    try {
      const materials = await ContentService.getLearningMaterials();
      setLearningMaterials(materials);
      
      const duration = Date.now() - startTime;
      addTestResult('Learning Materials Test', 'success', 
        `Loaded ${materials.length} learning materials successfully`, 
        `Performance: ${duration}ms`, duration);
      updateComponentResult('Learning Materials', true);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      addTestResult('Learning Materials Test', 'error', `Failed to load learning materials: ${error}`, 
        `Duration: ${duration}ms`, duration);
      updateComponentResult('Learning Materials', false);
    }
  };

  // Test all leadership members
  const testLeadershipMembers = async () => {
    setCurrentTest('Leadership Members Test');
    const startTime = Date.now();
    
    try {
      const members = await ContentService.getLeadershipTeam();
      setLeadershipMembers(members);
      
      const duration = Date.now() - startTime;
      addTestResult('Leadership Members Test', 'success', 
        `Loaded ${members.length} leadership members successfully`, 
        `Performance: ${duration}ms`, duration);
      updateComponentResult('Leadership', true);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      addTestResult('Leadership Members Test', 'error', `Failed to load leadership members: ${error}`, 
        `Duration: ${duration}ms`, duration);
      updateComponentResult('Leadership', false);
    }
  };

  // Test Footer Sections (Frontend - Active Only)
  const testFooterSections = async () => {
    setCurrentTest('Footer Sections Test');
    const startTime = Date.now();
    
    try {
      const sections = await ContentService.getFooterSections();
      setFooterSections(sections);
      
      const duration = Date.now() - startTime;
      addTestResult('Footer Sections Test', 'success', 
        `Loaded ${sections.length} active footer sections for frontend`, 
        `Performance: ${duration}ms`, duration);
      updateComponentResult('Footer', true);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      addTestResult('Footer Sections Test', 'error', `Failed to load footer sections: ${error}`, 
        `Duration: ${duration}ms`, duration);
      updateComponentResult('Footer', false);
    }
  };

  // Test Footer Admin Management (All Sections)
  const testFooterAdminSections = async () => {
    setCurrentTest('Footer Admin Sections Test');
    const startTime = Date.now();
    
    try {
      const allSections = await ContentService.getAllFooterSections();
      
      const duration = Date.now() - startTime;
      addTestResult('Footer Admin Sections Test', 'success', 
        `Loaded ${allSections.length} total footer sections for admin (including inactive)`, 
        `Performance: ${duration}ms`, duration);
      updateComponentResult('Footer Admin', true);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      addTestResult('Footer Admin Sections Test', 'error', `Failed to load all footer sections: ${error}`, 
        `Duration: ${duration}ms`, duration);
      updateComponentResult('Footer Admin', false);
    }
  };

  // Test Footer Section CRUD Operations
  const testFooterSectionCRUD = async () => {
    setCurrentTest('Footer Section CRUD Test');
    const startTime = Date.now();
    
    try {
      // Create a test footer section
      const testSection = {
        title: testConfig.testFooterSectionTitle,
        section_type: 'custom' as const,
        content: { text: 'This is a test footer section for integration testing.' },
        display_order: 999,
        is_active: true
      };
      
      const createdSection = await ContentService.createFooterSection(testSection);
      
      const duration = Date.now() - startTime;
      
      if (createdSection) {
        // Test update
        const updatedSection = await ContentService.updateFooterSection(createdSection.id, {
          title: `${testConfig.testFooterSectionTitle} - Updated`
        });
        
        if (updatedSection) {
          addTestResult('Footer Section CRUD Test', 'success', 
            `Created and updated footer section successfully`, 
            `Performance: ${duration}ms`, duration);
          updateComponentResult('Footer CRUD', true);
          
          // Clean up - delete the test section
          await ContentService.deleteFooterSection(createdSection.id);
        } else {
          addTestResult('Footer Section CRUD Test', 'error', 
            'Failed to update footer section', 
            `Duration: ${duration}ms`, duration);
          updateComponentResult('Footer CRUD', false);
        }
      } else {
        addTestResult('Footer Section CRUD Test', 'error', 
          'Failed to create footer section', 
          `Duration: ${duration}ms`, duration);
        updateComponentResult('Footer CRUD', false);
      }
      
    } catch (error) {
      const duration = Date.now() - startTime;
      addTestResult('Footer Section CRUD Test', 'error', `Error: ${error}`, 
        `Duration: ${duration}ms`, duration);
      updateComponentResult('Footer CRUD', false);
    }
  };

  // Reset test data
  const resetTestData = async () => {
    setLoading(true);
    try {
      // Reset to original values
      if (heroData) {
        await ContentService.updateHeroSection({
          title: 'Welcome to St. G. D. Convent School',
          subtitle: heroData.subtitle,
          description: heroData.description,
          image_url: heroData.image_url,
          image_description: heroData.image_description,
          primary_button_text: heroData.primary_button_text,
          primary_button_link: heroData.primary_button_link,
          secondary_button_text: heroData.secondary_button_text,
          secondary_button_link: heroData.secondary_button_link
        });
      }
      
      if (aboutData) {
        await ContentService.updateAboutSection({
          title: 'About Our School',
          subtitle: aboutData.subtitle,
          main_content: aboutData.main_content,
          principal_message: aboutData.principal_message,
          principal_name: aboutData.principal_name,
          principal_title: aboutData.principal_title,
          principal_image_url: aboutData.principal_image_url,
          school_founded_year: aboutData.school_founded_year,
          school_description: aboutData.school_description,
          features: aboutData.features
        });
      }
      
      if (visionData) {
        await ContentService.updateVisionSection({
          title: 'Our Vision & Mission',
          subtitle: visionData.subtitle,
          main_content: visionData.main_content,
          principal_message: visionData.principal_message,
          principal_name: visionData.principal_name,
          principal_title: visionData.principal_title,
          features: visionData.features
        });
      }
      
      // Delete test announcements
      const testAnnouncements = announcements.filter(a => a.title.includes('TEST:'));
      for (const announcement of testAnnouncements) {
        await ContentService.deleteAnnouncement(announcement.id);
      }
      
      await loadAllData();
      addTestResult('Data Reset', 'success', 'All test data has been reset to original values');
    } catch (error) {
      addTestResult('Data Reset', 'error', `Failed to reset data: ${error}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Content Integration Test Suite</h1>
          <p className="text-muted-foreground">
            Test the complete integration between admin editors and frontend display. 
            This will verify that content changes are properly saved to Supabase and displayed on the homepage.
          </p>
        </div>

        <Tabs defaultValue="tests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="tests">Run Tests</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="current-data">Current Data</TabsTrigger>
            <TabsTrigger value="results">Test Results</TabsTrigger>
          </TabsList>

          <TabsContent value="tests" className="space-y-6">
            {/* Test Progress */}
            {loading && (
              <Card>
                <CardHeader>
                  <CardTitle>Test Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current Test: {currentTest}</span>
                      <span>{testProgress}%</span>
                    </div>
                    <Progress value={testProgress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Test Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Test Configuration</CardTitle>
                <CardDescription>
                  Configure test parameters and performance thresholds
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="performance-threshold">Performance Threshold (ms)</Label>
                    <Input
                      id="performance-threshold"
                      type="number"
                      value={testConfig.performanceThreshold}
                      onChange={(e) => setTestConfig(prev => ({ ...prev, performanceThreshold: parseInt(e.target.value) || 1000 }))}
                      placeholder="1000"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="enable-performance"
                      checked={testConfig.enablePerformanceTests}
                      onChange={(e) => setTestConfig(prev => ({ ...prev, enablePerformanceTests: e.target.checked }))}
                    />
                    <Label htmlFor="enable-performance">Enable Performance Tests</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Integration Tests</CardTitle>
                <CardDescription>
                  Test each content section to verify that updates are properly saved and retrieved
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hero-title">Test Hero Title</Label>
                    <Input
                      id="hero-title"
                      value={testConfig.testHeroTitle}
                      onChange={(e) => setTestConfig(prev => ({ ...prev, testHeroTitle: e.target.value }))}
                      placeholder="Enter test hero title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="about-title">Test About Title</Label>
                    <Input
                      id="about-title"
                      value={testConfig.testAboutTitle}
                      onChange={(e) => setTestConfig(prev => ({ ...prev, testAboutTitle: e.target.value }))}
                      placeholder="Enter test about title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vision-title">Test Vision Title</Label>
                    <Input
                      id="vision-title"
                      value={testConfig.testVisionTitle}
                      onChange={(e) => setTestConfig(prev => ({ ...prev, testVisionTitle: e.target.value }))}
                      placeholder="Enter test vision title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="announcement-title">Test Announcement Title</Label>
                    <Input
                      id="announcement-title"
                      value={testConfig.testAnnouncementTitle}
                      onChange={(e) => setTestConfig(prev => ({ ...prev, testAnnouncementTitle: e.target.value }))}
                      placeholder="Enter test announcement title"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button onClick={runAllTests} disabled={loading} className="flex-1">
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Running Tests...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Run All Tests
                      </>
                    )}
                  </Button>
                  <Button onClick={resetTestData} variant="outline" disabled={loading}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset Data
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                  <Button onClick={testHeroUpdate} variant="outline" size="sm" disabled={loading}>
                    Test Hero Update
                  </Button>
                  <Button onClick={testAboutUpdate} variant="outline" size="sm" disabled={loading}>
                    Test About Update
                  </Button>
                  <Button onClick={testVisionUpdate} variant="outline" size="sm" disabled={loading}>
                    Test Vision Update
                  </Button>
                  <Button onClick={testAnnouncementCreate} variant="outline" size="sm" disabled={loading}>
                    Test Announcement Create
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Database Statistics
                </CardTitle>
                <CardDescription>
                  Real-time database content overview and record counts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{dbStats.hero_sections}</div>
                    <div className="text-sm text-muted-foreground">Hero Sections</div>
                  </div>
                  <div className="text-center p-4 bg-secondary/5 rounded-lg">
                    <div className="text-2xl font-bold text-secondary">{dbStats.about_sections}</div>
                    <div className="text-sm text-muted-foreground">About Sections</div>
                  </div>
                  <div className="text-center p-4 bg-accent/5 rounded-lg">
                    <div className="text-2xl font-bold text-accent-foreground">{dbStats.vision_sections}</div>
                    <div className="text-sm text-muted-foreground">Vision Sections</div>
                  </div>
                  <div className="text-center p-4 bg-muted/5 rounded-lg">
                    <div className="text-2xl font-bold">{dbStats.announcements}</div>
                    <div className="text-sm text-muted-foreground">Announcements</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{dbStats.gallery_items}</div>
                    <div className="text-sm text-muted-foreground">Gallery Items</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{dbStats.learning_materials}</div>
                    <div className="text-sm text-muted-foreground">Learning Materials</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{dbStats.leadership_members}</div>
                    <div className="text-sm text-muted-foreground">Leadership Members</div>
                  </div>
                  <div className="text-center p-4 bg-indigo-50 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-600">{dbStats.footer_sections}</div>
                    <div className="text-sm text-muted-foreground">Footer Sections</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{dbStats.total_records}</div>
                    <div className="text-sm text-muted-foreground">Total Records</div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button onClick={loadDatabaseStats} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Statistics
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Database Contents Preview</CardTitle>
                <CardDescription>
                  Sample data from each table to verify content integrity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {heroData && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Hero Section</h4>
                    <div className="text-sm text-muted-foreground">
                      <div>Title: {heroData.title}</div>
                      <div>Subtitle: {heroData.subtitle}</div>
                      <div>Last Updated: {new Date(heroData.updated_at || '').toLocaleString()}</div>
                    </div>
                  </div>
                )}
                
                {aboutData && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">About Section</h4>
                    <div className="text-sm text-muted-foreground">
                      <div>Title: {aboutData.title}</div>
                      <div>Main Content Length: {aboutData.main_content ? JSON.stringify(aboutData.main_content).length : 0} characters</div>
                      <div>Last Updated: {new Date(aboutData.updated_at || '').toLocaleString()}</div>
                    </div>
                  </div>
                )}
                
                {visionData && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Vision Section</h4>
                    <div className="text-sm text-muted-foreground">
                      <div>Title: {visionData.title}</div>
                      <div>Main Content: {visionData.main_content?.substring(0, 100)}...</div>
                      <div>Last Updated: {new Date(visionData.updated_at || '').toLocaleString()}</div>
                    </div>
                  </div>
                )}
                
                {announcements.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Recent Announcements ({announcements.length})</h4>
                    <div className="space-y-2">
                      {announcements.slice(0, 3).map((announcement, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          <div>• {announcement.title}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="components" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Component Test Results
                </CardTitle>
                <CardDescription>
                  Individual component test status and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {componentResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          result.status === 'pass' ? 'bg-green-500' : 
                          result.status === 'partial' ? 'bg-yellow-500' : 
                          'bg-red-500'
                        }`} />
                        <div>
                          <div className="font-semibold">{result.component}</div>
                          <div className="text-sm text-muted-foreground">
                            {result.tests_passed} passed, {result.tests_failed} failed
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {result.total_tests} test{result.total_tests !== 1 ? 's' : ''}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round((result.tests_passed / result.total_tests) * 100)}% success rate
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {componentResults.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No component tests have been run yet. Click "Run All Tests" to start testing.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Component Coverage</CardTitle>
                <CardDescription>
                  Overview of all components and their test coverage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'Hero Section', tested: componentResults.find(r => r.component === 'Hero Section')?.status === 'pass' },
                    { name: 'About Section', tested: componentResults.find(r => r.component === 'About Section')?.status === 'pass' },
                    { name: 'Vision Section', tested: componentResults.find(r => r.component === 'Vision Section')?.status === 'pass' },
                    { name: 'Announcements', tested: componentResults.find(r => r.component === 'Announcements')?.status === 'pass' },
                    { name: 'Gallery', tested: componentResults.find(r => r.component === 'Gallery')?.status === 'pass' },
                    { name: 'Learning Materials', tested: componentResults.find(r => r.component === 'Learning Materials')?.status === 'pass' },
                    { name: 'Leadership', tested: componentResults.find(r => r.component === 'Leadership')?.status === 'pass' },
                    { name: 'Footer', tested: componentResults.find(r => r.component === 'Footer')?.status === 'pass' },
                    { name: 'Footer CRUD', tested: componentResults.find(r => r.component === 'Footer CRUD')?.status === 'pass' },
                  ].map((component, index) => (
                    <div key={index} className={`flex items-center gap-2 p-3 rounded-lg ${
                      component.tested ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'
                    }`}>
                      {component.tested ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="font-medium">{component.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="current-data" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hero Section</CardTitle>
                </CardHeader>
                <CardContent>
                  {heroData ? (
                    <div className="space-y-2">
                      <p><strong>Title:</strong> {heroData.title}</p>
                      <p><strong>Subtitle:</strong> {heroData.subtitle}</p>
                      <p><strong>Last Updated:</strong> {new Date(heroData.updated_at).toLocaleString()}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No data loaded</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>About Section</CardTitle>
                </CardHeader>
                <CardContent>
                  {aboutData ? (
                    <div className="space-y-2">
                      <p><strong>Title:</strong> {aboutData.title}</p>
                      <p><strong>Subtitle:</strong> {aboutData.subtitle}</p>
                      <p><strong>Principal:</strong> {aboutData.principal_name}</p>
                      <p><strong>Last Updated:</strong> {new Date(aboutData.updated_at).toLocaleString()}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No data loaded</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vision Section</CardTitle>
                </CardHeader>
                <CardContent>
                  {visionData ? (
                    <div className="space-y-2">
                      <p><strong>Title:</strong> {visionData.title}</p>
                      <p><strong>Subtitle:</strong> {visionData.subtitle}</p>
                      <p><strong>Last Updated:</strong> {new Date(visionData.updated_at).toLocaleString()}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No data loaded</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Announcements ({announcements.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {announcements.length > 0 ? (
                    <div className="space-y-2">
                      {announcements.slice(0, 3).map((announcement) => (
                        <div key={announcement.id} className="border-l-2 border-primary pl-3">
                          <p className="font-medium">{announcement.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(announcement.created_at || '').toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No announcements found</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Test Results Summary
                </CardTitle>
                <CardDescription>
                  Complete overview of all integration tests with performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {testResults.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      No tests have been run yet. Go to the "Run Tests" tab to start testing.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Test Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {testResults.filter(r => r.status === 'success').length}
                        </div>
                        <div className="text-sm text-green-600">Passed</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          {testResults.filter(r => r.status === 'error').length}
                        </div>
                        <div className="text-sm text-red-600">Failed</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">
                          {testResults.filter(r => r.status === 'warning').length}
                        </div>
                        <div className="text-sm text-yellow-600">Warnings</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {testResults.length}
                        </div>
                        <div className="text-sm text-blue-600">Total Tests</div>
                      </div>
                    </div>

                    {/* Detailed Test Results */}
                    <div className="space-y-3">
                      {testResults.map((result, index) => (
                        <div key={index} className={`p-4 border rounded-lg ${
                          result.status === 'success' ? 'bg-green-50 border-green-200' : 
                          result.status === 'warning' ? 'bg-yellow-50 border-yellow-200' : 
                          'bg-red-50 border-red-200'
                        }`}>
                          <div className="flex items-start gap-3">
                            {result.status === 'success' ? (
                              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                            ) : result.status === 'warning' ? (
                              <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold">{result.test}</span>
                                <Badge variant={
                                  result.status === 'success' ? 'default' : 
                                  result.status === 'warning' ? 'secondary' : 'destructive'
                                }>
                                  {result.status}
                                </Badge>
                                {result.timestamp && (
                                  <span className="text-xs text-muted-foreground">{result.timestamp}</span>
                                )}
                                {result.duration && (
                                  <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                                    {result.duration}ms
                                  </span>
                                )}
                              </div>
                              <p className="text-sm mb-2">{result.message}</p>
                              {result.details && (
                                <div className="text-xs text-muted-foreground bg-white/50 p-2 rounded border">
                                  {result.details}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Analysis</CardTitle>
                <CardDescription>
                  Test execution times and performance recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {testResults.filter(r => r.duration).length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="text-sm text-blue-600 mb-1">Average Response Time</div>
                        <div className="text-2xl font-bold text-blue-700">
                          {Math.round(testResults.filter(r => r.duration).reduce((sum, r) => sum + (r.duration || 0), 0) / testResults.filter(r => r.duration).length)}ms
                        </div>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="text-sm text-purple-600 mb-1">Slowest Test</div>
                        <div className="text-2xl font-bold text-purple-700">
                          {Math.max(...testResults.filter(r => r.duration).map(r => r.duration || 0))}ms
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Performance Breakdown</h4>
                      {testResults.filter(r => r.duration).map((result, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{result.test}</span>
                          <span className={`text-sm font-mono ${
                            (result.duration || 0) > testConfig.performanceThreshold ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {result.duration}ms
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No performance data available. Run tests to see timing information.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>1. Run Tests:</strong> Click "Run All Tests" to test all content sections</p>
              <p><strong>2. Verify Frontend:</strong> Check the homepage to see if changes appear immediately</p>
              <p><strong>3. Admin Portal:</strong> Go to admin dashboard to verify changes are reflected there too</p>
              <p><strong>4. Reset Data:</strong> Use "Reset Data" to restore original content after testing</p>
              <p className="text-orange-600"><strong>⚠️ Note:</strong> This test will temporarily modify your content. Always reset after testing!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
