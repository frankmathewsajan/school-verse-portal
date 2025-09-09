import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { SectionTitle } from '@/components/ui/section-title';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Target, Award, Users } from 'lucide-react';

const Agsa = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <SectionTitle 
            title="AGSA - Academic Growth & Student Achievement" 
            subtitle="Empowering students through excellence in education and holistic development"
            centered
          />
          <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto">
            Our AGSA program is designed to foster academic excellence, personal growth, and leadership skills 
            among our students, preparing them for success in their educational journey and beyond.
          </p>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="py-16 bg-light">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="card-hover">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Target className="h-8 w-8 text-primary" />
                  <CardTitle className="text-2xl">Our Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  To provide comprehensive academic support and growth opportunities that enable every student 
                  to reach their full potential. We focus on building strong foundations in core subjects while 
                  nurturing critical thinking, creativity, and leadership skills essential for 21st-century success.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Star className="h-8 w-8 text-primary" />
                  <CardTitle className="text-2xl">Our Vision</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  To be recognized as a center of excellence that produces well-rounded individuals who are 
                  academically proficient, socially responsible, and equipped with the skills and values 
                  necessary to make meaningful contributions to society.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="Program Features" 
            subtitle="Comprehensive support for academic and personal development"
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <Card className="card-hover">
              <CardHeader>
                <Award className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Academic Excellence</CardTitle>
                <CardDescription>
                  Structured curriculum and teaching methodologies focused on achieving outstanding academic results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Personalized learning approaches</li>
                  <li>• Regular assessment and feedback</li>
                  <li>• Advanced study materials</li>
                  <li>• Expert faculty guidance</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Student Development</CardTitle>
                <CardDescription>
                  Holistic approach to developing character, leadership, and life skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Leadership training programs</li>
                  <li>• Character building activities</li>
                  <li>• Community service initiatives</li>
                  <li>• Peer mentoring systems</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <Target className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Achievement Tracking</CardTitle>
                <CardDescription>
                  Comprehensive monitoring and celebration of student progress and achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Progress tracking systems</li>
                  <li>• Achievement recognition</li>
                  <li>• Goal setting workshops</li>
                  <li>• Performance analytics</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-16 bg-light">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="Our Impact" 
            subtitle="Measuring success through student achievements and growth"
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <p className="text-muted-foreground">Academic Success Rate</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">85%</div>
              <p className="text-muted-foreground">Leadership Participation</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">200+</div>
              <p className="text-muted-foreground">Awards & Recognition</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <p className="text-muted-foreground">Student Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-2xl mx-auto card-hover">
            <CardHeader>
              <CardTitle className="text-3xl">Join AGSA Today</CardTitle>
              <CardDescription className="text-lg">
                Become part of our academic excellence program and unlock your potential
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Ready to take your academic journey to the next level? Our AGSA program is designed 
                to help you achieve your goals and excel in your studies.
              </p>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                Enrollment Open for All Grades
              </Badge>
            </CardContent>
          </Card>
        </div>
      </section>
    </MainLayout>
  );
};

export default Agsa;