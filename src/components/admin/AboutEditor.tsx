import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Save, Plus, Trash2, Loader2 } from 'lucide-react';
import { ContentService } from '@/services/contentService';
import { ImageUpload } from '@/components/ui/image-upload';
import type { Database } from '@/integrations/supabase/types';

type AboutSection = Database['public']['Tables']['about_section']['Row'];

export function AboutEditor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [aboutData, setAboutData] = useState<AboutSection & { about_image_url?: string }>({
    id: 'main',
    title: 'About Our School',
    subtitle: 'Excellence in education through innovative teaching and comprehensive curriculum',
    main_content: [
      'St. G. D. Convent School is a leading educational institution committed to providing a balanced and stimulating learning environment where students can achieve academic excellence and personal growth.',
      'Our comprehensive curriculum is designed to develop critical thinking, creativity, and problem-solving skills, preparing students for success in higher education and beyond.',
      'We pride ourselves on small class sizes, dedicated teachers, and a supportive community that nurtures each student\'s individual talents and abilities.'
    ],
    principal_message: 'Education is not just about academic achievement, but about nurturing curious minds, compassionate hearts, and resilient spirits. At St. G. D. Convent School, we are committed to guiding each student on their unique journey of growth and discovery.',
    principal_name: 'Mr. Ashirwad Goyal',
    principal_title: 'Principal, St. G. D. Convent School',
    principal_image_url: 'https://randomuser.me/api/portraits/women/45.jpg',
    about_image_url: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    school_founded_year: 1985,
    school_description: null,
    features: [
      {
        title: "Founded in 1985",
        description: "With decades of educational excellence and a strong foundation in values-based learning"
      },
      {
        title: "Diverse Community",
        description: "Creating an inclusive environment where every student feels valued and empowered"
      },
      {
        title: "Comprehensive Curriculum",
        description: "Balancing academic rigor with holistic development for well-rounded education"
      },
      {
        title: "Academic Excellence",
        description: "Consistent record of outstanding achievements in academics and extracurriculars"
      }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  useEffect(() => {
    const loadAboutData = async () => {
      setLoading(true);
      const data = await ContentService.getAboutSection();
      if (data) {
        setAboutData(data);
      }
      setLoading(false);
    };
    loadAboutData();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const success = await ContentService.updateAboutSection(aboutData);
    
    if (success) {
      toast({
        title: "About section updated successfully",
        description: "Changes will be reflected on the homepage",
      });
    } else {
      toast({
        title: "Error updating about section",
        description: "Please try again later",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const addMainContentParagraph = () => {
    const currentContent = Array.isArray(aboutData.main_content) 
      ? aboutData.main_content 
      : [];
    setAboutData({ 
      ...aboutData, 
      main_content: [...currentContent, ''] 
    });
  };

  const removeMainContentParagraph = (index: number) => {
    const currentContent = Array.isArray(aboutData.main_content) 
      ? aboutData.main_content 
      : [];
    const newContent = currentContent.filter((_, i) => i !== index);
    setAboutData({ ...aboutData, main_content: newContent });
  };

  const updateMainContentParagraph = (index: number, value: string) => {
    const currentContent = Array.isArray(aboutData.main_content) 
      ? aboutData.main_content 
      : [];
    const newContent = [...currentContent];
    newContent[index] = value;
    setAboutData({ ...aboutData, main_content: newContent });
  };

  const addFeature = () => {
    const currentFeatures = Array.isArray(aboutData.features) 
      ? aboutData.features 
      : [];
    setAboutData({ 
      ...aboutData, 
      features: [...currentFeatures, { title: '', description: '' }] 
    });
  };

  const removeFeature = (index: number) => {
    const currentFeatures = Array.isArray(aboutData.features) 
      ? aboutData.features 
      : [];
    const newFeatures = currentFeatures.filter((_, i) => i !== index);
    setAboutData({ ...aboutData, features: newFeatures });
  };

  const updateFeature = (index: number, field: 'title' | 'description', value: string) => {
    const currentFeatures = Array.isArray(aboutData.features) 
      ? aboutData.features 
      : [];
    const newFeatures = [...currentFeatures];
    const feature = newFeatures[index] as { title: string; description: string };
    newFeatures[index] = { ...feature, [field]: value };
    setAboutData({ ...aboutData, features: newFeatures });
  };

  const mainContent = Array.isArray(aboutData.main_content) 
    ? aboutData.main_content.map(item => typeof item === 'string' ? item : JSON.stringify(item))
    : [];

  const features = Array.isArray(aboutData.features) 
    ? aboutData.features.map(f => ({ 
        title: (f as any)?.title || '', 
        description: (f as any)?.description || '' 
      }))
    : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>About Section Editor</CardTitle>
          <CardDescription>
            Edit the about section content that appears on the homepage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Section Title</Label>
              <Input
                id="title"
                value={aboutData.title}
                onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                placeholder="About Our School"
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={aboutData.subtitle || ''}
                onChange={(e) => setAboutData({ ...aboutData, subtitle: e.target.value })}
                placeholder="Excellence in education..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="school-founded-year">School Founded Year</Label>
            <Input
              id="school-founded-year"
              type="number"
              value={aboutData.school_founded_year || ''}
              onChange={(e) => setAboutData({ ...aboutData, school_founded_year: parseInt(e.target.value) || null })}
              placeholder="1985"
            />
          </div>

          <ImageUpload
            label="About Section Image"
            value={(aboutData as any).about_image_url || ''}
            onChange={(url) => setAboutData({ ...aboutData, about_image_url: url } as any)}
            folder="about"
            maxSizeMB={10}
          />

          <div>
            <div className="flex justify-between items-center">
              <Label>Main Content Paragraphs</Label>
              <Button type="button" variant="outline" size="sm" onClick={addMainContentParagraph}>
                <Plus className="w-4 h-4 mr-2" />
                Add Paragraph
              </Button>
            </div>
            {mainContent.map((paragraph, index) => (
              <div key={index} className="flex gap-2 items-start">
                <Textarea
                  value={paragraph}
                  onChange={(e) => updateMainContentParagraph(index, e.target.value)}
                  placeholder="Enter paragraph content"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeMainContentParagraph(index)}
                  className="mt-1"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Principal Information</CardTitle>
          <CardDescription>
            Edit the principal's message and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="principal-message">Principal's Message</Label>
            <Textarea
              id="principal-message"
              value={aboutData.principal_message || ''}
              onChange={(e) => setAboutData({ ...aboutData, principal_message: e.target.value })}
              placeholder="Principal's inspirational message"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="principal-name">Principal's Name</Label>
              <Input
                id="principal-name"
                value={aboutData.principal_name || ''}
                onChange={(e) => setAboutData({ ...aboutData, principal_name: e.target.value })}
                placeholder="Mr. Ashirwad Goyal"
              />
            </div>
            <div>
              <Label htmlFor="principal-title">Principal's Title</Label>
              <Input
                id="principal-title"
                value={aboutData.principal_title || ''}
                onChange={(e) => setAboutData({ ...aboutData, principal_title: e.target.value })}
                placeholder="Principal, St. G. D. Convent School"
              />
            </div>
          </div>

          <ImageUpload
            label="Principal's Photo"
            value={aboutData.principal_image_url || ''}
            onChange={(url) => setAboutData({ ...aboutData, principal_image_url: url })}
            folder="principal"
            maxSizeMB={5}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>School Features</CardTitle>
          <CardDescription>
            Edit the key features and highlights of the school
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Features</Label>
            <Button type="button" variant="outline" size="sm" onClick={addFeature}>
              <Plus className="w-4 h-4 mr-2" />
              Add Feature
            </Button>
          </div>
          {features.map((feature, index) => (
            <div key={index} className="space-y-2 p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-2">
                  <Input
                    value={feature.title}
                    onChange={(e) => updateFeature(index, 'title', e.target.value)}
                    placeholder="Feature title"
                  />
                  <Textarea
                    value={feature.description}
                    onChange={(e) => updateFeature(index, 'description', e.target.value)}
                    placeholder="Feature description"
                    rows={2}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeFeature(index)}
                  className="ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
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
    </div>
  );
}
