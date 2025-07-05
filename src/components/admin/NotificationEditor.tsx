
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Save, Plus, Trash2, Edit, Loader2 } from 'lucide-react';
import { ContentService } from '@/services/contentService';
import type { Database } from '@/integrations/supabase/types';

type Announcement = Database['public']['Tables']['announcements']['Row'];

export function NotificationEditor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<Announcement[]>([]);
  const [editingNotification, setEditingNotification] = useState<Announcement | null>(null);
  const [newNotification, setNewNotification] = useState<Omit<Announcement, 'id' | 'created_at' | 'updated_at'>>({
    title: '',
    content: '',
    category: '',
    type: ''
  });

  const categories = ['academic', 'event', 'meeting', 'exam', 'holiday', 'announcement', 'sports', 'cultural'];

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      try {
        const data = await ContentService.getAnnouncements();
        setNotifications(data);
      } catch (error) {
        toast({
          title: "Error loading announcements",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    loadNotifications();
  }, []);

  const addNotification = async () => {
    if (newNotification.title && newNotification.content && newNotification.category) {
      setLoading(true);
      try {
        const success = await ContentService.createAnnouncement(newNotification);
        if (success) {
          const data = await ContentService.getAnnouncements();
          setNotifications(data);
          setNewNotification({
            title: '',
            content: '',
            category: '',
            type: ''
          });
          toast({
            title: "Announcement added",
            description: "New announcement has been created",
          });
        } else {
          toast({
            title: "Error creating announcement",
            description: "Please try again later",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Error creating announcement",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const removeNotification = async (id: string) => {
    setLoading(true);
    try {
      const success = await ContentService.deleteAnnouncement(id);
      if (success) {
        setNotifications(notifications.filter(item => item.id !== id));
        toast({
          title: "Announcement removed",
          description: "Announcement has been deleted",
        });
      } else {
        toast({
          title: "Error deleting announcement",
          description: "Please try again later",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error deleting announcement",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateNotification = async (updatedNotification: Announcement) => {
    setLoading(true);
    try {
      const success = await ContentService.updateAnnouncement(updatedNotification.id, updatedNotification);
      if (success) {
        setNotifications(notifications.map(item => 
          item.id === updatedNotification.id ? updatedNotification : item
        ));
        setEditingNotification(null);
        toast({
          title: "Announcement updated",
          description: "Announcement has been updated successfully",
        });
      } else {
        toast({
          title: "Error updating announcement",
          description: "Please try again later",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error updating announcement",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Announcement</CardTitle>
          <CardDescription>Create new school announcements and notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="new-title">Title</Label>
              <Input
                id="new-title"
                value={newNotification.title}
                onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                placeholder="Enter announcement title"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="new-category">Category</Label>
              <Select value={newNotification.category || ''} onValueChange={(value) => setNewNotification({ ...newNotification, category: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="new-content">Content</Label>
            <Textarea
              id="new-content"
              value={newNotification.content}
              onChange={(e) => setNewNotification({ ...newNotification, content: e.target.value })}
              placeholder="Enter announcement content"
              className="mt-1"
              rows={4}
            />
          </div>
          
          <Button onClick={addNotification} disabled={loading} className="flex items-center gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add Announcement
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Announcements</CardTitle>
          <CardDescription>Manage existing school announcements</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && notifications.length === 0 ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading announcements...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="border rounded-lg p-4">
                  {editingNotification?.id === notification.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Title</Label>
                          <Input
                            value={editingNotification.title}
                            onChange={(e) => setEditingNotification({ ...editingNotification, title: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Category</Label>
                          <Select 
                            value={editingNotification.category || ''} 
                            onValueChange={(value) => setEditingNotification({ ...editingNotification, category: value })}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category.charAt(0).toUpperCase() + category.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label>Content</Label>
                        <Textarea
                          value={editingNotification.content}
                          onChange={(e) => setEditingNotification({ ...editingNotification, content: e.target.value })}
                          className="mt-1"
                          rows={4}
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => updateNotification(editingNotification)} disabled={loading}>
                          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingNotification(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{notification.title}</h3>
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                            {notification.category}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {formatDate(notification.created_at || new Date().toISOString())}
                        </p>
                        <p className="text-muted-foreground">{notification.content}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline" onClick={() => setEditingNotification(notification)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => removeNotification(notification.id)} disabled={loading}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
