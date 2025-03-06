import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Get environment variables with fallbacks to prevent URL constructor errors
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function to check if Supabase is properly configured with real credentials
export const isSupabaseConfigured = (): boolean => {
  try {
    return (
      supabaseUrl !== 'https://example.supabase.co' && 
      supabaseAnonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' &&
      supabaseUrl.startsWith('https://') &&
      supabaseAnonKey.length > 20
    );
  } catch (error) {
    console.error('Error checking Supabase configuration:', error);
    return false;
  }
};