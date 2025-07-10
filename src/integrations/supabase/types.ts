export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string
          user_id: string
          role: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          role?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          role?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      announcements: {
        Row: {
          id: string
          title: string
          content: string
          category: string | null
          type: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          content: string
          category?: string | null
          type?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          content?: string
          category?: string | null
          type?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leadership_team: {
        Row: {
          id: string
          name: string
          position: string
          bio: string | null
          qualifications: string | null
          email: string | null
          phone: string | null
          image_url: string | null
          display_order: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          position: string
          bio?: string | null
          qualifications?: string | null
          email?: string | null
          phone?: string | null
          image_url?: string | null
          display_order?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          position?: string
          bio?: string | null
          qualifications?: string | null
          email?: string | null
          phone?: string | null
          image_url?: string | null
          display_order?: number | null
          created_at?: string | null
        }
        Relationships: []
      }
      learning_materials: {
        Row: {
          id: string
          title: string
          description: string | null
          subject: string
          class_level: string
          file_type: string
          file_url: string
          file_size: string | null
          downloads: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          subject: string
          class_level: string
          file_type: string
          file_url: string
          file_size?: string | null
          downloads?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          subject?: string
          class_level?: string
          file_type?: string
          file_url?: string
          file_size?: string | null
          downloads?: number | null
          created_at?: string | null
        }
        Relationships: []
      }
      school_life_gallery: {
        Row: {
          id: string
          title: string
          description: string | null
          image_url: string
          category: string | null
          date_taken: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image_url: string
          category?: string | null
          date_taken?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          image_url?: string
          category?: string | null
          date_taken?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      gallery_groups: {
        Row: {
          id: string
          title: string
          description: string | null
          cover_image_url: string | null
          category: string | null
          date_taken: string | null
          display_order: number | null
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          cover_image_url?: string | null
          category?: string | null
          date_taken?: string | null
          display_order?: number | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          cover_image_url?: string | null
          category?: string | null
          date_taken?: string | null
          display_order?: number | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          id: string
          group_id: string
          title: string | null
          description: string | null
          image_url: string
          alt_text: string | null
          display_order: number | null
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          group_id: string
          title?: string | null
          description?: string | null
          image_url: string
          alt_text?: string | null
          display_order?: number | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          title?: string | null
          description?: string | null
          image_url?: string
          alt_text?: string | null
          display_order?: number | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_items_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "gallery_groups"
            referencedColumns: ["id"]
          }
        ]
      }
      hero_section: {
        Row: {
          id: string
          title: string
          subtitle: string
          description: string | null
          image_url: string | null
          image_description: string | null
          primary_button_text: string | null
          primary_button_link: string | null
          secondary_button_text: string | null
          secondary_button_link: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          subtitle: string
          description?: string | null
          image_url?: string | null
          image_description?: string | null
          primary_button_text?: string | null
          primary_button_link?: string | null
          secondary_button_text?: string | null
          secondary_button_link?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string
          description?: string | null
          image_url?: string | null
          image_description?: string | null
          primary_button_text?: string | null
          primary_button_link?: string | null
          secondary_button_text?: string | null
          secondary_button_link?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      about_section: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          main_content: Json | null
          principal_message: string | null
          principal_name: string | null
          principal_title: string | null
          principal_image_url: string | null
          school_founded_year: number | null
          school_description: string | null
          features: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          subtitle?: string | null
          main_content?: Json | null
          principal_message?: string | null
          principal_name?: string | null
          principal_title?: string | null
          principal_image_url?: string | null
          school_founded_year?: number | null
          school_description?: string | null
          features?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string | null
          main_content?: Json | null
          principal_message?: string | null
          principal_name?: string | null
          principal_title?: string | null
          principal_image_url?: string | null
          school_founded_year?: number | null
          school_description?: string | null
          features?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vision_section: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          main_content: string | null
          principal_message: string | null
          principal_name: string | null
          principal_title: string | null
          features: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          subtitle?: string | null
          main_content?: string | null
          principal_message?: string | null
          principal_name?: string | null
          principal_title?: string | null
          features?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string | null
          main_content?: string | null
          principal_message?: string | null
          principal_name?: string | null
          principal_title?: string | null
          features?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      footer_sections: {
        Row: {
          id: string
          title: string
          section_type: string
          content: Json
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          section_type: string
          content?: Json
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          section_type?: string
          content?: Json
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_admin_status: {
        Args: {
          user_uuid?: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
