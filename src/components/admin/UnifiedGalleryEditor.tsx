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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Trash2, Plus, Upload, Eye, Edit, Save, X, ImageIcon, FolderOpen, Images } from 'lucide-react';
import { ContentService } from '@/services/contentService';
import { UploadService } from '@/services/uploadService';
import { Database } from '../../integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';

type GalleryItem = Database['public']['Tables']['school_life_gallery']['Row'];
type GalleryGroup = Database['public']['Tables']['gallery_groups']['Row'];

interface GalleryGroupWithItems extends GalleryGroup {
  items: any[];
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

interface NewSingleImage {
  title: string;
  description: string;
  image: File | null;
  category: string;
  dateTaken: string;
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
  'Community Events',
  'General'
];

export default function UnifiedGalleryEditor() {
  // Gallery Groups State
  const [galleryGroups, setGalleryGroups] = useState<GalleryGroupWithItems[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<GalleryGroupWithItems | null>(null);
  
  // Single Gallery State
  const [singleGallery, setSingleGallery] = useState<GalleryItem[]>([]);
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('events');
  const [groupView, setGroupView] = useState<'groups' | 'items'>('groups');
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    altText: ''
  });

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

  const [newSingleImage, setNewSingleImage] = useState<NewSingleImage>({
    title: '',
    description: '',
    image: null,
    category: '',
    dateTaken: ''
  });

  // Preview states
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [itemImagePreviews, setItemImagePreviews] = useState<string[]>([]);
  const [singleImagePreview, setSingleImagePreview] = useState<string | null>(null);

  useEffect(() => {
    loadAllGalleryData();
  }, []);

  const loadAllGalleryData = async () => {
    try {
      setLoading(true);
      console.log('Loading all gallery data...');
      
      const [groups, items] = await Promise.all([
        ContentService.getAllGalleryGroups(),
        ContentService.getGalleryItems()
      ]);
      
      console.log('Loaded groups:', groups.length, groups);
      console.log('Loaded single items:', items.length, items);
      
      setGalleryGroups(groups);
      setSingleGallery(items);
      
      console.log('State updated. Groups:', groups.length, 'Singles:', items.length);
    } catch (err) {
      console.error('Error loading gallery data:', err);
      setError('Failed to load gallery data');
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

  // Group Management Functions
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

  const handleSingleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewSingleImage({ ...newSingleImage, image: file });
      const reader = new FileReader();
      reader.onload = (e) => setSingleImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
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
      resetGroupForm();
      await loadAllGalleryData();
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
      console.log('Uploading', newItem.images.length, 'images to group:', selectedGroup.id);
      
      const uploadPromises = newItem.images.map(async (image, index) => {
        console.log(`Uploading image ${index + 1}/${newItem.images.length}`);
        
        const imageUrl = await UploadService.uploadGalleryItemImage(image);
        if (!imageUrl) {
          throw new Error(`Failed to upload image ${index + 1}`);
        }
        
        const itemData = {
          group_id: selectedGroup.id,
          title: newItem.title || `Image ${index + 1}`,
          description: newItem.description || null,
          image_url: imageUrl,
          alt_text: newItem.altText || newItem.title || `Image ${index + 1}`,
          display_order: index,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Direct insert into gallery_items table
        const { data, error } = await supabase
          .from('gallery_items')
          .insert(itemData)
          .select()
          .single();
          
        if (error) {
          console.error(`Error creating gallery item ${index + 1}:`, error);
          throw new Error(`Failed to create gallery item ${index + 1}: ${error.message}`);
        }
        
        console.log(`Successfully created gallery item ${index + 1}:`, data);
        return data;
      });

      const results = await Promise.all(uploadPromises);
      console.log('All images uploaded successfully:', results);

      setMessage(`${newItem.images.length} images uploaded successfully!`);
      resetItemForm();
      await loadGalleryItems(selectedGroup.id);
      // Also reload all gallery data to update counts
      await loadAllGalleryData();
    } catch (err) {
      console.error('Error uploading images:', err);
      setError(`Failed to upload images: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSingleImage = async () => {
    if (!newSingleImage.title || !newSingleImage.image || !newSingleImage.category) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      console.log('Uploading single image:', newSingleImage);
      
      const imageUrl = await UploadService.uploadGalleryImage(newSingleImage.image);
      console.log('Image uploaded to:', imageUrl);
      
      if (!imageUrl) {
        throw new Error('Failed to upload image');
      }
      
      const itemData = {
        title: newSingleImage.title,
        description: newSingleImage.description || null,
        image_url: imageUrl,
        category: newSingleImage.category,
        date_taken: newSingleImage.dateTaken || null,
        created_at: new Date().toISOString()
      };
      
      console.log('Creating gallery item with data:', itemData);
      
      // Directly insert into school_life_gallery table to ensure it goes to the right place
      const { data, error } = await supabase
        .from('school_life_gallery')
        .insert(itemData)
        .select()
        .single();
      
      if (error) {
        console.error('Database error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('Item created successfully:', data);
      
      setMessage('Image uploaded successfully!');
      resetSingleImageForm();
      await loadAllGalleryData();
      
    } catch (err) {
      console.error('Error uploading single image:', err);
      setError(`Failed to upload image: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
      await loadAllGalleryData();
      if (selectedGroup?.id === groupId) {
        setSelectedGroup(null);
        setGroupView('groups');
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
      console.log('Deleting gallery group item:', itemId);
      
      // Use deleteGalleryGroupItem for items within gallery groups
      const success = await ContentService.deleteGalleryGroupItem(itemId);
      
      if (success) {
        setMessage('Image deleted successfully!');
        if (selectedGroup) {
          await loadGalleryItems(selectedGroup.id);
          // Also reload all gallery data to update counts
          await loadAllGalleryData();
        }
      } else {
        setError('Failed to delete image');
      }
    } catch (err) {
      console.error('Error deleting gallery group item:', err);
      setError('Failed to delete image');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSingleImage = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      setLoading(true);
      await ContentService.deleteGalleryItem(itemId);
      setMessage('Image deleted successfully!');
      await loadAllGalleryData();
    } catch (err) {
      setError('Failed to delete image');
    } finally {
      setLoading(false);
    }
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setEditForm({
      title: item.title || '',
      description: item.description || '',
      altText: item.alt_text || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    try {
      setLoading(true);
      
      // Check if this is a grouped gallery item (has group_id) or single gallery item
      if (editingItem.group_id) {
        // Grouped gallery item - use updateGalleryGroupItem
        await ContentService.updateGalleryGroupItem(editingItem.id, {
          title: editForm.title,
          description: editForm.description,
          alt_text: editForm.altText
        });
      } else {
        // Single gallery item - use updateGalleryItem
        await ContentService.updateGalleryItem(editingItem.id, {
          title: editForm.title,
          description: editForm.description
        });
      }

      setMessage('Image updated successfully!');
      setEditingItem(null);
      
      if (selectedGroup) {
        await loadGalleryItems(selectedGroup.id);
      } else {
        await loadAllGalleryData();
      }
    } catch (err) {
      setError('Failed to update image');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditForm({
      title: '',
      description: '',
      altText: ''
    });
  };

  const resetGroupForm = () => {
    setNewGroup({
      title: '',
      description: '',
      category: '',
      coverImage: null,
      dateTaken: ''
    });
    setCoverImagePreview(null);
  };

  const resetItemForm = () => {
    setNewItem({
      title: '',
      description: '',
      images: [],
      altText: ''
    });
    setItemImagePreviews([]);
  };

  const resetSingleImageForm = () => {
    setNewSingleImage({
      title: '',
      description: '',
      image: null,
      category: '',
      dateTaken: ''
    });
    setSingleImagePreview(null);
  };

  const handleSelectGroup = (group: GalleryGroupWithItems) => {
    // Clear any editing state when switching groups
    setEditingItem(null);
    setEditForm({
      title: '',
      description: '',
      altText: ''
    });
    
    setSelectedGroup(group);
    setGroupView('items');
    loadGalleryItems(group.id);
  };

  const handleTabChange = (newTab: string) => {
    // Clear editing state when switching tabs
    setEditingItem(null);
    setEditForm({
      title: '',
      description: '',
      altText: ''
    });
    
    // Reset to groups view when switching away from events
    if (newTab !== 'events') {
      setGroupView('groups');
      setSelectedGroup(null);
    }
    
    setActiveTab(newTab);
  };

  const clearMessages = () => {
    setMessage('');
    setError('');
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };

  const totalImages = singleGallery.length + galleryGroups.reduce((sum, group) => sum + group.itemCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gallery Management</h2>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={loadAllGalleryData}
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
          <Badge variant="outline" className="text-sm">
            {galleryGroups.length} Events • {singleGallery.length} Single Images • {totalImages} Total
          </Badge>
        </div>
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

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="events" className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            Events & Trips Gallery
          </TabsTrigger>
          <TabsTrigger value="single" className="flex items-center gap-2">
            <Images className="w-4 h-4" />
            Single Photos
          </TabsTrigger>
        </TabsList>

        {/* Events & Trips Gallery Tab */}
        <TabsContent value="events" className="space-y-6">
          {groupView === 'groups' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create New Group */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create Event Gallery
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="groupTitle">Event Title *</Label>
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
                      placeholder="Brief description of this event"
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
                    {loading ? 'Creating...' : 'Create Event Gallery'}
                  </Button>
                </CardContent>
              </Card>

              {/* Gallery Groups List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="w-5 h-5" />
                    Event Galleries ({galleryGroups.length})
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
                            Manage Images ({group.itemCount})
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
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingItem(null);
                      setEditForm({
                        title: '',
                        description: '',
                        altText: ''
                      });
                      setGroupView('groups');
                    }}
                    className="flex items-center gap-2"
                  >
                    <FolderOpen className="w-4 h-4" />
                    Back to Events
                  </Button>
                  <h3 className="text-lg font-semibold">Managing: {selectedGroup.title}</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Add Images to Group */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Add Images to Event
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
                        Event Images ({selectedGroup.items?.length || 0})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-[600px] overflow-y-auto">
                        {selectedGroup.items?.map((item) => (
                          <div key={item.id} className="border rounded-lg p-4">
                            {editingItem?.id === item.id ? (
                              // Edit form
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="editTitle">Title</Label>
                                  <Input
                                    id="editTitle"
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    placeholder="Image title"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="editDescription">Description</Label>
                                  <Textarea
                                    id="editDescription"
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    placeholder="Image description"
                                    rows={3}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="editAltText">Alt Text</Label>
                                  <Input
                                    id="editAltText"
                                    value={editForm.altText}
                                    onChange={(e) => setEditForm({ ...editForm, altText: e.target.value })}
                                    placeholder="Alt text for accessibility"
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={handleSaveEdit}
                                    disabled={loading}
                                    className="flex items-center gap-2"
                                  >
                                    <Save className="w-4 h-4" />
                                    {loading ? 'Saving...' : 'Save'}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleCancelEdit}
                                    className="flex items-center gap-2"
                                  >
                                    <X className="w-4 h-4" />
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              // Display view
                              <>
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <h4 className="font-semibold">{item.title || 'Untitled'}</h4>
                                    {item.description && (
                                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                    )}
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                      <span>Order: {item.display_order || 0}</span>
                                      {item.alt_text && <span>Alt: {item.alt_text}</span>}
                                    </div>
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
                                    onClick={() => handleEditItem(item)}
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
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )
          )}
        </TabsContent>

        {/* Single Photos Tab */}
        <TabsContent value="single" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Single Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Single Photo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="singleTitle">Photo Title *</Label>
                  <Input
                    id="singleTitle"
                    value={newSingleImage.title}
                    onChange={(e) => setNewSingleImage({ ...newSingleImage, title: e.target.value })}
                    placeholder="Enter photo title"
                  />
                </div>

                <div>
                  <Label htmlFor="singleDescription">Description</Label>
                  <Textarea
                    id="singleDescription"
                    value={newSingleImage.description}
                    onChange={(e) => setNewSingleImage({ ...newSingleImage, description: e.target.value })}
                    placeholder="Brief description of the photo"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="singleCategory">Category *</Label>
                  <Select
                    value={newSingleImage.category}
                    onValueChange={(value) => setNewSingleImage({ ...newSingleImage, category: value })}
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
                  <Label htmlFor="singleDateTaken">Date Taken</Label>
                  <Input
                    id="singleDateTaken"
                    type="date"
                    value={newSingleImage.dateTaken}
                    onChange={(e) => setNewSingleImage({ ...newSingleImage, dateTaken: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="singleImage">Select Image *</Label>
                  <Input
                    id="singleImage"
                    type="file"
                    accept="image/*"
                    onChange={handleSingleImageChange}
                  />
                  {singleImagePreview && (
                    <div className="mt-2">
                      <img src={singleImagePreview} alt="Image preview" className="w-32 h-32 object-cover rounded" />
                    </div>
                  )}
                </div>

                <Button 
                  onClick={handleCreateSingleImage} 
                  disabled={loading || !newSingleImage.image}
                  className="w-full"
                >
                  {loading ? 'Uploading...' : 'Upload Photo'}
                </Button>
              </CardContent>
            </Card>

            {/* Single Gallery Items List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Images className="w-5 h-5" />
                  Single Photos ({singleGallery.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {singleGallery.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      {editingItem?.id === item.id ? (
                        // Edit form
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="editSingleTitle">Title</Label>
                            <Input
                              id="editSingleTitle"
                              value={editForm.title}
                              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                              placeholder="Photo title"
                            />
                          </div>
                          <div>
                            <Label htmlFor="editSingleDescription">Description</Label>
                            <Textarea
                              id="editSingleDescription"
                              value={editForm.description}
                              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                              placeholder="Photo description"
                              rows={3}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={handleSaveEdit}
                              disabled={loading}
                              className="flex items-center gap-2"
                            >
                              <Save className="w-4 h-4" />
                              {loading ? 'Saving...' : 'Save'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                              className="flex items-center gap-2"
                            >
                              <X className="w-4 h-4" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // Display view
                        <>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold">{item.title}</h4>
                              {item.description && (
                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                              )}
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                <span>Category: {item.category}</span>
                                <span>Date: {formatDate(item.date_taken)}</span>
                              </div>
                            </div>
                            <img 
                              src={item.image_url} 
                              alt={item.title}
                              className="w-16 h-16 object-cover rounded ml-4"
                            />
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditItem(item)}
                              className="flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteSingleImage(item.id)}
                              className="flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
