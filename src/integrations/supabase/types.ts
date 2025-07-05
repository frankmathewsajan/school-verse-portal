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
