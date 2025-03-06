import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Appointment, TimeSlot } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Fetch all appointments from the database
export const fetchAppointments = async (): Promise<Appointment[]> => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase connection error:', { message: 'Supabase is not properly configured' });
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*');

    if (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }

    // Convert database records to Appointment objects
    return data.map(record => ({
      id: record.id,
      teacherId: record.teacher_id,
      teacherName: record.teacher_name,
      teacherSubject: record.teacher_subject,
      parentName: record.parent_name,
      parentEmail: record.parent_email,
      studentName: record.student_name,
      timeSlot: {
        id: record.time_slot_id,
        startTime: new Date(record.start_time),
        endTime: new Date(record.end_time),
        formatted: record.time_slot_formatted
      }
    }));
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
};

// Create a new appointment in the database
export const createAppointment = async (appointment: Appointment): Promise<boolean> => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase connection error:', { message: 'Supabase is not properly configured' });
    return false;
  }

  try {
    // First check if this time slot is already booked
    const isBooked = await isTimeSlotBooked(appointment.teacherId, appointment.timeSlot.id);
    if (isBooked) {
      console.error('Time slot is already booked');
      return false;
    }

    // Generate a proper UUID for the appointment ID instead of using the composite key
    const appointmentId = uuidv4();

    // Use upsert with onConflict to handle race conditions
    const { error } = await supabase
      .from('appointments')
      .upsert({
        id: appointmentId,
        teacher_id: appointment.teacherId,
        teacher_name: appointment.teacherName,
        teacher_subject: appointment.teacherSubject,
        parent_name: appointment.parentName,
        parent_email: appointment.parentEmail,
        student_name: appointment.studentName,
        time_slot_id: appointment.timeSlot.id,
        time_slot_formatted: appointment.timeSlot.formatted,
        start_time: appointment.timeSlot.startTime.toISOString(),
        end_time: appointment.timeSlot.endTime.toISOString()
      }, {
        onConflict: 'teacher_id,time_slot_id',
        ignoreDuplicates: true
      });

    if (error) {
      // If the error is a unique constraint violation, it means the slot was booked
      // between our check and insert - handle this gracefully
      if (error.code === '23505') {
        console.error('Time slot was booked by another user');
        return false;
      }
      
      console.error('Error creating appointment:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error creating appointment:', error);
    return false;
  }
};

// Delete an appointment from the database
export const deleteAppointment = async (appointmentId: string): Promise<boolean> => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase connection error:', { message: 'Supabase is not properly configured' });
    return false;
  }

  try {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', appointmentId);

    if (error) {
      console.error('Error deleting appointment:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return false;
  }
};

// Check if a time slot is already booked for a teacher
export const isTimeSlotBooked = async (teacherId: number, timeSlotId: string): Promise<boolean> => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase connection error:', { message: 'Supabase is not properly configured' });
    return false;
  }

  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('id')
      .eq('teacher_id', teacherId)
      .eq('time_slot_id', timeSlotId);

    if (error) {
      console.error('Error checking time slot availability:', error);
      return false;
    }

    return data.length > 0;
  } catch (error) {
    console.error('Error checking time slot availability:', error);
    return false;
  }
};

// Get appointments for a specific parent
export const fetchParentAppointments = async (parentEmail: string): Promise<Appointment[]> => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase connection error:', { message: 'Supabase is not properly configured' });
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('parent_email', parentEmail);

    if (error) {
      console.error('Error fetching parent appointments:', error);
      return [];
    }

    // Convert database records to Appointment objects
    return data.map(record => ({
      id: record.id,
      teacherId: record.teacher_id,
      teacherName: record.teacher_name,
      teacherSubject: record.teacher_subject,
      parentName: record.parent_name,
      parentEmail: record.parent_email,
      studentName: record.student_name,
      timeSlot: {
        id: record.time_slot_id,
        startTime: new Date(record.start_time),
        endTime: new Date(record.end_time),
        formatted: record.time_slot_formatted
       }
    }));
  } catch (error) {
    console.error('Error fetching parent appointments:', error);
    return [];
  }
};

// Get all appointments for a specific teacher
export const fetchTeacherAppointments = async (teacherId: number): Promise<Appointment[]> => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase connection error:', { message: 'Supabase is not properly configured' });
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('teacher_id', teacherId);

    if (error) {
      console.error('Error fetching teacher appointments:', error);
      return [];
    }

    // Convert database records to Appointment objects
    return data.map(record => ({
      id: record.id,
      teacherId: record.teacher_id,
      teacherName: record.teacher_name,
      teacherSubject: record.teacher_subject,
      parentName: record.parent_name,
      parentEmail: record.parent_email,
      studentName: record.student_name,
      timeSlot: {
        id: record.time_slot_id,
        startTime: new Date(record.start_time),
        endTime: new Date(record.end_time),
        formatted: record.time_slot_formatted
      }
    }));
  } catch (error) {
    console.error('Error fetching teacher appointments:', error);
    return [];
  }
};