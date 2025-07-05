import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusIcon, EditIcon, TrashIcon } from 'lucide-react';

const AnnouncementManager = () => {
  return (
    <div className="space-y-6">
      {/* Add New Announcement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusIcon className="w-5 h-5" />
            Create New Announcement
          </CardTitle>
          <CardDescription>
            Add a new announcement to display on the website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input placeholder="Announcement title" />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Content</label>
            <Textarea 
              placeholder="Enter announcement content..." 
              className="min-h-[100px]"
            />
          </div>
          <Button>Create Announcement</Button>
        </CardContent>
      </Card>

      {/* Existing Announcements */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Announcements</CardTitle>
          <CardDescription>
            Manage and edit existing announcements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No announcements found. Create your first announcement above.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnnouncementManager;
