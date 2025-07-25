
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionTitle } from '@/components/ui/section-title';
import { Link } from 'react-router-dom';
import { ContentService } from '@/services/contentService';
import type { Database } from '@/integrations/supabase/types';

type Announcement = Database['public']['Tables']['announcements']['Row'];

export function NotificationSection({ title }: { title?: string }) {
  const [notifications, setNotifications] = useState<Announcement[]>([]);

  useEffect(() => {
    const loadNotifications = async () => {
      const data = await ContentService.getAnnouncements();
      setNotifications(data.slice(0, 3)); // Show only the latest 3 announcements
    };
    loadNotifications();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">
          {title || "Notifications"}
        </h2>
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
                    {notification.category || 'announcement'}
                  </span>
                </div>
                <CardDescription>
                  {formatDate(notification.created_at || new Date().toISOString())}
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
