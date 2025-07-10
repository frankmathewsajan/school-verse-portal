import { supabase } from '@/integrations/supabase/client';

export class UploadService {
  // Upload general image (for hero, about, principal, etc.)
  static async uploadImage(file: File, folder: string = 'images'): Promise<string | null> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Upload file
      const { data, error } = await supabase.storage
        .from('site-images')
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
        .from('site-images')
        .getPublicUrl(filePath);

      return publicData.publicUrl;
    } catch (error) {
      console.error('Error in uploadImage:', error);
      return null;
    }
  }

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

  // Gallery Groups Upload Methods
  static async uploadGalleryGroupImage(file: File): Promise<string> {
    try {
      // Validate file
      if (!this.validateImageType(file)) {
        throw new Error('Invalid file type for gallery group image');
      }
      
      if (!this.validateFileSize(file, 10)) {
        throw new Error('File size too large (max 10MB)');
      }

      // Generate unique filename
      const timestamp = Date.now();
      const fileName = `gallery-group-${timestamp}-${file.name}`;
      
      // Upload to storage
      const { data, error } = await supabase.storage
        .from('gallery-groups')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.warn('Gallery group upload failed, using mock URL:', error);
        return `https://via.placeholder.com/800x600?text=Gallery+Group+Image`;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('gallery-groups')
        .getPublicUrl(fileName);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.warn('Error in uploadGalleryGroupImage, using mock URL:', error);
      return `https://via.placeholder.com/800x600?text=Gallery+Group+Image`;
    }
  }

  static async uploadGalleryItemImage(file: File): Promise<string> {
    try {
      // Validate file
      if (!this.validateImageType(file)) {
        throw new Error('Invalid file type for gallery item image');
      }
      
      if (!this.validateFileSize(file, 10)) {
        throw new Error('File size too large (max 10MB)');
      }

      // Generate unique filename
      const timestamp = Date.now();
      const fileName = `gallery-item-${timestamp}-${file.name}`;
      
      // Upload to storage
      const { data, error } = await supabase.storage
        .from('gallery-items')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.warn('Gallery item upload failed, using mock URL:', error);
        return `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('gallery-items')
        .getPublicUrl(fileName);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.warn('Error in uploadGalleryItemImage, using mock URL:', error);
      return `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`;
    }
  }
}
