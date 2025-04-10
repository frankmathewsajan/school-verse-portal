
import React from 'react';
import { Book, FileText, Download, ArrowRight } from 'lucide-react';
import { SectionTitle } from '@/components/ui/section-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

// Dummy materials data (would come from API/database)
const materials = [
  {
    id: 1,
    title: "Mathematics Study Guide - Grade 10",
    description: "Comprehensive study materials covering algebra, geometry, and trigonometry for Grade 10 students.",
    fileType: "PDF",
    fileSize: "2.4 MB",
    subject: "Mathematics",
    grade: "10",
    downloadUrl: "#",
  },
  {
    id: 2,
    title: "Physics Lab Manual",
    description: "Laboratory experiments and procedures for high school physics classes with safety guidelines.",
    fileType: "PDF",
    fileSize: "3.8 MB",
    subject: "Physics",
    grade: "11-12",
    downloadUrl: "#",
  },
  {
    id: 3,
    title: "English Literature - Selected Readings",
    description: "Collection of essential readings and analysis questions for senior English literature course.",
    fileType: "DOCX",
    fileSize: "1.7 MB",
    subject: "English",
    grade: "12",
    downloadUrl: "#",
  }
];

export function MaterialsPreview() {
  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Learning Materials" 
          subtitle="Access educational resources, study guides, and supplementary materials to support your learning journey"
          centered
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {materials.map((material) => (
            <Card key={material.id} className="card-hover h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{material.title}</CardTitle>
                  <Badge variant="outline">{material.fileType}</Badge>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>{material.fileSize}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{material.description}</p>
                <div className="flex gap-2 mt-4">
                  <Badge variant="secondary">{material.subject}</Badge>
                  <Badge variant="secondary">Grade {material.grade}</Badge>
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
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
