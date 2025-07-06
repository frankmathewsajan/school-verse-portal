import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  LogOutIcon, 
  UsersIcon, 
  FileTextIcon, 
  ImageIcon, 
  BookOpenIcon,
  SettingsIcon,
  ShieldCheckIcon,
  HomeIcon,
  InfoIcon,
  RefreshCwIcon
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ContentService, DashboardStatistics } from '@/services/contentService';

// Import the new admin components
import { HeroEditor } from '@/components/admin/HeroEditor';
import { AboutEditor } from '@/components/admin/AboutEditor';
import { VisionEditor } from '@/components/admin/VisionEditor';
import { HistoryEditor } from '@/components/admin/HistoryEditor';
import { FacilitiesEditor } from '@/components/admin/FacilitiesEditor';
import { StaffEditor } from '@/components/admin/StaffEditor';
import { NotificationEditor } from '@/components/admin/NotificationEditor';
import { GalleryEditor } from '@/components/admin/GalleryEditor';
import { MaterialsEditor } from '@/components/admin/MaterialsEditor';
import FooterEditor from '@/components/admin/FooterEditor';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading, user, signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('hero');
  const [statistics, setStatistics] = useState<DashboardStatistics>({
    totalUsers: 0,
    totalAnnouncements: 0,
    totalGalleryItems: 0,
    totalLearningMaterials: 0,
    totalFooterSections: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Protect the route
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Load statistics
  useEffect(() => {
    if (isAuthenticated) {
      loadStatistics();
    }
  }, [isAuthenticated]);

  const loadStatistics = async () => {
    try {
      setLoadingStats(true);
      const stats = await ContentService.getDashboardStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading statistics:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive"
      });
    } finally {
      setLoadingStats(false);
    }
  };

  const refreshStatistics = async () => {
    await loadStatistics();
    toast({
      title: "Refreshed",
      description: "Dashboard statistics have been updated",
    });
  };

  const handleSignOut = async () => {
    const result = await signOut();
    if (!result.error) {
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of the admin dashboard",
      });
      navigate("/admin/login");
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">St. G. D. Convent School</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.email}</p>
              <Badge variant="secondary" className="text-xs">
                <ShieldCheckIcon className="w-3 h-3 mr-1" />
                Admin
              </Badge>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshStatistics}
              disabled={loadingStats}
            >
              <RefreshCwIcon className={`w-4 h-4 mr-2 ${loadingStats ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.open('/', '_blank')}>
              <HomeIcon className="w-4 h-4 mr-2" />
              Preview Site
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOutIcon className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loadingStats ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-8 rounded"></div>
                ) : (
                  statistics.totalUsers
                )}
              </div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Announcements</CardTitle>
              <FileTextIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loadingStats ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-8 rounded"></div>
                ) : (
                  statistics.totalAnnouncements
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Total announcements
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gallery Items</CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loadingStats ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-8 rounded"></div>
                ) : (
                  statistics.totalGalleryItems
                )}
              </div>
              <p className="text-xs text-muted-foreground">Photos in gallery</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Materials</CardTitle>
              <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loadingStats ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-8 rounded"></div>
                ) : (
                  statistics.totalLearningMaterials
                )}
              </div>
              <p className="text-xs text-muted-foreground">Available resources</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Footer Sections</CardTitle>
              <SettingsIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loadingStats ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-8 rounded"></div>
                ) : (
                  statistics.totalFooterSections
                )}
              </div>
              <p className="text-xs text-muted-foreground">Footer sections</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
            <CardDescription>
              Manage school content, announcements, gallery, and learning materials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-10">
                <TabsTrigger value="hero">
                  <HomeIcon className="w-4 h-4 mr-2" />
                  Hero
                </TabsTrigger>
                <TabsTrigger value="about">
                  <InfoIcon className="w-4 h-4 mr-2" />
                  About
                </TabsTrigger>
                <TabsTrigger value="vision">
                  <BookOpenIcon className="w-4 h-4 mr-2" />
                  Vision
                </TabsTrigger>
                <TabsTrigger value="history">
                  <FileTextIcon className="w-4 h-4 mr-2" />
                  History
                </TabsTrigger>
                <TabsTrigger value="facilities">
                  <SettingsIcon className="w-4 h-4 mr-2" />
                  Facilities
                </TabsTrigger>
                <TabsTrigger value="staff">
                  <UsersIcon className="w-4 h-4 mr-2" />
                  Staff
                </TabsTrigger>
                <TabsTrigger value="announcements">
                  <FileTextIcon className="w-4 h-4 mr-2" />
                  News
                </TabsTrigger>
                <TabsTrigger value="gallery">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Gallery
                </TabsTrigger>
                <TabsTrigger value="materials">
                  <BookOpenIcon className="w-4 h-4 mr-2" />
                  Materials
                </TabsTrigger>
                <TabsTrigger value="footer">
                  <SettingsIcon className="w-4 h-4 mr-2" />
                  Footer
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="hero" className="mt-6">
                <HeroEditor />
              </TabsContent>

              <TabsContent value="about" className="mt-6">
                <AboutEditor />
              </TabsContent>

              <TabsContent value="vision" className="mt-6">
                <VisionEditor />
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <HistoryEditor />
              </TabsContent>

              <TabsContent value="facilities" className="mt-6">
                <FacilitiesEditor />
              </TabsContent>

              <TabsContent value="staff" className="mt-6">
                <StaffEditor />
              </TabsContent>
              
              <TabsContent value="announcements" className="mt-6">
                <NotificationEditor />
              </TabsContent>
              
              <TabsContent value="gallery" className="mt-6">
                <GalleryEditor />
              </TabsContent>
              
              <TabsContent value="materials" className="mt-6">
                <MaterialsEditor />
              </TabsContent>
              
              <TabsContent value="footer" className="mt-6">
                <FooterEditor onSave={loadStatistics} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
