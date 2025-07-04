
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Save, Plus, Trash2 } from 'lucide-react';

export function AboutEditor() {
  const { toast } = useToast();
  const [aboutData, setAboutData] = useState({
    mainText: [
      'St. G. D. Convent School is a leading educational institution committed to providing a balanced and stimulating learning environment where students can achieve academic excellence and personal growth.',
      'Our comprehensive curriculum is designed to develop critical thinking, creativity, and problem-solving skills, preparing students for success in higher education and beyond.',
      'We pride ourselves on small class sizes, dedicated teachers, and a supportive community that nurtures each student\'s individual talents and abilities.'
    ],
    principalMessage: 'Education is not just about academic achievement, but about nurturing curious minds, compassionate hearts, and resilient spirits. At St. G. D. Convent School, we are committed to guiding each student on their unique journey of growth and discovery.',
    principalName: 'Mr. Ashirwad Goyal',
    principalTitle: 'Principal, St. G. D. Convent School',
    directorName: 'Mr. Shiv Narayan Goyal',
    directorTitle: 'Director'
  });

  const handleSave = () => {
    toast({
      title: "About section updated",
      description: "Changes will be reflected on the homepage",
    });
  };

  const addParagraph = () => {
    setAboutData({
      ...aboutData,
      mainText: [...aboutData.mainText, '']
    });
  };

  const removeParagraph = (index: number) => {
    const newText = aboutData.mainText.filter((_, i) => i !== index);
    setAboutData({ ...aboutData, mainText: newText });
  };

  const updateParagraph = (index: number, value: string) => {
    const newText = [...aboutData.mainText];
    newText[index] = value;
    setAboutData({ ...aboutData, mainText: newText });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>About School Content</CardTitle>
          <CardDescription>Edit the main about section paragraphs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {aboutData.mainText.map((paragraph, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor={`paragraph-${index}`}>Paragraph {index + 1}</Label>
                <Textarea
                  id={`paragraph-${index}`}
                  value={paragraph}
                  onChange={(e) => updateParagraph(index, e.target.value)}
                  rows={3}
                  className="mt-1"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeParagraph(index)}
                className="mt-6"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button variant="outline" onClick={addParagraph} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Paragraph
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Principal's Message</CardTitle>
          <CardDescription>Edit the principal's message and details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="principal-message">Message</Label>
            <Textarea
              id="principal-message"
              value={aboutData.principalMessage}
              onChange={(e) => setAboutData({ ...aboutData, principalMessage: e.target.value })}
              rows={4}
              className="mt-1"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="principal-name">Principal Name</Label>
              <Input
                id="principal-name"
                value={aboutData.principalName}
                onChange={(e) => setAboutData({ ...aboutData, principalName: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="principal-title">Principal Title</Label>
              <Input
                id="principal-title"
                value={aboutData.principalTitle}
                onChange={(e) => setAboutData({ ...aboutData, principalTitle: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Leadership Team</CardTitle>
          <CardDescription>Edit leadership team information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="director-name">Director Name</Label>
              <Input
                id="director-name"
                value={aboutData.directorName}
                onChange={(e) => setAboutData({ ...aboutData, directorName: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="director-title">Director Title</Label>
              <Input
                id="director-title"
                value={aboutData.directorTitle}
                onChange={(e) => setAboutData({ ...aboutData, directorTitle: e.target.value })}
                className="mt-1"
              />
            </div>
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
