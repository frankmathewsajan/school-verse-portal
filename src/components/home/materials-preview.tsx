
import React, { useState, useEffect } from 'react';
import { Book, FileText, Download, ArrowRight } from 'lucide-react';
import { SectionTitle } from '@/components/ui/section-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { ContentService } from '@/services/contentService';
import { downloadFile } from '@/lib/utils';
import type { Database } from '@/integrations/supabase/types';

type LearningMaterial = Database['public']['Tables']['learning_materials']['Row'];

export function MaterialsPreview() {
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMaterials = async () => {
      try {
        setLoading(true);
        const data = await ContentService.getLearningMaterials();
        setMaterials(data.slice(0, 4)); // Show only the latest 4 materials
      } catch (error) {
        console.error('Error loading materials:', error);
      } finally {
        setLoading(false);
      }
    };
    loadMaterials();
  }, []);

  const handleDownload = (material: LearningMaterial) => {
    if (!material.file_url) {
      console.error('No file URL available for download');
      return;
    }
    
    // Create a filename from the material title and file type
    const filename = `${material.title}.${material.file_type || 'file'}`;
    downloadFile(material.file_url, filename);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Learning Materials" 
          subtitle="Access educational resources, study guides, and supplementary materials to support your learning journey from Grade 1 to 12"
          centered
        />
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="h-full">
                <CardHeader>
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="animate-pulse">
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : materials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {materials.map((material) => (
              <Card key={material.id} className="card-hover h-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{material.title}</CardTitle>
                    <Badge variant="outline">{material.file_type?.toUpperCase()}</Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>{material.file_size}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{material.description}</p>
                  <div className="flex gap-2 mt-4">
                    <Badge variant="secondary" className="capitalize">{material.subject}</Badge>
                    <Badge variant="secondary">Grade {material.class_level}</Badge>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1"
                    onClick={() => handleDownload(material)}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 mt-12">
            <h3 className="text-xl font-semibold mb-2">No Materials Available</h3>
            <p className="text-muted-foreground">Learning materials will appear here once they are uploaded.</p>
          </div>
        )}
        
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
