/*
  # Create leads table

  1. New Tables
    - `leads`
      - `id` (uuid, primary key)
      - `nombre_completo` (text, required)
      - `email` (text, required)
      - `telefono` (text, required)
      - `mensaje` (text, required)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `leads` table
    - Add policy for authenticated users to read leads
    - Add policy for anonymous users to insert leads
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_completo text NOT NULL,
  email text NOT NULL,
  telefono text NOT NULL,
  mensaje text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert leads (for contact form)
CREATE POLICY "Allow anonymous insert to leads"
  ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read all leads (for admin panel)
CREATE POLICY "Allow authenticated read leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (true);