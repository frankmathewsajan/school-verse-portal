
import React, { useState, useEffect } from 'react';
import { SectionTitle } from '@/components/ui/section-title';
import { BookOpen, Award, Users, Star } from 'lucide-react';
import { ContentService } from '@/services/contentService';
import type { Database } from '@/integrations/supabase/types';

type VisionSection = Database['public']['Tables']['vision_section']['Row'];

export function VisionSection() {
  const [visionData, setVisionData] = useState<VisionSection>({
    id: 'main',
    title: '',
    subtitle: '',
    main_content: '',
    principal_message: '',
    principal_name: '',
    principal_title: '',
    features: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVisionData = async () => {
      setLoading(true);
      const data = await ContentService.getVisionSection();
      if (data) {
        setVisionData(data);
      }
      setLoading(false);
    };
    loadVisionData();
  }, []);

  const features = Array.isArray(visionData.features) 
    ? visionData.features.map(f => ({ 
        title: (f as any)?.title || '', 
        description: (f as any)?.description || '' 
      }))
    : [];

  const featureIcons = [
    <BookOpen className="h-10 w-10 text-primary" />,
    <Users className="h-10 w-10 text-primary" />,
    <Award className="h-10 w-10 text-primary" />,
    <Star className="h-10 w-10 text-primary" />
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left side - Text placeholders */}
            <div className="space-y-6">
              {/* Title placeholder */}
              <div className="space-y-3">
                <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-64 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                </div>
                <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-96 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                </div>
              </div>
              
              {/* Content placeholder */}
              <div className="space-y-2">
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                </div>
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                </div>
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-3/4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                </div>
              </div>
              
              <div className="text-gray-400 text-sm">Loading...</div>
            </div>
            
            {/* Right side - Feature cards placeholders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, index) => (
                <div 
                  key={index} 
                  className="bg-card border rounded-lg p-6"
                >
                  <div className="mb-4 h-10 w-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                  </div>
                  <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded mb-2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                    </div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-3/4 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <SectionTitle 
                title={visionData.title || 'Our Vision & Mission'} 
                subtitle={visionData.subtitle || undefined}
              />
              
              {visionData.main_content && (
                <p className="text-muted-foreground my-6">
                  {visionData.main_content}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.length > 0 && (
                features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="bg-card border rounded-lg p-6 card-hover"
                  >
                    <div className="mb-4">{featureIcons[index] || featureIcons[0]}</div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
