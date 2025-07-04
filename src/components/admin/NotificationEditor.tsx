
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Save, Plus, Trash2, Edit } from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  content: string;
  date: string;
  category: string;
}

export function NotificationEditor() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Annual Sports Day",
      date: "2025-05-12",
      content: "The annual sports day will be held on May, 2025. All students are requested to register for their events by April 30.",
      category: "event",
    },
    {
      id: 2,
      title: "Exam Schedule Released",
      date: "2025-04-15",
      content: "The final examination schedule for all grades has been released. Please check the academic calendar for details.",
      category: "academic",
    },
    {
      id: 3,
      title: "Parent-Teacher Meeting",
      date: "2025-04-20",
      content: "Parent-teacher meetings will be conducted on April 20-21. Online booking for appointment slots is now open.",
      category: "meeting",
    }
  ]);

  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [newNotification, setNewNotification] = useState<Omit<Notification, 'id'>>({
    title: '',
    content: '',
    date: '',
    category: ''
  });

  const categories = ['academic', 'event', 'meeting', 'exam', 'holiday', 'announcement', 'sports', 'cultural'];

  const handleSave = () => {
    toast({
      title: "Announcements updated",
      description: "Changes will be reflected on the homepage",
    });
  };

  const addNotification = () => {
    if (newNotification.title && newNotification.content && newNotification.date && newNotification.category) {
      const id = Math.max(...notifications.map(item => item.id)) + 1;
      setNotifications([...notifications, { ...newNotification, id }]);
      setNewNotification({
        title: '',
        content: '',
        date: '',
        category: ''
      });
      toast({
        title: "Announcement added",
        description: "New announcement has been added",
      });
    }
  };

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter(item => item.id !== id));
    toast({
      title: "Announcement removed",
      description: "Announcement has been removed",
    });
  };

  const updateNotification = (updatedNotification: Notification) => {
    setNotifications(notifications.map(item => 
      item.id === updatedNotification.id ? updatedNotification : item
    ));
    setEditingNotification(null);
    toast({
      title: "Announcement updated",
      description: "Announcement has been updated successfully",
    });
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
              <Label htmlFor="new-date">Date</Label>
              <Input
                id="new-date"
                type="date"
                value={newNotification.date}
                onChange={(e) => setNewNotification({ ...newNotification, date: e.target.value })}
                className="mt-1"
              />
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

          <div>
            <Label htmlFor="new-category">Category</Label>
            <Select value={newNotification.category} onValueChange={(value) => setNewNotification({ ...newNotification, category: value })}>
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
          
          <Button onClick={addNotification} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
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
                        <Label>Date</Label>
                        <Input
                          type="date"
                          value={editingNotification.date}
                          onChange={(e) => setEditingNotification({ ...editingNotification, date: e.target.value })}
                          className="mt-1"
                        />
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
                    
                    <div>
                      <Label>Category</Label>
                      <Select 
                        value={editingNotification.category} 
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
                    
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => updateNotification(editingNotification)}>
                        Save Changes
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
                        {formatDate(notification.date)}
                      </p>
                      <p className="text-muted-foreground">{notification.content}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => setEditingNotification(notification)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => removeNotification(notification.id)}>
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
