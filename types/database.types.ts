export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      property_requests: {
        Row: {
          id: string
          property_id: string
          property_type: 'rent' | 'sell'
          requester_id: string
          owner_id: string
          message: string | null
          status: 'pending' | 'accepted' | 'rejected' | 'completed'
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          property_id: string
          property_type: 'rent' | 'sell'
          requester_id: string
          owner_id: string
          message?: string | null
          status?: 'pending' | 'accepted' | 'rejected' | 'completed'
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          property_id?: string
          property_type?: 'rent' | 'sell'
          requester_id?: string
          owner_id?: string
          message?: string | null
          status?: 'pending' | 'accepted' | 'rejected' | 'completed'
          created_at?: string | null
          updated_at?: string | null
        }
      },
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          username: string | null
          email: string | null
          phone: string | null
          online: boolean | null
          last_seen: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          username?: string | null
          email?: string | null
          phone?: string | null
          online?: boolean | null
          last_seen?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          username?: string | null
          email?: string | null
          phone?: string | null
          online?: boolean | null
          last_seen?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      rent_posts: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          category: string | null
          rent_amount: number
          deposit_amount: number
          is_active: boolean
          location: string | null
          tags: string[]
          contact_number: string | null
          views_count: number
          created_at: string | null
          image_urls: string[] | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          category?: string | null
          rent_amount: number
          deposit_amount?: number
          is_active?: boolean
          location?: string | null
          tags?: string[]
          contact_number?: string | null
          views_count?: number
          created_at?: string | null
          image_urls?: string[] | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          category?: string | null
          rent_amount?: number
          deposit_amount?: number
          is_active?: boolean
          location?: string | null
          tags?: string[]
          contact_number?: string | null
          views_count?: number
          created_at?: string | null
          image_urls?: string[] | null
        }
      }
      sell_posts: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          category: string | null
          price: number
          is_active: boolean
          location: string | null
          tags: string[]
          contact_number: string | null
          views_count: number
          created_at: string | null
          image_urls: string[] | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          category?: string | null
          price: number
          is_active?: boolean
          location?: string | null
          tags?: string[]
          contact_number?: string | null
          views_count?: number
          created_at?: string | null
          image_urls?: string[] | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          category?: string | null
          price?: number
          is_active?: boolean
          location?: string | null
          tags?: string[]
          contact_number?: string | null
          views_count?: number
          created_at?: string | null
          image_urls?: string[] | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Helper types for your existing code
export type PropertyDetails = Tables<'rent_posts'> & { post_type: 'rent' } | Tables<'sell_posts'> & { post_type: 'sell' }

export type PropertyRequest = Tables<'property_requests'>
