
import React, { useState, useEffect } from 'react';
import { SectionTitle } from '@/components/ui/section-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Camera, FolderOpen, Images, Calendar, ArrowRight } from 'lucide-react';
import { ContentService } from '@/services/contentService';
import type { Database } from '@/integrations/supabase/types';

type GalleryItem = Database['public']['Tables']['school_life_gallery']['Row'];
type GalleryGroup = Database['public']['Tables']['gallery_groups']['Row'];

interface GalleryGroupWithItems extends GalleryGroup {
  items: any[];
  itemCount: number;
}

export function GalleryPreview() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryGroups, setGalleryGroups] = useState<GalleryGroupWithItems[]>([]);

  useEffect(() => {
    const loadGalleryData = async () => {
      try {
        const [items, groups] = await Promise.all([
          ContentService.getGalleryItems(),
          ContentService.getAllGalleryGroups()
        ]);
        setGalleryItems(items.slice(0, 4)); // Show only the latest 4 items
        setGalleryGroups(groups.slice(0, 3)); // Show only the latest 3 groups
      } catch (error) {
        console.error('Error loading gallery data:', error);
      }
    };
    loadGalleryData();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Recent';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  // Default fallback data if no items in database
  const defaultGalleryItems = [
    {
      id: "1",
      title: "Science Exhibition",
      description: null,
      image_url: "https://images.unsplash.com/photo-1581812873626-cdc86de0d916?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      category: "Academic",
      date_taken: null,
      created_at: new Date().toISOString()
    },
    {
      id: "2",
      title: "Annual Sports Day",
      description: null,
      image_url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      category: "Sports",
      date_taken: null,
      created_at: new Date().toISOString()
    },
    {
      id: "3",
      title: "Cultural Festival",
      description: null,
      image_url: "https://images.unsplash.com/photo-1511424400163-1c66a2d5b3ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
      category: "Cultural",
      date_taken: null,
      created_at: new Date().toISOString()
    },
    {
      id: "4",
      title: "Graduation Ceremony",
      description: null,
      image_url: "https://images.unsplash.com/photo-1627556704302-624286467c65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      category: "Event",
      date_taken: null,
      created_at: new Date().toISOString()
    }
  ];

  const displayItems = galleryItems.length > 0 ? galleryItems : defaultGalleryItems;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="School Life Gallery" 
          subtitle="Explore moments from our vibrant school community through our curated photo gallery"
          centered
        />
        
        {/* Gallery Groups Section */}
        {galleryGroups.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold flex items-center gap-2">
                <FolderOpen className="w-6 h-6 text-primary" />
                Recent Events & Trips
              </h3>
              <Button asChild variant="ghost" className="text-primary">
                <Link to="/gallery">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {galleryGroups.map((group) => (
                <Card key={group.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-[4/3] relative">
                    {group.cover_image_url ? (
                      <img
                        src={group.cover_image_url}
                        alt={group.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <FolderOpen className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h4 className="font-semibold text-lg mb-1">{group.title}</h4>
                      <div className="flex items-center gap-2 text-sm opacity-90">
                        <Images className="w-4 h-4" />
                        <span>{group.itemCount} photos</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{group.category}</Badge>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(group.date_taken)}
                      </span>
                    </div>
                    {group.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {group.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {/* Individual Photos Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold flex items-center gap-2">
              <Camera className="w-6 h-6 text-primary" />
              Latest Photos
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayItems.map((item) => (
              <div 
                key={item.id} 
                className="group relative h-64 md:h-80 rounded-lg overflow-hidden card-hover"
              >
                <img 
                  src={item.image_url} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 text-white">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-white/80">{item.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/gallery">
              <Camera className="mr-2 h-4 w-4" />
              View Full Gallery
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
