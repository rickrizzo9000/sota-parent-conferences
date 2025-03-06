-- Create teachers table
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
    SELECT 1 FROM pg_policies WHERE tablename = 'teachers' AND policyname = 'Anyone can insert teachers'
  ) THEN
    -- Allow anyone to insert teacher data (needed for seeding)
    CREATE POLICY "Anyone can insert teachers"
      ON teachers
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;

  -- Check if the policy exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'teachers' AND policyname = 'Administrators can manage teachers'
  ) THEN
    -- Only administrators can update or delete teacher data
    CREATE POLICY "Administrators can manage teachers"
      ON teachers
      FOR UPDATE
      TO authenticated
      USING (auth.email() = 'admin@example.com');
  END IF;
END $$;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_teachers_name ON teachers(name);