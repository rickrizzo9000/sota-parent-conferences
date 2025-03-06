-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id text PRIMARY KEY,
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
    SELECT 1 FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'Anyone can update appointments'
  ) THEN
    -- Anyone can update appointments (we'll validate in the application)
    CREATE POLICY "Anyone can update appointments"
      ON appointments
      FOR UPDATE
      TO public
      USING (true);
  END IF;

  -- Check if the policy exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'Anyone can delete appointments'
  ) THEN
    -- Anyone can delete appointments (we'll validate in the application)
    CREATE POLICY "Anyone can delete appointments"
      ON appointments
      FOR DELETE
      TO public
      USING (true);
  END IF;
END $$;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_appointments_parent_email ON appointments(parent_email);
CREATE INDEX IF NOT EXISTS idx_appointments_teacher_id ON appointments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_appointments_time_slot_id ON appointments(time_slot_id);