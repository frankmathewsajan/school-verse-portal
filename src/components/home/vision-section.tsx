
import React, { useState, useEffect } from 'react';
import { SectionTitle } from '@/components/ui/section-title';
import { BookOpen, Award, Users, Star } from 'lucide-react';
import { ContentService } from '@/services/contentService';
import type { Database } from '@/integrations/supabase/types';

type VisionSection = Database['public']['Tables']['vision_section']['Row'];

export function VisionSection() {
  const [visionData, setVisionData] = useState<VisionSection>({
    id: 'main',
    title: 'Our Vision & Mission',
    subtitle: 'Fostering a learning environment that nurtures excellence, character, and lifelong learning',
    main_content: 'At SchoolVerse Academy, we believe in providing an education that goes beyond textbooks. Our vision is to create a nurturing environment where students can discover their potential, develop critical skills, and become responsible global citizens prepared for the challenges of tomorrow.',
    principal_message: 'Education is not just about academic achievement, but about nurturing curious minds, compassionate hearts, and resilient spirits. At SchoolVerse, we are committed to guiding each student on their unique journey of growth and discovery.',
    principal_name: 'Dr. Ashirwad Goel',
    principal_title: 'Principal, St.G.D.Convent School',
    features: [
      {
        title: "Academic Excellence",
        description: "We maintain high academic standards through innovative teaching methods and comprehensive curriculum."
      },
      {
        title: "Inclusive Community",
        description: "Our diverse and supportive environment ensures every student feels valued and empowered to succeed."
      },
      {
        title: "Holistic Development",
        description: "We focus on developing well-rounded individuals through academic, social, and extracurricular activities."
      },
      {
        title: "Future-Ready Skills",
        description: "Our programs equip students with critical thinking, creativity, and technological skills for future success."
      }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  useEffect(() => {
    const loadVisionData = async () => {
      const data = await ContentService.getVisionSection();
      if (data) {
        setVisionData(data);
      }
    };
    loadVisionData();
  }, []);

  const features = Array.isArray(visionData.features) ? visionData.features : [
    {
      title: "Academic Excellence",
      description: "We maintain high academic standards through innovative teaching methods and comprehensive curriculum."
    },
    {
      title: "Inclusive Community",
      description: "Our diverse and supportive environment ensures every student feels valued and empowered to succeed."
    },
    {
      title: "Holistic Development",
      description: "We focus on developing well-rounded individuals through academic, social, and extracurricular activities."
    },
    {
      title: "Future-Ready Skills",
      description: "Our programs equip students with critical thinking, creativity, and technological skills for future success."
    }
  ];

  const featureIcons = [
    <BookOpen className="h-10 w-10 text-primary" />,
    <Users className="h-10 w-10 text-primary" />,
    <Award className="h-10 w-10 text-primary" />,
    <Star className="h-10 w-10 text-primary" />
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <SectionTitle 
              title={visionData.title} 
              subtitle={visionData.subtitle || undefined}
            />
            
            <p className="text-muted-foreground my-6">
              {visionData.main_content}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-card border rounded-lg p-6 card-hover"
              >
                <div className="mb-4">{featureIcons[index] || featureIcons[0]}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
