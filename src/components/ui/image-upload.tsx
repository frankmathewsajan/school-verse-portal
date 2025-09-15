import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { UploadService } from '@/services/uploadService';

// Helper: Allow only http and https URLs, and optionally restrict to trusted domains and image file extensions
function isSafeImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    // Disallow protocol-relative URLs (starting with //)
    if (url.startsWith('//')) return false;
    const parsed = new URL(url, window.location.origin);
    // Only allow http and https protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;
    // Optionally allow only specific trusted hostnames (uncomment and edit domain list if needed)
    // const allowedHosts = ['example.com', 'your-cdn.com'];
    // if (!allowedHosts.includes(parsed.hostname)) return false;
    // Optionally allow only image file types
    if (!/\.(jpe?g|png|webp|gif)$/i.test(parsed.pathname)) return false;
    return true;
  } catch {
    return false;
  }
}

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  maxSizeMB?: number;
  className?: string;
}

export function ImageUpload({ 
  label, 
  value, 
  onChange, 
  folder = 'images',
  maxSizeMB = 5,
  className = ''
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!UploadService.validateImageType(file)) {
      toast({
        title: "Invalid file type",
        description: "Please select a valid image file (JPEG, PNG, WebP, GIF)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size
    if (!UploadService.validateFileSize(file, maxSizeMB)) {
      toast({
        title: "File too large",
        description: `Please select an image smaller than ${maxSizeMB}MB`,
        variant: "destructive"
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    try {
      console.log('Starting upload for file:', file.name, 'to folder:', folder);
      const url = await UploadService.uploadImage(file, folder);
      if (url) {
        console.log('Upload successful, URL:', url);
        onChange(url);
        setPreview(null); // Clear preview since we now have the final URL
        toast({
          title: "Image uploaded successfully",
          description: "The image has been uploaded and saved",
        });
      } else {
        console.error('Upload failed: No URL returned');
        toast({
          title: "Upload failed",
          description: "No URL was returned from the upload service. Please check your Supabase storage configuration.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: `Upload error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    onChange('');
    setPreview(null);
  };

  const handleUrlChange = (url: string) => {
    onChange(url);
    // Don't clear preview when URL changes programmatically
    // setPreview(null);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label>{label}</Label>
      
      {/* Current Image Preview */}
      {(value || preview) && isSafeImageUrl(preview || value) && (
        <Card>
          <CardContent className="p-4">
            <div className="relative group">
              <img 
                src={preview || value} 
                alt={label}
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Button */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {uploading ? 'Uploading...' : 'Upload Image'}
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Manual URL Input */}
      <div>
        <Label htmlFor={`url-${label}`} className="text-sm text-muted-foreground">
          Or enter image URL manually
        </Label>
        <Input
          id={`url-${label}`}
          value={value}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="mt-1"
        />
      </div>

      {/* File Info */}
      <p className="text-xs text-muted-foreground">
        Supported formats: JPEG, PNG, WebP, GIF. Max size: {maxSizeMB}MB
      </p>
    </div>
  );
}

export default ImageUpload;
