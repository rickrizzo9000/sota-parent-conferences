/*
  # Fix for teachers table policies

  This migration ensures the policies for the teachers table are created correctly
  without causing duplicate policy errors.
  
  1. Changes
    - Uses DO blocks with IF NOT EXISTS checks to prevent duplicate policy creation
    - Maintains the same security model as the original migration
*/

-- Use DO blocks with IF NOT EXISTS checks to prevent duplicate policy errors
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

-- Only administrators can manage teacher data
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