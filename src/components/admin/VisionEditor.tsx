import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Save, Plus, Trash2, Loader2 } from 'lucide-react';
import { ContentService } from '@/services/contentService';
import type { Database } from '@/integrations/supabase/types';

type VisionSection = Database['public']['Tables']['vision_section']['Row'];

export function VisionEditor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [visionData, setVisionData] = useState<VisionSection>({
    id: 'main',
    title: 'Our Vision & Mission',
    subtitle: 'Fostering a learning environment that nurtures excellence, character, and lifelong learning',
    main_content: 'At SchoolVerse Academy, we believe in providing an education that goes beyond textbooks. Our vision is to create a nurturing environment where students can discover their potential, develop critical skills, and become responsible global citizens prepared for the challenges of tomorrow.',
    principal_message: '',
    principal_name: '',
    principal_title: '',
    features: [
      {
        title: "Academic Excellence",
        description: "We maintain high academic standards through innovative teaching methods and comprehensive curriculum."
      },
      {
        title: "Inclusive Community",
        description: "Our diverse and supportive environment ensures every student feels valued and empowered to succeed."
      },
      {
        title: "Holistic Development",
        description: "We focus on developing well-rounded individuals through academic, social, and extracurricular activities."
      },
      {
        title: "Future-Ready Skills",
        description: "Our programs equip students with critical thinking, creativity, and technological skills for future success."
      }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  useEffect(() => {
    const loadVisionData = async () => {
      setLoading(true);
      const data = await ContentService.getVisionSection();
      if (data) {
        setVisionData(data);
      }
      setLoading(false);
    };
    loadVisionData();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const success = await ContentService.updateVisionSection(visionData);
    
    if (success) {
      toast({
        title: "Vision section updated successfully",
        description: "Changes will be reflected on the homepage",
      });
    } else {
      toast({
        title: "Error updating vision section",
        description: "Please try again later",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const addFeature = () => {
    const currentFeatures = Array.isArray(visionData.features) 
      ? visionData.features 
      : [];
    setVisionData({ 
      ...visionData, 
      features: [...currentFeatures, { title: '', description: '' }] 
    });
  };

  const removeFeature = (index: number) => {
    const currentFeatures = Array.isArray(visionData.features) 
      ? visionData.features 
      : [];
    const newFeatures = currentFeatures.filter((_, i) => i !== index);
    setVisionData({ ...visionData, features: newFeatures });
  };

  const updateFeature = (index: number, field: 'title' | 'description', value: string) => {
    const currentFeatures = Array.isArray(visionData.features) 
      ? visionData.features 
      : [];
    const newFeatures = [...currentFeatures];
    const feature = newFeatures[index] as { title: string; description: string };
    newFeatures[index] = { ...feature, [field]: value };
    setVisionData({ ...visionData, features: newFeatures });
  };

  const features = Array.isArray(visionData.features) 
    ? visionData.features.map(f => ({ 
        title: (f as any)?.title || '', 
        description: (f as any)?.description || '' 
      }))
    : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vision & Mission Editor</CardTitle>
          <CardDescription>
            Edit the vision and mission section content that appears on the homepage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vision-title">Section Title</Label>
              <Input
                id="vision-title"
                value={visionData.title}
                onChange={(e) => setVisionData({ ...visionData, title: e.target.value })}
                placeholder="Our Vision & Mission"
              />
            </div>
            <div>
              <Label htmlFor="vision-subtitle">Subtitle</Label>
              <Input
                id="vision-subtitle"
                value={visionData.subtitle || ''}
                onChange={(e) => setVisionData({ ...visionData, subtitle: e.target.value })}
                placeholder="Fostering a learning environment..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="vision-content">Main Content</Label>
            <Textarea
              id="vision-content"
              value={visionData.main_content || ''}
              onChange={(e) => setVisionData({ ...visionData, main_content: e.target.value })}
              placeholder="Our vision and mission statement..."
              rows={5}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vision Features</CardTitle>
          <CardDescription>
            Edit the key features and highlights of your vision
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

export default VisionEditor;
