import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Save, Plus, Trash2, Edit, Loader2 } from 'lucide-react';
import { ContentService } from '@/services/contentService';
import type { Database } from '@/integrations/supabase/types';

type GalleryItem = Database['public']['Tables']['school_life_gallery']['Row'];

export function GalleryEditor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [newItem, setNewItem] = useState<Partial<GalleryItem>>({
    title: '',
    image_url: '',
    category: '',
    description: '',
    date_taken: null
  });

  useEffect(() => {
    loadGalleryItems();
  }, []);

  const loadGalleryItems = async () => {
    setLoading(true);
    const items = await ContentService.getGalleryItems();
    setGalleryItems(items);
    setLoading(false);
  };

  const handleAddItem = async () => {
    if (!newItem.title || !newItem.image_url || !newItem.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const itemToCreate = {
      title: newItem.title,
      image_url: newItem.image_url,
      category: newItem.category,
      description: newItem.description || null,
      date_taken: newItem.date_taken || null
    };
    
    const success = await ContentService.createGalleryItem(itemToCreate);
    
    if (success) {
      toast({
        title: "Gallery item added",
        description: "New photo has been added to the gallery",
      });
      setNewItem({
        title: '',
        image_url: '',
        category: '',
        description: '',
        date_taken: null
      });
      loadGalleryItems();
    } else {
      toast({
        title: "Error adding item",
        description: "Please try again later",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDeleteItem = async (id: string) => {
    setLoading(true);
    const success = await ContentService.deleteGalleryItem(id);
    
    if (success) {
      toast({
        title: "Gallery item deleted",
        description: "Photo has been removed from the gallery",
      });
      loadGalleryItems();
    } else {
      toast({
        title: "Error deleting item",
        description: "Please try again later",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const categories = ['Academic', 'Sports', 'Cultural', 'Event', 'Other'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gallery Management</CardTitle>
          <CardDescription>
            Add, edit, and manage photos in the school gallery
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Photo Title</Label>
              <Input
                id="title"
                value={newItem.title || ''}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                placeholder="Enter photo title"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select 
                value={newItem.category || ''} 
                onValueChange={(value) => setNewItem({ ...newItem, category: value })}
              >
                <SelectTrigger>
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
          
          <div>
            <Label htmlFor="image-url">Image URL</Label>
            <Input
              id="image-url"
              value={newItem.image_url || ''}
              onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={newItem.description || ''}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              placeholder="Brief description of the photo"
            />
          </div>

          <div>
            <Label htmlFor="date-taken">Date Taken (Optional)</Label>
            <Input
              id="date-taken"
              type="date"
              value={newItem.date_taken || ''}
              onChange={(e) => setNewItem({ ...newItem, date_taken: e.target.value })}
            />
          </div>

          <Button onClick={handleAddItem} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Photo
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Gallery Items</CardTitle>
          <CardDescription>
            Manage existing photos in the gallery
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading gallery items...
            </div>
          ) : galleryItems.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No gallery items found. Add some photos to get started!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{item.category}</p>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    )}
                    {item.date_taken && (
                      <p className="text-xs text-muted-foreground mb-3">
                        {new Date(item.date_taken).toLocaleDateString()}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
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
