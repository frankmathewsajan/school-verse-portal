# Material and Image Upload Setup Guide

## Overview
This guide explains how to set up file upload functionality in Supabase for both gallery images and learning materials, and how to integrate it with the admin editors.

## Supabase Storage Setup

### 1. Create Storage Buckets

Go to your Supabase dashboard → Storage → Create new bucket:

#### Gallery Images Bucket
```sql
-- Create bucket for gallery images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery-images',
  'gallery-images',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);
```

#### Learning Materials Bucket
```sql
-- Create bucket for learning materials
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'learning-materials',
  'learning-materials',
  true,
  104857600, -- 100MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/zip', 'text/plain']
);
```

### 2. Set Up Row Level Security (RLS) Policies

#### Gallery Images Policies
```sql
-- Enable RLS on storage.objects for gallery-images bucket
CREATE POLICY "Allow public read access for gallery images" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery-images');

-- Allow authenticated users to upload gallery images
CREATE POLICY "Allow authenticated users to upload gallery images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'gallery-images' AND
    auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete gallery images
CREATE POLICY "Allow authenticated users to delete gallery images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'gallery-images' AND
    auth.role() = 'authenticated'
  );

-- Allow authenticated users to update gallery images
CREATE POLICY "Allow authenticated users to update gallery images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'gallery-images' AND
    auth.role() = 'authenticated'
  );
```

#### Learning Materials Policies
```sql
-- Enable RLS on storage.objects for learning-materials bucket
CREATE POLICY "Allow public read access for learning materials" ON storage.objects
  FOR SELECT USING (bucket_id = 'learning-materials');

-- Allow authenticated users to upload learning materials
CREATE POLICY "Allow authenticated users to upload learning materials" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'learning-materials' AND
    auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete learning materials
CREATE POLICY "Allow authenticated users to delete learning materials" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'learning-materials' AND
    auth.role() = 'authenticated'
  );

-- Allow authenticated users to update learning materials
CREATE POLICY "Allow authenticated users to update learning materials" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'learning-materials' AND
    auth.role() = 'authenticated'
  );
```

### 3. Create Helper Functions (Optional)

```sql
-- Function to get file size in human readable format
CREATE OR REPLACE FUNCTION get_file_size_mb(file_size bigint)
RETURNS text AS $$
BEGIN
  RETURN ROUND(file_size / 1024.0 / 1024.0, 2) || ' MB';
END;
$$ LANGUAGE plpgsql;

-- Function to generate unique file names
CREATE OR REPLACE FUNCTION generate_unique_filename(original_name text)
RETURNS text AS $$
BEGIN
  RETURN extract(epoch from now()) || '_' || original_name;
END;
$$ LANGUAGE plpgsql;
```

## Frontend Integration

### 1. Required Dependencies

Install the necessary packages:

```bash
npm install @supabase/storage-js
npm install react-dropzone
npm install file-type
```

### 2. File Upload Service

Create a new service for handling file uploads:

```typescript
// src/services/uploadService.ts
import { supabase } from '@/integrations/supabase/client';

export class UploadService {
  // Upload gallery image
  static async uploadGalleryImage(file: File): Promise<string | null> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      // Upload file
      const { data, error } = await supabase.storage
        .from('gallery-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading image:', error);
        return null;
      }

      // Get public URL
      const { data: publicData } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(filePath);

      return publicData.publicUrl;
    } catch (error) {
      console.error('Error in uploadGalleryImage:', error);
      return null;
    }
  }

  // Upload learning material
  static async uploadLearningMaterial(file: File): Promise<{ url: string; size: string } | null> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `materials/${fileName}`;

      // Upload file
      const { data, error } = await supabase.storage
        .from('learning-materials')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading material:', error);
        return null;
      }

      // Get public URL
      const { data: publicData } = supabase.storage
        .from('learning-materials')
        .getPublicUrl(filePath);

      // Calculate file size in MB
      const sizeInMB = (file.size / 1024 / 1024).toFixed(2);

      return {
        url: publicData.publicUrl,
        size: `${sizeInMB} MB`
      };
    } catch (error) {
      console.error('Error in uploadLearningMaterial:', error);
      return null;
    }
  }

  // Delete file from storage
  static async deleteFile(bucketName: string, filePath: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (error) {
        console.error('Error deleting file:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteFile:', error);
      return false;
    }
  }

  // Get file type from file extension
  static getFileType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    
    switch (ext) {
      case 'pdf':
        return 'PDF';
      case 'doc':
      case 'docx':
        return 'DOC';
      case 'ppt':
      case 'pptx':
        return 'PPT';
      case 'xls':
      case 'xlsx':
        return 'XLS';
      case 'zip':
        return 'ZIP';
      case 'txt':
        return 'TXT';
      case 'jpg':
      case 'jpeg':
        return 'JPEG';
      case 'png':
        return 'PNG';
      case 'gif':
        return 'GIF';
      case 'webp':
        return 'WEBP';
      default:
        return 'Other';
    }
  }

  // Validate file size
  static validateFileSize(file: File, maxSizeMB: number): boolean {
    const fileSizeMB = file.size / 1024 / 1024;
    return fileSizeMB <= maxSizeMB;
  }

  // Validate file type
  static validateImageType(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    return allowedTypes.includes(file.type);
  }

  static validateMaterialType(file: File): boolean {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/zip',
      'text/plain'
    ];
    return allowedTypes.includes(file.type);
  }
}
```

### 3. File Upload Component

Create a reusable file upload component:

```typescript
// src/components/ui/file-upload.tsx
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, Image } from 'lucide-react';
import { Button } from './button';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  accept: string;
  maxSize: number; // in MB
  selectedFile: File | null;
  uploadType: 'image' | 'material';
  disabled?: boolean;
}

export function FileUpload({ 
  onFileSelect, 
  onFileRemove, 
  accept, 
  maxSize, 
  selectedFile, 
  uploadType,
  disabled = false 
}: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0].code === 'file-too-large') {
        setError(`File too large. Maximum size is ${maxSize}MB`);
      } else if (rejection.errors[0].code === 'file-invalid-type') {
        setError('Invalid file type');
      } else {
        setError('File upload failed');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect, maxSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.split(',').reduce((acc, type) => {
      acc[type.trim()] = [];
      return acc;
    }, {} as any),
    maxSize: maxSize * 1024 * 1024, // Convert MB to bytes
    multiple: false,
    disabled
  });

  return (
    <div className="space-y-2">
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            {uploadType === 'image' ? (
              <Image className="h-8 w-8 text-muted-foreground" />
            ) : (
              <File className="h-8 w-8 text-muted-foreground" />
            )}
            <div className="text-sm">
              {isDragActive ? (
                <p>Drop the file here...</p>
              ) : (
                <div>
                  <p className="font-medium">Click to upload or drag and drop</p>
                  <p className="text-muted-foreground">
                    Max size: {maxSize}MB
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            {uploadType === 'image' ? (
              <Image className="h-4 w-4" />
            ) : (
              <File className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">{selectedFile.name}</span>
            <span className="text-xs text-muted-foreground">
              ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onFileRemove}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
```

### 4. Updated Editor Components

The GalleryEditor and MaterialsEditor components need to be updated to include:

1. File upload functionality
2. Upload progress indicators
3. File validation
4. Automatic file type detection
5. File size calculation
6. Option to use either URL or upload

### 5. Environment Variables

Ensure your `.env` file includes:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Implementation Steps

### Step 1: Set Up Storage Buckets
1. Go to Supabase Dashboard → Storage
2. Create two buckets: `gallery-images` and `learning-materials`
3. Configure bucket settings (public access, file size limits, MIME types)

### Step 2: Configure RLS Policies
1. Go to Supabase Dashboard → SQL Editor
2. Run the provided SQL commands to set up RLS policies
3. Test that authenticated users can upload and public users can read

### Step 3: Install Dependencies
```bash
npm install @supabase/storage-js react-dropzone file-type
```

### Step 4: Create Upload Service
1. Create `src/services/uploadService.ts`
2. Implement file upload, validation, and deletion methods

### Step 5: Create File Upload Component
1. Create `src/components/ui/file-upload.tsx`
2. Implement drag-and-drop functionality with validation

### Step 6: Update Editor Components
1. Update `GalleryEditor.tsx` to support image uploads
2. Update `MaterialsEditor.tsx` to support file uploads
3. Add option to choose between URL input and file upload

### Step 7: Test the Implementation
1. Test image uploads in gallery editor
2. Test material uploads in materials editor
3. Verify file validation and error handling
4. Test file deletion functionality

## Security Considerations

1. **File Size Limits**: Set appropriate limits (50MB for images, 100MB for materials)
2. **MIME Type Validation**: Only allow specific file types
3. **Authentication**: Ensure only authenticated users can upload
4. **File Name Sanitization**: Generate unique file names to prevent conflicts
5. **Virus Scanning**: Consider adding virus scanning for uploaded files
6. **Rate Limiting**: Implement rate limiting for uploads

## Storage Costs

- Supabase Storage pricing: $0.021 per GB per month
- Free tier includes 1GB of storage
- Monitor usage through Supabase dashboard

## Troubleshooting

### Common Issues:
1. **Upload fails**: Check RLS policies and authentication
2. **File not accessible**: Verify bucket is public and policies are correct
3. **Large files fail**: Check file size limits in bucket settings
4. **Wrong file type**: Verify MIME type validation

### Debug Commands:
```sql
-- Check bucket settings
SELECT * FROM storage.buckets WHERE name IN ('gallery-images', 'learning-materials');

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- Check uploaded files
SELECT * FROM storage.objects WHERE bucket_id IN ('gallery-images', 'learning-materials');
```

This setup provides a complete file upload system with proper security, validation, and error handling for both gallery images and learning materials.
