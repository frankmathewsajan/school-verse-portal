
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { SectionTitle } from '@/components/ui/section-title';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Search, FolderOpen, Images, Calendar, Eye, ArrowRight } from 'lucide-react';
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
  const [selectedGroup, setSelectedGroup] = useState<GalleryGroupWithItems | null>(null);
  const [selectedGroupItems, setSelectedGroupItems] = useState<any[]>([]);

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
      setSelectedGroup(group);
      setSelectedGroupItems(items);
    } catch (err) {
      console.error('Error loading group items:', err);
      setError('Failed to load group images');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToGroups = () => {
    setSelectedGroup(null);
    setSelectedGroupItems([]);
  };

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

  // Show loading state only during initial load or when loading group items
  if (loading && !selectedGroup && galleryData.length === 0) {
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
              {selectedGroup ? (
                // Individual Group View
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={handleBackToGroups}
                      className="flex items-center gap-2"
                    >
                      <ArrowRight className="w-4 h-4 rotate-180" />
                      Back to Events
                    </Button>
                    <Badge variant="secondary">
                      {selectedGroupItems.length} images
                    </Badge>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FolderOpen className="w-5 h-5" />
                        {selectedGroup.title}
                      </CardTitle>
                      <CardDescription>
                        {selectedGroup.description}
                      </CardDescription>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                        <span>Category: {selectedGroup.category}</span>
                        <span>Date: {formatDate(selectedGroup.date_taken)}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="text-center py-12">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                          <p className="text-muted-foreground">Loading images...</p>
                        </div>
                      ) : selectedGroupItems.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {selectedGroupItems.map((item) => (
                            <div 
                              key={item.id} 
                              className="group relative aspect-square rounded-lg overflow-hidden card-hover"
                            >
                              <img 
                                src={item.image_url} 
                                alt={item.alt_text || item.title || 'Gallery image'}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.title && (
                                  <h4 className="text-sm font-semibold">{item.title}</h4>
                                )}
                                {item.description && (
                                  <p className="text-xs text-white/80 mt-1">{item.description}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Images className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Images Yet</h3>
                          <p className="text-gray-500">
                            Images will appear here once they are uploaded to this event.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                // Groups List View
                filteredGroups.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGroups.map((group) => (
                      <Card key={group.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
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
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {group.description}
                            </p>
                          )}
                          <Button
                            onClick={() => handleGroupClick(group)}
                            className="w-full"
                            variant="outline"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Gallery
                          </Button>
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
                )
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
    </MainLayout>
  );
};

export default Gallery;
