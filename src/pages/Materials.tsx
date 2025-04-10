
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Search, SlidersHorizontal, Book, BookOpen } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Dummy materials data (would come from API/database)
const materialsData = [
  // Primary School (Grades 1-5)
  {
    id: 1,
    title: "Mathematics Fundamentals - Grade 3",
    description: "Basic arithmetic, multiplication tables, and simple fractions for Grade 3 students.",
    fileType: "PDF",
    fileSize: "1.2 MB",
    subject: "Mathematics",
    grade: "3",
    uploadDate: "2025-03-15",
    downloadUrl: "#",
  },
  {
    id: 2,
    title: "English Reading Practice - Grade 1-2",
    description: "Simple reading exercises and phonics practice for early readers.",
    fileType: "PDF",
    fileSize: "0.8 MB",
    subject: "English",
    grade: "1-2",
    uploadDate: "2025-03-12",
    downloadUrl: "#",
  },
  {
    id: 3,
    title: "Environmental Science - Grade 5",
    description: "Introduction to ecosystems, plants, animals, and environmental awareness.",
    fileType: "PDF",
    fileSize: "1.5 MB",
    subject: "Science",
    grade: "5",
    uploadDate: "2025-03-10",
    downloadUrl: "#",
  },
  {
    id: 4,
    title: "Art & Craft Activities - Grade 1-4",
    description: "Creative art projects and crafts for primary school students.",
    fileType: "PDF",
    fileSize: "2.2 MB",
    subject: "Art",
    grade: "1-4",
    uploadDate: "2025-03-08",
    downloadUrl: "#",
  },
  
  // Middle School (Grades 6-8)
  {
    id: 5,
    title: "Algebra Basics - Grade 7",
    description: "Introduction to algebraic expressions, equations, and problem-solving techniques.",
    fileType: "PDF",
    fileSize: "2.0 MB",
    subject: "Mathematics",
    grade: "7",
    uploadDate: "2025-03-05",
    downloadUrl: "#",
  },
  {
    id: 6,
    title: "Cell Biology Guide - Grade 8",
    description: "Comprehensive study of cell structure, functions, and processes.",
    fileType: "PDF",
    fileSize: "2.8 MB",
    subject: "Biology",
    grade: "8",
    uploadDate: "2025-03-01",
    downloadUrl: "#",
  },
  {
    id: 7,
    title: "World History - Grade 6",
    description: "Overview of ancient civilizations and major historical events.",
    fileType: "PPTX",
    fileSize: "3.5 MB",
    subject: "History",
    grade: "6",
    uploadDate: "2025-02-25",
    downloadUrl: "#",
  },
  {
    id: 8,
    title: "Computer Fundamentals - Grade 6-8",
    description: "Introduction to computer systems, basic programming, and digital literacy.",
    fileType: "PDF",
    fileSize: "1.8 MB",
    subject: "Computer Science",
    grade: "6-8",
    uploadDate: "2025-02-20",
    downloadUrl: "#",
  },
  
  // High School (Grades 9-10)
  {
    id: 9,
    title: "Geometry and Trigonometry - Grade 10",
    description: "Comprehensive study materials covering geometry theorems and trigonometric functions.",
    fileType: "PDF",
    fileSize: "2.4 MB",
    subject: "Mathematics",
    grade: "10",
    uploadDate: "2025-02-15",
    downloadUrl: "#",
  },
  {
    id: 10,
    title: "Chemistry Formulas & Equations - Grade 9",
    description: "Essential chemical formulas, balancing equations, and reaction types.",
    fileType: "PDF",
    fileSize: "1.9 MB",
    subject: "Chemistry",
    grade: "9",
    uploadDate: "2025-02-10",
    downloadUrl: "#",
  },
  {
    id: 11,
    title: "English Literature Analysis - Grade 10",
    description: "Literary analysis techniques and essay writing for secondary students.",
    fileType: "DOCX",
    fileSize: "1.7 MB",
    subject: "English",
    grade: "10",
    uploadDate: "2025-02-05",
    downloadUrl: "#",
  },
  {
    id: 12,
    title: "Physics Experiments - Grade 9-10",
    description: "Laboratory experiments and procedures for high school physics classes.",
    fileType: "PDF",
    fileSize: "3.2 MB",
    subject: "Physics",
    grade: "9-10",
    uploadDate: "2025-01-30",
    downloadUrl: "#",
  },
  
  // Senior Secondary (Grades 11-12)
  {
    id: 13,
    title: "Calculus Complete Guide - Grade 12",
    description: "Comprehensive calculus materials covering limits, derivatives, and integrals.",
    fileType: "PDF",
    fileSize: "4.7 MB",
    subject: "Mathematics",
    grade: "12",
    uploadDate: "2025-01-25",
    downloadUrl: "#",
  },
  {
    id: 14,
    title: "Organic Chemistry - Grade 11",
    description: "Detailed notes on organic compounds, reactions, and mechanisms.",
    fileType: "PDF",
    fileSize: "3.8 MB",
    subject: "Chemistry",
    grade: "11",
    uploadDate: "2025-01-20",
    downloadUrl: "#",
  },
  {
    id: 15,
    title: "Advanced Physics - Grade 11-12",
    description: "In-depth physics materials covering mechanics, electromagnetism, and modern physics.",
    fileType: "PDF",
    fileSize: "5.2 MB",
    subject: "Physics",
    grade: "11-12",
    uploadDate: "2025-01-15",
    downloadUrl: "#",
  },
  {
    id: 16,
    title: "Economics Principles - Grade 12",
    description: "Foundations of micro and macroeconomics for senior students.",
    fileType: "PDF",
    fileSize: "2.6 MB",
    subject: "Economics",
    grade: "12",
    uploadDate: "2025-01-10",
    downloadUrl: "#",
  }
];

const Materials = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSubject, setCurrentSubject] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");
  
  // Define grade level groups for filtering
  const gradeGroups = [
    { id: "all", label: "All Grades" },
    { id: "1-5", label: "Primary (1-5)" },
    { id: "6-8", label: "Middle (6-8)" },
    { id: "9-10", label: "Secondary (9-10)" },
    { id: "11-12", label: "Sr. Secondary (11-12)" }
  ];
  
  // Individual grades for more specific filtering
  const individualGrades = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  
  // Get unique subjects for filters
  const subjects = ["all", ...new Set(materialsData.map(item => item.subject))];
  
  // Filter materials based on search query, selected subject, and grade
  const filteredMaterials = materialsData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = currentSubject === "all" || item.subject === currentSubject;
    
    // Handle grade filtering with groups or individual grades
    const matchesGrade = gradeFilter === "all" ? true : 
                        (gradeFilter === "1-5" && (["1", "2", "3", "4", "5"].some(g => item.grade.includes(g)))) ||
                        (gradeFilter === "6-8" && (["6", "7", "8"].some(g => item.grade.includes(g)))) ||
                        (gradeFilter === "9-10" && (["9", "10"].some(g => item.grade.includes(g)))) ||
                        (gradeFilter === "11-12" && (["11", "12"].some(g => item.grade.includes(g)))) ||
                        item.grade.includes(gradeFilter);
    
    return matchesSearch && matchesSubject && matchesGrade;
  });
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif">Learning Materials</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Access educational resources, study guides, and supplementary materials for all grade levels from 1 to 12 at St. G. D. Convent School.
          </p>
        </div>
      </section>

      {/* Materials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Grade Levels Tabs */}
          <Tabs defaultValue="all" value={gradeFilter} onValueChange={setGradeFilter} className="w-full mb-8">
            <TabsList className="flex flex-wrap h-auto p-1 mb-4">
              {gradeGroups.map((group) => (
                <TabsTrigger 
                  key={group.id} 
                  value={group.id}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {group.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          
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
                <Select value={currentSubject} onValueChange={setCurrentSubject}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <div className="flex items-center gap-2">
                      <Book className="h-4 w-4" />
                      <span>{currentSubject === "all" ? "All Subjects" : currentSubject}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.filter(s => s !== "all").map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={gradeFilter === "all" || gradeGroups.some(g => g.id === gradeFilter) ? gradeFilter : "all"}>
                  <SelectTrigger className="w-full md:w-[150px]">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>
                        {gradeFilter === "all" ? "All Grades" : 
                         gradeFilter === "1-5" ? "Primary (1-5)" :
                         gradeFilter === "6-8" ? "Middle (6-8)" :
                         gradeFilter === "9-10" ? "Secondary (9-10)" :
                         gradeFilter === "11-12" ? "Sr. Secondary (11-12)" :
                         `Grade ${gradeFilter}`}
                      </span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {/* Already handled by the tabs above */}
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
