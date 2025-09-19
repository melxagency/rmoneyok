/*
  # Add estado field to leads table

  1. Changes
    - Add `estado` column to leads table with default value 'pendiente'
    - This will allow tracking lead status (pendiente, contactado)

  2. Security
    - No changes to RLS policies needed
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'estado'
  ) THEN
    ALTER TABLE leads ADD COLUMN estado character varying DEFAULT 'pendiente';
  END IF;
END $$;