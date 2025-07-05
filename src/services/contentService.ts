import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type HeroSection = Database['public']['Tables']['hero_section']['Row'];
type AboutSection = Database['public']['Tables']['about_section']['Row'];
type VisionSection = Database['public']['Tables']['vision_section']['Row'];
type Announcement = Database['public']['Tables']['announcements']['Row'];
type GalleryItem = Database['public']['Tables']['school_life_gallery']['Row'];
type LearningMaterial = Database['public']['Tables']['learning_materials']['Row'];
type LeadershipMember = Database['public']['Tables']['leadership_team']['Row'];

// Footer Section interface (temporary - will be added to Database type later)
export interface FooterSection {
  id: string;
  title: string;
  section_type: 'links' | 'contact' | 'social' | 'custom';
  content: Record<string, any>;
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
      
      return data;
    } catch (error) {
      console.error('Error in getAboutSection:', error);
      return null;
    }
  }

  static async updateAboutSection(aboutData: Partial<AboutSection>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('about_section')
        .upsert({
          id: 'main',
          title: aboutData.title || 'About Our School',
          subtitle: aboutData.subtitle || null,
          main_content: aboutData.main_content || null,
          principal_message: aboutData.principal_message || null,
          principal_name: aboutData.principal_name || null,
          principal_title: aboutData.principal_title || null,
          principal_image_url: aboutData.principal_image_url || null,
          school_founded_year: aboutData.school_founded_year || null,
          school_description: aboutData.school_description || null,
          features: aboutData.features || null,
          created_at: aboutData.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error updating about section:', error);
        return false;
      }
      
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
          title: visionData.title || 'Our Vision & Mission',
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

  // Gallery Methods
  static async getGalleryItems(): Promise<GalleryItem[]> {
    try {
      const { data, error } = await supabase
        .from('school_life_gallery')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching gallery items:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getGalleryItems:', error);
      return [];
    }
  }

  static async createGalleryItem(item: Omit<GalleryItem, 'id' | 'created_at'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('school_life_gallery')
        .insert({
          ...item,
          created_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error creating gallery item:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in createGalleryItem:', error);
      return false;
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
      // TODO: Uncomment when footer_sections table is created
      // const { count } = await supabase
      //   .from('footer_sections')
      //   .select('id', { count: 'exact', head: true });
      // return count || 0;
      return 0; // Temporary - will return actual count once table is created
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
  static async getFooterSections(): Promise<FooterSection[]> {
    try {
      // TODO: Uncomment when footer_sections table is created
      // const { data, error } = await supabase
      //   .from('footer_sections')
      //   .select('*')
      //   .eq('is_active', true)
      //   .order('display_order', { ascending: true });
      
      // if (error) {
      //   console.error('Error fetching footer sections:', error);
      //   return [];
      // }
      
      // return data || [];
      return []; // Temporary - will return actual data once table is created
    } catch (error) {
      console.error('Error fetching footer sections:', error);
      return [];
    }
  }

  static async getFooterSectionById(id: string): Promise<FooterSection | null> {
    try {
      // TODO: Uncomment when footer_sections table is created
      // const { data, error } = await supabase
      //   .from('footer_sections')
      //   .select('*')
      //   .eq('id', id)
      //   .single();
      
      // if (error) {
      //   console.error('Error fetching footer section:', error);
      //   return null;
      // }
      
      // return data;
      return null; // Temporary - will return actual data once table is created
    } catch (error) {
      console.error('Error fetching footer section:', error);
      return null;
    }
  }

  static async createFooterSection(section: Omit<FooterSection, 'id' | 'created_at' | 'updated_at'>): Promise<FooterSection | null> {
    try {
      // TODO: Uncomment when footer_sections table is created
      // const { data, error } = await supabase
      //   .from('footer_sections')
      //   .insert([section])
      //   .select()
      //   .single();
      
      // if (error) {
      //   console.error('Error creating footer section:', error);
      //   return null;
      // }
      
      // return data;
      return null; // Temporary - will return actual data once table is created
    } catch (error) {
      console.error('Error creating footer section:', error);
      return null;
    }
  }

  static async updateFooterSection(id: string, updates: Partial<Omit<FooterSection, 'id' | 'created_at' | 'updated_at'>>): Promise<FooterSection | null> {
    try {
      // TODO: Uncomment when footer_sections table is created
      // const { data, error } = await supabase
      //   .from('footer_sections')
      //   .update(updates)
      //   .eq('id', id)
      //   .select()
      //   .single();
      
      // if (error) {
      //   console.error('Error updating footer section:', error);
      //   return null;
      // }
      
      // return data;
      return null; // Temporary - will return actual data once table is created
    } catch (error) {
      console.error('Error updating footer section:', error);
      return null;
    }
  }

  static async deleteFooterSection(id: string): Promise<boolean> {
    try {
      // TODO: Uncomment when footer_sections table is created
      // const { error } = await supabase
      //   .from('footer_sections')
      //   .delete()
      //   .eq('id', id);
      
      // if (error) {
      //   console.error('Error deleting footer section:', error);
      //   return false;
      // }
      
      // return true;
      return false; // Temporary - will return actual result once table is created
    } catch (error) {
      console.error('Error deleting footer section:', error);
      return false;
    }
  }

  static async toggleFooterSectionStatus(id: string): Promise<FooterSection | null> {
    try {
      // TODO: Uncomment when footer_sections table is created
      // First get the current status
      // const current = await this.getFooterSectionById(id);
      // if (!current) return null;
      
      // Toggle the status
      // return await this.updateFooterSection(id, { is_active: !current.is_active });
      return null; // Temporary - will return actual data once table is created
    } catch (error) {
      console.error('Error toggling footer section status:', error);
      return null;
    }
  }

  static async reorderFooterSections(sectionIds: string[]): Promise<boolean> {
    try {
      // TODO: Uncomment when footer_sections table is created
      // const updates = sectionIds.map((id, index) => ({
      //   id,
      //   display_order: index + 1
      // }));
      
      // for (const update of updates) {
      //   await this.updateFooterSection(update.id, { display_order: update.display_order });
      // }
      
      // return true;
      return false; // Temporary - will return actual result once table is created
    } catch (error) {
      console.error('Error reordering footer sections:', error);
      return false;
    }
  }
}
