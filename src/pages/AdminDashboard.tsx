
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  LogOutIcon, 
  UsersIcon, 
  FileTextIcon, 
  ImageIcon, 
  BookOpenIcon,
  SettingsIcon,
  Home,
  RefreshCwIcon
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ContentService, DashboardStatistics } from '@/services/contentService';
import { SystemSettingsService } from '@/services/systemSettingsService';

// Import the new admin components
import AnnouncementManager from '@/components/admin/AnnouncementManager';
import GalleryManager from '@/components/admin/GalleryManager';
import LearningMaterialsManager from '@/components/admin/LearningMaterialsManager';
import LeadershipManager from '@/components/admin/LeadershipManager';
import FooterEditor from '@/components/admin/FooterEditor';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading, user, signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('announcements');
  const [statistics, setStatistics] = useState<DashboardStatistics>({
    totalUsers: 0,
    totalAnnouncements: 0,
    totalGalleryItems: 0,
    totalLearningMaterials: 0,
    totalFooterSections: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [signupDisabled, setSignupDisabled] = useState(false);

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

  // Load system settings
  useEffect(() => {
    const loadSettings = () => {
      setSignupDisabled(SystemSettingsService.isSignupDisabled());
    };
    
    loadSettings();
    
    // Listen for settings changes
    const handleSettingsChange = () => {
      loadSettings();
    };
    
    window.addEventListener('systemSettingsChanged', handleSettingsChange);
    return () => window.removeEventListener('systemSettingsChanged', handleSettingsChange);
  }, []);

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

  const handlePreview = () => {
    window.open('/', '_blank');
  };

  const handleToggleSignup = () => {
    const success = SystemSettingsService.toggleSignupDisabled();
    if (success) {
      const newState = SystemSettingsService.isSignupDisabled();
      setSignupDisabled(newState);
      toast({
        title: "Settings Updated",
        description: `User signup has been ${newState ? 'disabled' : 'enabled'}`,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update signup settings",
        variant: "destructive"
      });
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
            <Button variant="outline" size="sm" onClick={handlePreview}>
              <Home className="w-4 h-4 mr-2" />
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
        </div>

        {/* Additional Statistics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
          <div></div>
          <div></div>
          <div></div>
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
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="announcements">
                  <FileTextIcon className="w-4 h-4 mr-2" />
                  Announcements
                </TabsTrigger>
                <TabsTrigger value="gallery">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Gallery
                </TabsTrigger>
                <TabsTrigger value="materials">
                  <BookOpenIcon className="w-4 h-4 mr-2" />
                  Materials
                </TabsTrigger>
                <TabsTrigger value="leadership">
                  <UsersIcon className="w-4 h-4 mr-2" />
                  Leadership
                </TabsTrigger>
                <TabsTrigger value="footer">
                  <SettingsIcon className="w-4 h-4 mr-2" />
                  Footer
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <SettingsIcon className="w-4 h-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="announcements" className="mt-6">
                <AnnouncementManager onContentUpdate={loadStatistics} />
              </TabsContent>
              
              <TabsContent value="gallery" className="mt-6">
                <GalleryManager onContentUpdate={loadStatistics} />
              </TabsContent>
              
              <TabsContent value="materials" className="mt-6">
                <LearningMaterialsManager onContentUpdate={loadStatistics} />
              </TabsContent>
              
              <TabsContent value="leadership" className="mt-6">
                <LeadershipManager onContentUpdate={loadStatistics} />
              </TabsContent>
              
              <TabsContent value="footer" className="mt-6">
                <FooterEditor onSave={loadStatistics} />
              </TabsContent>
              
              <TabsContent value="settings" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>System Settings</CardTitle>
                    <CardDescription>
                      Configure system settings and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* User Access Control */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold">User Access Control</h4>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="space-y-0.5">
                            <Label htmlFor="signup-toggle" className="text-sm font-medium">
                              Disable User Signup
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              When enabled, new users cannot create accounts. Only existing users can sign in.
                            </p>
                          </div>
                          <Switch
                            id="signup-toggle"
                            checked={signupDisabled}
                            onCheckedChange={handleToggleSignup}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <p>Current status: {signupDisabled ? '🔒 Signup is disabled' : '🔓 Signup is enabled'}</p>
                        </div>
                      </div>
                      
                      {/* Authentication Settings */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold">Authentication</h4>
                          <div className="text-sm text-muted-foreground">
                            <p>Admin Passkey: 143143</p>
                            <p>Allowed Domains: gmail.com, outlook.com, hotmail.com</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold">Database</h4>
                          <div className="text-sm text-muted-foreground">
                            <p>Connected to Supabase</p>
                            <p>Project: sfffnjjozmkmugdchhaq</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
