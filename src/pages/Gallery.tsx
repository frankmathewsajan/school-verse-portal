
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { SectionTitle } from '@/components/ui/section-title';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Camera, Search, FolderOpen, Images, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ContentService } from '@/services/contentService';
import type { Database } from '@/integrations/supabase/types';

type GalleryItem = Database['public']['Tables']['school_life_gallery']['Row'];
type GalleryGroup = Database['public']['Tables']['gallery_groups']['Row'];

interface GalleryGroupWithItems extends GalleryGroup {
  items: any[];
  itemCount: number;
}

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
  const [currentTab, setCurrentTab] = useState("events");
  const [galleryData, setGalleryData] = useState<GalleryData[]>([]);
  const [galleryGroups, setGalleryGroups] = useState<GalleryGroupWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state for Instagram-style image viewer
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalImages, setModalImages] = useState<any[]>([]);

  // Load gallery data from database
  const loadGalleryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load both gallery groups and individual gallery items
      const [items, groups] = await Promise.all([
        ContentService.getGalleryItems(),
        ContentService.getAllGalleryGroups()
      ]);
      
      // Transform database data to component format inline
      const transformedItems = items.map((item: GalleryItem): GalleryData => ({
        id: item.id,
        title: item.title,
        date: item.date_taken || item.created_at || new Date().toISOString(),
        category: item.category || 'General',
        imageUrl: item.image_url,
        description: item.description || undefined
      }));
      
      setGalleryData(transformedItems);
      setGalleryGroups(groups);
    } catch (err) {
      console.error('Error loading gallery data:', err);
      setError('Failed to load gallery items');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount only
  useEffect(() => {
    loadGalleryData();
  }, []); // Empty dependency array - load only once

  const handleGroupClick = async (group: GalleryGroupWithItems) => {
    try {
      setLoading(true);
      setError(null);
      const items = await ContentService.getGalleryItemsByGroup(group.id);
      
      // Directly open the modal with the images instead of showing individual group view
      openImageModal(0, items);
    } catch (err) {
      console.error('Error loading group items:', err);
      setError('Failed to load group images');
    } finally {
      setLoading(false);
    }
  };

  // Modal functions for Instagram-style image viewer
  const openImageModal = (imageIndex: number, images: any[]) => {
    setCurrentImageIndex(imageIndex);
    setModalImages(images);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
    setCurrentImageIndex(0);
    setModalImages([]);
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? modalImages.length - 1 : prev - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === modalImages.length - 1 ? 0 : prev + 1
    );
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      
      if (e.key === 'ArrowLeft') {
        goToPreviousImage();
      } else if (e.key === 'ArrowRight') {
        goToNextImage();
      } else if (e.key === 'Escape') {
        closeImageModal();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isModalOpen, modalImages.length]);

  // Filter gallery items based on search query and selected category
  const filteredGallery = galleryData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = currentTab === "all" || item.category.toLowerCase() === currentTab.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Filter gallery groups based on search query
  const filteredGroups = galleryGroups.filter(group => {
    const matchesSearch = group.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (group.description && group.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });
  
  // Get unique categories for the tabs
  const categories = ["all", ...new Set(galleryData.map(item => item.category.toLowerCase()))];

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Date not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Show loading state only during initial load
  if (loading && galleryData.length === 0 && galleryGroups.length === 0) {
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
              <span className="text-muted-foreground">
                {currentTab === "events" ? `${filteredGroups.length} events` : `${filteredGallery.length} photos`}
              </span>
            </div>
          </div>
          
          {/* Category Tabs */}
          <Tabs defaultValue="events" value={currentTab} onValueChange={setCurrentTab} className="w-full mb-8">
            <TabsList className="flex flex-wrap h-auto p-1">
              <TabsTrigger value="events" className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                Events & Trips
              </TabsTrigger>
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Images className="h-4 w-4" />
                All Photos
              </TabsTrigger>
              {categories.filter(cat => cat !== "all").map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="capitalize"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Events Tab Content */}
            <TabsContent value="events" className="mt-8">
              {filteredGroups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGroups.map((group) => (
                    <Card 
                      key={group.id} 
                      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleGroupClick(group)}
                    >
                      <div className="aspect-[4/3] relative">
                        {group.cover_image_url ? (
                          <img
                            src={group.cover_image_url}
                            alt={group.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <FolderOpen className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h3 className="font-semibold text-lg mb-1">{group.title}</h3>
                          <div className="flex items-center gap-2 text-sm opacity-90">
                            <Images className="w-4 h-4" />
                            <span>{group.itemCount} images</span>
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
              ) : (
                <div className="text-center py-12">
                  <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Events Found</h3>
                  <p className="text-gray-500">
                    {searchQuery ? 'Try adjusting your search criteria' : 'Events will appear here once they are created'}
                  </p>
                </div>
              )}
            </TabsContent>

            {/* All Photos and Category Tabs */}
            <TabsContent value="all" className="mt-8">
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
            </TabsContent>

            {/* Individual Category Tabs */}
            {categories.filter(cat => cat !== "all").map((category) => (
              <TabsContent key={category} value={category} className="mt-8">
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
                    <p className="text-muted-foreground">No photos in this category yet</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Instagram-style Image Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent 
          className="max-w-4xl w-full h-[80vh] p-0 bg-white border border-gray-200"
          aria-describedby={undefined}
        >
          <div className="relative w-full h-full flex items-center justify-center bg-gray-50">
            {/* Navigation buttons */}
            {modalImages.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 text-gray-700 hover:bg-white hover:text-gray-900 border-gray-300 shadow-lg rounded-full w-12 h-12"
                  onClick={goToPreviousImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 text-gray-700 hover:bg-white hover:text-gray-900 border-gray-300 shadow-lg rounded-full w-12 h-12"
                  onClick={goToNextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* Current image */}
            {modalImages[currentImageIndex] && (
              <div className="w-full h-full flex flex-col">
                <div className="flex-1 flex items-center justify-center p-6">
                  <img
                    src={modalImages[currentImageIndex].image_url}
                    alt={modalImages[currentImageIndex].alt_text || modalImages[currentImageIndex].title || 'Gallery image'}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                  />
                </div>
                
                {/* Image info */}
                {(modalImages[currentImageIndex].title || modalImages[currentImageIndex].description) && (
                  <div className="bg-white border-t border-gray-200 p-4">
                    <div className="max-w-3xl mx-auto">
                      {modalImages[currentImageIndex].title && (
                        <h3 className="text-lg font-semibold mb-2 text-gray-900">
                          {modalImages[currentImageIndex].title}
                        </h3>
                      )}
                      {modalImages[currentImageIndex].description && (
                        <p className="text-gray-600 text-sm">
                          {modalImages[currentImageIndex].description}
                        </p>
                      )}
                      {modalImages.length > 1 && (
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-gray-500 text-sm">
                            {currentImageIndex + 1} of {modalImages.length}
                          </span>
                          <div className="flex gap-1">
                            {modalImages.map((_, index) => (
                              <button
                                key={index}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                  index === currentImageIndex ? 'bg-gray-600' : 'bg-gray-300'
                                }`}
                                onClick={() => setCurrentImageIndex(index)}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Gallery;
