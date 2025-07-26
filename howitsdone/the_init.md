# Supabase Integration Setup Guide for Next.js

This guide contains all the necessary steps to integrate Supabase into a Next.js/TypeScript project, including database setup, authentication, file storage, and service layers.

## 1. Package Installation

```bash
npm install @supabase/supabase-js
# For TypeScript projects (recommended)
npm install -D typescript @types/node @types/react @types/react-dom
```

## 2. Project Structure

Create the following directory structure:
```
src/
├── lib/
│   └── supabase/
│       ├── client.ts
│       └── types.ts
├── services/
│   ├── contentService.ts
│   └── uploadService.ts
├── components/
│   └── ui/
│       └── image-upload.tsx
└── hooks/
    └── use-toast.ts
```

## 3. Supabase Client Setup

### `src/lib/supabase/client.ts`
```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

## 4. Database Types

### `src/lib/supabase/types.ts`
Generate this file using Supabase CLI or create manually:

```typescript
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      // Example table structure
      about_section: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          main_content: Json | null
          principal_message: string | null
          principal_name: string | null
          principal_title: string | null
          principal_image_url: string | null
          school_founded_year: number | null
          school_description: string | null
          features: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          subtitle?: string | null
          main_content?: Json | null
          principal_message?: string | null
          principal_name?: string | null
          principal_title?: string | null
          principal_image_url?: string | null
          school_founded_year?: number | null
          school_description?: string | null
          features?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string | null
          main_content?: Json | null
          principal_message?: string | null
          principal_name?: string | null
          principal_title?: string | null
          principal_image_url?: string | null
          school_founded_year?: number | null
          school_description?: string | null
          features?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      // Add more tables as needed
    }
  }
}
```

## 5. Content Service Layer

### `src/services/contentService.ts`
```typescript
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';

type AboutSection = Database['public']['Tables']['about_section']['Row'];

export class ContentService {
  // GET operations
  static async getAboutSection(): Promise<AboutSection | null> {
    try {
      const { data, error } = await supabase
        .from('about_section')
        .select('*')
        .single();
      
      if (error) {
        console.error('Error fetching about section:', error);
        return null;
      }
      
      // Handle custom fields stored in JSON (like about_image_url in features)
      let aboutImageUrl = '';
      if (data && Array.isArray(data.features)) {
        const metaFeature = data.features.find((f: any) => f && typeof f === 'object' && f._meta === true);
        if (metaFeature && typeof metaFeature === 'object' && (metaFeature as any).about_image_url) {
          aboutImageUrl = (metaFeature as any).about_image_url;
        }
      }
      
      return {
        ...data,
        about_image_url: aboutImageUrl
      } as any;
    } catch (error) {
      console.error('Error in getAboutSection:', error);
      return null;
    }
  }

  // UPDATE operations
  static async updateAboutSection(aboutData: Partial<AboutSection>): Promise<boolean> {
    try {
      // Handle custom fields by storing them in JSON fields
      let features = aboutData.features || [];
      const aboutImageUrl = (aboutData as any).about_image_url;
      
      if (aboutImageUrl !== undefined) {
        const featuresArray = Array.isArray(features) ? features : [];
        const metaIndex = featuresArray.findIndex((f: any) => f._meta === true);
        
        if (metaIndex >= 0) {
          featuresArray[metaIndex] = { _meta: true, about_image_url: aboutImageUrl };
        } else {
          featuresArray.push({ _meta: true, about_image_url: aboutImageUrl });
        }
        
        features = featuresArray;
      }

      const { error } = await supabase
        .from('about_section')
        .upsert({
          id: 'main',
          title: aboutData.title || 'About Our School',
          subtitle: aboutData.subtitle || null,
          main_content: aboutData.main_content || null,
          principal_message: aboutData.principal_message || null,
          principal_name: aboutData.principal_name || null,
          principal_title: aboutData.principal_title || null,
          principal_image_url: aboutData.principal_image_url || null,
          school_founded_year: aboutData.school_founded_year || null,
          school_description: aboutData.school_description || null,
          features: features,
          created_at: aboutData.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error updating about section:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateAboutSection:', error);
      return false;
    }
  }

  // CRUD operations for gallery items
  static async getGalleryItems(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('school_life_gallery')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching gallery items:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getGalleryItems:', error);
      return [];
    }
  }

  static async createGalleryItem(item: any): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('school_life_gallery')
        .insert(item);
      
      if (error) {
        console.error('Error creating gallery item:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in createGalleryItem:', error);
      return false;
    }
  }

  static async deleteGalleryItem(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('school_life_gallery')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting gallery item:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteGalleryItem:', error);
      return false;
    }
  }
}
```

## 6. Upload Service (File Storage)

### `src/services/uploadService.ts`
```typescript
import { supabase } from '@/lib/supabase/client';

export class UploadService {
  static validateImageType(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    return allowedTypes.includes(file.type);
  }

  static validateFileSize(file: File, maxSizeMB: number): boolean {
    const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
    return file.size <= maxSize;
  }

  static async uploadImage(file: File, folder: string = 'images'): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading file:', error);
        return null;
      }

      // Get public URL
      const { data: publicData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return publicData.publicUrl;
    } catch (error) {
      console.error('Error in uploadImage:', error);
      return null;
    }
  }

  static async deleteImage(url: string): Promise<boolean> {
    try {
      // Extract file path from URL
      const urlParts = url.split('/');
      const filePath = urlParts.slice(-2).join('/'); // Get folder/filename

      const { error } = await supabase.storage
        .from('images')
        .remove([filePath]);

      if (error) {
        console.error('Error deleting file:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteImage:', error);
      return false;
    }
  }
}
```

## 7. Image Upload Component

### `src/components/ui/image-upload.tsx`
```typescript
'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Loader2 } from 'lucide-react';
import { UploadService } from '@/services/uploadService';

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

    if (!UploadService.validateImageType(file)) {
      toast({
        title: "Invalid file type",
        description: "Please select a valid image file (JPEG, PNG, WebP, GIF)",
        variant: "destructive"
      });
      return;
    }

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
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    try {
      const url = await UploadService.uploadImage(file, folder);
      if (url) {
        onChange(url);
        toast({
          title: "Image uploaded successfully",
          description: "The image has been uploaded and saved",
        });
      } else {
        toast({
          title: "Upload failed",
          description: "Please try again later",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please try again later",
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

  return (
    <div className={`space-y-4 ${className}`}>
      <Label>{label}</Label>
      
      {(value || preview) && (
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

      <div>
        <Label className="text-sm text-muted-foreground">
          Or enter image URL manually
        </Label>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="mt-1"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Supported formats: JPEG, PNG, WebP, GIF. Max size: {maxSizeMB}MB
      </p>
    </div>
  );
}
```

## 8. Environment Variables

Create `.env.local` file in project root:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 9. Next.js Configuration

### `next.config.js`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'your-supabase-project.supabase.co', // Add your Supabase storage domain
      'plgjavfrwcphrehmthdv.supabase.co', // Example domain
    ],
  },
}

module.exports = nextConfig
```

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 9. Database Schema Examples

### Basic Tables Structure
```sql
-- About Section Table
CREATE TABLE about_section (
  id TEXT PRIMARY KEY DEFAULT 'main',
  title TEXT NOT NULL,
  subtitle TEXT,
  main_content JSONB,
  principal_message TEXT,
  principal_name TEXT,
  principal_title TEXT,
  principal_image_url TEXT,
  school_founded_year INTEGER,
  school_description TEXT,
  features JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery Table
CREATE TABLE school_life_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  date_taken DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Announcements Table
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Storage Buckets
Create storage buckets in Supabase dashboard:
- `images` bucket for general images
- Set appropriate RLS policies for public read access

## 10. Usage Examples

### In React Components (App Router)
```typescript
// app/about/page.tsx
import { ContentService } from '@/services/contentService';

export default async function AboutPage() {
  const aboutData = await ContentService.getAboutSection();

  return (
    <div>
      {aboutData && (
        <>
          <h2>{aboutData.title}</h2>
          <p>{aboutData.subtitle}</p>
          {aboutData.about_image_url && (
            <img src={aboutData.about_image_url} alt="About" />
          )}
        </>
      )}
    </div>
  );
}
```

### In Client Components
```typescript
'use client';

import { ContentService } from '@/services/contentService';
import { useEffect, useState } from 'react';

export default function AboutSection() {
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await ContentService.getAboutSection();
      setAboutData(data);
    };
    loadData();
  }, []);

  return (
    <div>
      {aboutData && (
        <>
          <h2>{aboutData.title}</h2>
          <p>{aboutData.subtitle}</p>
          {aboutData.about_image_url && (
            <img src={aboutData.about_image_url} alt="About" />
          )}
        </>
      )}
    </div>
  );
}
```

### In Admin Forms
```typescript
'use client';

import { ImageUpload } from '@/components/ui/image-upload';
import { ContentService } from '@/services/contentService';
import { useState } from 'react';

export default function AboutEditor() {
  const [aboutData, setAboutData] = useState({
    title: '',
    about_image_url: ''
  });

  const handleSave = async () => {
    const success = await ContentService.updateAboutSection(aboutData);
    if (success) {
      console.log('Saved successfully!');
    }
  };

  return (
    <div>
      <ImageUpload
        label="About Section Image"
        value={aboutData.about_image_url}
        onChange={(url) => setAboutData({...aboutData, about_image_url: url})}
        folder="about"
      />
      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
}
```

### API Routes Example
```typescript
// app/api/about/route.ts
import { ContentService } from '@/services/contentService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const aboutData = await ContentService.getAboutSection();
    return NextResponse.json(aboutData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch about data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const success = await ContentService.updateAboutSection(body);
    
    if (success) {
      return NextResponse.json({ message: 'About section updated successfully' });
    } else {
      return NextResponse.json({ error: 'Failed to update about section' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

## 11. Next.js Specific Features

### Server Components with Supabase
```typescript
// lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Handle cookie setting errors
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Handle cookie removal errors
          }
        },
      },
    }
  );
}
```

### Middleware for Authentication
```typescript
// middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
        },
      },
    }
  );

  // Refresh session if expired
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

## 12. Key Features Implemented

- **Next.js App Router**: Full support for App Router with server components
- **Server-Side Rendering**: Optimized data fetching with server components
- **Client Components**: Proper 'use client' directives for interactive components
- **API Routes**: Next.js API routes for backend operations
- **Middleware Support**: Authentication and session management
- **Image Optimization**: Next.js Image component integration
- **Type Safety**: Full TypeScript integration with generated types
- **File Upload**: Complete image upload system with validation
- **CRUD Operations**: Create, Read, Update, Delete for all entities
- **Error Handling**: Comprehensive error handling and logging
- **Storage Management**: File upload, deletion, and URL management
- **JSON Field Handling**: Store complex data in JSON fields when schema can't be modified
- **Component Integration**: Reusable UI components for admin interfaces

## 13. Tips for Next.js Replication

1. **App Router vs Pages Router**: This guide assumes App Router; adjust file structure for Pages Router if needed
2. **Environment Variables**: Use `NEXT_PUBLIC_` prefix for client-side variables
3. **Server Components**: Leverage server components for better performance and SEO
4. **Client Components**: Use 'use client' directive only when necessary (interactivity, hooks)
5. **API Routes**: Use API routes for server-side operations that need to be secure
6. **Image Domains**: Configure allowed image domains in next.config.js
7. **Middleware**: Implement middleware for authentication and session management
8. **Error Handling**: Implement comprehensive error handling for all operations
9. **Storage Policies**: Configure proper RLS policies for security
10. **File Validation**: Always validate file types and sizes before upload
11. **JSON Fields**: Use JSON fields for flexible data storage when schema modifications aren't possible
12. **Service Layer**: Abstract database operations into service classes for better organization

## 14. Additional Next.js Packages

Consider installing these additional packages for a complete setup:
```bash
# UI Components (if using shadcn/ui)
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react

# Form handling
npm install react-hook-form @hookform/resolvers zod

# State management (if needed)
npm install zustand

# Authentication (if using Supabase Auth)
npm install @supabase/ssr
```

This setup provides a complete, production-ready Supabase integration specifically tailored for Next.js projects that can be easily replicated across projects.