
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { SectionTitle } from '@/components/ui/section-title';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Camera, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Dummy gallery data (would come from API/database)
const galleryData = [
  {
    id: 1,
    title: "Science Exhibition",
    date: "2025-03-15",
    category: "Academic",
    imageUrl: "https://images.unsplash.com/photo-1581812873626-cdc86de0d916?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
  },
  {
    id: 2,
    title: "Annual Sports Day",
    date: "2025-02-20",
    category: "Sports",
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
  },
  {
    id: 3,
    title: "Cultural Festival",
    date: "2025-01-25",
    category: "Cultural",
    imageUrl: "https://images.unsplash.com/photo-1511424400163-1c66a2d5b3ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  },
  {
    id: 4,
    title: "Graduation Ceremony",
    date: "2024-12-15",
    category: "Event",
    imageUrl: "https://images.unsplash.com/photo-1627556704302-624286467c65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
  },
  {
    id: 5,
    title: "Art Exhibition",
    date: "2024-11-10",
    category: "Arts",
    imageUrl: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  },
  {
    id: 6,
    title: "Science Fair",
    date: "2024-10-05",
    category: "Academic",
    imageUrl: "https://images.unsplash.com/photo-1561525140-c2a4cc68e4bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
  },
  {
    id: 7,
    title: "Music Concert",
    date: "2024-09-20",
    category: "Cultural",
    imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
  },
  {
    id: 8,
    title: "Field Trip",
    date: "2024-08-15",
    category: "Excursion",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
  },
  {
    id: 9,
    title: "Basketball Tournament",
    date: "2024-07-10",
    category: "Sports",
    imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1780&q=80",
  },
  {
    id: 10,
    title: "Robotics Workshop",
    date: "2024-06-25",
    category: "Academic",
    imageUrl: "https://images.unsplash.com/photo-1671751412361-73ccaa653db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
  },
  {
    id: 11,
    title: "Swimming Competition",
    date: "2024-05-20",
    category: "Sports",
    imageUrl: "https://images.unsplash.com/photo-1622629797619-c100e3e67e2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1776&q=80",
  },
  {
    id: 12,
    title: "Drama Performance",
    date: "2024-04-15",
    category: "Cultural",
    imageUrl: "https://images.unsplash.com/photo-1588680215558-d7343516c1c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1772&q=80",
  },
];

const Gallery = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  
  // Filter gallery items based on search query and selected category
  const filteredGallery = galleryData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = currentTab === "all" || item.category.toLowerCase() === currentTab.toLowerCase();
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories for the tabs
  const categories = ["all", ...new Set(galleryData.map(item => item.category.toLowerCase()))];
  
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
