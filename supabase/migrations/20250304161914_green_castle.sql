/*
  # Create teachers table

  1. New Tables
    - `teachers`
      - `id` (integer, primary key)
      - `name` (text, not null)
      - `subject` (text, not null)
      - `created_at` (timestamptz, default now())
  2. Security
    - Enable RLS on `teachers` table
    - Add policy for authenticated users to read teacher data
    - Add policy for administrators to manage teacher data
*/

CREATE TABLE IF NOT EXISTS teachers (
  id integer PRIMARY KEY,
  name text NOT NULL,
  subject text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read teacher data
CREATE POLICY "Anyone can read teachers"
  ON teachers
  FOR SELECT
  TO public
  USING (true);

-- Only administrators can manage teacher data
CREATE POLICY "Administrators can manage teachers"
  ON teachers
  USING (auth.uid() IN (
    SELECT auth.uid() FROM auth.users WHERE auth.email() = 'admin@example.com'
  ));