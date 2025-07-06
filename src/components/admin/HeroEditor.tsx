
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Save, Loader2 } from 'lucide-react';
import { ContentService } from '@/services/contentService';
import { ImageUpload } from '@/components/ui/image-upload';
import type { Database } from '@/integrations/supabase/types';

type HeroSection = Database['public']['Tables']['hero_section']['Row'];

export function HeroEditor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [heroData, setHeroData] = useState<Partial<HeroSection>>({
    title: 'Welcome to St. G. D. Convent School',
    subtitle: 'Empowering students through innovative education and comprehensive learning experiences. Discover a vibrant community dedicated to academic excellence.',
    description: null,
    image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    image_description: "Students learning together",
    primary_button_text: "Explore Gallery",
    primary_button_link: "/gallery",
    secondary_button_text: "Learning Materials",
    secondary_button_link: "/materials"
  });

  useEffect(() => {
    const loadHeroData = async () => {
      const data = await ContentService.getHeroSection();
      if (data) {
        setHeroData(data);
      }
    };
    loadHeroData();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const success = await ContentService.updateHeroSection(heroData);
      if (success) {
        toast({
          title: "Hero section updated",
          description: "Changes have been saved and will be reflected on the homepage",
        });
      } else {
        toast({
          title: "Error saving changes",
          description: "Please try again later",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error saving changes",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Main Content</CardTitle>
          <CardDescription>Edit the primary hero section content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="hero-title">Main Title</Label>
            <Input
              id="hero-title"
              value={heroData.title || ''}
              onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="hero-subtitle">Subtitle</Label>
            <Textarea
              id="hero-subtitle"
              value={heroData.subtitle || ''}
              onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
              rows={3}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="hero-description">Description (Optional)</Label>
            <Textarea
              id="hero-description"
              value={heroData.description || ''}
              onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
              rows={2}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Button Configuration</CardTitle>
          <CardDescription>Configure the call-to-action buttons</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primary-button-text">Primary Button Text</Label>
              <Input
                id="primary-button-text"
                value={heroData.primary_button_text || ''}
                onChange={(e) => setHeroData({ ...heroData, primary_button_text: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="primary-button-link">Primary Button Link</Label>
              <Input
                id="primary-button-link"
                value={heroData.primary_button_link || ''}
                onChange={(e) => setHeroData({ ...heroData, primary_button_link: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="secondary-button-text">Secondary Button Text</Label>
              <Input
                id="secondary-button-text"
                value={heroData.secondary_button_text || ''}
                onChange={(e) => setHeroData({ ...heroData, secondary_button_text: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="secondary-button-link">Secondary Button Link</Label>
              <Input
                id="secondary-button-link"
                value={heroData.secondary_button_link || ''}
                onChange={(e) => setHeroData({ ...heroData, secondary_button_link: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hero Image</CardTitle>
          <CardDescription>Upload or configure the hero section image</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageUpload
            label="Hero Image"
            value={heroData.image_url || ''}
            onChange={(url) => setHeroData({ ...heroData, image_url: url })}
            folder="hero"
            maxSizeMB={10}
          />
          
          <div>
            <Label htmlFor="hero-image-description">Image Description (Alt Text)</Label>
            <Input
              id="hero-image-description"
              value={heroData.image_description || ''}
              onChange={(e) => setHeroData({ ...heroData, image_description: e.target.value })}
              className="mt-1"
              placeholder="Describe the image for accessibility"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading} className="flex items-center gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
