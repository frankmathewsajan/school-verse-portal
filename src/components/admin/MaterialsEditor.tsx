
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Save, Plus, Trash2, Edit } from 'lucide-react';

interface Material {
  id: number;
  title: string;
  description: string;
  subject: string;
  grade: string;
  fileType: string;
  fileSize: string;
  downloadUrl: string;
}

export function MaterialsEditor() {
  const { toast } = useToast();
  const [materials, setMaterials] = useState<Material[]>([
    {
      id: 1,
      title: "Primary Mathematics Handbook",
      description: "Essential mathematics concepts for primary school students with practice exercises.",
      fileType: "PDF",
      fileSize: "1.8 MB",
      subject: "Mathematics",
      grade: "1-5",
      downloadUrl: "#",
    },
    {
      id: 2,
      title: "Middle School Science Experiments",
      description: "Practical science experiments and activities for middle school students.",
      fileType: "PDF",
      fileSize: "3.2 MB",
      subject: "Science",
      grade: "6-8",
      downloadUrl: "#",
    },
    {
      id: 3,
      title: "Secondary English Literature Guide",
      description: "Comprehensive analysis of literary works for secondary students.",
      fileType: "PDF",
      fileSize: "2.7 MB",
      subject: "English",
      grade: "9-10",
      downloadUrl: "#",
    },
    {
      id: 4,
      title: "Senior Physics - Advanced Concepts",
      description: "Detailed physics materials for senior secondary covering mechanics, thermodynamics, and electromagnetism.",
      fileType: "PDF",
      fileSize: "4.5 MB",
      subject: "Physics",
      grade: "11-12",
      downloadUrl: "#",
    }
  ]);

  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [newMaterial, setNewMaterial] = useState<Omit<Material, 'id'>>({
    title: '',
    description: '',
    subject: '',
    grade: '',
    fileType: 'PDF',
    fileSize: '',
    downloadUrl: ''
  });

  const subjects = ['Mathematics', 'Science', 'English', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Computer Science', 'Art', 'Music', 'Physical Education'];
  const grades = ['1-5', '6-8', '9-10', '11-12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const fileTypes = ['PDF', 'DOC', 'DOCX', 'PPT', 'PPTX', 'XLS', 'XLSX'];

  const handleSave = () => {
    toast({
      title: "Materials updated",
      description: "Changes will be reflected on the materials page",
    });
  };

  const addMaterial = () => {
    if (newMaterial.title && newMaterial.subject && newMaterial.grade) {
      const id = Math.max(...materials.map(item => item.id)) + 1;
      setMaterials([...materials, { ...newMaterial, id }]);
      setNewMaterial({
        title: '',
        description: '',
        subject: '',
        grade: '',
        fileType: 'PDF',
        fileSize: '',
        downloadUrl: ''
      });
      toast({
        title: "Material added",
        description: "New material has been added to the collection",
      });
    }
  };

  const removeMaterial = (id: number) => {
    setMaterials(materials.filter(item => item.id !== id));
    toast({
      title: "Material removed",
      description: "Material has been removed from the collection",
    });
  };

  const updateMaterial = (updatedMaterial: Material) => {
    setMaterials(materials.map(item => 
      item.id === updatedMaterial.id ? updatedMaterial : item
    ));
    setEditingMaterial(null);
    toast({
      title: "Material updated",
      description: "Material has been updated successfully",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Learning Material</CardTitle>
          <CardDescription>Add new educational materials for students</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="new-title">Title</Label>
              <Input
                id="new-title"
                value={newMaterial.title}
                onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                placeholder="Enter material title"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="new-subject">Subject</Label>
              <Select value={newMaterial.subject} onValueChange={(value) => setNewMaterial({ ...newMaterial, subject: value })}>
                <SelectTrigger className="mt-1">
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
            <Label htmlFor="new-description">Description</Label>
            <Textarea
              id="new-description"
              value={newMaterial.description}
              onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
              placeholder="Enter material description"
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="new-grade">Grade Level</Label>
              <Select value={newMaterial.grade} onValueChange={(value) => setNewMaterial({ ...newMaterial, grade: value })}>
                <SelectTrigger className="mt-1">
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
              <Label htmlFor="new-type">File Type</Label>
              <Select value={newMaterial.fileType} onValueChange={(value) => setNewMaterial({ ...newMaterial, fileType: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
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
              <Label htmlFor="new-size">File Size</Label>
              <Input
                id="new-size"
                value={newMaterial.fileSize}
                onChange={(e) => setNewMaterial({ ...newMaterial, fileSize: e.target.value })}
                placeholder="e.g., 2.5 MB"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="new-url">Download URL</Label>
              <Input
                id="new-url"
                value={newMaterial.downloadUrl}
                onChange={(e) => setNewMaterial({ ...newMaterial, downloadUrl: e.target.value })}
                placeholder="Enter file URL"
                className="mt-1"
              />
            </div>
          </div>
          
          <Button onClick={addMaterial} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Material
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Learning Materials</CardTitle>
          <CardDescription>Manage existing educational materials</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {materials.map((material) => (
              <div key={material.id} className="border rounded-lg p-4">
                {editingMaterial?.id === material.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={editingMaterial.title}
                          onChange={(e) => setEditingMaterial({ ...editingMaterial, title: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Subject</Label>
                        <Select 
                          value={editingMaterial.subject} 
                          onValueChange={(value) => setEditingMaterial({ ...editingMaterial, subject: value })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
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
                      <Label>Description</Label>
                      <Textarea
                        value={editingMaterial.description}
                        onChange={(e) => setEditingMaterial({ ...editingMaterial, description: e.target.value })}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label>Grade</Label>
                        <Select 
                          value={editingMaterial.grade} 
                          onValueChange={(value) => setEditingMaterial({ ...editingMaterial, grade: value })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
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
                        <Label>File Type</Label>
                        <Select 
                          value={editingMaterial.fileType} 
                          onValueChange={(value) => setEditingMaterial({ ...editingMaterial, fileType: value })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
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
                        <Label>File Size</Label>
                        <Input
                          value={editingMaterial.fileSize}
                          onChange={(e) => setEditingMaterial({ ...editingMaterial, fileSize: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Download URL</Label>
                        <Input
                          value={editingMaterial.downloadUrl}
                          onChange={(e) => setEditingMaterial({ ...editingMaterial, downloadUrl: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => updateMaterial(editingMaterial)}>
                        Save Changes
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingMaterial(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{material.title}</h3>
                      <p className="text-muted-foreground mt-1">{material.description}</p>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                          {material.subject}
                        </span>
                        <span className="bg-secondary/10 text-secondary px-2 py-1 rounded">
                          Grade {material.grade}
                        </span>
                        <span className="bg-accent/10 text-accent-foreground px-2 py-1 rounded">
                          {material.fileType} • {material.fileSize}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => setEditingMaterial(material)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => removeMaterial(material.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save All Changes
        </Button>
      </div>
    </div>
  );
}
