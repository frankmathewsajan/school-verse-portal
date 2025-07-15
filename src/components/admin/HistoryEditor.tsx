import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ImageUpload } from '@/components/ui/image-upload';
import { useToast } from '@/hooks/use-toast';
import { 
  Save, Loader2, CheckCircle, XCircle, Plus, Trash2, 
  GripVertical, History, Image, FileText
} from 'lucide-react';
import { ContentService } from '@/services/contentService';

interface HistoryData {
  id: string;
  title: string;
  subtitle: string;
  main_image_url: string;
  content_paragraphs: string[];
}

export function HistoryEditor() {
  const [activeLang, setActiveLang] = useState<'en' | 'hi'>('en');
  const [historyData, setHistoryData] = useState<any>({
    id: '',
    title_en: 'Our History',
    title_hi: '',
    subtitle_en: 'Four decades of educational excellence and community impact',
    subtitle_hi: '',
    main_image_url: '',
    content_paragraphs_en: [],
    content_paragraphs_hi: [],
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadHistoryData();
    // eslint-disable-next-line
  }, []);

  const loadHistoryData = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const data = await ContentService.getSchoolHistory();
      if (data) {
        setHistoryData({
          ...historyData,
          ...data,
        });
      }
    } catch (error) {
      setLoadError('Failed to load history data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const success = await ContentService.updateSchoolHistory(historyData);
      if (success) {
        toast({
          title: 'Success',
          description: 'History section updated successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update history section',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while saving',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const langField = (field: string) => (activeLang === 'en' ? `${field}_en` : `${field}_hi`);
  const paragraphs = historyData[langField('content_paragraphs')] || [];

  const addParagraph = () => {
    setHistoryData({
      ...historyData,
      [langField('content_paragraphs')]: [...paragraphs, ''],
    });
  };
  const updateParagraph = (index: number, value: string) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index] = value;
    setHistoryData({
      ...historyData,
      [langField('content_paragraphs')]: newParagraphs,
    });
  };
  const deleteParagraph = (index: number) => {
    setHistoryData({
      ...historyData,
      [langField('content_paragraphs')]: paragraphs.filter((_: any, i: number) => i !== index),
    });
  };
  const moveParagraph = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= paragraphs.length) return;
    const newParagraphs = [...paragraphs];
    const temp = newParagraphs[index];
    newParagraphs[index] = newParagraphs[newIndex];
    newParagraphs[newIndex] = temp;
    setHistoryData({
      ...historyData,
      [langField('content_paragraphs')]: newParagraphs,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading history data...</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertDescription>
          {loadError}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadHistoryData}
            className="ml-2"
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <History className="h-6 w-6" />
            History Section Editor
          </h2>
          <p className="text-muted-foreground">
            Manage the school's history content displayed on the About page
          </p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="flex items-center gap-2"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="history-title">Section Title ({activeLang === 'en' ? 'English' : 'Hindi'})</Label>
          <Input
            id="history-title"
            value={historyData[langField('title')] || ''}
            onChange={(e) => setHistoryData({ ...historyData, [langField('title')]: e.target.value })}
            placeholder={activeLang === 'en' ? 'Our History' : 'हमारा इतिहास'}
          />
        </div>
        <div>
          <Label htmlFor="history-subtitle">Subtitle ({activeLang === 'en' ? 'English' : 'Hindi'})</Label>
          <Input
            id="history-subtitle"
            value={historyData[langField('subtitle')] || ''}
            onChange={(e) => setHistoryData({ ...historyData, [langField('subtitle')]: e.target.value })}
            placeholder={activeLang === 'en' ? 'Four decades of educational excellence...' : 'शैक्षिक उत्कृष्टता के चार दशक...'}
          />
        </div>
      </div>
      <div>
        <Label>Main Content Paragraphs ({activeLang === 'en' ? 'English' : 'Hindi'})</Label>
        <Button type="button" variant="outline" size="sm" onClick={addParagraph}>
          <Plus className="w-4 h-4 mr-2" />
          Add Paragraph
        </Button>
        {paragraphs.map((paragraph: string, index: number) => (
          <div key={index} className="flex gap-2 items-start mt-2">
            <Textarea
              value={paragraph}
              onChange={(e) => updateParagraph(index, e.target.value)}
              placeholder={activeLang === 'en' ? 'Enter paragraph content' : 'अनुच्छेद सामग्री दर्ज करें'}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => deleteParagraph(index)}
              className="mt-1"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => moveParagraph(index, 'up')}
              className="mt-1"
              disabled={index === 0}
            >
              ↑
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => moveParagraph(index, 'down')}
              className="mt-1"
              disabled={index === paragraphs.length - 1}
            >
              ↓
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
