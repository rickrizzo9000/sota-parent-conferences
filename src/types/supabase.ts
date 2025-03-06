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
      teachers: {
        Row: {
          id: number
          name: string
          subject: string
          created_at: string
        }
        Insert: {
          id: number
          name: string
          subject: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          subject?: string
          created_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          teacher_id: number
          teacher_name: string
          teacher_subject: string
          parent_name: string
          parent_email: string
          student_name: string
          time_slot_id: string
          time_slot_formatted: string
          start_time: string
          end_time: string
          created_at: string
        }
        Insert: {
          id?: string
          teacher_id: number
          teacher_name: string
          teacher_subject: string
          parent_name: string
          parent_email: string
          student_name: string
          time_slot_id: string
          time_slot_formatted: string
          start_time: string
          end_time: string
          created_at?: string
        }
        Update: {
          id?: string
          teacher_id?: number
          teacher_name?: string
          teacher_subject?: string
          parent_name?: string
          parent_email?: string
          student_name?: string
          time_slot_id?: string
          time_slot_formatted?: string
          start_time?: string
          end_time?: string
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