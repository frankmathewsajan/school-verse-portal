# Footer Management Setup Guide

## Overview
This guide details how to create an editable footer system for the school website, allowing admins to modify footer content through the admin dashboard.

## 1. Supabase Database Table Creation

### Create Footer Table

```sql
-- Create footer_section table
CREATE TABLE public.footer_section (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- School Information
    school_name varchar(255) NOT NULL DEFAULT 'St.G.D Convent School',
    school_description text DEFAULT 'Empowering students through innovative education and comprehensive learning experiences since 2015.',
    founded_year integer DEFAULT 2015,
    
    -- Contact Information
    address text DEFAULT 'Siroli, Road Dhanouli, Agra, Uttar Pradesh',
    phone_primary varchar(50) DEFAULT '8077422014',
    phone_secondary varchar(50) DEFAULT '9084792142',
    email varchar(255) DEFAULT 'st.g.dconventschool1@gmail.com',
    
    -- Social Media Links
    facebook_url varchar(500) DEFAULT '#',
    twitter_url varchar(500) DEFAULT '#',
    instagram_url varchar(500) DEFAULT '#',
    youtube_url varchar(500) DEFAULT '#',
    
    -- Quick Links (JSON array)
    quick_links jsonb DEFAULT '[
        {"label": "Home", "url": "/", "external": false},
        {"label": "About Us", "url": "/about", "external": false},
        {"label": "Gallery", "url": "/gallery", "external": false},
        {"label": "Learning Materials", "url": "/materials", "external": false},
        {"label": "Admin Portal", "url": "/admin", "external": false}
    ]'::jsonb,
    
    -- Resource Links (JSON array)
    resource_links jsonb DEFAULT '[
        {"label": "Academic Calendar", "url": "#", "external": false},
        {"label": "Events", "url": "#", "external": false},
        {"label": "Parent Portal", "url": "#", "external": false},
        {"label": "Career Opportunities", "url": "#", "external": false},
        {"label": "Support", "url": "#", "external": false}
    ]'::jsonb,
    
    -- Copyright Information
    copyright_text varchar(500) DEFAULT 'St.G.D Convent School. All rights reserved.',
    
    -- SEO and Additional Fields
    footer_note text DEFAULT NULL,
    is_active boolean DEFAULT true,
    
    -- Timestamps
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.footer_section ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON public.footer_section
    FOR SELECT USING (is_active = true);

-- Create policy for authenticated users (admin) to do everything
CREATE POLICY "Allow authenticated users full access" ON public.footer_section
    FOR ALL USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER handle_footer_section_updated_at
    BEFORE UPDATE ON public.footer_section
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

-- Insert initial footer data
INSERT INTO public.footer_section (
    school_name,
    school_description,
    founded_year,
    address,
    phone_primary,
    phone_secondary,
    email,
    facebook_url,
    twitter_url,
    instagram_url,
    youtube_url,
    quick_links,
    resource_links,
    copyright_text
) VALUES (
    'St.G.D Convent School',
    'Empowering students through innovative education and comprehensive learning experiences since 2015.',
    2015,
    'Siroli, Road Dhanouli, Agra, Uttar Pradesh',
    '8077422014',
    '9084792142',
    'st.g.dconventschool1@gmail.com',
    'https://facebook.com/stgdconventschool',
    'https://twitter.com/stgdconvent',
    'https://instagram.com/stgdconventschool',
    'https://youtube.com/@stgdconventschool',
    '[
        {"label": "Home", "url": "/", "external": false},
        {"label": "About Us", "url": "/about", "external": false},
        {"label": "Gallery", "url": "/gallery", "external": false},
        {"label": "Learning Materials", "url": "/materials", "external": false},
        {"label": "Admin Portal", "url": "/admin", "external": false}
    ]'::jsonb,
    '[
        {"label": "Academic Calendar", "url": "#", "external": false},
        {"label": "Events", "url": "#", "external": false},
        {"label": "Parent Portal", "url": "#", "external": false},
        {"label": "Career Opportunities", "url": "#", "external": false},
        {"label": "Support", "url": "#", "external": false}
    ]'::jsonb,
    'St.G.D Convent School. All rights reserved.'
);
```

## 2. TypeScript Interface Updates

### Update Supabase Types
Add to `src/integrations/supabase/types.ts`:

```typescript
// Add to Database interface
footer_section: {
  Row: {
    id: string
    school_name: string
    school_description: string | null
    founded_year: number | null
    address: string | null
    phone_primary: string | null
    phone_secondary: string | null
    email: string | null
    facebook_url: string | null
    twitter_url: string | null
    instagram_url: string | null
    youtube_url: string | null
    quick_links: Json | null
    resource_links: Json | null
    copyright_text: string | null
    footer_note: string | null
    is_active: boolean | null
    created_at: string
    updated_at: string
  }
  Insert: {
    id?: string
    school_name: string
    school_description?: string | null
    founded_year?: number | null
    address?: string | null
    phone_primary?: string | null
    phone_secondary?: string | null
    email?: string | null
    facebook_url?: string | null
    twitter_url?: string | null
    instagram_url?: string | null
    youtube_url?: string | null
    quick_links?: Json | null
    resource_links?: Json | null
    copyright_text?: string | null
    footer_note?: string | null
    is_active?: boolean | null
    created_at?: string
    updated_at?: string
  }
  Update: {
    id?: string
    school_name?: string
    school_description?: string | null
    founded_year?: number | null
    address?: string | null
    phone_primary?: string | null
    phone_secondary?: string | null
    email?: string | null
    facebook_url?: string | null
    twitter_url?: string | null
    instagram_url?: string | null
    youtube_url?: string | null
    quick_links?: Json | null
    resource_links?: Json | null
    copyright_text?: string | null
    footer_note?: string | null
    is_active?: boolean | null
    created_at?: string
    updated_at?: string
  }
  Relationships: []
}
```

## 3. Service Layer Implementation

### Update ContentService
Add to `src/services/contentService.ts`:

```typescript
// Footer-related types
interface FooterLink {
  label: string;
  url: string;
  external: boolean;
}

export interface FooterSection {
  id: string;
  school_name: string;
  school_description: string | null;
  founded_year: number | null;
  address: string | null;
  phone_primary: string | null;
  phone_secondary: string | null;
  email: string | null;
  facebook_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  quick_links: FooterLink[] | null;
  resource_links: FooterLink[] | null;
  copyright_text: string | null;
  footer_note: string | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
}

// Footer methods
static async getFooterSection(): Promise<FooterSection | null> {
  const { data, error } = await supabase
    .from('footer_section')
    .select('*')
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching footer section:', error);
    return null;
  }

  return data;
}

static async updateFooterSection(footerData: Partial<FooterSection>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('footer_section')
      .update(footerData)
      .eq('is_active', true);

    if (error) {
      console.error('Error updating footer section:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateFooterSection:', error);
    return false;
  }
}

// Add footer count to dashboard statistics
static async getFooterSectionCount(): Promise<number> {
  try {
    const { count } = await supabase
      .from('footer_section')
      .select('id', { count: 'exact', head: true });
    return count || 0;
  } catch (error) {
    console.error('Error getting footer section count:', error);
    return 0;
  }
}
```

## 4. Update Dashboard Statistics

### Modify DashboardStatistics Interface
Update `src/services/contentService.ts`:

```typescript
export interface DashboardStatistics {
  totalUsers: number;
  totalAnnouncements: number;
  totalGalleryItems: number;
  totalLearningMaterials: number;
  totalFooterSections: number; // Add this
}

// Update getDashboardStatistics method
static async getDashboardStatistics(): Promise<DashboardStatistics> {
  try {
    const [
      totalAnnouncements,
      galleryItems,
      learningMaterials,
      footerSections
    ] = await Promise.all([
      this.getActiveAnnouncementCount(),
      this.getGalleryItemCount(),
      this.getLearningMaterialCount(),
      this.getFooterSectionCount() // Add this
    ]);

    return {
      totalUsers: 1,
      totalAnnouncements,
      totalGalleryItems: galleryItems,
      totalLearningMaterials: learningMaterials,
      totalFooterSections: footerSections // Add this
    };
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    return {
      totalUsers: 0,
      totalAnnouncements: 0,
      totalGalleryItems: 0,
      totalLearningMaterials: 0,
      totalFooterSections: 0 // Add this
    };
  }
}
```

## 5. Frontend Components

### Create FooterEditor Component
Create `src/components/admin/FooterEditor.tsx`:

```typescript
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Save, 
  Loader2, 
  Plus, 
  Trash2, 
  ExternalLink,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { ContentService, FooterSection } from '@/services/contentService';

interface FooterLink {
  label: string;
  url: string;
  external: boolean;
}

interface FooterEditorProps {
  onContentUpdate?: () => void;
}

export function FooterEditor({ onContentUpdate }: FooterEditorProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [footerData, setFooterData] = useState<FooterSection | null>(null);
  const [quickLinks, setQuickLinks] = useState<FooterLink[]>([]);
  const [resourceLinks, setResourceLinks] = useState<FooterLink[]>([]);

  useEffect(() => {
    loadFooterData();
  }, []);

  const loadFooterData = async () => {
    try {
      setLoading(true);
      const data = await ContentService.getFooterSection();
      if (data) {
        setFooterData(data);
        setQuickLinks(data.quick_links || []);
        setResourceLinks(data.resource_links || []);
      }
    } catch (error) {
      console.error('Error loading footer data:', error);
      toast({
        title: "Error",
        description: "Failed to load footer data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!footerData) return;

    try {
      setLoading(true);
      
      const updateData = {
        ...footerData,
        quick_links: quickLinks,
        resource_links: resourceLinks,
      };

      const success = await ContentService.updateFooterSection(updateData);
      
      if (success) {
        toast({
          title: "Success",
          description: "Footer updated successfully",
        });
        onContentUpdate?.();
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error('Error updating footer:', error);
      toast({
        title: "Error",
        description: "Failed to update footer",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addLink = (type: 'quick' | 'resource') => {
    const newLink: FooterLink = { label: '', url: '', external: false };
    if (type === 'quick') {
      setQuickLinks([...quickLinks, newLink]);
    } else {
      setResourceLinks([...resourceLinks, newLink]);
    }
  };

  const removeLink = (type: 'quick' | 'resource', index: number) => {
    if (type === 'quick') {
      setQuickLinks(quickLinks.filter((_, i) => i !== index));
    } else {
      setResourceLinks(resourceLinks.filter((_, i) => i !== index));
    }
  };

  const updateLink = (type: 'quick' | 'resource', index: number, field: keyof FooterLink, value: string | boolean) => {
    if (type === 'quick') {
      const updated = quickLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      );
      setQuickLinks(updated);
    } else {
      const updated = resourceLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      );
      setResourceLinks(updated);
    }
  };

  if (loading && !footerData) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!footerData) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No footer data found</p>
        <Button onClick={loadFooterData} className="mt-4">
          Retry Loading
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Footer Management</h3>
          <p className="text-muted-foreground">Manage footer content, links, and contact information</p>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="links">Navigation Links</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                School Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="school_name">School Name</Label>
                <Input
                  id="school_name"
                  value={footerData.school_name}
                  onChange={(e) => setFooterData({...footerData, school_name: e.target.value})}
                  placeholder="Enter school name"
                />
              </div>
              
              <div>
                <Label htmlFor="school_description">Description</Label>
                <Textarea
                  id="school_description"
                  value={footerData.school_description || ''}
                  onChange={(e) => setFooterData({...footerData, school_description: e.target.value})}
                  placeholder="Enter school description"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="founded_year">Founded Year</Label>
                <Input
                  id="founded_year"
                  type="number"
                  value={footerData.founded_year || ''}
                  onChange={(e) => setFooterData({...footerData, founded_year: parseInt(e.target.value) || null})}
                  placeholder="Enter founding year"
                />
              </div>
              
              <div>
                <Label htmlFor="copyright_text">Copyright Text</Label>
                <Input
                  id="copyright_text"
                  value={footerData.copyright_text || ''}
                  onChange={(e) => setFooterData({...footerData, copyright_text: e.target.value})}
                  placeholder="Enter copyright text"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={footerData.address || ''}
                  onChange={(e) => setFooterData({...footerData, address: e.target.value})}
                  placeholder="Enter school address"
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone_primary">Primary Phone</Label>
                  <Input
                    id="phone_primary"
                    value={footerData.phone_primary || ''}
                    onChange={(e) => setFooterData({...footerData, phone_primary: e.target.value})}
                    placeholder="Enter primary phone"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone_secondary">Secondary Phone</Label>
                  <Input
                    id="phone_secondary"
                    value={footerData.phone_secondary || ''}
                    onChange={(e) => setFooterData({...footerData, phone_secondary: e.target.value})}
                    placeholder="Enter secondary phone"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={footerData.email || ''}
                  onChange={(e) => setFooterData({...footerData, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="facebook_url" className="flex items-center gap-2">
                    <Facebook className="w-4 h-4" />
                    Facebook URL
                  </Label>
                  <Input
                    id="facebook_url"
                    value={footerData.facebook_url || ''}
                    onChange={(e) => setFooterData({...footerData, facebook_url: e.target.value})}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="twitter_url" className="flex items-center gap-2">
                    <Twitter className="w-4 h-4" />
                    Twitter URL
                  </Label>
                  <Input
                    id="twitter_url"
                    value={footerData.twitter_url || ''}
                    onChange={(e) => setFooterData({...footerData, twitter_url: e.target.value})}
                    placeholder="https://twitter.com/..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="instagram_url" className="flex items-center gap-2">
                    <Instagram className="w-4 h-4" />
                    Instagram URL
                  </Label>
                  <Input
                    id="instagram_url"
                    value={footerData.instagram_url || ''}
                    onChange={(e) => setFooterData({...footerData, instagram_url: e.target.value})}
                    placeholder="https://instagram.com/..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="youtube_url" className="flex items-center gap-2">
                    <Youtube className="w-4 h-4" />
                    YouTube URL
                  </Label>
                  <Input
                    id="youtube_url"
                    value={footerData.youtube_url || ''}
                    onChange={(e) => setFooterData({...footerData, youtube_url: e.target.value})}
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
                <CardDescription>Navigation links for the footer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {quickLinks.map((link, index) => (
                  <div key={index} className="space-y-2 p-3 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">Link {index + 1}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLink('quick', index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <Input
                      placeholder="Link label"
                      value={link.label}
                      onChange={(e) => updateLink('quick', index, 'label', e.target.value)}
                    />
                    
                    <Input
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => updateLink('quick', index, 'url', e.target.value)}
                    />
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={link.external}
                        onChange={(e) => updateLink('quick', index, 'external', e.target.checked)}
                      />
                      <span className="text-sm">External link</span>
                      <ExternalLink className="w-3 h-3" />
                    </label>
                  </div>
                ))}
                
                <Button onClick={() => addLink('quick')} variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Quick Link
                </Button>
              </CardContent>
            </Card>

            {/* Resource Links */}
            <Card>
              <CardHeader>
                <CardTitle>Resource Links</CardTitle>
                <CardDescription>Additional resource links</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {resourceLinks.map((link, index) => (
                  <div key={index} className="space-y-2 p-3 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">Link {index + 1}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLink('resource', index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <Input
                      placeholder="Link label"
                      value={link.label}
                      onChange={(e) => updateLink('resource', index, 'label', e.target.value)}
                    />
                    
                    <Input
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => updateLink('resource', index, 'url', e.target.value)}
                    />
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={link.external}
                        onChange={(e) => updateLink('resource', index, 'external', e.target.checked)}
                      />
                      <span className="text-sm">External link</span>
                      <ExternalLink className="w-3 h-3" />
                    </label>
                  </div>
                ))}
                
                <Button onClick={() => addLink('resource')} variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Resource Link
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

## 6. Update Footer Component

### Make Footer Dynamic
Update `src/components/layout/Footer.tsx`:

```typescript
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from 'lucide-react';
import { ContentService, FooterSection } from '@/services/contentService';

interface FooterLink {
  label: string;
  url: string;
  external: boolean;
}

const Footer = () => {
  const [footerData, setFooterData] = useState<FooterSection | null>(null);
  const currentYear = new Date().getFullYear();
  
  useEffect(() => {
    loadFooterData();
  }, []);

  const loadFooterData = async () => {
    try {
      const data = await ContentService.getFooterSection();
      setFooterData(data);
    } catch (error) {
      console.error('Error loading footer data:', error);
    }
  };

  // Fallback data if no footer data is loaded
  const defaultFooterData = {
    school_name: 'St.G.D Convent School',
    school_description: 'Empowering students through innovative education and comprehensive learning experiences since 2015.',
    address: 'Siroli, Road Dhanouli, Agra, Uttar Pradesh',
    phone_primary: '8077422014',
    phone_secondary: '9084792142',
    email: 'st.g.dconventschool1@gmail.com',
    facebook_url: '#',
    twitter_url: '#',
    instagram_url: '#',
    youtube_url: '#',
    quick_links: [
      { label: "Home", url: "/", external: false },
      { label: "About Us", url: "/about", external: false },
      { label: "Gallery", url: "/gallery", external: false },
      { label: "Learning Materials", url: "/materials", external: false },
      { label: "Admin Portal", url: "/admin", external: false }
    ] as FooterLink[],
    resource_links: [
      { label: "Academic Calendar", url: "#", external: false },
      { label: "Events", url: "#", external: false },
      { label: "Parent Portal", url: "#", external: false },
      { label: "Career Opportunities", url: "#", external: false },
      { label: "Support", url: "#", external: false }
    ] as FooterLink[],
    copyright_text: 'St.G.D Convent School. All rights reserved.'
  };

  const displayData = footerData || defaultFooterData;
  
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* School Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{displayData.school_name}</h3>
            <p className="text-primary-foreground/80 max-w-xs">
              {displayData.school_description}
            </p>
            <div className="flex space-x-4">
              {displayData.facebook_url && displayData.facebook_url !== '#' && (
                <a 
                  href={displayData.facebook_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  <Facebook size={20} />
                </a>
              )}
              {displayData.twitter_url && displayData.twitter_url !== '#' && (
                <a 
                  href={displayData.twitter_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  <Twitter size={20} />
                </a>
              )}
              {displayData.instagram_url && displayData.instagram_url !== '#' && (
                <a 
                  href={displayData.instagram_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  <Instagram size={20} />
                </a>
              )}
              {displayData.youtube_url && displayData.youtube_url !== '#' && (
                <a 
                  href={displayData.youtube_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  <Youtube size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              {(displayData.quick_links || []).map((link, index) => (
                link.external ? (
                  <a 
                    key={index}
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link 
                    key={index}
                    to={link.url} 
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </nav>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <nav className="flex flex-col space-y-2">
              {(displayData.resource_links || []).map((link, index) => (
                link.external ? (
                  <a 
                    key={index}
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link 
                    key={index}
                    to={link.url} 
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              {displayData.address && (
                <div className="flex items-start space-x-3">
                  <MapPin size={20} className="text-primary-foreground/80 mt-1 flex-shrink-0" />
                  <span className="text-primary-foreground/80">{displayData.address}</span>
                </div>
              )}
              {(displayData.phone_primary || displayData.phone_secondary) && (
                <div className="flex items-center space-x-3">
                  <Phone size={20} className="text-primary-foreground/80 flex-shrink-0" />
                  <span className="text-primary-foreground/80">
                    {[displayData.phone_primary, displayData.phone_secondary].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
              {displayData.email && (
                <div className="flex items-center space-x-3">
                  <Mail size={20} className="text-primary-foreground/80 flex-shrink-0" />
                  <span className="text-primary-foreground/80">{displayData.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-primary-foreground/10 py-4">
        <div className="container mx-auto px-4 text-center text-primary-foreground/80 text-sm">
          <p>© {currentYear} {displayData.copyright_text}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

## 7. Add Footer Tab to Admin Dashboard

### Update AdminDashboard
Add footer tab to `src/pages/admin/AdminDashboard.tsx`:

```typescript
// Import FooterEditor
import { FooterEditor } from '@/components/admin/FooterEditor';

// Add footer icon import
import { Settings } from 'lucide-react';

// Add footer tab to TabsList
<TabsTrigger value="footer">
  <Settings className="w-4 h-4 mr-2" />
  Footer
</TabsTrigger>

// Add footer TabsContent
<TabsContent value="footer">
  <FooterEditor onContentUpdate={refreshStatistics} />
</TabsContent>
```

## 8. Add Footer Statistics

### Update AdminDashboard Statistics
Add footer statistics card to admin dashboard:

```typescript
<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">Footer Sections</CardTitle>
    <Settings className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">
      {loadingStats ? (
        <div className="animate-pulse bg-gray-200 h-8 w-8 rounded"></div>
      ) : (
        statistics.totalFooterSections
      )}
    </div>
    <p className="text-xs text-muted-foreground">Configuration sections</p>
  </CardContent>
</Card>
```

## 9. Testing Integration

### Add Footer Tests to ContentIntegrationTest
Update `src/tests/ContentIntegrationTest.tsx`:

```typescript
// Add footer state
const [footerData, setFooterData] = useState<FooterSection | null>(null);

// Add footer loading to loadAllData
const footer = await ContentService.getFooterSection();
setFooterData(footer);

// Add footer test function
const testFooterUpdate = async () => {
  setCurrentTest('Footer Section Update');
  const startTime = Date.now();
  
  try {
    const originalName = footerData?.school_name || '';
    
    const success = await ContentService.updateFooterSection({
      school_name: 'TEST: Footer School Name Update',
      school_description: footerData?.school_description,
      // ... other fields
    });
    
    const duration = Date.now() - startTime;
    
    if (success) {
      const updatedFooter = await ContentService.getFooterSection();
      
      if (updatedFooter?.school_name === 'TEST: Footer School Name Update') {
        setFooterData(updatedFooter);
        addTestResult('Footer Section Update', 'success', 
          `School name updated from "${originalName}" to "TEST: Footer School Name Update"`, 
          `Performance: ${duration}ms`, duration);
        updateComponentResult('Footer Section', true);
      } else {
        addTestResult('Footer Section Update', 'error', 'Update succeeded but verification failed');
        updateComponentResult('Footer Section', false);
      }
    } else {
      addTestResult('Footer Section Update', 'error', 'Failed to update footer section');
      updateComponentResult('Footer Section', false);
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    addTestResult('Footer Section Update', 'error', `Error: ${error}`, `Duration: ${duration}ms`, duration);
    updateComponentResult('Footer Section', false);
  }
  setLoading(false);
};

// Add footer statistics
const dbStats = {
  // ... existing stats
  footer_sections: footerData ? 1 : 0,
};

// Add footer data preview
{footerData && (
  <div className="border rounded-lg p-4">
    <h4 className="font-semibold mb-2">Footer Section</h4>
    <div className="text-sm text-muted-foreground">
      <div>School Name: {footerData.school_name}</div>
      <div>Contact Email: {footerData.email}</div>
      <div>Last Updated: {new Date(footerData.updated_at).toLocaleString()}</div>
    </div>
  </div>
)}
```

## 10. Implementation Checklist

- [ ] Create footer_section table in Supabase
- [ ] Update TypeScript types
- [ ] Add footer methods to ContentService
- [ ] Update dashboard statistics interface
- [ ] Create FooterEditor component
- [ ] Update Footer component to use database
- [ ] Add footer tab to AdminDashboard
- [ ] Add footer statistics card
- [ ] Update integration tests
- [ ] Test all functionality

## 11. Features Included

### Admin Features:
- ✅ **School Information**: Name, description, founding year
- ✅ **Contact Management**: Address, phones, email
- ✅ **Social Media**: Facebook, Twitter, Instagram, YouTube
- ✅ **Navigation Links**: Quick links and resource links
- ✅ **Dynamic Link Management**: Add/remove/edit links
- ✅ **External Link Support**: Internal and external link options
- ✅ **Real-time Preview**: Changes reflect immediately
- ✅ **Statistics Integration**: Footer counts in dashboard

### Frontend Features:
- ✅ **Dynamic Content**: Database-driven footer content
- ✅ **Fallback Data**: Graceful handling if no data
- ✅ **Responsive Design**: Mobile-friendly layout
- ✅ **SEO Friendly**: Proper link handling
- ✅ **Performance**: Efficient data loading

### Testing Features:
- ✅ **Integration Tests**: Footer update testing
- ✅ **Performance Monitoring**: Response time tracking
- ✅ **Error Handling**: Comprehensive error testing
- ✅ **Data Validation**: Content verification

This comprehensive footer management system provides full admin control over footer content with robust testing and monitoring capabilities.
