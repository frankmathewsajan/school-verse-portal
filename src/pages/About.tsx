
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { SectionTitle } from '@/components/ui/section-title';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const About = () => {
  const staffMembers = [
    {
      id: 1,
      name: "Mr. Ashirwad Goyal",
      position: "Principal",
      bio: "Mr. Ashirwad Goyal has over 20 years of experience in education leadership and holds a Ph.D. in Educational Administration.",
      imageUrl: "https://randomuser.me/api/portraits/women/45.jpg"
    },
    {
      id: 2,
      name: "Prof. Robert Johnson",
      position: "Vice Principal",
      bio: "Prof. Johnson oversees academic affairs and curriculum development with his extensive background in educational psychology.",
      imageUrl: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-16 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Our School</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the mission, values, and community that make SchoolVerse Academy
            a leader in educational excellence.
          </p>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-12">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="facilities">Facilities</TabsTrigger>
              <TabsTrigger value="staff">Our Staff</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <SectionTitle 
                    title="School Overview" 
                    subtitle="Excellence in education through innovative teaching and comprehensive curriculum"
                  />
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      SchoolVerse Academy is a leading educational institution committed to providing a 
                      balanced and stimulating learning environment where students can achieve academic 
                      excellence and personal growth.
                    </p>
                    <p>
                      Our comprehensive curriculum is designed to develop critical thinking, creativity, 
                      and problem-solving skills, preparing students for success in higher education and beyond.
                    </p>
                    <p>
                      We pride ourselves on small class sizes, dedicated teachers, and a supportive community 
                      that nurtures each student's individual talents and abilities.
                    </p>
                  </div>
                </div>
                <div className="relative rounded-lg overflow-hidden h-[400px]">
                  <img 
                    src="https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                    alt="School building"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="relative rounded-lg overflow-hidden h-[400px]">
                  <img 
                    src="https://images.unsplash.com/photo-1544531585-9847b68c8c86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                    alt="School history"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <SectionTitle 
                    title="Our History" 
                    subtitle="Four decades of educational excellence and community impact"
                  />
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Founded in 1985, SchoolVerse Academy began as a small community school with a vision 
                      to provide quality education that balances academic rigor with character development.
                    </p>
                    <p>
                      Over the decades, we have grown into a respected institution known for our innovative 
                      teaching methods, comprehensive curriculum, and commitment to nurturing well-rounded individuals.
                    </p>
                    <p>
                      Throughout our history, we have maintained our founding principles while evolving to 
                      meet the changing needs of education in the 21st century.
                    </p>
                    <p>
                      Today, our alumni network spans across the globe, with graduates making significant 
                      contributions in various fields and communities.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="facilities">
              <SectionTitle 
                title="Our Facilities" 
                subtitle="State-of-the-art resources designed to enhance learning and development"
                centered
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                <Card className="card-hover">
                  <CardContent className="p-0">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1517031350709-19e7df358b75?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                        alt="Library"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">Modern Library</h3>
                      <p className="text-muted-foreground">
                        Our extensive library houses over 20,000 books, digital resources, and quiet study spaces.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="card-hover">
                  <CardContent className="p-0">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1564069114553-7215e1ff1890?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80" 
                        alt="Science Lab"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">Science Laboratories</h3>
                      <p className="text-muted-foreground">
                        Fully equipped labs for physics, chemistry, and biology with modern experimental apparatus.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="card-hover">
                  <CardContent className="p-0">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1772&q=80" 
                        alt="Sports Facilities"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">Sports Complex</h3>
                      <p className="text-muted-foreground">
                        Indoor and outdoor sports facilities including a gymnasium, swimming pool, and athletic fields.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="card-hover">
                  <CardContent className="p-0">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1571260899304-425eee4c7efd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" 
                        alt="Auditorium"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">Auditorium</h3>
                      <p className="text-muted-foreground">
                        A 500-seat auditorium for performances, assemblies, and community events.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="card-hover">
                  <CardContent className="p-0">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1589652717521-10c0d092dea9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" 
                        alt="Computer Lab"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">Technology Center</h3>
                      <p className="text-muted-foreground">
                        Computer labs with the latest hardware and software for digital learning and research.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="card-hover">
                  <CardContent className="p-0">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80" 
                        alt="Art Studio"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">Arts Center</h3>
                      <p className="text-muted-foreground">
                        Studios for visual arts, music, and performing arts with professional equipment.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="staff">
              <SectionTitle 
                title="Our Staff" 
                subtitle="Meet our dedicated team of educators and administrators"
                centered
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {staffMembers.map((staff) => (
                  <Card key={staff.id} className="card-hover">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="h-16 w-16 rounded-full overflow-hidden">
                          <img 
                            src={staff.imageUrl} 
                            alt={staff.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{staff.name}</h3>
                          <p className="text-muted-foreground">{staff.position}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{staff.bio}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </MainLayout>
  );
};

export default About;
