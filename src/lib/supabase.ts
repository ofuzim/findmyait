import { createClient } from '@jsr/supabase__supabase-js'
import { projectId, publicAnonKey, supabaseUrl } from '../utils/supabase/info.tsx'

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  supabaseUrl || `https://${projectId}.supabase.co`,
  publicAnonKey
)

// Database types based on our schema
export interface Database {
  public: {
    Tables: {
      jobs: {
        Row: {
          id: string
          job_id: string | null
          job_title: string
          employer_name: string
          employer_logo: string | null
          employer_website: string | null
          job_employment_type: string | null
          job_employment_types: string[] | null
          job_apply_link: string | null
          job_apply_is_direct: boolean | null
          apply_options: any | null
          job_description: string | null
          job_is_remote: boolean | null
          job_posted_at: string | null
          job_posted_at_timestamp: number | null
          job_posted_at_datetime_utc: string | null
          job_location: string | null
          job_city: string | null
          job_state: string | null
          job_country: string | null
          job_latitude: number | null
          job_longitude: number | null
          job_benefits: string[] | null
          job_salary: string | null
          job_min_salary: number | null
          job_max_salary: number | null
          job_salary_period: string | null
          job_highlights: any | null
          job_onet_soc: string | null
          job_onet_job_zone: number | null
          facility_type: string | null
          job_type: 'ait' | 'edt' | null
          experience_level: 'entry' | '1-2years' | '3-5years' | null
          facility_type_id: 'memory' | 'skilled' | 'assisted' | 'ccrc' | 'rehab' | 'longterm' | null
          training_details: any | null
          facility_info: any | null
          contact: any | null
          created_at: string
          updated_at: string
          is_active: boolean | null
          source: string | null
        }
        Insert: {
          id?: string
          job_id?: string | null
          job_title: string
          employer_name: string
          employer_logo?: string | null
          employer_website?: string | null
          job_employment_type?: string | null
          job_employment_types?: string[] | null
          job_apply_link?: string | null
          job_apply_is_direct?: boolean | null
          apply_options?: any | null
          job_description?: string | null
          job_is_remote?: boolean | null
          job_posted_at?: string | null
          job_posted_at_timestamp?: number | null
          job_posted_at_datetime_utc?: string | null
          job_location?: string | null
          job_city?: string | null
          job_state?: string | null
          job_country?: string | null
          job_latitude?: number | null
          job_longitude?: number | null
          job_benefits?: string[] | null
          job_salary?: string | null
          job_min_salary?: number | null
          job_max_salary?: number | null
          job_salary_period?: string | null
          job_highlights?: any | null
          job_onet_soc?: string | null
          job_onet_job_zone?: number | null
          facility_type?: string | null
          job_type?: 'ait' | 'edt' | null
          experience_level?: 'entry' | '1-2years' | '3-5years' | null
          facility_type_id?: 'memory' | 'skilled' | 'assisted' | 'ccrc' | 'rehab' | 'longterm' | null
          training_details?: any | null
          facility_info?: any | null
          contact?: any | null
          created_at?: string
          updated_at?: string
          is_active?: boolean | null
          source?: string | null
        }
        Update: {
          id?: string
          job_id?: string | null
          job_title?: string
          employer_name?: string
          employer_logo?: string | null
          employer_website?: string | null
          job_employment_type?: string | null
          job_employment_types?: string[] | null
          job_apply_link?: string | null
          job_apply_is_direct?: boolean | null
          apply_options?: any | null
          job_description?: string | null
          job_is_remote?: boolean | null
          job_posted_at?: string | null
          job_posted_at_timestamp?: number | null
          job_posted_at_datetime_utc?: string | null
          job_location?: string | null
          job_city?: string | null
          job_state?: string | null
          job_country?: string | null
          job_latitude?: number | null
          job_longitude?: number | null
          job_benefits?: string[] | null
          job_salary?: string | null
          job_min_salary?: number | null
          job_max_salary?: number | null
          job_salary_period?: string | null
          job_highlights?: any | null
          job_onet_soc?: string | null
          job_onet_job_zone?: number | null
          facility_type?: string | null
          job_type?: 'ait' | 'edt' | null
          experience_level?: 'entry' | '1-2years' | '3-5years' | null
          facility_type_id?: 'memory' | 'skilled' | 'assisted' | 'ccrc' | 'rehab' | 'longterm' | null
          training_details?: any | null
          facility_info?: any | null
          contact?: any | null
          created_at?: string
          updated_at?: string
          is_active?: boolean | null
          source?: string | null
        }
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      job_applications: {
        Row: {
          id: string
          user_id: string
          job_id: string
          status: 'applied' | 'viewed' | 'interviewed' | 'rejected' | 'accepted'
          applied_at: string
          notes: string | null
        }
        Insert: {
          id?: string
          user_id: string
          job_id: string
          status?: 'applied' | 'viewed' | 'interviewed' | 'rejected' | 'accepted'
          applied_at?: string
          notes?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          job_id?: string
          status?: 'applied' | 'viewed' | 'interviewed' | 'rejected' | 'accepted'
          applied_at?: string
          notes?: string | null
        }
      }
      saved_jobs: {
        Row: {
          id: string
          user_id: string
          job_id: string
          saved_at: string
        }
        Insert: {
          id?: string
          user_id: string
          job_id: string
          saved_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          job_id?: string
          saved_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          preferred_states: string[] | null
          preferred_facility_types: string[] | null
          preferred_job_types: string[] | null
          preferred_experience_levels: string[] | null
          salary_min: number | null
          salary_max: number | null
          remote_only: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          preferred_states?: string[] | null
          preferred_facility_types?: string[] | null
          preferred_job_types?: string[] | null
          preferred_experience_levels?: string[] | null
          salary_min?: number | null
          salary_max?: number | null
          remote_only?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          preferred_states?: string[] | null
          preferred_facility_types?: string[] | null
          preferred_job_types?: string[] | null
          preferred_experience_levels?: string[] | null
          salary_min?: number | null
          salary_max?: number | null
          remote_only?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      job_alerts: {
        Row: {
          id: string
          user_id: string
          name: string
          search_criteria: any
          is_active: boolean | null
          frequency: 'immediate' | 'daily' | 'weekly'
          last_sent_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          search_criteria: any
          is_active?: boolean | null
          frequency?: 'immediate' | 'daily' | 'weekly'
          last_sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          search_criteria?: any
          is_active?: boolean | null
          frequency?: 'immediate' | 'daily' | 'weekly'
          last_sent_at?: string | null
          created_at?: string
          updated_at?: string
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

// Type-safe Supabase client
export type SupabaseClient = ReturnType<typeof createClient<Database>>
