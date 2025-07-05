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
  InfoIcon
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

// Import the new admin components
import { HeroEditor } from '@/components/admin/HeroEditor';
import { AboutEditor } from '@/components/admin/AboutEditor';
import { NotificationEditor } from '@/components/admin/NotificationEditor';
import { GalleryEditor } from '@/components/admin/GalleryEditor';
import { MaterialsEditor } from '@/components/admin/MaterialsEditor';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading, user, signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('hero');

  // Protect the route
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, authLoading, navigate]);

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
            <Button variant="outline" size="sm" onClick={handlePreview}>
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
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Announcements</CardTitle>
              <FileTextIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Active announcements</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gallery Items</CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Photos in gallery</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Materials</CardTitle>
              <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Available resources</p>
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
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="hero">
                  <HomeIcon className="w-4 h-4 mr-2" />
                  Hero
                </TabsTrigger>
                <TabsTrigger value="about">
                  <InfoIcon className="w-4 h-4 mr-2" />
                  About
                </TabsTrigger>
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
                <TabsTrigger value="settings">
                  <SettingsIcon className="w-4 h-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="hero" className="mt-6">
                <HeroEditor />
              </TabsContent>

              <TabsContent value="about" className="mt-6">
                <AboutEditor />
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
              
              <TabsContent value="settings" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>System Settings</CardTitle>
                    <CardDescription>
                      Configure system settings and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
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
                            <p>Project: plgjavfrwcphrehmthdv</p>
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
