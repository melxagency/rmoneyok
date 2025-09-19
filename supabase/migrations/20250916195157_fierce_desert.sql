/*
  # Add email verification to clients table

  1. Changes
    - Add `email_verified` boolean column (default false)
    - Add `verification_token` text column for email verification
    - Add `verification_expires_at` timestamp for token expiration

  2. Security
    - Users cannot login until email is verified
    - Verification tokens expire after 24 hours
*/

DO $$
BEGIN
  -- Add email verification columns if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clientes' AND column_name = 'email_verified'
  ) THEN
    ALTER TABLE clientes ADD COLUMN email_verified boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clientes' AND column_name = 'verification_token'
  ) THEN
    ALTER TABLE clientes ADD COLUMN verification_token text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clientes' AND column_name = 'verification_expires_at'
  ) THEN
    ALTER TABLE clientes ADD COLUMN verification_expires_at timestamptz;
  END IF;
END $$;