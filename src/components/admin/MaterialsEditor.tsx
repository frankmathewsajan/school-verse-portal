import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUpload } from '@/components/ui/file-upload';
import { useToast } from '@/hooks/use-toast';
import { Save, Plus, Trash2, Edit, Loader2, Download, Upload, Link } from 'lucide-react';
import { ContentService } from '@/services/contentService';
import { UploadService } from '@/services/uploadService';
import { downloadFile } from '@/lib/utils';
import type { Database } from '@/integrations/supabase/types';

type LearningMaterial = Database['public']['Tables']['learning_materials']['Row'];

export function MaterialsEditor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [showVideo, setShowVideo] = useState<Record<string, boolean>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'upload'>('url');
  const [metadataLoading, setMetadataLoading] = useState(false);
  const [metadataError, setMetadataError] = useState<string | null>(null);
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

  // Helper: extract YouTube ID from various link formats (youtu.be, youtube.com/watch, /shorts/, embed)
  const getYouTubeId = (url?: string | null) => {
    if (!url) return null;
    try {
      const u = url.trim();
      // Shortened youtu.be/ID
      const shortMatch = u.match(/(?:https?:\/\/)?(?:www\.)?youtu\.be\/([-_A-Za-z0-9]{11})/);
      if (shortMatch) return shortMatch[1];

      // Standard watch?v=ID or &v=ID
      const watchMatch = u.match(/[?&]v=([-_A-Za-z0-9]{11})/);
      if (watchMatch) return watchMatch[1];

      // /embed/ID
      const embedMatch = u.match(/(?:embed|v|shorts)\/([-_A-Za-z0-9]{11})/);
      if (embedMatch) return embedMatch[1];

      // If url is just the ID
      const idOnly = u.match(/^[-_A-Za-z0-9]{11}$/);
      if (idOnly) return idOnly[0];

      return null;
    } catch (e) {
      return null;
    }
  };

  const isYouTubeUrl = (url?: string | null) => !!getYouTubeId(url);

  const getYouTubeEmbedUrl = (url?: string | null) => {
    const id = getYouTubeId(url);
    // YouTube IDs are exactly 11 characters, only A-Za-z0-9_- allowed
    if (id && /^[-_A-Za-z0-9]{11}$/.test(id)) {
      return `https://www.youtube.com/embed/${id}`;
    }
    return null;
  };

  const loadMaterials = async () => {
    setLoading(true);
    const items = await ContentService.getLearningMaterials();
    setMaterials(items);
    setLoading(false);
  };

  // Auto-fill metadata for YouTube links using oEmbed (debounced)
  useEffect(() => {
    if (uploadMethod !== 'url') return;
    const url = newMaterial.file_url;
    if (!isYouTubeUrl(url)) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setMetadataError(null);
        setMetadataLoading(true);
        const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url || '')}&format=json`;
        const res = await fetch(oembedUrl, { signal: controller.signal });
        if (!res.ok) throw new Error(`oEmbed fetch failed: ${res.status}`);
        const data = await res.json();

        // Merge data into newMaterial but don't overwrite user-filled fields
        setNewMaterial(prev => ({
          ...prev,
          title: prev.title && prev.title.trim() ? prev.title : data.title || prev.title,
          description: prev.description && prev.description.trim() ? prev.description : (data.author_name ? `Video by ${data.author_name}` : data.title) || prev.description,
          file_type: 'Link',
          file_size: '0'
        }));
      } catch (err) {
        if ((err as any).name === 'AbortError') return;
        console.warn('Failed to fetch YouTube metadata', err);
        setMetadataError('Failed to fetch video metadata');
      } finally {
        setMetadataLoading(false);
      }
    }, 600);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [newMaterial.file_url, uploadMethod]);

  const handleAddMaterial = async () => {
    if (!newMaterial.title || !newMaterial.description || !newMaterial.subject || !newMaterial.class_level) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (uploadMethod === 'upload' && !selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    if (uploadMethod === 'url' && !newMaterial.file_url) {
      toast({
        title: "No file URL",
        description: "Please provide a file URL",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setUploading(true);

    try {
      let fileUrl = newMaterial.file_url;
      let fileSize = newMaterial.file_size || '0 MB';
      let fileType = newMaterial.file_type || 'Other';

      // If the provided URL is a YouTube link, treat it as a Video material
      if (uploadMethod === 'url' && isYouTubeUrl(fileUrl)) {
        fileType = 'Link';
        fileSize = '0';
      }

      // Handle file upload
      if (uploadMethod === 'upload' && selectedFile) {
        // Validate file
        if (!UploadService.validateMaterialType(selectedFile)) {
          toast({
            title: "Invalid file type",
            description: "Please select a valid file type (PDF, DOC, PPT, XLS, ZIP, TXT)",
            variant: "destructive",
          });
          setLoading(false);
          setUploading(false);
          return;
        }

        if (!UploadService.validateFileSize(selectedFile, 100)) {
          toast({
            title: "File too large",
            description: "File must be smaller than 100MB",
            variant: "destructive",
          });
          setLoading(false);
          setUploading(false);
          return;
        }

        // Upload file
        const uploadResult = await UploadService.uploadLearningMaterial(selectedFile);
        
        if (!uploadResult) {
          toast({
            title: "Upload failed",
            description: "Failed to upload file. Please try again.",
            variant: "destructive",
          });
          setLoading(false);
          setUploading(false);
          return;
        }

        fileUrl = uploadResult.url;
        fileSize = uploadResult.size;
        fileType = UploadService.getFileType(selectedFile.name);
      }

      const materialToCreate = {
        title: newMaterial.title,
        description: newMaterial.description,
        subject: newMaterial.subject,
        class_level: newMaterial.class_level,
        file_type: fileType,
        file_size: fileSize,
        file_url: fileUrl
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
        setSelectedFile(null);
        loadMaterials();
      } else {
        toast({
          title: "Error adding material",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error adding material:', error);
      toast({
        title: "Error adding material",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setUploading(false);
    }
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

  const handleDownloadMaterial = (material: LearningMaterial) => {
    if (!material.file_url) {
      toast({
        title: "Download failed",
        description: "No file URL available for download",
        variant: "destructive",
      });
      return;
    }
    
    const filename = `${material.title}.${material.file_type || 'file'}`;
    downloadFile(material.file_url, filename);
  };

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
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="class-level">Class Level</Label>
              <Select 
                value={newMaterial.class_level || ''} 
                onValueChange={(value) => setNewMaterial({ ...newMaterial, class_level: value })}
                disabled={loading}
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
            {uploadMethod === 'url' && (
              <>
                <div>
                  <Label htmlFor="file-type">File Type</Label>
                  <Select 
                    value={newMaterial.file_type || ''} 
                    onValueChange={(value) => setNewMaterial({ ...newMaterial, file_type: value })}
                    disabled={loading}
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
                    disabled={loading}
                  />
                </div>
              </>
            )}
          </div>

          <div>
            <Label>File Source</Label>
            <Tabs value={uploadMethod} onValueChange={(value) => setUploadMethod(value as 'url' | 'upload')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url">
                  <Link className="w-4 h-4 mr-2" />
                  URL
                </TabsTrigger>
                <TabsTrigger value="upload">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </TabsTrigger>
              </TabsList>
              <TabsContent value="url" className="space-y-2">
                <Label htmlFor="file-url">File URL</Label>
                <Input
                  id="file-url"
                  value={newMaterial.file_url || ''}
                  onChange={(e) => setNewMaterial({ ...newMaterial, file_url: e.target.value })}
                  placeholder="https://example.com/file.pdf"
                  disabled={loading}
                />
                {/* Live preview for YouTube links */}
                {metadataLoading && (
                  <p className="text-sm text-muted-foreground mt-2">Fetching video details...</p>
                )}
                {metadataError && (
                  <p className="text-sm text-destructive mt-2">{metadataError}</p>
                )}
                {isYouTubeUrl(newMaterial.file_url) && (
                  <div className="mt-2">
                    <Label>Video Preview</Label>
                    <div className="mt-1 aspect-video">
                      <iframe
                        src={getYouTubeEmbedUrl(newMaterial.file_url) || undefined}
                        title="YouTube preview"
                        className="w-full h-full rounded"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="upload" className="space-y-2">
                <Label>Upload File</Label>
                <FileUpload
                  onFileSelect={(file) => setSelectedFile(file)}
                  onFileRemove={() => setSelectedFile(null)}
                  accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/zip,text/plain"
                  maxSize={100}
                  selectedFile={selectedFile}
                  uploadType="material"
                  disabled={loading}
                />
              </TabsContent>
            </Tabs>
          </div>

          <Button onClick={handleAddMaterial} disabled={loading || uploading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {uploading ? 'Uploading...' : 'Adding...'}
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
                      {isYouTubeUrl(material.file_url) ? (
                        <div className="flex gap-2 items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowVideo(prev => ({ ...prev, [material.id]: !prev[material.id] }))}
                          >
                            View Video
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
                      ) : (
                        <div className="flex gap-2 items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadMaterial(material)}
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
                      )}
                    </div>
                    {showVideo[material.id] && isYouTubeUrl(material.file_url) && (
                      <div className="mt-3 aspect-video">
                        <iframe
                          src={getYouTubeEmbedUrl(material.file_url) || undefined}
                          title={`YouTube-${material.id}`}
                          className="w-full h-full rounded"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
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
