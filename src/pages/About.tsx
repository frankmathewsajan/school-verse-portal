
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { AboutSection } from '@/components/home/about-section';
import { VisionSection } from '@/components/home/vision-section';
import { SectionTitle } from '@/components/ui/section-title';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentService } from '@/services/contentService';
import { Users, Mail, Phone } from 'lucide-react';

interface HistoryData {
  id: string;
  title: string;
  subtitle: string;
  main_image_url: string;
  content_paragraphs: string[];
}

interface FacilityData {
  id: string;
  title: string;
  description: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
}

interface StaffData {
  id: string;
  name: string;
  position: string;
  bio: string;
  image_url: string;
  email: string;
  phone: string;
  department: string;
  display_order: number;
  is_active: boolean;
}

const About = () => {
  const [historyData, setHistoryData] = useState<HistoryData | null>(null);
  const [facilities, setFacilities] = useState<FacilityData[]>([]);
  const [staff, setStaff] = useState<StaffData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAboutData();
  }, []);

  const loadAboutData = async () => {
    try {
      const [historyResponse, facilitiesResponse, staffResponse] = await Promise.all([
        ContentService.getSchoolHistory(),
        ContentService.getSchoolFacilities(),
        ContentService.getStaffMembers()
      ]);

      if (historyResponse) setHistoryData(historyResponse);
      setFacilities(facilitiesResponse);
      setStaff(staffResponse);
    } catch (error) {
      console.error('Error loading about data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      {/* Dynamic About Section from Database */}
      <AboutSection />
      
      {/* Vision Section from Database */}
      <VisionSection />

      {/* Additional School Information */}
      <section className="py-16 bg-light">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="history" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-12">
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="facilities">Facilities</TabsTrigger>
              <TabsTrigger value="staff">Our Staff</TabsTrigger>
            </TabsList>
            
            <TabsContent value="history">
              {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Image placeholder */}
                  <div className="relative rounded-lg overflow-hidden h-[400px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-gray-400 text-sm font-medium">Content loading...</div>
                    </div>
                  </div>
                  {/* Content placeholder */}
                  <div className="space-y-6">
                    {/* Title placeholder */}
                    <div className="space-y-3">
                      <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                      </div>
                      <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-3/4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                      </div>
                    </div>
                    {/* Paragraph placeholders */}
                    <div className="space-y-4">
                      {[...Array(4)].map((_, index) => (
                        <div key={index} className="space-y-2">
                          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                          </div>
                          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                          </div>
                          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-5/6 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : historyData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {historyData.main_image_url && (
                    <div className="relative rounded-lg overflow-hidden h-[400px]">
                      <img 
                        src={historyData.main_image_url} 
                        alt="School history"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <SectionTitle 
                      title={historyData.title} 
                      subtitle={historyData.subtitle}
                    />
                    <div className="space-y-4 text-muted-foreground">
                      {historyData.content_paragraphs.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="facilities">
              <SectionTitle 
                title="Our Facilities" 
                subtitle="State-of-the-art resources designed to enhance learning and development"
                centered
              />
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {[...Array(6)].map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardContent className="p-0">
                        {/* Animated image placeholder */}
                        <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-gray-400 text-sm font-medium">Content loading...</div>
                          </div>
                        </div>
                        <div className="p-6 space-y-3">
                          {/* Title placeholder */}
                          <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                          </div>
                          {/* Description placeholder */}
                          <div className="space-y-2">
                            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                            </div>
                            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-3/4 relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : facilities.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {facilities.map((facility) => (
                    <Card key={facility.id} className="card-hover">
                      <CardContent className="p-0">
                        {facility.image_url && (
                          <div className="h-48 overflow-hidden">
                            <img 
                              src={facility.image_url} 
                              alt={facility.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="text-xl font-semibold mb-2">{facility.title}</h3>
                          <p className="text-muted-foreground">
                            {facility.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="staff">
              <SectionTitle 
                title="Our Staff" 
                subtitle="Meet our dedicated team of educators and administrators"
                centered
              />
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {[...Array(6)].map((_, index) => (
                    <Card key={index} className="overflow-hidden relative">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          {/* Avatar placeholder */}
                          <div className="h-16 w-16 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                          </div>
                          <div className="flex-1 space-y-2">
                            {/* Name placeholder */}
                            <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                            </div>
                            {/* Position placeholder */}
                            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-3/4 relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                            </div>
                          </div>
                        </div>
                        {/* Bio placeholder */}
                        <div className="space-y-2 mb-4">
                          <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                          </div>
                          <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-4/5 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                          </div>
                        </div>
                        {/* Contact placeholder */}
                        <div className="space-y-2">
                          <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-2/3 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                          </div>
                          <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-1/2 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                          </div>
                        </div>
                        <div className="absolute top-4 right-4 text-xs text-gray-400">Content loading...</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : staff.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {staff.map((member) => (
                    <Card key={member.id} className="card-hover">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          {member.image_url ? (
                            <div className="h-16 w-16 rounded-full overflow-hidden">
                              <img 
                                src={member.image_url} 
                                alt={member.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                              <Users className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <h3 className="text-lg font-semibold">{member.name}</h3>
                            <p className="text-muted-foreground">{member.position}</p>
                            {member.department && (
                              <p className="text-sm text-muted-foreground">{member.department}</p>
                            )}
                          </div>
                        </div>
                        {member.bio && (
                          <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                        )}
                        <div className="space-y-2">
                          {member.email && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-4 w-4" />
                              <span>{member.email}</span>
                            </div>
                          )}
                          {member.phone && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-4 w-4" />
                              <span>{member.phone}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </MainLayout>
  );
};

export default About;
