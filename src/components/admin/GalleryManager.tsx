import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusIcon, UploadIcon, ImageIcon } from 'lucide-react';

const GalleryManager = () => {
  return (
    <div className="space-y-6">
      {/* Upload New Photo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusIcon className="w-5 h-5" />
            Upload New Photo
          </CardTitle>
          <CardDescription>
            Add photos to the school life gallery
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input placeholder="Photo title" />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Input placeholder="e.g., Sports, Cultural, Academic" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea 
              placeholder="Photo description..." 
              className="min-h-[80px]"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Upload Photo</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <UploadIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
          <Button>Upload Photo</Button>
        </CardContent>
      </Card>

      {/* Gallery Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Gallery Photos</CardTitle>
          <CardDescription>
            Manage existing photos in the gallery
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <ImageIcon className="w-12 h-12 mx-auto mb-4" />
            <p>No photos in gallery. Upload your first photo above.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GalleryManager;
