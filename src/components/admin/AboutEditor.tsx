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
  // Add language toggle state
  const [activeLang, setActiveLang] = useState<'en' | 'hi'>('en');
  // Update aboutData to support both languages
  const [aboutData, setAboutData] = useState<any>({
    id: 'main',
    title_en: 'About Our School',
    title_hi: '',
    subtitle_en: 'Excellence in education through innovative teaching and comprehensive curriculum',
    subtitle_hi: '',
    main_content_en: [
      'St. G. D. Convent School is a leading educational institution committed to providing a balanced and stimulating learning environment where students can achieve academic excellence and personal growth.',
      'Our comprehensive curriculum is designed to develop critical thinking, creativity, and problem-solving skills, preparing students for success in higher education and beyond.',
      'We pride ourselves on small class sizes, dedicated teachers, and a supportive community that nurtures each student\'s individual talents and abilities.'
    ],
    main_content_hi: [],
    principal_message_en: 'Education is not just about academic achievement, but about nurturing curious minds, compassionate hearts, and resilient spirits. At St. G. D. Convent School, we are committed to guiding each student on their unique journey of growth and discovery.',
    principal_message_hi: '',
    principal_name_en: 'Mr. Ashirwad Goyal',
    principal_name_hi: '',
    principal_title_en: 'Principal, St. G. D. Convent School',
    principal_title_hi: '',
    principal_image_url: 'https://randomuser.me/api/portraits/women/45.jpg',
    about_image_url: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    school_founded_year: 1985,
    school_description_en: null,
    school_description_hi: null,
    features_en: [
      { title: 'Founded in 1985', description: 'With decades of educational excellence and a strong foundation in values-based learning' },
      { title: 'Diverse Community', description: 'Creating an inclusive environment where every student feels valued and empowered' },
      { title: 'Comprehensive Curriculum', description: 'Balancing academic rigor with holistic development for well-rounded education' },
      { title: 'Academic Excellence', description: 'Consistent record of outstanding achievements in academics and extracurriculars' }
    ],
    features_hi: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  useEffect(() => {
    const loadAboutData = async () => {
      setLoading(true);
      const data = await ContentService.getAboutSection();
      if (data) {
        setAboutData({
          ...aboutData,
          ...data,
        });
      }
      setLoading(false);
    };
    loadAboutData();
    // eslint-disable-next-line
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const success = await ContentService.updateAboutSection(aboutData);
    if (success) {
      toast({
        title: 'About section updated successfully',
        description: 'Changes will be reflected on the homepage',
      });
    } else {
      toast({
        title: 'Error updating about section',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  // Helper for dual-language fields
  const langField = (field: string) => (activeLang === 'en' ? `${field}_en` : `${field}_hi`);

  // Main content helpers
  const mainContent = aboutData[langField('main_content')] || [];
  const addMainContentParagraph = () => {
    setAboutData({
      ...aboutData,
      [langField('main_content')]: [...mainContent, ''],
    });
  };
  const removeMainContentParagraph = (index: number) => {
    setAboutData({
      ...aboutData,
      [langField('main_content')]: mainContent.filter((_: any, i: number) => i !== index),
    });
  };
  const updateMainContentParagraph = (index: number, value: string) => {
    const newContent = [...mainContent];
    newContent[index] = value;
    setAboutData({
      ...aboutData,
      [langField('main_content')]: newContent,
    });
  };

  // Features helpers (array of {title, description})
  const features = aboutData[langField('features')] || [];
  const addFeature = () => {
    setAboutData({
      ...aboutData,
      [langField('features')]: [...features, { title: '', description: '' }],
    });
  };
  const removeFeature = (index: number) => {
    setAboutData({
      ...aboutData,
      [langField('features')]: features.filter((_: any, i: number) => i !== index),
    });
  };
  const updateFeature = (index: number, field: 'title' | 'description', value: string) => {
    const newFeatures = [...features];
    newFeatures[index][field] = value;
    setAboutData({
      ...aboutData,
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
          <CardTitle>About Section Editor</CardTitle>
          <CardDescription>Edit the about section content that appears on the homepage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Section Title ({activeLang === 'en' ? 'English' : 'Hindi'})</Label>
              <Input
                id="title"
                value={aboutData[langField('title')] || ''}
                onChange={(e) => setAboutData({ ...aboutData, [langField('title')]: e.target.value })}
                placeholder={activeLang === 'en' ? 'About Our School' : 'हमारे स्कूल के बारे में'}
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle ({activeLang === 'en' ? 'English' : 'Hindi'})</Label>
              <Input
                id="subtitle"
                value={aboutData[langField('subtitle')] || ''}
                onChange={(e) => setAboutData({ ...aboutData, [langField('subtitle')]: e.target.value })}
                placeholder={activeLang === 'en' ? 'Excellence in education...' : 'शिक्षा में उत्कृष्टता...'}
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
            value={aboutData.about_image_url || ''}
            onChange={(url) => setAboutData({ ...aboutData, about_image_url: url })}
            folder="about"
            maxSizeMB={10}
          />
          <div className="flex justify-between items-center">
            <Label>Main Content Paragraphs ({activeLang === 'en' ? 'English' : 'Hindi'})</Label>
            <Button type="button" variant="outline" size="sm" onClick={addMainContentParagraph}>
              <Plus className="w-4 h-4 mr-2" />
              Add Paragraph
            </Button>
          </div>
          {mainContent.map((paragraph: string, index: number) => (
            <div key={index} className="flex gap-2 items-start">
              <Textarea
                value={paragraph}
                onChange={(e) => updateMainContentParagraph(index, e.target.value)}
                placeholder={activeLang === 'en' ? 'Enter paragraph content' : 'अनुच्छेद सामग्री दर्ज करें'}
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
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Principal Information</CardTitle>
          <CardDescription>Edit the principal's message and contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="principal-message">Principal's Message ({activeLang === 'en' ? 'English' : 'Hindi'})</Label>
            <Textarea
              id="principal-message"
              value={aboutData[langField('principal_message')] || ''}
              onChange={(e) => setAboutData({ ...aboutData, [langField('principal_message')]: e.target.value })}
              placeholder={activeLang === 'en' ? "Principal's inspirational message" : 'प्रधानाचार्य का संदेश'}
              rows={4}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="principal-name">Principal's Name ({activeLang === 'en' ? 'English' : 'Hindi'})</Label>
              <Input
                id="principal-name"
                value={aboutData[langField('principal_name')] || ''}
                onChange={(e) => setAboutData({ ...aboutData, [langField('principal_name')]: e.target.value })}
                placeholder={activeLang === 'en' ? 'Mr. Ashirwad Goyal' : 'श्री अशीरवाद गोयल'}
              />
            </div>
            <div>
              <Label htmlFor="principal-title">Principal's Title ({activeLang === 'en' ? 'English' : 'Hindi'})</Label>
              <Input
                id="principal-title"
                value={aboutData[langField('principal_title')] || ''}
                onChange={(e) => setAboutData({ ...aboutData, [langField('principal_title')]: e.target.value })}
                placeholder={activeLang === 'en' ? 'Principal, St. G. D. Convent School' : 'प्रधानाचार्य, सेंट जी. डी. कॉन्वेंट स्कूल'}
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
      {/* Features Section */}
      <Card>
        <CardHeader>
          <CardTitle>Features ({activeLang === 'en' ? 'English' : 'Hindi'})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button type="button" variant="outline" size="sm" onClick={addFeature}>
            <Plus className="w-4 h-4 mr-2" />
            Add Feature
          </Button>
          {features.map((feature: any, index: number) => (
            <div key={index} className="flex gap-2 items-start">
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
