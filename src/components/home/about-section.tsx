
import React from 'react';
import { SectionTitle } from '@/components/ui/section-title';
import { Card, CardContent } from '@/components/ui/card';
import { Building, Users, BookOpen, GraduationCap } from 'lucide-react';

export function AboutSection() {
  const staffMembers = [
    {
      id: 1,
      name: "Dr. Jane Smith",
      position: "Principal",
      bio: "Dr. Smith has over 20 years of experience in education leadership and holds a Ph.D. in Educational Administration.",
      imageUrl: "https://randomuser.me/api/portraits/women/45.jpg"
    },
    {
      id: 2,
      name: "Prof. Robert Johnson",
      position: "Vice Principal",
      bio: "Prof. Johnson oversees academic affairs and curriculum development with his extensive background in educational psychology.",
      imageUrl: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 3,
      name: "Ms. Emily Chen",
      position: "Head of Sciences",
      bio: "Ms. Chen leads our science department with innovative teaching methods and a passion for STEM education.",
      imageUrl: "https://randomuser.me/api/portraits/women/33.jpg"
    },
    {
      id: 4,
      name: "Mr. David Wilson",
      position: "Head of Arts",
      bio: "Mr. Wilson brings creativity and artistic excellence to our curriculum with his background in fine arts and education.",
      imageUrl: "https://randomuser.me/api/portraits/men/52.jpg"
    }
  ];

  const features = [
    {
      icon: <Building className="h-10 w-10 text-primary" />,
      title: "Founded in 1985",
      description: "With decades of educational excellence and a strong foundation in values-based learning"
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Diverse Community",
      description: "Creating an inclusive environment where every student feels valued and empowered"
    },
    {
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      title: "Comprehensive Curriculum",
      description: "Balancing academic rigor with holistic development for well-rounded education"
    },
    {
      icon: <GraduationCap className="h-10 w-10 text-primary" />,
      title: "Academic Excellence",
      description: "Consistent record of outstanding achievements in academics and extracurriculars"
    }
  ];

  return (
    <section className="py-16 bg-light">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="About Our School" 
          subtitle="Excellence in education through innovative teaching and comprehensive curriculum"
          centered
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-12">
          <div className="relative rounded-lg overflow-hidden h-[400px]">
            <img 
              src="https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
              alt="School building"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div>
            <div className="space-y-4 text-muted-foreground">
              <p>
                St. G. D. Convent School is a leading educational institution committed to providing a 
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
            
            <div className="bg-primary/5 border border-primary/10 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-semibold mb-3">Principal's Message</h3>
              <blockquote className="text-muted-foreground italic">
                "Education is not just about academic achievement, but about nurturing curious minds, 
                compassionate hearts, and resilient spirits. At St. G. D. Convent School, we are committed to 
                guiding each student on their unique journey of growth and discovery."
              </blockquote>
              <div className="mt-4 flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img 
                    src="https://randomuser.me/api/portraits/women/45.jpg" 
                    alt="Principal"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <p className="font-medium">Dr. Jane Smith</p>
                  <p className="text-sm text-muted-foreground">Principal, St. G. D. Convent School</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {features.map((feature, index) => (
            <Card key={index} className="card-hover">
              <CardContent className="p-6">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-16">
          <SectionTitle 
            title="Our Leadership Team" 
            subtitle="Meet the dedicated educators guiding our school"
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {staffMembers.map((staff) => (
              <Card key={staff.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="h-20 w-20 rounded-full overflow-hidden mx-auto mb-4">
                    <img 
                      src={staff.imageUrl} 
                      alt={staff.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">{staff.name}</h3>
                    <p className="text-primary font-medium text-sm mb-2">{staff.position}</p>
                    <p className="text-sm text-muted-foreground">{staff.bio}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
