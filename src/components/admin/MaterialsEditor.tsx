import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Save, Plus, Trash2, Edit, Loader2, Download } from 'lucide-react';
import { ContentService } from '@/services/contentService';
import type { Database } from '@/integrations/supabase/types';

type LearningMaterial = Database['public']['Tables']['learning_materials']['Row'];

export function MaterialsEditor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [newMaterial, setNewMaterial] = useState<Partial<LearningMaterial>>({
    title: '',
    description: '',
    subject: '',
    class_level: '',
    file_type: '',
    file_size: '',
    file_url: ''
  });

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    setLoading(true);
    const items = await ContentService.getLearningMaterials();
    setMaterials(items);
    setLoading(false);
  };

  const handleAddMaterial = async () => {
    if (!newMaterial.title || !newMaterial.description || !newMaterial.subject || !newMaterial.class_level) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const materialToCreate = {
      title: newMaterial.title,
      description: newMaterial.description,
      subject: newMaterial.subject,
      class_level: newMaterial.class_level,
      file_type: newMaterial.file_type || 'PDF',
      file_size: newMaterial.file_size || '0 MB',
      file_url: newMaterial.file_url || '#'
    };
    
    const success = await ContentService.createLearningMaterial(materialToCreate);
    
    if (success) {
      toast({
        title: "Learning material added",
        description: "New material has been added to the collection",
      });
      setNewMaterial({
        title: '',
        description: '',
        subject: '',
        class_level: '',
        file_type: '',
        file_size: '',
        file_url: ''
      });
      loadMaterials();
    } else {
      toast({
        title: "Error adding material",
        description: "Please try again later",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDeleteMaterial = async (id: string) => {
    setLoading(true);
    const success = await ContentService.deleteLearningMaterial(id);
    
    if (success) {
      toast({
        title: "Learning material deleted",
        description: "Material has been removed from the collection",
      });
      loadMaterials();
    } else {
      toast({
        title: "Error deleting material",
        description: "Please try again later",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Other'];
  const grades = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '1-5', '6-8', '9-10', '11-12'];
  const fileTypes = ['PDF', 'DOC', 'DOCX', 'PPT', 'PPTX', 'XLS', 'XLSX', 'ZIP', 'Other'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Learning Materials Management</CardTitle>
          <CardDescription>
            Add, edit, and manage learning materials for students
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Material Title</Label>
              <Input
                id="title"
                value={newMaterial.title || ''}
                onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                placeholder="Enter material title"
              />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Select 
                value={newMaterial.subject || ''} 
                onValueChange={(value) => setNewMaterial({ ...newMaterial, subject: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newMaterial.description || ''}
              onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
              placeholder="Brief description of the material"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="class-level">Class Level</Label>
              <Select 
                value={newMaterial.class_level || ''} 
                onValueChange={(value) => setNewMaterial({ ...newMaterial, class_level: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      Grade {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="file-type">File Type</Label>
              <Select 
                value={newMaterial.file_type || ''} 
                onValueChange={(value) => setNewMaterial({ ...newMaterial, file_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select file type" />
                </SelectTrigger>
                <SelectContent>
                  {fileTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="file-size">File Size</Label>
              <Input
                id="file-size"
                value={newMaterial.file_size || ''}
                onChange={(e) => setNewMaterial({ ...newMaterial, file_size: e.target.value })}
                placeholder="e.g., 2.5 MB"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="file-url">File URL</Label>
            <Input
              id="file-url"
              value={newMaterial.file_url || ''}
              onChange={(e) => setNewMaterial({ ...newMaterial, file_url: e.target.value })}
              placeholder="https://example.com/file.pdf"
            />
          </div>

          <Button onClick={handleAddMaterial} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Material
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Learning Materials</CardTitle>
          <CardDescription>
            Manage existing learning materials
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading materials...
            </div>
          ) : materials.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No learning materials found. Add some materials to get started!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {materials.map((material) => (
                <Card key={material.id} className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{material.title}</CardTitle>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                        {material.subject}
                      </span>
                      <span className="px-2 py-1 bg-secondary/10 text-secondary-foreground text-xs rounded">
                        Grade {material.class_level}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <p className="text-sm text-muted-foreground mb-3">{material.description}</p>
                    <div className="flex justify-between items-center text-sm text-muted-foreground mb-3">
                      <span>{material.file_type}</span>
                      <span>{material.file_size}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(material.file_url, '_blank')}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteMaterial(material.id)}
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
