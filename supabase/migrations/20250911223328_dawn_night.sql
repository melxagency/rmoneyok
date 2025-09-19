/*
  # Configure RLS policies for users table

  1. Security
    - Enable RLS on users table
    - Add policy to allow reading all users (for authentication)
    - Add policy to allow inserting users
    - Add policy to allow updating users
    - Add policy to allow deleting users

  Note: These policies are permissive for admin functionality.
  In production, you may want to restrict based on user roles.
*/

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy to allow reading all users
CREATE POLICY "Allow read access to users"
  ON users
  FOR SELECT
  USING (true);

-- Policy to allow inserting users
CREATE POLICY "Allow insert access to users"
  ON users
  FOR INSERT
  WITH CHECK (true);

-- Policy to allow updating users
CREATE POLICY "Allow update access to users"
  ON users
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy to allow deleting users
CREATE POLICY "Allow delete access to users"
  ON users
  FOR DELETE
  USING (true);