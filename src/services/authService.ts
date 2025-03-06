import { supabase } from './supabaseClient';

// Local storage key for admin authentication
const ADMIN_AUTH_KEY = 'admin_authenticated';

export const signIn = async (email: string, password: string): Promise<boolean> => {
  try {
    // For demo purposes, we'll simulate authentication
    if (email === 'admin@example.com' && password === 'admin123') {
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      return true;
    }
    
    // In a real app, we would use Supabase auth
    /*
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Error signing in:', error);
      return false;
    }
    */

    return false;
  } catch (error) {
    console.error('Unexpected error signing in:', error);
    return false;
  }
};

export const signOut = async (): Promise<boolean> => {
  try {
    // For demo purposes, we'll clear local storage
    localStorage.removeItem(ADMIN_AUTH_KEY);
    
    // In a real app, we would use Supabase auth
    /*
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error signing out:', error);
      return false;
    }
    */

    return true;
  } catch (error) {
    console.error('Unexpected error signing out:', error);
    return false;
  }
};

export const getCurrentUser = async () => {
  try {
    // For demo purposes, we'll check local storage
    const isAdmin = localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    
    if (isAdmin) {
      return { email: 'admin@example.com' };
    }
    
    // In a real app, we would use Supabase auth
    /*
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Error getting current user:', error);
      return null;
    }

    return data.user;
    */

    return null;
  } catch (error) {
    console.error('Unexpected error getting current user:', error);
    return null;
  }
};

export const isAdmin = async (): Promise<boolean> => {
  try {
    // For demo purposes, we'll check local storage
    return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    
    // In a real app, we would use Supabase auth
    /*
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return false;
    }

    // Check if the user's email is the admin email
    return data.user.email === 'admin@example.com';
    */
  } catch (error) {
    console.error('Unexpected error checking admin status:', error);
    return false;
  }
};