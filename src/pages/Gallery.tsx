
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { SectionTitle } from '@/components/ui/section-title';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Camera, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ContentService } from '@/services/contentService';
import type { Database } from '@/integrations/supabase/types';

type GalleryItem = Database['public']['Tables']['school_life_gallery']['Row'];

// Interface for our gallery data structure
interface GalleryData {
  id: string;
  title: string;
  date: string;
  category: string;
  imageUrl: string;
  description?: string;
}

const Gallery = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [galleryData, setGalleryData] = useState<GalleryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Transform database data to component format
  const transformGalleryItem = (item: GalleryItem): GalleryData => ({
    id: item.id,
    title: item.title,
    date: item.date_taken || item.created_at || new Date().toISOString(),
    category: item.category || 'General',
    imageUrl: item.image_url,
    description: item.description || undefined
  });

  // Load gallery data from database
  const loadGalleryData = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await ContentService.getGalleryItems();
      const transformedItems = items.map(transformGalleryItem);
      setGalleryData(transformedItems);
    } catch (err) {
      console.error('Error loading gallery data:', err);
      setError('Failed to load gallery items');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadGalleryData();
  }, []);

  // Listen for gallery updates
  useEffect(() => {
    const handleGalleryUpdate = () => {
      loadGalleryData();
    };

    window.addEventListener('galleryUpdated', handleGalleryUpdate);
    return () => {
      window.removeEventListener('galleryUpdated', handleGalleryUpdate);
    };
  }, []);
  
  // Filter gallery items based on search query and selected category
  const filteredGallery = galleryData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = currentTab === "all" || item.category.toLowerCase() === currentTab.toLowerCase();
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories for the tabs
  const categories = ["all", ...new Set(galleryData.map(item => item.category.toLowerCase()))];

  // Show loading state
  if (loading) {
    return (
      <MainLayout>
        <section className="py-16 bg-gradient-to-br from-primary/10 to-secondary/5">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">School Gallery</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Loading gallery...
            </p>
          </div>
        </section>
      </MainLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <MainLayout>
        <section className="py-16 bg-gradient-to-br from-primary/10 to-secondary/5">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">School Gallery</h1>
            <p className="text-xl text-red-600 max-w-3xl mx-auto">
              {error}
            </p>
            <Button 
              onClick={loadGalleryData} 
              className="mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        </section>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">School Gallery</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore moments from our vibrant school community through our photo gallery.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search gallery..."
                className="pl-10 w-full sm:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Camera className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">{filteredGallery.length} photos</span>
            </div>
          </div>
          
          {/* Category Tabs */}
          <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab} className="w-full mb-8">
            <TabsList className="flex flex-wrap h-auto p-1">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="capitalize"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          
          {/* Gallery Grid */}
          {filteredGallery.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredGallery.map((item) => (
                <div 
                  key={item.id} 
                  className="group relative h-64 rounded-lg overflow-hidden card-hover"
                >
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 text-white">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-white/80">{item.category}</span>
                      <span className="text-sm text-white/80">
                        {new Date(item.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No photos found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
          
          {/* Load More Button */}
          {filteredGallery.length > 0 && (
            <div className="mt-12 text-center">
              <Button variant="outline">
                Load More Photos
              </Button>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Gallery;
