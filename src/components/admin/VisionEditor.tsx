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
  const [activeLang, setActiveLang] = useState<'en' | 'hi'>('en');
  const [visionData, setVisionData] = useState<any>({
    title_en: 'Our Vision & Mission',
    title_hi: '',
    subtitle_en: 'Fostering a learning environment that nurtures excellence, character, and lifelong learning',
    subtitle_hi: '',
    main_content_en: 'At SchoolVerse Academy, we believe in providing an education that goes beyond textbooks. Our vision is to create a nurturing environment where students can discover their potential, develop critical skills, and become responsible global citizens prepared for the challenges of tomorrow.',
    main_content_hi: '',
    principal_message_en: '',
    principal_message_hi: '',
    principal_name_en: '',
    principal_name_hi: '',
    principal_title_en: '',
    principal_title_hi: '',
    features_en: [
      { title: 'Academic Excellence', description: 'We maintain high academic standards through innovative teaching methods and comprehensive curriculum.' },
      { title: 'Inclusive Community', description: 'Our diverse and supportive environment ensures every student feels valued and empowered to succeed.' },
      { title: 'Holistic Development', description: 'We focus on developing well-rounded individuals through academic, social, and extracurricular activities.' },
      { title: 'Future-Ready Skills', description: 'Our programs equip students with critical thinking, creativity, and technological skills for future success.' }
    ],
    features_hi: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  useEffect(() => {
    const loadVisionData = async () => {
      setLoading(true);
      const data = await ContentService.getVisionSection();
      if (data) {
        setVisionData({ ...visionData, ...data });
      }
      setLoading(false);
    };
    loadVisionData();
    // eslint-disable-next-line
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const success = await ContentService.updateVisionSection(visionData);
    if (success) {
      toast({
        title: 'Vision section updated successfully',
        description: 'Changes will be reflected on the homepage',
      });
    } else {
      toast({
        title: 'Error updating vision section',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  const langField = (field: string) => (activeLang === 'en' ? `${field}_en` : `${field}_hi`);

  // Features helpers
  const features = visionData[langField('features')] || [];
  const addFeature = () => {
    setVisionData({
      ...visionData,
      [langField('features')]: [...features, { title: '', description: '' }],
    });
  };
  const removeFeature = (index: number) => {
    setVisionData({
      ...visionData,
      [langField('features')]: features.filter((_: any, i: number) => i !== index),
    });
  };
  const updateFeature = (index: number, field: 'title' | 'description', value: string) => {
    const newFeatures = [...features];
    newFeatures[index][field] = value;
    setVisionData({
      ...visionData,
      [langField('features')]: newFeatures,
    });
  };

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
          <CardTitle>Vision & Mission Editor</CardTitle>
          <CardDescription>Edit the vision and mission section content that appears on the homepage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vision-title">Section Title ({activeLang === 'en' ? 'English' : 'Hindi'})</Label>
              <Input
                id="vision-title"
                value={visionData[langField('title')] || ''}
                onChange={(e) => setVisionData({ ...visionData, [langField('title')]: e.target.value })}
                placeholder={activeLang === 'en' ? 'Our Vision & Mission' : 'हमारा दृष्टिकोण और मिशन'}
              />
            </div>
            <div>
              <Label htmlFor="vision-subtitle">Subtitle ({activeLang === 'en' ? 'English' : 'Hindi'})</Label>
              <Input
                id="vision-subtitle"
                value={visionData[langField('subtitle')] || ''}
                onChange={(e) => setVisionData({ ...visionData, [langField('subtitle')]: e.target.value })}
                placeholder={activeLang === 'en' ? 'Fostering a learning environment...' : 'एक सीखने का वातावरण विकसित करना...'}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="vision-content">Main Content ({activeLang === 'en' ? 'English' : 'Hindi'})</Label>
            <Textarea
              id="vision-content"
              value={visionData[langField('main_content')] || ''}
              onChange={(e) => setVisionData({ ...visionData, [langField('main_content')]: e.target.value })}
              placeholder={activeLang === 'en' ? 'Our vision and mission statement...' : 'हमारा दृष्टिकोण और मिशन वक्तव्य...'}
              rows={5}
            />
          </div>
          <div>
            <Label htmlFor="principal-message">Principal's Message ({activeLang === 'en' ? 'English' : 'Hindi'})</Label>
            <Textarea
              id="principal-message"
              value={visionData[langField('principal_message')] || ''}
              onChange={(e) => setVisionData({ ...visionData, [langField('principal_message')]: e.target.value })}
              placeholder={activeLang === 'en' ? "Principal's inspirational message" : 'प्रधानाचार्य का संदेश'}
              rows={4}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="principal-name">Principal's Name ({activeLang === 'en' ? 'English' : 'Hindi'})</Label>
              <Input
                id="principal-name"
                value={visionData[langField('principal_name')] || ''}
                onChange={(e) => setVisionData({ ...visionData, [langField('principal_name')]: e.target.value })}
                placeholder={activeLang === 'en' ? 'Dr. Ashirwad Goel' : 'डॉ. अशीरवाद गोयल'}
              />
            </div>
            <div>
              <Label htmlFor="principal-title">Principal's Title ({activeLang === 'en' ? 'English' : 'Hindi'})</Label>
              <Input
                id="principal-title"
                value={visionData[langField('principal_title')] || ''}
                onChange={(e) => setVisionData({ ...visionData, [langField('principal_title')]: e.target.value })}
                placeholder={activeLang === 'en' ? 'Principal, St.G.D.Convent School' : 'प्रधानाचार्य, सेंट जी. डी. कॉन्वेंट स्कूल'}
              />
            </div>
          </div>
          {/* Features Section */}
          <div className="mt-6">
            <Label>Features ({activeLang === 'en' ? 'English' : 'Hindi'})</Label>
            <Button type="button" variant="outline" size="sm" onClick={addFeature}>
              <Plus className="w-4 h-4 mr-2" />
              Add Feature
            </Button>
            {features.map((feature: any, index: number) => (
              <div key={index} className="flex gap-2 items-start mt-2">
                <Input
                  value={feature.title}
                  onChange={(e) => updateFeature(index, 'title', e.target.value)}
                  placeholder={activeLang === 'en' ? 'Feature Title' : 'विशेषता शीर्षक'}
                  className="flex-1"
                />
                <Textarea
                  value={feature.description}
                  onChange={(e) => updateFeature(index, 'description', e.target.value)}
                  placeholder={activeLang === 'en' ? 'Feature Description' : 'विशेषता विवरण'}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeFeature(index)}
                  className="mt-1"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
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
