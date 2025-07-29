import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          user_type: 'User' | 'Artist'
          aka: string | null
          bio: string | null
          profile_picture_url: string | null
          location: string | null
          genre: string | null
          social_links: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          user_type: 'User' | 'Artist'
          aka?: string | null
          bio?: string | null
          profile_picture_url?: string | null
          location?: string | null
          genre?: string | null
          social_links?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          user_type?: 'User' | 'Artist'
          aka?: string | null
          bio?: string | null
          profile_picture_url?: string | null
          location?: string | null
          genre?: string | null
          social_links?: any
          created_at?: string
          updated_at?: string
        }
      }
      albums: {
        Row: {
          id: string
          artist_id: string
          title: string
          description: string | null
          cover_image_url: string | null
          genre: string
          release_year: number
          price: number
          is_public: boolean
          total_duration: number
          likes_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          artist_id: string
          title: string
          description?: string | null
          cover_image_url?: string | null
          genre: string
          release_year: number
          price?: number
          is_public?: boolean
          total_duration?: number
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          artist_id?: string
          title?: string
          description?: string | null
          cover_image_url?: string | null
          genre?: string
          release_year?: number
          price?: number
          is_public?: boolean
          total_duration?: number
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      tracks: {
        Row: {
          id: string
          album_id: string
          title: string
          duration: number
          track_number: number
          is_explicit: boolean
          audio_file_url: string | null
          likes_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          album_id: string
          title: string
          duration: number
          track_number: number
          is_explicit?: boolean
          audio_file_url?: string | null
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          album_id?: string
          title?: string
          duration?: number
          track_number?: number
          is_explicit?: boolean
          audio_file_url?: string | null
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_interactions: {
        Row: {
          id: string
          user_id: string
          target_type: 'album' | 'track' | 'artist'
          target_id: string
          interaction_type: 'like' | 'follow'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          target_type: 'album' | 'track' | 'artist'
          target_id: string
          interaction_type: 'like' | 'follow'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          target_type?: 'album' | 'track' | 'artist'
          target_id?: string
          interaction_type?: 'like' | 'follow'
          created_at?: string
        }
      }
      album_purchases: {
        Row: {
          id: string
          user_id: string
          album_id: string
          amount_paid: number
          purchase_date: string
        }
        Insert: {
          id?: string
          user_id: string
          album_id: string
          amount_paid: number
          purchase_date?: string
        }
        Update: {
          id?: string
          user_id?: string
          album_id?: string
          amount_paid?: number
          purchase_date?: string
        }
      }
      artist_verifications: {
        Row: {
          id: string
          user_id: string
          status: 'not_applied' | 'pending' | 'verified' | 'rejected'
          application_data: any
          rejection_reason: string | null
          verified_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: 'not_applied' | 'pending' | 'verified' | 'rejected'
          application_data?: any
          rejection_reason?: string | null
          verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: 'not_applied' | 'pending' | 'verified' | 'rejected'
          application_data?: any
          rejection_reason?: string | null
          verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          artist_id: string | null
          venue: string
          event_date: string
          ticket_price: number
          total_capacity: number
          tickets_sold: number
          image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          artist_id?: string | null
          venue: string
          event_date: string
          ticket_price?: number
          total_capacity: number
          tickets_sold?: number
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          artist_id?: string | null
          venue?: string
          event_date?: string
          ticket_price?: number
          total_capacity?: number
          tickets_sold?: number
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          data: any
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          data?: any
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          data?: any
          is_read?: boolean
          created_at?: string
        }
      }
    }
  }
} 