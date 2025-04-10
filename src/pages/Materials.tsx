
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { SectionTitle } from '@/components/ui/section-title';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Search, SlidersHorizontal, Book, BookOpen } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Dummy materials data (would come from API/database)
const materialsData = [
  {
    id: 1,
    title: "Mathematics Study Guide - Grade 10",
    description: "Comprehensive study materials covering algebra, geometry, and trigonometry for Grade 10 students.",
    fileType: "PDF",
    fileSize: "2.4 MB",
    subject: "Mathematics",
    grade: "10",
    uploadDate: "2025-03-10",
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
    uploadDate: "2025-03-05",
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
    uploadDate: "2025-02-28",
    downloadUrl: "#",
  },
  {
    id: 4,
    title: "Chemistry Formula Sheet",
    description: "Quick reference guide with important formulas, constants, and equations for chemistry students.",
    fileType: "PDF",
    fileSize: "1.2 MB",
    subject: "Chemistry",
    grade: "11",
    uploadDate: "2025-02-20",
    downloadUrl: "#",
  },
  {
    id: 5,
    title: "Biology Revision Notes",
    description: "Comprehensive notes covering key biology concepts including cell biology, genetics, and ecology.",
    fileType: "PDF",
    fileSize: "4.5 MB",
    subject: "Biology",
    grade: "11-12",
    uploadDate: "2025-02-15",
    downloadUrl: "#",
  },
  {
    id: 6,
    title: "History - World War II Timeline",
    description: "Detailed timeline of major events during World War II with contextual information.",
    fileType: "PDF",
    fileSize: "2.1 MB",
    subject: "History",
    grade: "10",
    uploadDate: "2025-02-08",
    downloadUrl: "#",
  },
  {
    id: 7,
    title: "Computer Science - Programming Basics",
    description: "Introduction to programming concepts, algorithms, and basic coding exercises.",
    fileType: "PDF",
    fileSize: "3.2 MB",
    subject: "Computer Science",
    grade: "9-10",
    uploadDate: "2025-01-30",
    downloadUrl: "#",
  },
  {
    id: 8,
    title: "Geography - Climate Change Study",
    description: "Research materials on climate change causes, effects, and potential solutions.",
    fileType: "PPTX",
    fileSize: "5.7 MB",
    subject: "Geography",
    grade: "11",
    uploadDate: "2025-01-25",
    downloadUrl: "#",
  },
  {
    id: 9,
    title: "Art History - Renaissance Period",
    description: "Overview of Renaissance art movements, key artists, and significant works.",
    fileType: "PDF",
    fileSize: "6.3 MB",
    subject: "Art",
    grade: "10-12",
    uploadDate: "2025-01-18",
    downloadUrl: "#",
  },
  {
    id: 10,
    title: "Economics - Market Structures",
    description: "Exploration of different market structures including perfect competition, monopoly, and oligopoly.",
    fileType: "PDF",
    fileSize: "2.8 MB",
    subject: "Economics",
    grade: "12",
    uploadDate: "2025-01-12",
    downloadUrl: "#",
  },
  {
    id: 11,
    title: "Music Theory Fundamentals",
    description: "Introduction to music notation, scales, chords, and basic compositional techniques.",
    fileType: "PDF",
    fileSize: "3.4 MB",
    subject: "Music",
    grade: "9-12",
    uploadDate: "2025-01-05",
    downloadUrl: "#",
  },
  {
    id: 12,
    title: "Physical Education - Fitness Program",
    description: "Comprehensive fitness plan with exercises, nutrition guidelines, and tracking tools.",
    fileType: "PDF",
    fileSize: "2.6 MB",
    subject: "Physical Education",
    grade: "9-12",
    uploadDate: "2024-12-28",
    downloadUrl: "#",
  }
];

const Materials = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSubject, setCurrentSubject] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");
  
  // Get unique subjects and grades for filters
  const subjects = ["all", ...new Set(materialsData.map(item => item.subject))];
  const grades = ["all", ...new Set(materialsData.map(item => item.grade))];
  
  // Filter materials based on search query, selected subject, and grade
  const filteredMaterials = materialsData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = currentSubject === "all" || item.subject === currentSubject;
    const matchesGrade = gradeFilter === "all" || item.grade.includes(gradeFilter);
    return matchesSearch && matchesSubject && matchesGrade;
  });
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Learning Materials</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Access educational resources, study guides, and supplementary materials to support your learning.
          </p>
        </div>
      </section>

      {/* Materials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search materials..."
                className="pl-10 w-full md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Select value={gradeFilter} onValueChange={setGradeFilter}>
                  <SelectTrigger className="w-full md:w-[150px]">
                    <div className="flex items-center gap-2">
                      <Book className="h-4 w-4" />
                      <span>{gradeFilter === "all" ? "All Grades" : `Grade ${gradeFilter}`}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    {grades.filter(g => g !== "all").map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        Grade {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>
          
          {/* Subject Tabs */}
          <Tabs defaultValue="all" value={currentSubject} onValueChange={setCurrentSubject} className="w-full mb-8">
            <TabsList className="flex flex-wrap h-auto p-1 mb-4">
              {subjects.slice(0, 6).map((subject) => (
                <TabsTrigger 
                  key={subject} 
                  value={subject}
                >
                  {subject}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsList className="flex flex-wrap h-auto p-1">
              {subjects.slice(6).map((subject) => (
                <TabsTrigger 
                  key={subject} 
                  value={subject}
                >
                  {subject}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          
          {/* Materials Grid */}
          {filteredMaterials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials.map((material) => (
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
                    <span className="text-xs text-muted-foreground">
                      Uploaded: {new Date(material.uploadDate).toLocaleDateString()}
                    </span>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No materials found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
          
          {/* Load More Button */}
          {filteredMaterials.length > 0 && (
            <div className="mt-12 text-center">
              <Button variant="outline">
                Load More Materials
              </Button>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Materials;
