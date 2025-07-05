
import React, { useState, useEffect } from 'react';
import { Book, FileText, Download, ArrowRight } from 'lucide-react';
import { SectionTitle } from '@/components/ui/section-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { ContentService } from '@/services/contentService';
import type { Database } from '@/integrations/supabase/types';

type LearningMaterial = Database['public']['Tables']['learning_materials']['Row'];

export function MaterialsPreview() {
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);

  useEffect(() => {
    const loadMaterials = async () => {
      const data = await ContentService.getLearningMaterials();
      setMaterials(data.slice(0, 4)); // Show only the latest 4 materials
    };
    loadMaterials();
  }, []);

  // Default fallback data if no materials in database
  const defaultMaterials = [
    {
      id: "1",
      title: "Primary Mathematics Handbook",
      description: "Essential mathematics concepts for primary school students with practice exercises.",
      file_type: "PDF",
      file_size: "1.8 MB",
      subject: "Mathematics",
      class_level: "1-5",
      file_url: "#",
      downloads: 0,
      created_at: new Date().toISOString()
    },
    {
      id: "2",
      title: "Middle School Science Experiments",
      description: "Practical science experiments and activities for middle school students.",
      file_type: "PDF",
      file_size: "3.2 MB",
      subject: "Science",
      class_level: "6-8",
      file_url: "#",
      downloads: 0,
      created_at: new Date().toISOString()
    },
    {
      id: "3",
      title: "Secondary English Literature Guide",
      description: "Comprehensive analysis of literary works for secondary students.",
      file_type: "PDF",
      file_size: "2.7 MB",
      subject: "English",
      class_level: "9-10",
      file_url: "#",
      downloads: 0,
      created_at: new Date().toISOString()
    },
    {
      id: "4",
      title: "Senior Physics - Advanced Concepts",
      description: "Detailed physics materials for senior secondary covering mechanics, thermodynamics, and electromagnetism.",
      file_type: "PDF",
      file_size: "4.5 MB",
      subject: "Physics",
      class_level: "11-12",
      file_url: "#",
      downloads: 0,
      created_at: new Date().toISOString()
    }
  ];

  const displayMaterials = materials.length > 0 ? materials : defaultMaterials;

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Learning Materials" 
          subtitle="Access educational resources, study guides, and supplementary materials to support your learning journey from Grade 1 to 12"
          centered
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {displayMaterials.map((material) => (
            <Card key={material.id} className="card-hover h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{material.title}</CardTitle>
                  <Badge variant="outline">{material.file_type}</Badge>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>{material.file_size}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{material.description}</p>
                <div className="flex gap-2 mt-4">
                  <Badge variant="secondary">{material.subject}</Badge>
                  <Badge variant="secondary">Grade {material.class_level}</Badge>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost" size="sm" className="gap-1">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild className="rounded-full">
            <Link to="/materials">
              <Book className="mr-2 h-4 w-4" />
              Browse All Materials
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
