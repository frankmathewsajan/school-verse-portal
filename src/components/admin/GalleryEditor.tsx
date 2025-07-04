
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Save, Plus, Trash2, Edit } from 'lucide-react';

interface GalleryItem {
  id: number;
  title: string;
  imageUrl: string;
  category: string;
}

export function GalleryEditor() {
  const { toast } = useToast();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([
    {
      id: 1,
      title: "Science Exhibition",
      imageUrl: "https://images.unsplash.com/photo-1581812873626-cdc86de0d916?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      category: "Academic",
    },
    {
      id: 2,
      title: "Annual Sports Day",
      imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      category: "Sports",
    },
    {
      id: 3,
      title: "Cultural Festival",
      imageUrl: "https://images.unsplash.com/photo-1511424400163-1c66a2d5b3ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
      category: "Cultural",
    },
    {
      id: 4,
      title: "Graduation Ceremony",
      imageUrl: "https://images.unsplash.com/photo-1627556704302-624286467c65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      category: "Event",
    }
  ]);

  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [newItem, setNewItem] = useState<Omit<GalleryItem, 'id'>>({
    title: '',
    imageUrl: '',
    category: ''
  });

  const categories = ['Academic', 'Sports', 'Cultural', 'Event', 'Achievement'];

  const handleSave = () => {
    toast({
      title: "Gallery updated",
      description: "Changes will be reflected on the gallery page",
    });
  };

  const addItem = () => {
    if (newItem.title && newItem.imageUrl && newItem.category) {
      const id = Math.max(...galleryItems.map(item => item.id)) + 1;
      setGalleryItems([...galleryItems, { ...newItem, id }]);
      setNewItem({ title: '', imageUrl: '', category: '' });
      toast({
        title: "Gallery item added",
        description: "New item has been added to the gallery",
      });
    }
  };

  const removeItem = (id: number) => {
    setGalleryItems(galleryItems.filter(item => item.id !== id));
    toast({
      title: "Gallery item removed",
      description: "Item has been removed from the gallery",
    });
  };

  const updateItem = (updatedItem: GalleryItem) => {
    setGalleryItems(galleryItems.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
    setEditingItem(null);
    toast({
      title: "Gallery item updated",
      description: "Item has been updated successfully",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Gallery Item</CardTitle>
          <CardDescription>Add new images to the school gallery</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="new-title">Title</Label>
              <Input
                id="new-title"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                placeholder="Enter image title"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="new-url">Image URL</Label>
              <Input
                id="new-url"
                value={newItem.imageUrl}
                onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                placeholder="Enter image URL"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="new-category">Category</Label>
              <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={addItem} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add to Gallery
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Gallery Items</CardTitle>
          <CardDescription>Manage existing gallery items</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 space-y-3">
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-32 object-cover rounded"
                />
                
                {editingItem?.id === item.id ? (
                  <div className="space-y-2">
                    <Input
                      value={editingItem.title}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      placeholder="Title"
                    />
                    <Input
                      value={editingItem.imageUrl}
                      onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                      placeholder="Image URL"
                    />
                    <Select 
                      value={editingItem.category} 
                      onValueChange={(value) => setEditingItem({ ...editingItem, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => updateItem(editingItem)}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingItem(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline" onClick={() => setEditingItem(item)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => removeItem(item.id)}>
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
