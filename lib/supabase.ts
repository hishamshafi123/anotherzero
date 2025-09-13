import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDA5OTUyMDAsImV4cCI6MTk1NjU3MTIwMH0.Ecs6uP9j9lM0RYK6K2T2c7VYf7f7z1Y1Y1Y1Y1Y1Y1Y'

export type Database = {
  public: {
    Tables: {
      contacts: {
        Row: {
          id: string
          user_id: string
          source: 'instagram' | 'facebook'
          external_id: string
          handle: string
          name: string
          avatar_url: string
          interest_level: 'interested' | 'not_interested' | 'neutral'
          last_interaction_at: string
          tags: string[]
          clicks_count: number
          campaigns_count: number
          status: 'active' | 'inactive' | 'blocked'
          engagement_score: number
          location?: string
          joined_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          source: 'instagram' | 'facebook'
          external_id: string
          handle: string
          name: string
          avatar_url: string
          interest_level?: 'interested' | 'not_interested' | 'neutral'
          last_interaction_at?: string
          tags?: string[]
          clicks_count?: number
          campaigns_count?: number
          status?: 'active' | 'inactive' | 'blocked'
          engagement_score?: number
          location?: string
          joined_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          source?: 'instagram' | 'facebook'
          external_id?: string
          handle?: string
          name?: string
          avatar_url?: string
          interest_level?: 'interested' | 'not_interested' | 'neutral'
          last_interaction_at?: string
          tags?: string[]
          clicks_count?: number
          campaigns_count?: number
          status?: 'active' | 'inactive' | 'blocked'
          engagement_score?: number
          location?: string
          joined_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          name: string
          channel: 'instagram' | 'facebook' | 'both'
          status: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed'
          schedule_start_at: string
          audience_size: number
          sent: number
          clicks: number
          ctr: number
          conversions: number
          variants: Array<{
            id: string
            name: string
            weight: number
            ctr: number
          }>
          created_at: string
          created_by: string
          description?: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          channel: 'instagram' | 'facebook' | 'both'
          status?: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed'
          schedule_start_at?: string
          audience_size?: number
          sent?: number
          clicks?: number
          ctr?: number
          conversions?: number
          variants?: Array<{
            id: string
            name: string
            weight: number
            ctr: number
          }>
          created_at?: string
          created_by: string
          description?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          channel?: 'instagram' | 'facebook' | 'both'
          status?: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed'
          schedule_start_at?: string
          audience_size?: number
          sent?: number
          clicks?: number
          ctr?: number
          conversions?: number
          variants?: Array<{
            id: string
            name: string
            weight: number
            ctr: number
          }>
          created_at?: string
          created_by?: string
          description?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          type: 'click' | 'message' | 'campaign' | 'tag_added' | 'status_changed'
          contact_id?: string
          campaign_id?: string
          data: Record<string, any>
          created_at: string
        }
        Insert: {
          id?: string
          type: 'click' | 'message' | 'campaign' | 'tag_added' | 'status_changed'
          contact_id?: string
          campaign_id?: string
          data: Record<string, any>
          created_at?: string
        }
        Update: {
          id?: string
          type?: 'click' | 'message' | 'campaign' | 'tag_added' | 'status_changed'
          contact_id?: string
          campaign_id?: string
          data?: Record<string, any>
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
      [_ in never]: never
    }
  }
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)