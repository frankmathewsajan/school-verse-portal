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
  const [historyData, setHistoryData] = useState<HistoryData>({
    id: '',
    title: 'Our History',
    subtitle: 'Four decades of educational excellence and community impact',
    main_image_url: '',
    content_paragraphs: []
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadHistoryData();
  }, []);

  const loadHistoryData = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const data = await ContentService.getSchoolHistory();
      
      if (data) {
        setHistoryData({
          id: data.id,
          title: data.title,
          subtitle: data.subtitle || '',
          main_image_url: data.main_image_url || '',
          content_paragraphs: Array.isArray(data.content_paragraphs) 
            ? data.content_paragraphs 
            : []
        });
      }
    } catch (error) {
      console.error('Error loading history data:', error);
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
          title: "Success",
          description: "History section updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update history section",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving history:', error);
      toast({
        title: "Error",
        description: "An error occurred while saving",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const addParagraph = () => {
    setHistoryData(prev => ({
      ...prev,
      content_paragraphs: [...prev.content_paragraphs, '']
    }));
  };

  const updateParagraph = (index: number, value: string) => {
    setHistoryData(prev => ({
      ...prev,
      content_paragraphs: prev.content_paragraphs.map((p, i) => 
        i === index ? value : p
      )
    }));
  };

  const deleteParagraph = (index: number) => {
    setHistoryData(prev => ({
      ...prev,
      content_paragraphs: prev.content_paragraphs.filter((_, i) => i !== index)
    }));
  };

  const moveParagraph = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= historyData.content_paragraphs.length) return;

    setHistoryData(prev => {
      const newParagraphs = [...prev.content_paragraphs];
      const temp = newParagraphs[index];
      newParagraphs[index] = newParagraphs[newIndex];
      newParagraphs[newIndex] = temp;
      return {
        ...prev,
        content_paragraphs: newParagraphs
      };
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Edit the main title and subtitle for the history section
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Section Title</Label>
              <Input
                id="title"
                value={historyData.title}
                onChange={(e) => setHistoryData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Our History"
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={historyData.subtitle}
                onChange={(e) => setHistoryData(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="e.g., Four decades of educational excellence"
              />
            </div>
          </CardContent>
        </Card>

        {/* Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              History Image
            </CardTitle>
            <CardDescription>
              Upload or change the main image for the history section
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              label="History Image"
              value={historyData.main_image_url}
              onChange={(url) => setHistoryData(prev => ({ ...prev, main_image_url: url }))}
              folder="history"
            />
          </CardContent>
        </Card>
      </div>

      {/* Content Paragraphs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            History Content
          </CardTitle>
          <CardDescription>
            Add and edit paragraphs that tell your school's story
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {historyData.content_paragraphs.map((paragraph, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveParagraph(index, 'up')}
                  disabled={index === 0}
                  className="h-8 w-8 p-0"
                >
                  <GripVertical className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveParagraph(index, 'down')}
                  disabled={index === historyData.content_paragraphs.length - 1}
                  className="h-8 w-8 p-0"
                >
                  <GripVertical className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1">
                <Textarea
                  value={paragraph}
                  onChange={(e) => updateParagraph(index, e.target.value)}
                  placeholder={`Paragraph ${index + 1}...`}
                  rows={3}
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteParagraph(index)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button
            variant="outline"
            onClick={addParagraph}
            className="w-full flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Paragraph
          </Button>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>
            This is how the history section will appear on the About page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {historyData.main_image_url && (
              <div className="relative rounded-lg overflow-hidden h-[200px]">
                <img 
                  src={historyData.main_image_url} 
                  alt="School history"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold mb-2">{historyData.title}</h3>
              <p className="text-muted-foreground mb-4">{historyData.subtitle}</p>
              <div className="space-y-3">
                {historyData.content_paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-sm text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
