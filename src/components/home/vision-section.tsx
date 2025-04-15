
import React from 'react';
import { SectionTitle } from '@/components/ui/section-title';
import { BookOpen, Award, Users, Star } from 'lucide-react';

export function VisionSection() {
  const features = [
    {
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      title: "Academic Excellence",
      description: "We maintain high academic standards through innovative teaching methods and comprehensive curriculum."
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Inclusive Community",
      description: "Our diverse and supportive environment ensures every student feels valued and empowered to succeed."
    },
    {
      icon: <Award className="h-10 w-10 text-primary" />,
      title: "Holistic Development",
      description: "We focus on developing well-rounded individuals through academic, social, and extracurricular activities."
    },
    {
      icon: <Star className="h-10 w-10 text-primary" />,
      title: "Future-Ready Skills",
      description: "Our programs equip students with critical thinking, creativity, and technological skills for future success."
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <SectionTitle 
              title="Our Vision & Mission" 
              subtitle="Fostering a learning environment that nurtures excellence, character, and lifelong learning"
            />
            
            <p className="text-muted-foreground my-6">
              At SchoolVerse Academy, we believe in providing an education that goes beyond textbooks. 
              Our vision is to create a nurturing environment where students can discover their potential, 
              develop critical skills, and become responsible global citizens prepared for the challenges of tomorrow.
            </p>
            
            <div className="bg-primary/5 border border-primary/10 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-semibold mb-3">Principal's Message</h3>
              <blockquote className="text-muted-foreground italic">
                "Education is not just about academic achievement, but about nurturing curious minds, 
                compassionate hearts, and resilient spirits. At SchoolVerse, we are committed to 
                guiding each student on their unique journey of growth and discovery."
              </blockquote>
              <div className="mt-4 flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 mr-3"></div>
                <div>
                  <p className="font-medium">Dr. Ashirwad Goel</p>
                  <p className="text-sm text-muted-foreground">Principal, St.G.D.Convent School</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-card border rounded-lg p-6 card-hover"
              >
                <div className="mb-4">{feature.icon}</div>
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
