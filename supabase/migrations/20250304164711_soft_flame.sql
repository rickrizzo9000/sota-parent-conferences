/*
  # Create teachers table

  1. New Tables
    - `teachers`
      - `id` (integer, primary key)
      - `name` (text, not null)
      - `subject` (text, not null)
      - `created_at` (timestamp with time zone, default now())
  2. Security
    - Enable RLS on `teachers` table
    - Add policy for public to read teacher data
    - Add policy for administrators to manage teacher data
*/

-- Create teachers table if it doesn't exist
CREATE TABLE IF NOT EXISTS teachers (
  id integer PRIMARY KEY,
  name text NOT NULL,
  subject text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable row level security
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$
BEGIN
  -- Check if the policy exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'teachers' AND policyname = 'Anyone can read teachers'
  ) THEN
    -- Allow anyone to read teacher data
    CREATE POLICY "Anyone can read teachers"
      ON teachers
      FOR SELECT
      TO public
      USING (true);
  END IF;

  -- Check if the policy exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'teachers' AND policyname = 'Administrators can manage teachers'
  ) THEN
    -- Only administrators can manage teacher data
    CREATE POLICY "Administrators can manage teachers"
      ON teachers
      FOR ALL
      TO authenticated
      USING (auth.email() = 'admin@example.com');
  END IF;
END $$;