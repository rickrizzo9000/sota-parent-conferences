import { createClient } from '@supabase/supabase-js';
import { Teacher, Appointment, TimeSlot } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Teacher functions
export const fetchTeachers = async (): Promise<Teacher[]> => {
  try {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching teachers:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Supabase connection error:', error);
    throw error;
  }
};

export const seedTeachers = async (teachers: Teacher[]): Promise<void> => {
  try {
    // Check if teachers already exist
    const { count, error: countError } = await supabase
      .from('teachers')
      .select('count()');
    
    if (countError) {
      console.error('Error checking teachers count:', countError);
      throw countError;
    }
    
    // Only seed if no teachers exist
    if (count === 0) {
      const { error } = await supabase
        .from('teachers')
        .insert(teachers);
      
      if (error) {
        console.error('Error seeding teachers:', error);
        throw error;
      }
    }
  } catch (error) {
    console.error('Error seeding teachers:', error);
    throw error;
  }
};

// Appointment functions
export const fetchAppointments = async (): Promise<Appointment[]> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*');
    
    if (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
    
    // Convert date strings back to Date objects
    return (data || []).map(app => ({
      ...app,
      timeSlot: {
        ...app.timeSlot,
        startTime: new Date(app.timeSlot.startTime),
        endTime: new Date(app.timeSlot.endTime)
      }
    }));
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

export const createAppointment = async (appointment: Appointment): Promise<void> => {
  try {
    const { error } = await supabase
      .from('appointments')
      .insert([appointment]);
    
    if (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

export const deleteAppointment = async (appointmentId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', appointmentId);
    
    if (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
};

// Get appointments for a specific parent
export const fetchParentAppointments = async (parentEmail: string): Promise<Appointment[]> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('parentEmail', parentEmail);
    
    if (error) {
      console.error('Error fetching parent appointments:', error);
      throw error;
    }
    
    // Convert date strings back to Date objects
    return (data || []).map(app => ({
      ...app,
      timeSlot: {
        ...app.timeSlot,
        startTime: new Date(app.timeSlot.startTime),
        endTime: new Date(app.timeSlot.endTime)
      }
    }));
  } catch (error) {
    console.error('Error fetching parent appointments:', error);
    throw error;
  }
};

// Check if a time slot is booked for a specific teacher
export const isTimeSlotBooked = async (teacherId: number, timeSlotId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('id')
      .eq('teacherId', teacherId)
      .eq('timeSlot->>id', timeSlotId);
    
    if (error) {
      console.error('Error checking time slot:', error);
      throw error;
    }
    
    return (data || []).length > 0;
  } catch (error) {
    console.error('Error checking time slot:', error);
    throw error;
  }
};