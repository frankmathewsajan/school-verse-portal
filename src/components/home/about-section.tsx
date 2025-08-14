
import React, { useState, useEffect } from 'react';
import { SectionTitle } from '@/components/ui/section-title';
import { Card, CardContent } from '@/components/ui/card';
import { Building, Users, BookOpen, GraduationCap } from 'lucide-react';
import { ContentService } from '@/services/contentService';
import type { Database } from '@/integrations/supabase/types';

type AboutSection = Database['public']['Tables']['about_section']['Row'];

export function AboutSection() {
  const [aboutData, setAboutData] = useState<AboutSection & { about_image_url?: string }>({
    id: 'main',
    title: '',
    subtitle: '',
    main_content: [],
    principal_message: '',
    principal_name: '',
    principal_title: '',
    principal_image_url: '',
    about_image_url: '',
    school_founded_year: null,
    school_description: null,
    features: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const aboutSection = await ContentService.getAboutSection();
      
      if (aboutSection) {
        setAboutData(aboutSection);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const features = Array.isArray(aboutData.features) 
    ? aboutData.features
        .filter((f: any) => !(f && typeof f === 'object' && f._meta === true)) // Filter out metadata
        .map(f => ({ 
          title: (f as any)?.title || '', 
          description: (f as any)?.description || '' 
        }))
    : [];

  const featureIcons = [
    <Building className="h-10 w-10 text-primary" />,
    <Users className="h-10 w-10 text-primary" />,
    <BookOpen className="h-10 w-10 text-primary" />,
    <GraduationCap className="h-10 w-10 text-primary" />
  ];

  const mainContent = Array.isArray(aboutData.main_content) 
    ? aboutData.main_content.map(item => typeof item === 'string' ? item : JSON.stringify(item))
    : [];

  return (
    <section id="about" className="py-16 bg-light">
      <div className="container mx-auto px-4">
        {loading ? (
          <div className="text-center">
            <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-64 mx-auto mb-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
            </div>
            <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-96 mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
            </div>
            <div className="text-gray-400 mt-4">Loading...</div>
          </div>
        ) : (
          <SectionTitle 
            title={aboutData.title || 'About Our School'} 
            subtitle={aboutData.subtitle || undefined}
            centered
          />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-12">
          {loading ? (
            <>
              {/* Image placeholder */}
              <div className="relative rounded-lg overflow-hidden h-[400px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-gray-400 text-sm font-medium">Loading...</div>
                </div>
              </div>
              
              {/* Content placeholder */}
              <div className="space-y-6">
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="space-y-2">
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
                  ))}
                </div>
                
                {/* Principal message placeholder */}
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-6">
                  <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-48 mb-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                    </div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-5/6 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                    </div>
                    <div className="ml-3 space-y-2">
                      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-32 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                      </div>
                      <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-40 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {aboutData.about_image_url && (
                <div className="relative rounded-lg overflow-hidden h-[400px]">
                  <img 
                    src={aboutData.about_image_url} 
                    alt="School building"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div>
                {mainContent.length > 0 && (
                  <div className="space-y-4 text-muted-foreground">
                    {mainContent.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                )}
                
                {aboutData.principal_message && (
                  <div className="bg-primary/5 border border-primary/10 rounded-lg p-6 mt-8">
                    <h3 className="text-xl font-semibold mb-3">Principal's Message</h3>
                    <blockquote className="text-muted-foreground italic">
                      "{aboutData.principal_message}"
                    </blockquote>
                    <div className="mt-4 flex items-center">
                      {aboutData.principal_image_url && (
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img 
                            src={aboutData.principal_image_url} 
                            alt="Principal"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="ml-3">
                        <p className="font-medium">{aboutData.principal_name}</p>
                        <p className="text-sm text-muted-foreground">{aboutData.principal_title}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {loading ? (
            [...Array(4)].map((_, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-6">
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
                </CardContent>
              </Card>
            ))
          ) : features.length > 0 && (
            features.map((feature, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-6">
                  <div className="mb-4">{featureIcons[index] || featureIcons[0]}</div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
