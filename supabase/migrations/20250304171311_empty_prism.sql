/*
  # Create appointments table

  1. New Tables
    - `appointments`
      - `id` (uuid, primary key, default gen_random_uuid())
      - `teacher_id` (integer, references teachers.id)
      - `teacher_name` (text, not null)
      - `teacher_subject` (text, not null)
      - `parent_name` (text, not null)
      - `parent_email` (text, not null)
      - `student_name` (text, not null)
      - `time_slot_id` (text, not null)
      - `time_slot_formatted` (text, not null)
      - `start_time` (timestamp with time zone, not null)
      - `end_time` (timestamp with time zone, not null)
      - `created_at` (timestamp with time zone, default now())
  2. Constraints
    - Unique index on teacher_id and time_slot_id to prevent double booking
  3. Security
    - Enable RLS on `appointments` table
    - Add policies for public access and management
*/

-- Create appointments table
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

-- Enable row level security
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$
BEGIN
  -- Check if the policy exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'Anyone can read appointments'
  ) THEN
    -- Anyone can read appointments (needed for checking availability)
    CREATE POLICY "Anyone can read appointments"
      ON appointments
      FOR SELECT
      TO public
      USING (true);
  END IF;

  -- Check if the policy exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'Anyone can insert appointments'
  ) THEN
    -- Anyone can insert appointments (we'll validate in the application)
    CREATE POLICY "Anyone can insert appointments"
      ON appointments
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;

  -- Check if the policy exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'Users can update own appointments'
  ) THEN
    -- Users can update their own appointments
    CREATE POLICY "Users can update own appointments"
      ON appointments
      FOR UPDATE
      TO public
      USING (parent_email = auth.email());
  END IF;

  -- Check if the policy exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'Users can delete own appointments'
  ) THEN
    -- Users can delete their own appointments
    CREATE POLICY "Users can delete own appointments"
      ON appointments
      FOR DELETE
      TO public
      USING (parent_email = auth.email() OR auth.email() = 'admin@example.com');
  END IF;

  -- Check if the policy exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'Administrators can manage all appointments'
  ) THEN
    -- Administrators can manage all appointments
    CREATE POLICY "Administrators can manage all appointments"
      ON appointments
      FOR ALL
      TO authenticated
      USING (auth.email() = 'admin@example.com');
  END IF;
END $$;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_appointments_parent_email ON appointments(parent_email);
CREATE INDEX IF NOT EXISTS idx_appointments_teacher_id ON appointments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_appointments_time_slot_id ON appointments(time_slot_id);