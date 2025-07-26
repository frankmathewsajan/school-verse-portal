
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Search, SlidersHorizontal, Book, BookOpen } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContentService } from '@/services/contentService';
import { downloadFile } from '@/lib/utils';
import type { Database } from '@/integrations/supabase/types';

type LearningMaterial = Database['public']['Tables']['learning_materials']['Row'];

const Materials = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSubject, setCurrentSubject] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load materials from database
  useEffect(() => {
    const loadMaterials = async () => {
      try {
        setLoading(true);
        const data = await ContentService.getLearningMaterials();
        setMaterials(data);
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
  
  // Define grade level groups for filtering
  const gradeGroups = [
    { id: "all", label: "All Grades" },
    { id: "1-5", label: "Primary (1-5)" },
    { id: "6-8", label: "Middle (6-8)" },
    { id: "9-10", label: "Secondary (9-10)" },
    { id: "11-12", label: "Sr. Secondary (11-12)" }
  ];
  
  // Get unique subjects for filters from actual data
  const subjects = ["all", ...new Set(materials.map(item => item.subject?.toLowerCase() || 'other'))];
  
  // Filter materials based on search query, selected subject, and grade
  const filteredMaterials = materials.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = currentSubject === "all" || 
                          (item.subject?.toLowerCase() || 'other') === currentSubject;
    
    // Handle grade filtering with groups or individual grades
    const itemGrade = item.class_level || '';
    const matchesGrade = gradeFilter === "all" ? true : 
                        (gradeFilter === "1-5" && (["1", "2", "3", "4", "5"].some(g => itemGrade.includes(g)))) ||
                        (gradeFilter === "6-8" && (["6", "7", "8"].some(g => itemGrade.includes(g)))) ||
                        (gradeFilter === "9-10" && (["9", "10"].some(g => itemGrade.includes(g)))) ||
                        (gradeFilter === "11-12" && (["11", "12"].some(g => itemGrade.includes(g)))) ||
                        itemGrade.includes(gradeFilter);
    
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
                      <span className="capitalize">{currentSubject === "all" ? "All Subjects" : currentSubject}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.filter(s => s !== "all").map((subject) => (
                      <SelectItem key={subject} value={subject} className="capitalize">
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
              {subjects.map((subject) => (
                <TabsTrigger 
                  key={subject} 
                  value={subject}
                  className="capitalize"
                >
                  {subject === "all" ? "All Subjects" : subject}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          
          {/* Materials Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
          ) : filteredMaterials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials.map((material) => (
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
                    <span className="text-xs text-muted-foreground">
                      Uploaded: {material.created_at ? new Date(material.created_at).toLocaleDateString() : 'Unknown'}
                    </span>
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
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No materials found</h3>
              <p className="text-muted-foreground">
                {materials.length === 0 
                  ? "No learning materials have been uploaded yet." 
                  : "Try adjusting your search or filter criteria"}
              </p>
            </div>
          )}
          
          {/* Load More Button - Only show if there are materials */}
          {!loading && filteredMaterials.length > 0 && materials.length > filteredMaterials.length && (
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
