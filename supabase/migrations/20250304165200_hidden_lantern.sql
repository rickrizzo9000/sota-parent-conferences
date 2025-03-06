/*
  # Database schema for parent-teacher conference system

  1. Tables
    - `teachers` - Stores information about teachers
    - `appointments` - Stores conference appointments

  2. Security
    - Enable RLS on all tables
    - Create policies for proper access control
*/

-- Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id integer PRIMARY KEY,
  name text NOT NULL,
  subject text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id text PRIMARY KEY,
  teacher_id integer REFERENCES teachers(id),
  teacher_name text NOT NULL,
  teacher_subject text NOT NULL,
  parent_name text NOT NULL,
  parent_email text NOT NULL,
  student_name text NOT NULL,
  time_slot jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Policies for teachers table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'teachers' AND policyname = 'Anyone can read teachers'
  ) THEN
    CREATE POLICY "Anyone can read teachers"
      ON teachers
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'teachers' AND policyname = 'Administrators can manage teachers'
  ) THEN
    CREATE POLICY "Administrators can manage teachers"
      ON teachers
      FOR ALL
      TO authenticated
      USING (auth.email() = 'admin@example.com');
  END IF;
END $$;

-- Policies for appointments table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'Anyone can read appointments'
  ) THEN
    CREATE POLICY "Anyone can read appointments"
      ON appointments
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'Users can create their own appointments'
  ) THEN
    CREATE POLICY "Users can create their own appointments"
      ON appointments
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'Users can update their own appointments'
  ) THEN
    CREATE POLICY "Users can update their own appointments"
      ON appointments
      FOR UPDATE
      TO public
      USING (parent_email = auth.email())
      WITH CHECK (parent_email = auth.email());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'Users can delete their own appointments'
  ) THEN
    CREATE POLICY "Users can delete their own appointments"
      ON appointments
      FOR DELETE
      TO public
      USING (parent_email = auth.email());
  END IF;
END $$;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_appointments_parent_email ON appointments(parent_email);
CREATE INDEX IF NOT EXISTS idx_appointments_teacher_id ON appointments(teacher_id);