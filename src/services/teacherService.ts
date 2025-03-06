import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Teacher } from '../types';

// Fetch all teachers from the database
export const fetchTeachers = async (): Promise<Teacher[]> => {
  // If Supabase is not configured, return an empty array
  if (!isSupabaseConfigured()) {
    console.error('Supabase connection error:', { message: 'Supabase is not properly configured' });
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('teachers')
      .select('id, name, subject')
      .order('name');

    if (error) {
      console.error('Error fetching teachers:', error);
      return [];
    }

    return data.map(teacher => ({
      id: teacher.id,
      name: teacher.name,
      subject: teacher.subject
    }));
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return [];
  }
};

// Seed teachers if none exist in the database
export const seedTeachersIfNeeded = async (defaultTeachers: Teacher[]): Promise<void> => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase connection error:', { message: 'Supabase is not properly configured' });
    return;
  }

  try {
    // Check if teachers already exist
    const { count, error: countError } = await supabase
      .from('teachers')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error checking teachers count:', countError);
      return;
    }

    // If no teachers exist, seed the database
    if (count === 0) {
      console.log('No teachers found in database, seeding...');
      
      // First check which teachers already exist to avoid duplicate key errors
      const { data: existingTeachers, error: existingError } = await supabase
        .from('teachers')
        .select('id');
        
      if (existingError) {
        console.error('Error checking existing teachers:', existingError);
        return;
      }
      
      // Create a set of existing teacher IDs for quick lookup
      const existingIds = new Set(existingTeachers?.map(t => t.id) || []);
      
      // Filter out teachers that already exist
      const teachersToInsert = defaultTeachers.filter(teacher => !existingIds.has(teacher.id));
      
      if (teachersToInsert.length === 0) {
        console.log('All teachers already exist in the database');
        return;
      }
      
      console.log(`Inserting ${teachersToInsert.length} teachers...`);
      
      // Insert teachers in smaller batches to avoid potential issues
      const batchSize = 20;
      for (let i = 0; i < teachersToInsert.length; i += batchSize) {
        const batch = teachersToInsert.slice(i, i + batchSize);
        const { error: insertError } = await supabase
          .from('teachers')
          .insert(batch.map(teacher => ({
            id: teacher.id,
            name: teacher.name,
            subject: teacher.subject
          })));

        if (insertError) {
          console.error(`Error seeding teachers batch ${i}-${Math.min(i+batchSize, teachersToInsert.length)}:`, insertError);
        } else {
          console.log(`Successfully seeded teachers batch ${i}-${Math.min(i+batchSize, teachersToInsert.length)}`);
        }
      }
    } else {
      console.log(`Found ${count} teachers in database, skipping seed`);
    }
  } catch (error) {
    console.error('Error seeding teachers:', error);
  }
};

// Get a single teacher by ID
export const getTeacherById = async (teacherId: number): Promise<Teacher | null> => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase connection error:', { message: 'Supabase is not properly configured' });
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('teachers')
      .select('id, name, subject')
      .eq('id', teacherId)
      .single();

    if (error) {
      console.error('Error fetching teacher:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      subject: data.subject
    };
  } catch (error) {
    console.error('Error fetching teacher:', error);
    return null;
  }
};

// Search teachers by name or subject
export const searchTeachers = async (searchTerm: string): Promise<Teacher[]> => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase connection error:', { message: 'Supabase is not properly configured' });
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('teachers')
      .select('id, name, subject')
      .or(`name.ilike.%${searchTerm}%,subject.ilike.%${searchTerm}%`)
      .order('name');

    if (error) {
      console.error('Error searching teachers:', error);
      return [];
    }

    return data.map(teacher => ({
      id: teacher.id,
      name: teacher.name,
      subject: teacher.subject
    }));
  } catch (error) {
    console.error('Error searching teachers:', error);
    return [];
  }
};