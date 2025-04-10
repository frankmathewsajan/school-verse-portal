
import React from 'react';
import { SectionTitle } from '@/components/ui/section-title';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Camera } from 'lucide-react';

// Dummy gallery data (would come from API/database)
const galleryItems = [
  {
    id: 1,
    title: "Science Exhibition",
    imageUrl: "https://images.unsplash.com/photo-1581812873626-cdc86de0d916?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    category: "Academic",
  },
  {
    id: 2,
    title: "Annual Sports Day",
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    category: "Sports",
  },
  {
    id: 3,
    title: "Cultural Festival",
    imageUrl: "https://images.unsplash.com/photo-1511424400163-1c66a2d5b3ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    category: "Cultural",
  },
  {
    id: 4,
    title: "Graduation Ceremony",
    imageUrl: "https://images.unsplash.com/photo-1627556704302-624286467c65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    category: "Event",
  }
];

export function GalleryPreview() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="School Life" 
          subtitle="Explore moments from our vibrant school community through our curated photo gallery"
          centered
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {galleryItems.map((item) => (
            <div 
              key={item.id} 
              className="group relative h-64 md:h-80 rounded-lg overflow-hidden card-hover"
            >
              <img 
                src={item.imageUrl} 
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
