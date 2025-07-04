
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

export function HeroEditor() {
  const { toast } = useToast();
  const [heroData, setHeroData] = useState({
    title: 'Welcome to St. G. D. Convent School',
    subtitle: 'Empowering students through innovative education and comprehensive learning experiences. Discover a vibrant community dedicated to academic excellence.',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    imageCaption: 'Inspiring Tomorrow\'s Leaders',
    imageDescription: 'Building character, creativity, and excellence'
  });

  const handleSave = () => {
    // In a real app, this would save to a database
    toast({
      title: "Hero section updated",
      description: "Changes will be reflected on the homepage",
    });
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
              value={heroData.title}
              onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="hero-subtitle">Subtitle</Label>
            <Textarea
              id="hero-subtitle"
              value={heroData.subtitle}
              onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
              rows={3}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hero Image</CardTitle>
          <CardDescription>Manage the hero section image and overlay text</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="hero-image">Image URL</Label>
            <Input
              id="hero-image"
              value={heroData.imageUrl}
              onChange={(e) => setHeroData({ ...heroData, imageUrl: e.target.value })}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="hero-caption">Image Caption</Label>
            <Input
              id="hero-caption"
              value={heroData.imageCaption}
              onChange={(e) => setHeroData({ ...heroData, imageCaption: e.target.value })}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="hero-description">Image Description</Label>
            <Input
              id="hero-description"
              value={heroData.imageDescription}
              onChange={(e) => setHeroData({ ...heroData, imageDescription: e.target.value })}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
