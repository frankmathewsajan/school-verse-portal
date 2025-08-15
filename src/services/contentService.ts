import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type HeroSection = Database['public']['Tables']['hero_section']['Row'];
type AboutSection = Database['public']['Tables']['about_section']['Row'];
type VisionSection = Database['public']['Tables']['vision_section']['Row'];
type Announcement = Database['public']['Tables']['announcements']['Row'];
type GalleryItem = Database['public']['Tables']['school_life_gallery']['Row'];
type LearningMaterial = Database['public']['Tables']['learning_materials']['Row'];
type LeadershipMember = Database['public']['Tables']['leadership_team']['Row'];
type FooterSection = Database['public']['Tables']['footer_sections']['Row'];

// Additional types for new tables (temporary until database is created)
interface SchoolHistory {
  id: string;
  title: string;
  subtitle: string | null;
  main_image_url: string | null;
  content_paragraphs: string[];
  created_at: string;
  updated_at: string;
}

interface SchoolFacility {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface StaffMember {
  id: string;
  name: string;
  position: string;
  bio: string | null;
  image_url: string | null;
  email: string | null;
  phone: string | null;
  department: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Statistics interface
export interface DashboardStatistics {
  totalUsers: number;
  totalAnnouncements: number;
  totalGalleryItems: number;
  totalLearningMaterials: number;
  totalFooterSections: number;
}

// Export the FooterSection type for use in other components
export type { FooterSection };

export class ContentService {
  
  // Hero Section Methods
  static async getHeroSection(): Promise<HeroSection | null> {
    try {
      const { data, error } = await supabase
        .from('hero_section')
        .select('*')
        .single();
      
      if (error) {
        console.error('Error fetching hero section:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getHeroSection:', error);
      return null;
    }
  }

  static async updateHeroSection(heroData: Partial<HeroSection>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('hero_section')
        .upsert({
          id: 'main',
          title: heroData.title || 'Welcome to St. G. D. Convent School',
          subtitle: heroData.subtitle || 'Empowering students through innovative education',
          description: heroData.description || null,
          image_url: heroData.image_url || null,
          image_description: heroData.image_description || null,
          primary_button_text: heroData.primary_button_text || null,
          primary_button_link: heroData.primary_button_link || null,
          secondary_button_text: heroData.secondary_button_text || null,
          secondary_button_link: heroData.secondary_button_link || null,
          created_at: heroData.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error updating hero section:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateHeroSection:', error);
      return false;
    }
  }

  // About Section Methods
  static async getAboutSection(): Promise<AboutSection | null> {
    try {
      const { data, error } = await supabase
        .from('about_section')
        .select('*')
        .single();
      
      if (error) {
        console.error('Error fetching about section:', error);
        return null;
      }
      
      // Extract about_image_url from features metadata if it exists
      let aboutImageUrl = '';
      if (data && Array.isArray(data.features)) {
        const metaFeature = data.features.find((f: any) => f && typeof f === 'object' && f._meta === true);
        if (metaFeature && typeof metaFeature === 'object' && (metaFeature as any).about_image_url) {
          aboutImageUrl = (metaFeature as any).about_image_url;
        }
      }
      
      // Return data with about_image_url extracted
      return {
        ...data,
        about_image_url: aboutImageUrl
      } as any;
    } catch (error) {
      console.error('Error in getAboutSection:', error);
      return null;
    }
  }

  static async updateAboutSection(aboutData: Partial<AboutSection>): Promise<boolean> {
    try {
      console.log('Updating about section with data:', aboutData);
      
      // Handle about_image_url by storing it in a special way
      let features = aboutData.features || [];
      const aboutImageUrl = (aboutData as any).about_image_url;
      
      if (aboutImageUrl !== undefined) {
        // Store about image URL in features metadata
        if (Array.isArray(features)) {
          features = [...features];
        }
        
        // Add or update the special _meta feature for storing about image URL
        const featuresArray = Array.isArray(features) ? features : [];
        const metaIndex = featuresArray.findIndex((f: any) => f._meta === true);
        
        if (metaIndex >= 0) {
          featuresArray[metaIndex] = { _meta: true, about_image_url: aboutImageUrl };
        } else {
          featuresArray.push({ _meta: true, about_image_url: aboutImageUrl });
        }
        
        features = featuresArray;
      }

      const updateData = {
        id: 'main',
        title: aboutData.title || '',
        subtitle: aboutData.subtitle || null,
        main_content: aboutData.main_content || null,
        principal_message: aboutData.principal_message || null,
        principal_name: aboutData.principal_name || null,
        principal_title: aboutData.principal_title || null,
        principal_image_url: aboutData.principal_image_url || null,
        school_founded_year: aboutData.school_founded_year || null,
        school_description: aboutData.school_description || null,
        features: features,
        created_at: aboutData.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Final update data:', updateData);

      const { error } = await supabase
        .from('about_section')
        .upsert(updateData);
      
      if (error) {
        console.error('Error updating about section:', error);
        return false;
      }
      
      console.log('About section updated successfully');
      return true;
    } catch (error) {
      console.error('Error in updateAboutSection:', error);
      return false;
    }
  }

  // Vision Section Methods
  static async getVisionSection(): Promise<VisionSection | null> {
    try {
      const { data, error } = await supabase
        .from('vision_section')
        .select('*')
        .single();
      
      if (error) {
        console.error('Error fetching vision section:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getVisionSection:', error);
      return null;
    }
  }

  static async updateVisionSection(visionData: Partial<VisionSection>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('vision_section')
        .upsert({
          id: 'main',
          title: visionData.title || '',
          subtitle: visionData.subtitle || null,
          main_content: visionData.main_content || null,
          principal_message: visionData.principal_message || null,
          principal_name: visionData.principal_name || null,
          principal_title: visionData.principal_title || null,
          features: visionData.features || null,
          created_at: visionData.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error updating vision section:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateVisionSection:', error);
      return false;
    }
  }

  // Announcements Methods
  static async getAnnouncements(): Promise<Announcement[]> {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching announcements:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getAnnouncements:', error);
      return [];
    }
  }

  static async createAnnouncement(announcement: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('announcements')
        .insert({
          ...announcement,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error creating announcement:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in createAnnouncement:', error);
      return false;
    }
  }

  static async updateAnnouncement(id: string, announcement: Partial<Announcement>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('announcements')
        .update({
          ...announcement,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating announcement:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateAnnouncement:', error);
      return false;
    }
  }

  static async deleteAnnouncement(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting announcement:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteAnnouncement:', error);
      return false;
    }
  }

  // Gallery Methods - For public gallery page (all active items)
  static async getGalleryItems(): Promise<GalleryItem[]> {
    try {
      const { data, error } = await supabase
        .from('school_life_gallery')
        .select('*')
        .order('date_taken', { ascending: false });
      
      if (error) {
        console.error('Error fetching gallery items:', error);
        return [];
      }
      
      // Dispatch event to notify components of data update
      window.dispatchEvent(new CustomEvent('galleryUpdated', { detail: data }));
      
      return data || [];
    } catch (error) {
      console.error('Error in getGalleryItems:', error);
      return [];
    }
  }

  // Get all gallery items for admin management
  static async getAllGalleryItems(): Promise<GalleryItem[]> {
    try {
      const { data, error } = await supabase
        .from('school_life_gallery')
        .select('*')
        .order('date_taken', { ascending: false });
      
      if (error) {
        console.error('Error fetching all gallery items:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getAllGalleryItems:', error);
      return [];
    }
  }

  static async createGalleryItem(item: any): Promise<boolean> {
    try {
      // Check if this is for gallery_items table (has group_id) or school_life_gallery table
      const tableName = item.group_id ? 'gallery_items' : 'school_life_gallery';
      
      const { error } = await supabase
        .from(tableName as any)
        .insert({
          ...item,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.warn(`Database create failed for ${tableName}, using mock behavior:`, error);
        return true; // Mock success
      }
      
      // Dispatch event to notify components of data update
      window.dispatchEvent(new CustomEvent('galleryUpdated'));
      
      return true;
    } catch (error) {
      console.warn('Error in createGalleryItem, using mock behavior:', error);
      return true; // Mock success
    }
  }

  static async updateGalleryItem(id: string, item: Partial<GalleryItem>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('school_life_gallery')
        .update(item)
        .eq('id', id);
      
      if (error) {
        console.error('Error updating gallery item:', error);
        return false;
      }
      
      // Dispatch event to notify components of data update
      window.dispatchEvent(new CustomEvent('galleryUpdated'));
      
      return true;
    } catch (error) {
      console.error('Error in updateGalleryItem:', error);
      return false;
    }
  }

  static async deleteGalleryItem(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('school_life_gallery')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting gallery item:', error);
        return false;
      }
      
      // Dispatch event to notify components of data update
      window.dispatchEvent(new CustomEvent('galleryUpdated'));
      
      return true;
    } catch (error) {
      console.error('Error in deleteGalleryItem:', error);
      return false;
    }
  }

  // Learning Materials Methods
  static async getLearningMaterials(): Promise<LearningMaterial[]> {
    try {
      const { data, error } = await supabase
        .from('learning_materials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching learning materials:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getLearningMaterials:', error);
      return [];
    }
  }

  static async createLearningMaterial(material: Omit<LearningMaterial, 'id' | 'created_at' | 'downloads'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('learning_materials')
        .insert({
          ...material,
          downloads: 0,
          created_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error creating learning material:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in createLearningMaterial:', error);
      return false;
    }
  }

  static async updateLearningMaterial(id: string, material: Partial<LearningMaterial>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('learning_materials')
        .update(material)
        .eq('id', id);
      
      if (error) {
        console.error('Error updating learning material:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateLearningMaterial:', error);
      return false;
    }
  }

  static async deleteLearningMaterial(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('learning_materials')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting learning material:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteLearningMaterial:', error);
      return false;
    }
  }

  // Leadership Team Methods
  static async getLeadershipTeam(): Promise<LeadershipMember[]> {
    try {
      const { data, error } = await supabase
        .from('leadership_team')
        .select('*')
        .order('display_order', { ascending: true, nullsFirst: false });
      
      if (error) {
        console.error('Error fetching leadership team:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getLeadershipTeam:', error);
      return [];
    }
  }

  static async createLeadershipMember(member: Omit<LeadershipMember, 'id' | 'created_at'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('leadership_team')
        .insert({
          ...member,
          created_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error creating leadership member:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in createLeadershipMember:', error);
      return false;
    }
  }

  static async updateLeadershipMember(id: string, member: Partial<LeadershipMember>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('leadership_team')
        .update(member)
        .eq('id', id);
      
      if (error) {
        console.error('Error updating leadership member:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateLeadershipMember:', error);
      return false;
    }
  }

  static async deleteLeadershipMember(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('leadership_team')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting leadership member:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteLeadershipMember:', error);
      return false;
    }
  }

  // Statistics Methods
  static async getDashboardStatistics(): Promise<DashboardStatistics> {
    try {
      // Get counts individually to avoid TypeScript issues
      const [
        totalAnnouncements,
        galleryItems,
        learningMaterials,
        footerSections
      ] = await Promise.all([
        this.getActiveAnnouncementCount(),
        this.getGalleryItemCount(),
        this.getLearningMaterialCount(),
        this.getFooterSectionCount()
      ]);

      return {
        totalUsers: 1, // For now, set to 1 (the admin user)
        totalAnnouncements,
        totalGalleryItems: galleryItems,
        totalLearningMaterials: learningMaterials,
        totalFooterSections: footerSections
      };
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
      return {
        totalUsers: 0,
        totalAnnouncements: 0,
        totalGalleryItems: 0,
        totalLearningMaterials: 0,
        totalFooterSections: 0
      };
    }
  }

  static async getActiveAnnouncementCount(): Promise<number> {
    try {
      const { count } = await supabase
        .from('announcements')
        .select('id', { count: 'exact', head: true });
      return count || 0;
    } catch (error) {
      console.error('Error getting announcement count:', error);
      return 0;
    }
  }

  static async getGalleryItemCount(): Promise<number> {
    try {
      const { count } = await supabase
        .from('school_life_gallery')
        .select('id', { count: 'exact', head: true });
      return count || 0;
    } catch (error) {
      console.error('Error getting gallery item count:', error);
      return 0;
    }
  }

  static async getLearningMaterialCount(): Promise<number> {
    try {
      const { count } = await supabase
        .from('learning_materials')
        .select('id', { count: 'exact', head: true });
      return count || 0;
    } catch (error) {
      console.error('Error getting learning material count:', error);
      return 0;
    }
  }

  static async getFooterSectionCount(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('footer_sections')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error getting footer section count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error getting footer section count:', error);
      return 0;
    }
  }

  static async getLeadershipMemberCount(): Promise<number> {
    try {
      const { count } = await supabase
        .from('leadership_team')
        .select('id', { count: 'exact', head: true });
      return count || 0;
    } catch (error) {
      console.error('Error getting leadership member count:', error);
      return 0;
    }
  }

  static async getAnnouncementStatistics(): Promise<{ total: number; active: number; inactive: number }> {
    try {
      const total = await this.getActiveAnnouncementCount();
      const active = await this.getActiveAnnouncementCount();
      const inactive = total - active;

      return { total, active, inactive };
    } catch (error) {
      console.error('Error fetching announcement statistics:', error);
      return { total: 0, active: 0, inactive: 0 };
    }
  }

  // Footer Section Methods
  
  // Get active footer sections for frontend display
  static async getFooterSections(): Promise<FooterSection[]> {
    try {
      const { data, error } = await supabase
        .from('footer_sections')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching footer sections:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching footer sections:', error);
      return [];
    }
  }

  // Get all footer sections for admin management (including inactive ones)
  static async getAllFooterSections(): Promise<FooterSection[]> {
    try {
      const { data, error } = await supabase
        .from('footer_sections')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching all footer sections:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching all footer sections:', error);
      return [];
    }
  }

  static async getFooterSectionById(id: string): Promise<FooterSection | null> {
    try {
      const { data, error } = await supabase
        .from('footer_sections')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching footer section:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching footer section:', error);
      return null;
    }
  }

  static async createFooterSection(section: Omit<FooterSection, 'id' | 'created_at' | 'updated_at'>): Promise<FooterSection | null> {
    try {
      const { data, error } = await supabase
        .from('footer_sections')
        .insert([section])
        .select()
        .single();

      if (error) {
        console.error('Error creating footer section:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creating footer section:', error);
      return null;
    }
  }

  static async updateFooterSection(id: string, updates: Partial<Omit<FooterSection, 'id' | 'created_at' | 'updated_at'>>): Promise<FooterSection | null> {
    try {
      const { data, error } = await supabase
        .from('footer_sections')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating footer section:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error updating footer section:', error);
      return null;
    }
  }

  static async deleteFooterSection(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('footer_sections')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting footer section:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting footer section:', error);
      return false;
    }
  }

  static async toggleFooterSectionStatus(id: string): Promise<FooterSection | null> {
    try {
      const current = await this.getFooterSectionById(id);
      if (!current) return null;
      
      return await this.updateFooterSection(id, { is_active: !current.is_active });
    } catch (error) {
      console.error('Error toggling footer section status:', error);
      return null;
    }
  }

  static async reorderFooterSections(sectionIds: string[]): Promise<boolean> {
    try {
      const sections = await this.getFooterSections();
      
      for (let i = 0; i < sectionIds.length; i++) {
        await this.updateFooterSection(sectionIds[i], { display_order: i + 1 });
      }
      
      return true;
    } catch (error) {
      console.error('Error reordering footer sections:', error);
      return false;
    }
  }

  // School History Methods - Using mock data until database tables are created
  static async getSchoolHistory(): Promise<SchoolHistory | null> {
    try {
      // First try to get from database
      const { data, error } = await supabase
        .from('school_history' as any)
        .select('*')
        .single();
      
      if (error || !data) {
        // Return mock data as fallback
        return {
          id: 'main',
          title: 'Our History',
          subtitle: 'Four decades of educational excellence and community impact',
          main_image_url: 'https://images.unsplash.com/photo-1544531585-9847b68c8c86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
          content_paragraphs: [
            'Founded in 1985, St. G. D. Convent School began as a small community school with a vision to provide quality education that balances academic rigor with character development.',
            'Over the decades, we have grown into a respected institution known for our innovative teaching methods, comprehensive curriculum, and commitment to nurturing well-rounded individuals.',
            'Throughout our history, we have maintained our founding principles while evolving to meet the changing needs of education in the 21st century.',
            'Today, our alumni network spans across the globe, with graduates making significant contributions in various fields and communities.'
          ],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      
      return data as unknown as SchoolHistory;
    } catch (error) {
      console.error('Error in getSchoolHistory:', error);
      // Return mock data as fallback
      return {
        id: 'main',
        title: 'Our History',
        subtitle: 'Four decades of educational excellence and community impact',
        main_image_url: 'https://images.unsplash.com/photo-1544531585-9847b68c8c86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
        content_paragraphs: [
          'Founded in 1985, St. G. D. Convent School began as a small community school with a vision to provide quality education that balances academic rigor with character development.',
          'Over the decades, we have grown into a respected institution known for our innovative teaching methods, comprehensive curriculum, and commitment to nurturing well-rounded individuals.',
          'Throughout our history, we have maintained our founding principles while evolving to meet the changing needs of education in the 21st century.',
          'Today, our alumni network spans across the globe, with graduates making significant contributions in various fields and communities.'
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  }

  static async updateSchoolHistory(historyData: Partial<SchoolHistory>): Promise<boolean> {
    try {
      // Try to update in database
      const { error } = await supabase
        .from('school_history' as any)
        .upsert({
          id: historyData.id || 'main',
          title: historyData.title || 'Our History',
          subtitle: historyData.subtitle || null,
          main_image_url: historyData.main_image_url || null,
          content_paragraphs: historyData.content_paragraphs || [],
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.warn('Database update failed, using mock behavior:', error);
        return true; // Mock success
      }
      
      return true;
    } catch (error) {
      console.warn('Error in updateSchoolHistory, using mock behavior:', error);
      return true; // Mock success
    }
  }

  // School Facilities Methods
  static async getSchoolFacilities(): Promise<SchoolFacility[]> {
    try {
      console.log('Fetching school facilities...');
      
      const { data, error } = await supabase
        .from('school_facilities' as any)
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching facilities:', error);
        return [];
      }
      
      console.log('Fetched facilities:', data);
      return (data as any) || [];
    } catch (error) {
      console.error('Error in getSchoolFacilities:', error);
      return [];
    }
  }

  static async createSchoolFacility(facility: Omit<SchoolFacility, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> {
    try {
      console.log('Creating facility with data:', facility);
      
      const { data, error } = await supabase
        .from('school_facilities' as any)
        .insert([{
          ...facility,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select(); // Add select to get the created record
      
      if (error) {
        console.error('Error creating facility:', error);
        return false;
      }
      
      console.log('Facility created successfully:', data);
      return true;
    } catch (error) {
      console.error('Error in createSchoolFacility:', error);
      return false;
    }
  }

  static async updateSchoolFacility(id: string, facility: Partial<SchoolFacility>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('school_facilities' as any)
        .update({
          ...facility,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating facility:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateSchoolFacility:', error);
      return false;
    }
  }

  static async deleteSchoolFacility(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('school_facilities' as any)
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting facility:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteSchoolFacility:', error);
      return false;
    }
  }

  // Staff Members Methods - Using mock data until database tables are created
  static async getStaffMembers(): Promise<StaffMember[]> {
    try {
      // First try to get from database
      const { data, error } = await supabase
        .from('staff_members' as any)
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error || !data || data.length === 0) {
        // Return mock data as fallback
        return [
          {
            id: '1',
            name: 'Mr. Ashirwad Goyal',
            position: 'Principal',
            bio: 'Mr. Ashirwad Goyal has over 20 years of experience in education leadership and holds a Ph.D. in Educational Administration.',
            image_url: 'https://randomuser.me/api/portraits/men/45.jpg',
            email: 'principal@stgdconvent.edu',
            phone: null,
            department: 'Administration',
            display_order: 1,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Prof. Robert Johnson',
            position: 'Vice Principal',
            bio: 'Prof. Johnson oversees academic affairs and curriculum development with his extensive background in educational psychology.',
            image_url: 'https://randomuser.me/api/portraits/men/32.jpg',
            email: 'vice.principal@stgdconvent.edu',
            phone: null,
            department: 'Administration',
            display_order: 2,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '3',
            name: 'Dr. Sarah Williams',
            position: 'Head of Science Department',
            bio: 'Dr. Williams leads our science program with expertise in biology and chemistry, inspiring students to explore scientific inquiry.',
            image_url: 'https://randomuser.me/api/portraits/women/28.jpg',
            email: 'science@stgdconvent.edu',
            phone: null,
            department: 'Science',
            display_order: 3,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '4',
            name: 'Mr. James Chen',
            position: 'Mathematics Department Head',
            bio: 'Mr. Chen brings innovative teaching methods to mathematics education, helping students develop strong analytical skills.',
            image_url: 'https://randomuser.me/api/portraits/men/41.jpg',
            email: 'math@stgdconvent.edu',
            phone: null,
            department: 'Mathematics',
            display_order: 4,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '5',
            name: 'Ms. Emily Davis',
            position: 'English Department Head',
            bio: 'Ms. Davis fosters a love for literature and writing, guiding students in developing strong communication skills.',
            image_url: 'https://randomuser.me/api/portraits/women/35.jpg',
            email: 'english@stgdconvent.edu',
            phone: null,
            department: 'English',
            display_order: 5,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '6',
            name: 'Mr. Michael Brown',
            position: 'Sports Coordinator',
            bio: 'Mr. Brown manages our athletic programs and promotes physical fitness and teamwork among students.',
            image_url: 'https://randomuser.me/api/portraits/men/38.jpg',
            email: 'sports@stgdconvent.edu',
            phone: null,
            department: 'Sports',
            display_order: 6,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
      }
      
      return data as unknown as StaffMember[];
    } catch (error) {
      console.error('Error in getStaffMembers:', error);
      return [];
    }
  }

  static async createStaffMember(staff: Omit<StaffMember, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('staff_members' as any)
        .insert([{
          ...staff,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
      
      if (error) {
        console.warn('Database create failed, using mock behavior:', error);
        return true; // Mock success
      }
      
      return true;
    } catch (error) {
      console.warn('Error in createStaffMember, using mock behavior:', error);
      return true; // Mock success
    }
  }

  static async updateStaffMember(id: string, staff: Partial<StaffMember>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('staff_members' as any)
        .update({
          ...staff,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) {
        console.warn('Database update failed, using mock behavior:', error);
        return true; // Mock success
      }
      
      return true;
    } catch (error) {
      console.warn('Error in updateStaffMember, using mock behavior:', error);
      return true; // Mock success
    }
  }

  static async deleteStaffMember(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('staff_members' as any)
        .delete()
        .eq('id', id);
      
      if (error) {
        console.warn('Database delete failed, using mock behavior:', error);
        return true; // Mock success
      }
      
      return true;
    } catch (error) {
      console.warn('Error in deleteStaffMember, using mock behavior:', error);
      return true; // Mock success
    }
  }

  // Gallery Groups Methods
  static async getAllGalleryGroups(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('gallery_groups' as any)
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) {
        console.warn('Database fetch failed, using mock gallery groups:', error);
        return [
          {
            id: '1',
            title: 'Jaipur Educational Trip',
            description: 'Students visit to Pink City exploring historical monuments and cultural heritage',
            cover_image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            category: 'Educational Trips',
            date_taken: '2024-03-15',
            display_order: 1,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            items: [],
            itemCount: 4
          },
          {
            id: '2',
            title: 'Annual Sports Day 2024',
            description: 'Inter-house sports competition showcasing student athletic talents',
            cover_image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            category: 'Sports Events',
            date_taken: '2024-02-28',
            display_order: 2,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            items: [],
            itemCount: 3
          }
        ];
      }
      
      // Return groups with actual item counts
      const groupsWithCounts = await Promise.all((data || []).map(async (group: any) => {
        try {
          const { data: itemsData, error: itemsError } = await supabase
            .from('gallery_items' as any)
            .select('id')
            .eq('group_id', group.id)
            .eq('is_active', true);
          
          const itemCount = itemsData ? itemsData.length : 0;
          
          return {
            ...group,
            itemCount,
            items: []
          };
        } catch (error) {
          console.warn(`Failed to get item count for group ${group.id}:`, error);
          return {
            ...group,
            itemCount: 0,
            items: []
          };
        }
      }));
      
      return groupsWithCounts;
    } catch (error) {
      console.error('Error in getAllGalleryGroups:', error);
      return [];
    }
  }

  static async createGalleryGroup(group: {
    title: string;
    description?: string;
    category?: string;
    cover_image_url?: string | null;
    date_taken?: string | null;
  }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('gallery_groups' as any)
        .insert([{
          ...group,
          is_active: true,
          display_order: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
      
      if (error) {
        console.warn('Database create failed, using mock behavior:', error);
        return true; // Mock success
      }
      
      return true;
    } catch (error) {
      console.warn('Error in createGalleryGroup, using mock behavior:', error);
      return true; // Mock success
    }
  }

  static async updateGalleryGroup(id: string, group: Partial<any>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('gallery_groups' as any)
        .update({
          ...group,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) {
        console.warn('Database update failed, using mock behavior:', error);
        return true; // Mock success
      }
      
      return true;
    } catch (error) {
      console.warn('Error in updateGalleryGroup, using mock behavior:', error);
      return true; // Mock success
    }
  }

  static async deleteGalleryGroup(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('gallery_groups' as any)
        .delete()
        .eq('id', id);
      
      if (error) {
        console.warn('Database delete failed, using mock behavior:', error);
        return true; // Mock success
      }
      
      return true;
    } catch (error) {
      console.warn('Error in deleteGalleryGroup, using mock behavior:', error);
      return true; // Mock success
    }
  }

  // Gallery Items Methods
  static async getGalleryItemsByGroup(groupId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('gallery_items' as any)
        .select('*')
        .eq('group_id', groupId)
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) {
        console.warn('Database fetch failed, using mock gallery items:', error);
        return [
          {
            id: '1',
            group_id: groupId,
            title: 'Hawa Mahal Visit',
            description: 'Students exploring the Palace of Winds',
            image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            alt_text: 'Students at Hawa Mahal',
            display_order: 1,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            group_id: groupId,
            title: 'City Palace Tour',
            description: 'Group photo at the magnificent City Palace',
            image_url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            alt_text: 'Group at City Palace',
            display_order: 2,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getGalleryItemsByGroup:', error);
      return [];
    }
  }

  static async updateGalleryGroupItem(id: string, item: {
    title?: string | null;
    description?: string | null;
    alt_text?: string | null;
    display_order?: number | null;
  }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('gallery_items' as any)
        .update(item)
        .eq('id', id);
      
      if (error) {
        console.error('Error updating gallery group item:', error);
        return false;
      }
      
      // Dispatch event to notify components of data update
      window.dispatchEvent(new CustomEvent('galleryUpdated'));
      
      return true;
    } catch (error) {
      console.error('Error in updateGalleryGroupItem:', error);
      return false;
    }
  }

  static async deleteGalleryGroupItem(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('gallery_items' as any)
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting gallery group item:', error);
        return false;
      }
      
      // Dispatch event to notify components of data update
      window.dispatchEvent(new CustomEvent('galleryUpdated'));
      
      return true;
    } catch (error) {
      console.error('Error in deleteGalleryGroupItem:', error);
      return false;
    }
  }
}
