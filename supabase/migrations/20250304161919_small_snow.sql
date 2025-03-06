/*
  # Create appointments table

  1. New Tables
    - `appointments`
      - `id` (uuid, primary key)
      - `teacher_id` (integer, foreign key to teachers.id)
      - `teacher_name` (text, not null)
      - `teacher_subject` (text, not null)
      - `parent_name` (text, not null)
      - `parent_email` (text, not null)
      - `student_name` (text, not null)
      - `time_slot_id` (text, not null)
      - `time_slot_formatted` (text, not null)
      - `start_time` (timestamptz, not null)
      - `end_time` (timestamptz, not null)
      - `created_at` (timestamptz, default now())
  2. Security
    - Enable RLS on `appointments` table
    - Add policy for users to read their own appointments
    - Add policy for users to insert their own appointments
    - Add policy for users to update their own appointments
    - Add policy for users to delete their own appointments
    - Add policy for administrators to read all appointments
*/

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id integer REFERENCES teachers(id),
  teacher_name text NOT NULL,
  teacher_subject text NOT NULL,
  parent_name text NOT NULL,
  parent_email text NOT NULL,
  student_name text NOT NULL,
  time_slot_id text NOT NULL,
  time_slot_formatted text NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create a unique constraint to prevent double booking
CREATE UNIQUE INDEX IF NOT EXISTS appointments_teacher_timeslot_idx 
  ON appointments (teacher_id, time_slot_id);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Users can read their own appointments
CREATE POLICY "Users can read own appointments"
  ON appointments
  FOR SELECT
  TO public
  USING (parent_email = auth.email());

-- Users can insert their own appointments
CREATE POLICY "Users can insert own appointments"
  ON appointments
  FOR INSERT
  TO public
  WITH CHECK (parent_email = auth.email());

-- Users can update their own appointments
CREATE POLICY "Users can update own appointments"
  ON appointments
  FOR UPDATE
  TO public
  USING (parent_email = auth.email());

-- Users can delete their own appointments
CREATE POLICY "Users can delete own appointments"
  ON appointments
  FOR DELETE
  TO public
  USING (parent_email = auth.email());

-- Administrators can read all appointments
CREATE POLICY "Administrators can read all appointments"
  ON appointments
  FOR SELECT
  TO public
  USING (auth.uid() IN (
    SELECT auth.uid() FROM auth.users WHERE auth.email() = 'admin@example.com'
  ));

-- Administrators can manage all appointments
CREATE POLICY "Administrators can manage all appointments"
  ON appointments
  USING (auth.uid() IN (
    SELECT auth.uid() FROM auth.users WHERE auth.email() = 'admin@example.com'
  ));