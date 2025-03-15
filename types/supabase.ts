export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          date: string
          location: string | null
          category: "movie" | "party" | "food" | "travel" | "picnic"
          image_url: string | null
          is_private: boolean
          event_password: string | null
          host_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          date: string
          location?: string | null
          category: "movie" | "party" | "food" | "travel" | "picnic"
          image_url?: string | null
          is_private?: boolean
          event_password?: string | null
          host_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          date?: string
          location?: string | null
          category?: "movie" | "party" | "food" | "travel" | "picnic"
          image_url?: string | null
          is_private?: boolean
          event_password?: string | null
          host_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      attendees: {
        Row: {
          id: string
          event_id: string
          user_id: string
          status: "going" | "maybe" | "not-going"
          note: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          status: "going" | "maybe" | "not-going"
          note?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          status?: "going" | "maybe" | "not-going"
          note?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      photos: {
        Row: {
          id: string
          event_id: string
          uploaded_by: string
          url: string
          alt_text: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          uploaded_by: string
          url: string
          alt_text?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          uploaded_by?: string
          url?: string
          alt_text?: string | null
          created_at?: string
        }
      }
      co_hosts: {
        Row: {
          id: string
          event_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          created_at?: string
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
      rsvp_status: "going" | "maybe" | "not-going"
      event_category: "movie" | "party" | "food" | "travel" | "picnic"
    }
  }
}

