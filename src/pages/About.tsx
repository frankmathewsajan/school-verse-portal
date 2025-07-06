
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
              {historyData ? (
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
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading history...</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="facilities">
              <SectionTitle 
                title="Our Facilities" 
                subtitle="State-of-the-art resources designed to enhance learning and development"
                centered
              />
              {facilities.length > 0 ? (
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
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {loading ? 'Loading facilities...' : 'No facilities available.'}
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="staff">
              <SectionTitle 
                title="Our Staff" 
                subtitle="Meet our dedicated team of educators and administrators"
                centered
              />
              {staff.length > 0 ? (
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
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {loading ? 'Loading staff members...' : 'No staff members available.'}
                  </p>
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
