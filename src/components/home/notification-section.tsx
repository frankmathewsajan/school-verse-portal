
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionTitle } from '@/components/ui/section-title';
import { Link } from 'react-router-dom';

// Dummy notification data (would come from API/database)
const notifications = [
  {
    id: 1,
    title: "Annual Sports Day",
    date: "2025-05-12",
    content: "The annual sports day will be held on May, 2025. All students are requested to register for their events by April 30.",
    category: "event",
  },
  {
    id: 2,
    title: "Exam Schedule Released",
    date: "2025-04-15",
    content: "The final examination schedule for all grades has been released. Please check the academic calendar for details.",
    category: "academic",
  },
  {
    id: 3,
    title: "Parent-Teacher Meeting",
    date: "2025-04-20",
    content: "Parent-teacher meetings will be conducted on April 20-21. Online booking for appointment slots is now open.",
    category: "meeting",
  }
];

export function NotificationSection() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Latest Announcements" 
          subtitle="Stay updated with the latest information and announcements from our school"
          centered
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {notifications.map((notification) => (
            <Card key={notification.id} className="card-hover h-full">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{notification.title}</CardTitle>
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    {notification.category}
                  </span>
                </div>
                <CardDescription>
                  {formatDate(notification.date)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{notification.content}</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm">
                  Read More
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild variant="outline" className="rounded-full">
            <Link to="#all-notifications">
              <Bell className="mr-2 h-4 w-4" />
              View All Announcements
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
