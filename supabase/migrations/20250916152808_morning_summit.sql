/*
  # Create orders table for remittance orders

  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `nombre_completo` (text, full name)
      - `email` (text, email address)
      - `telefono_contacto` (text, contact phone)
      - `oferta_seleccionada` (text, selected offer)
      - `provincia` (text, province name)
      - `municipio` (text, municipality name)
      - `metodo_cobro` (text, payment method: efectivo/transferencia)
      - `moneda_cobro` (text, currency for payment)
      - `numero_familiar` (text, family member phone in Cuba)
      - `direccion` (text, address in Cuba)
      - `carnet_identidad` (text, ID card number)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `orders` table
    - Add policy for anonymous users to create orders
    - Add policy for authenticated users to read orders
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_completo text NOT NULL,
  email text NOT NULL,
  telefono_contacto text NOT NULL,
  oferta_seleccionada text NOT NULL,
  provincia text NOT NULL,
  municipio text NOT NULL,
  metodo_cobro text NOT NULL CHECK (metodo_cobro IN ('efectivo', 'transferencia')),
  moneda_cobro text NOT NULL,
  numero_familiar text NOT NULL,
  direccion text NOT NULL,
  carnet_identidad text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert to orders"
  ON orders
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (true);