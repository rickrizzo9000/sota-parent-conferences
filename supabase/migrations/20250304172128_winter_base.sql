/*
  # Fix duplicate key issues and improve error handling

  1. Changes
     - Add ON CONFLICT DO NOTHING to teacher insertions to prevent duplicate key errors
     - Add more robust error handling for appointment creation
     - Ensure all tables have appropriate indexes for performance

  2. Security
     - Maintain existing RLS policies
*/

-- Add ON CONFLICT DO NOTHING option to teacher insertions
CREATE OR REPLACE FUNCTION insert_teacher_if_not_exists(
  p_id integer,
  p_name text,
  p_subject text
) RETURNS void AS $$
BEGIN
  INSERT INTO teachers (id, name, subject)
  VALUES (p_id, p_name, p_subject)
  ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Add function to safely check if a time slot is available before booking
CREATE OR REPLACE FUNCTION is_time_slot_available(
  p_teacher_id integer,
  p_time_slot_id text
) RETURNS boolean AS $$
DECLARE
  appointment_count integer;
BEGIN
  SELECT COUNT(*) INTO appointment_count
  FROM appointments
  WHERE teacher_id = p_teacher_id AND time_slot_id = p_time_slot_id;
  
  RETURN appointment_count = 0;
END;
$$ LANGUAGE plpgsql;

-- Ensure we have all necessary indexes for performance
CREATE INDEX IF NOT EXISTS idx_appointments_parent_email ON appointments(parent_email);
CREATE INDEX IF NOT EXISTS idx_appointments_teacher_id ON appointments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_appointments_time_slot_id ON appointments(time_slot_id);
CREATE INDEX IF NOT EXISTS idx_teachers_name ON teachers(name);
CREATE INDEX IF NOT EXISTS idx_teachers_subject ON teachers(subject);