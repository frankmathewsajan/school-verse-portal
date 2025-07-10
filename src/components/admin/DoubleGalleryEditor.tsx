import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { Trash2, Plus, Upload, Eye, Edit, Save, X, ImageIcon, FolderOpen, Images } from 'lucide-react';
import { ContentService } from '@/services/contentService';
import { UploadService } from '@/services/uploadService';
import { Database } from '../../integrations/supabase/types';

type GalleryGroup = Database['public']['Tables']['gallery_groups']['Row'];
type GalleryItem = Database['public']['Tables']['gallery_items']['Row'];

interface GalleryGroupWithItems extends GalleryGroup {
  items: GalleryItem[];
  itemCount: number;
}

interface NewGalleryGroup {
  title: string;
  description: string;
  category: string;
  coverImage: File | null;
  dateTaken: string;
}

interface NewGalleryItem {
  title: string;
  description: string;
  images: File[];
  altText: string;
}

const GALLERY_CATEGORIES = [
  'Educational Trips',
  'Sports Events',
  'Cultural Events',
  'Academic Events',
  'National Events',
  'Ceremonies',
  'Workshops',
  'Competitions',
  'Festivals',
  'Community Events'
];

export default function DoubleGalleryEditor() {
  const [galleryGroups, setGalleryGroups] = useState<GalleryGroupWithItems[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<GalleryGroupWithItems | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [view, setView] = useState<'groups' | 'items'>('groups');
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  // Form states
  const [newGroup, setNewGroup] = useState<NewGalleryGroup>({
    title: '',
    description: '',
    category: '',
    coverImage: null,
    dateTaken: ''
  });

  const [newItem, setNewItem] = useState<NewGalleryItem>({
    title: '',
    description: '',
    images: [],
    altText: ''
  });

  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [itemImagePreviews, setItemImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    loadGalleryGroups();
  }, []);

  const loadGalleryGroups = async () => {
    try {
      setLoading(true);
      const groups = await ContentService.getAllGalleryGroups();
      setGalleryGroups(groups);
    } catch (err) {
      setError('Failed to load gallery groups');
    } finally {
      setLoading(false);
    }
  };

  const loadGalleryItems = async (groupId: string) => {
    try {
      setLoading(true);
      const items = await ContentService.getGalleryItemsByGroup(groupId);
      if (selectedGroup) {
        setSelectedGroup({
          ...selectedGroup,
          items
        });
      }
    } catch (err) {
      setError('Failed to load gallery items');
    } finally {
      setLoading(false);
    }
  };

  const handleGroupImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewGroup({ ...newGroup, coverImage: file });
      const reader = new FileReader();
      reader.onload = (e) => setCoverImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleItemImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setNewItem({ ...newItem, images: files });
      
      // Create previews
      const previews: string[] = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          previews.push(e.target?.result as string);
          if (previews.length === files.length) {
            setItemImagePreviews(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroup.title || !newGroup.category) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      let coverImageUrl = null;

      if (newGroup.coverImage) {
        coverImageUrl = await UploadService.uploadGalleryGroupImage(newGroup.coverImage);
      }

      await ContentService.createGalleryGroup({
        title: newGroup.title,
        description: newGroup.description,
        category: newGroup.category,
        cover_image_url: coverImageUrl,
        date_taken: newGroup.dateTaken || null
      });

      setMessage('Gallery group created successfully!');
      setNewGroup({
        title: '',
        description: '',
        category: '',
        coverImage: null,
        dateTaken: ''
      });
      setCoverImagePreview(null);
      await loadGalleryGroups();
    } catch (err) {
      setError('Failed to create gallery group');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItems = async () => {
    if (!selectedGroup || !newItem.images.length) {
      setError('Please select images to upload');
      return;
    }

    try {
      setLoading(true);
      
      const uploadPromises = newItem.images.map(async (image, index) => {
        const imageUrl = await UploadService.uploadGalleryItemImage(image);
        return ContentService.createGalleryItem({
          group_id: selectedGroup.id,
          title: newItem.title || `Image ${index + 1}`,
          description: newItem.description,
          image_url: imageUrl,
          alt_text: newItem.altText || newItem.title || `Image ${index + 1}`,
          display_order: index
        });
      });

      await Promise.all(uploadPromises);

      setMessage(`${newItem.images.length} images uploaded successfully!`);
      setNewItem({
        title: '',
        description: '',
        images: [],
        altText: ''
      });
      setItemImagePreviews([]);
      await loadGalleryItems(selectedGroup.id);
    } catch (err) {
      setError('Failed to upload images');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm('Are you sure you want to delete this gallery group? This will also delete all images in this group.')) {
      return;
    }

    try {
      setLoading(true);
      await ContentService.deleteGalleryGroup(groupId);
      setMessage('Gallery group deleted successfully!');
      await loadGalleryGroups();
      if (selectedGroup?.id === groupId) {
        setSelectedGroup(null);
        setView('groups');
      }
    } catch (err) {
      setError('Failed to delete gallery group');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      setLoading(true);
      await ContentService.deleteGalleryItem(itemId);
      setMessage('Image deleted successfully!');
      if (selectedGroup) {
        await loadGalleryItems(selectedGroup.id);
      }
    } catch (err) {
      setError('Failed to delete image');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGroup = (group: GalleryGroupWithItems) => {
    setSelectedGroup(group);
    setView('items');
    loadGalleryItems(group.id);
  };

  const clearMessages = () => {
    setMessage('');
    setError('');
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Double Gallery Management</h2>
          <div className="flex items-center gap-2">
            <Button
              variant={view === 'groups' ? 'default' : 'outline'}
              onClick={() => setView('groups')}
              className="flex items-center gap-2"
            >
              <FolderOpen className="w-4 h-4" />
              Gallery Groups
            </Button>
            {selectedGroup && (
              <Button
                variant={view === 'items' ? 'default' : 'outline'}
                onClick={() => setView('items')}
                className="flex items-center gap-2"
              >
                <Images className="w-4 h-4" />
                {selectedGroup.title} Images
              </Button>
            )}
          </div>
        </div>
        <Badge variant="outline" className="text-sm">
          {galleryGroups.length} Groups • {galleryGroups.reduce((sum, group) => sum + group.itemCount, 0)} Total Images
        </Badge>
      </div>

      {message && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">{message}</AlertDescription>
          <Button variant="ghost" size="sm" onClick={clearMessages} className="ml-auto">
            <X className="w-4 h-4" />
          </Button>
        </Alert>
      )}

      {error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
          <Button variant="ghost" size="sm" onClick={clearMessages} className="ml-auto">
            <X className="w-4 h-4" />
          </Button>
        </Alert>
      )}

      {view === 'groups' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create New Group */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create Gallery Group
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="groupTitle">Group Title *</Label>
                <Input
                  id="groupTitle"
                  value={newGroup.title}
                  onChange={(e) => setNewGroup({ ...newGroup, title: e.target.value })}
                  placeholder="e.g., Jaipur Educational Trip"
                />
              </div>

              <div>
                <Label htmlFor="groupDescription">Description</Label>
                <Textarea
                  id="groupDescription"
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                  placeholder="Brief description of this gallery group"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="groupCategory">Category *</Label>
                <Select
                  value={newGroup.category}
                  onValueChange={(value) => setNewGroup({ ...newGroup, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {GALLERY_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dateTaken">Date Taken</Label>
                <Input
                  id="dateTaken"
                  type="date"
                  value={newGroup.dateTaken}
                  onChange={(e) => setNewGroup({ ...newGroup, dateTaken: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="coverImage">Cover Image</Label>
                <Input
                  id="coverImage"
                  type="file"
                  accept="image/*"
                  onChange={handleGroupImageChange}
                />
                {coverImagePreview && (
                  <div className="mt-2">
                    <img src={coverImagePreview} alt="Cover preview" className="w-32 h-32 object-cover rounded" />
                  </div>
                )}
              </div>

              <Button 
                onClick={handleCreateGroup} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Creating...' : 'Create Gallery Group'}
              </Button>
            </CardContent>
          </Card>

          {/* Gallery Groups List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                Gallery Groups ({galleryGroups.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {galleryGroups.map((group) => (
                  <div key={group.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold">{group.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>Category: {group.category}</span>
                          <span>Date: {formatDate(group.date_taken)}</span>
                          <span>Images: {group.itemCount}</span>
                        </div>
                      </div>
                      {group.cover_image_url && (
                        <img 
                          src={group.cover_image_url} 
                          alt={group.title}
                          className="w-16 h-16 object-cover rounded ml-4"
                        />
                      )}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        onClick={() => handleSelectGroup(group)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Images ({group.itemCount})
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingGroup(group.id)}
                        className="flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteGroup(group.id)}
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        selectedGroup && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add Images to Group */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Add Images to "{selectedGroup.title}"
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="itemTitle">Image Title (Optional)</Label>
                  <Input
                    id="itemTitle"
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    placeholder="Title for these images"
                  />
                </div>

                <div>
                  <Label htmlFor="itemDescription">Description (Optional)</Label>
                  <Textarea
                    id="itemDescription"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Description for these images"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="itemImages">Select Images *</Label>
                  <Input
                    id="itemImages"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleItemImagesChange}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    You can select multiple images at once
                  </p>
                </div>

                <div>
                  <Label htmlFor="altText">Alt Text (Optional)</Label>
                  <Input
                    id="altText"
                    value={newItem.altText}
                    onChange={(e) => setNewItem({ ...newItem, altText: e.target.value })}
                    placeholder="Alt text for accessibility"
                  />
                </div>

                {itemImagePreviews.length > 0 && (
                  <div>
                    <Label>Image Previews</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {itemImagePreviews.map((preview, index) => (
                        <img
                          key={index}
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleCreateItems} 
                  disabled={loading || newItem.images.length === 0}
                  className="w-full"
                >
                  {loading ? 'Uploading...' : `Upload ${newItem.images.length} Images`}
                </Button>
              </CardContent>
            </Card>

            {/* Gallery Items List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Images className="w-5 h-5" />
                  Images in "{selectedGroup.title}" ({selectedGroup.items?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {selectedGroup.items?.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.title || 'Untitled'}</h4>
                          {item.description && (
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          )}
                          {item.alt_text && (
                            <p className="text-xs text-gray-500 mt-1">Alt: {item.alt_text}</p>
                          )}
                        </div>
                        <img 
                          src={item.image_url} 
                          alt={item.alt_text || item.title || 'Gallery image'}
                          className="w-16 h-16 object-cover rounded ml-4"
                        />
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingItem(item.id)}
                          className="flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteItem(item.id)}
                          className="flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )
      )}
    </div>
  );
}
