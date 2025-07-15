
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
    title: 'About Our School',
    subtitle: 'Excellence in education through innovative teaching and comprehensive curriculum',
    main_content: [
      'St. G. D. Convent School is a leading educational institution committed to providing a balanced and stimulating learning environment where students can achieve academic excellence and personal growth.',
      'Our comprehensive curriculum is designed to develop critical thinking, creativity, and problem-solving skills, preparing students for success in higher education and beyond.',
      'We pride ourselves on small class sizes, dedicated teachers, and a supportive community that nurtures each student\'s individual talents and abilities.'
    ],
    principal_message: 'Education is not just about academic achievement, but about nurturing curious minds, compassionate hearts, and resilient spirits. At St. G. D. Convent School, we are committed to guiding each student on their unique journey of growth and discovery.',
    principal_name: 'Mr. Ashirwad Goyal',
    principal_title: 'Principal, St. G. D. Convent School',
    principal_image_url: 'https://randomuser.me/api/portraits/women/45.jpg',
    about_image_url: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    school_founded_year: 1985,
    school_description: null,
    features: [
      {
        title: "Founded in 1985",
        description: "With decades of educational excellence and a strong foundation in values-based learning"
      },
      {
        title: "Diverse Community",
        description: "Creating an inclusive environment where every student feels valued and empowered"
      },
      {
        title: "Comprehensive Curriculum",
        description: "Balancing academic rigor with holistic development for well-rounded education"
      },
      {
        title: "Academic Excellence",
        description: "Consistent record of outstanding achievements in academics and extracurriculars"
      }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  useEffect(() => {
    const loadData = async () => {
      const aboutSection = await ContentService.getAboutSection();
      
      if (aboutSection) {
        setAboutData(aboutSection);
      }
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
    : [
        {
          title: "Founded in 1985",
          description: "With decades of educational excellence and a strong foundation in values-based learning"
        },
        {
          title: "Diverse Community",
          description: "Creating an inclusive environment where every student feels valued and empowered"
        },
        {
          title: "Comprehensive Curriculum",
          description: "Balancing academic rigor with holistic development for well-rounded education"
        },
        {
          title: "Academic Excellence",
          description: "Consistent record of outstanding achievements in academics and extracurriculars"
        }
      ];

  const featureIcons = [
    <Building className="h-10 w-10 text-primary" />,
    <Users className="h-10 w-10 text-primary" />,
    <BookOpen className="h-10 w-10 text-primary" />,
    <GraduationCap className="h-10 w-10 text-primary" />
  ];

  const mainContent = Array.isArray(aboutData.main_content) 
    ? aboutData.main_content.map(item => typeof item === 'string' ? item : JSON.stringify(item))
    : [
        'St. G. D. Convent School is a leading educational institution committed to providing a balanced and stimulating learning environment where students can achieve academic excellence and personal growth.',
        'Our comprehensive curriculum is designed to develop critical thinking, creativity, and problem-solving skills, preparing students for success in higher education and beyond.',
        'We pride ourselves on small class sizes, dedicated teachers, and a supportive community that nurtures each student\'s individual talents and abilities.'
      ];

  return (
    <section id="about" className="py-16 bg-light">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title={aboutData.title} 
          subtitle={aboutData.subtitle || undefined}
          centered
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-12">
          <div className="relative rounded-lg overflow-hidden h-[400px]">
            <img 
              src={aboutData.about_image_url || "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"} 
              alt="School building"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div>
            <div className="space-y-4 text-muted-foreground">
              {mainContent.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            
            <div className="bg-primary/5 border border-primary/10 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-semibold mb-3">Principal's Message</h3>
              <blockquote className="text-muted-foreground italic">
                "{aboutData.principal_message}"
              </blockquote>
              <div className="mt-4 flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img 
                    src={aboutData.principal_image_url || "https://randomuser.me/api/portraits/women/45.jpg"} 
                    alt="Principal"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <p className="font-medium">{aboutData.principal_name}</p>
                  <p className="text-sm text-muted-foreground">{aboutData.principal_title}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {features.map((feature, index) => (
            <Card key={index} className="card-hover">
              <CardContent className="p-6">
                <div className="mb-4">{featureIcons[index] || featureIcons[0]}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
