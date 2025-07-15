
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
  const [activeLang, setActiveLang] = useState<'en' | 'hi'>('en');
  const [heroData, setHeroData] = useState<any>({
    title_en: 'Welcome to St. G. D. Convent School',
    title_hi: '',
    subtitle_en: 'Empowering students through innovative education and comprehensive learning experiences. Discover a vibrant community dedicated to academic excellence.',
    subtitle_hi: '',
    description_en: '',
    description_hi: '',
    image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    image_description_en: 'Students learning together',
    image_description_hi: '',
    primary_button_text_en: 'Explore Gallery',
    primary_button_text_hi: '',
    primary_button_link: '/gallery',
    secondary_button_text_en: 'Learning Materials',
    secondary_button_text_hi: '',
    secondary_button_link: '/materials',
  });

  useEffect(() => {
    const loadHeroData = async () => {
      const data = await ContentService.getHeroSection();
      if (data) {
        setHeroData({ ...heroData, ...data });
      }
    };
    loadHeroData();
    // eslint-disable-next-line
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const success = await ContentService.updateHeroSection(heroData);
      if (success) {
        toast({
          title: 'Hero section updated',
          description: 'Changes have been saved and will be reflected on the homepage',
        });
      } else {
        toast({
          title: 'Error saving changes',
          description: 'Please try again later',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error saving changes',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const langField = (field: string) => (activeLang === 'en' ? `${field}_en` : `${field}_hi`);

  return (
    <div className="space-y-6">
      {/* Language Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded ${activeLang === 'en' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveLang('en')}
        >
          English
        </button>
        <button
          className={`px-4 py-2 rounded ${activeLang === 'hi' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveLang('hi')}
        >
          हिंदी
        </button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Main Content</CardTitle>
          <CardDescription>Edit the primary hero section content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="hero-title">Main Title ({activeLang === 'en' ? 'English' : 'Hindi'})</Label>
            <Input
              id="hero-title"
              value={heroData[langField('title')] || ''}
              onChange={(e) => setHeroData({ ...heroData, [langField('title')]: e.target.value })}
              className="mt-1"
              placeholder={activeLang === 'en' ? 'Welcome to St. G. D. Convent School' : 'सेंट जी. डी. कॉन्वेंट स्कूल में आपका स्वागत है'}
            />
          </div>
          <div>
            <Label htmlFor="hero-subtitle">Subtitle ({activeLang === 'en' ? 'English' : 'Hindi'})</Label>
            <Textarea
              id="hero-subtitle"
              value={heroData[langField('subtitle')] || ''}
              onChange={(e) => setHeroData({ ...heroData, [langField('subtitle')]: e.target.value })}
              rows={3}
              className="mt-1"
              placeholder={activeLang === 'en' ? 'Empowering students...' : 'छात्रों को सशक्त बनाना...'}
            />
          </div>
          <div>
            <Label htmlFor="hero-description">Description ({activeLang === 'en' ? 'English' : 'Hindi'})</Label>
            <Textarea
              id="hero-description"
              value={heroData[langField('description')] || ''}
              onChange={(e) => setHeroData({ ...heroData, [langField('description')]: e.target.value })}
              rows={2}
              className="mt-1"
              placeholder={activeLang === 'en' ? 'Description' : 'विवरण'}
            />
          </div>
          <div>
            <Label htmlFor="hero-image-description">Image Description ({activeLang === 'en' ? 'English' : 'Hindi'})</Label>
            <Input
              id="hero-image-description"
              value={heroData[langField('image_description')] || ''}
              onChange={(e) => setHeroData({ ...heroData, [langField('image_description')]: e.target.value })}
              className="mt-1"
              placeholder={activeLang === 'en' ? 'Students learning together' : 'छात्र एक साथ सीख रहे हैं'}
            />
          </div>
          <div>
            <Label htmlFor="hero-image-url">Image URL</Label>
            <Input
              id="hero-image-url"
              value={heroData.image_url || ''}
              onChange={(e) => setHeroData({ ...heroData, image_url: e.target.value })}
              className="mt-1"
              placeholder="Image URL"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primary-button-text">Primary Button Text ({activeLang === 'en' ? 'English' : 'Hindi'})</Label>
              <Input
                id="primary-button-text"
                value={heroData[langField('primary_button_text')] || ''}
                onChange={(e) => setHeroData({ ...heroData, [langField('primary_button_text')]: e.target.value })}
                className="mt-1"
                placeholder={activeLang === 'en' ? 'Explore Gallery' : 'गैलरी देखें'}
              />
            </div>
            <div>
              <Label htmlFor="primary-button-link">Primary Button Link</Label>
              <Input
                id="primary-button-link"
                value={heroData.primary_button_link || ''}
                onChange={(e) => setHeroData({ ...heroData, primary_button_link: e.target.value })}
                className="mt-1"
                placeholder="/gallery"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="secondary-button-text">Secondary Button Text ({activeLang === 'en' ? 'English' : 'Hindi'})</Label>
              <Input
                id="secondary-button-text"
                value={heroData[langField('secondary_button_text')] || ''}
                onChange={(e) => setHeroData({ ...heroData, [langField('secondary_button_text')]: e.target.value })}
                className="mt-1"
                placeholder={activeLang === 'en' ? 'Learning Materials' : 'शैक्षिक सामग्री'}
              />
            </div>
            <div>
              <Label htmlFor="secondary-button-link">Secondary Button Link</Label>
              <Input
                id="secondary-button-link"
                value={heroData.secondary_button_link || ''}
                onChange={(e) => setHeroData({ ...heroData, secondary_button_link: e.target.value })}
                className="mt-1"
                placeholder="/materials"
              />
            </div>
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
