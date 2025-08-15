
import React, { useState, useEffect } from 'react';
import { Bell, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionTitle } from '@/components/ui/section-title';
import { AnnouncementContent } from '@/components/ui/text-with-links';
import { Link } from 'react-router-dom';
import { ContentService } from '@/services/contentService';
import type { Database } from '@/integrations/supabase/types';

type Announcement = Database['public']['Tables']['announcements']['Row'];

export function NotificationSection() {
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
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Latest Announcements" 
          subtitle="Stay updated with the latest information and announcements from our school"
          centered
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {notifications.map((notification) => (
            <Card key={notification.id} className="card-hover h-full flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-xl break-words line-clamp-2 flex-1">
                    {notification.title}
                  </CardTitle>
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full whitespace-nowrap flex-shrink-0">
                    {notification.category || 'announcement'}
                  </span>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(notification.created_at || new Date().toISOString())}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <AnnouncementContent 
                  content={notification.content}
                  maxLines={4}
                  className="text-sm text-muted-foreground"
                />
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">
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
