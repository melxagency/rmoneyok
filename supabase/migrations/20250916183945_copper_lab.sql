/*
  # Arreglar políticas RLS para provincias y municipios

  1. Políticas para tabla provincias
    - Permitir lectura a usuarios anónimos y autenticados
    - Permitir escritura solo a usuarios autenticados (admin)

  2. Políticas para tabla municipios  
    - Permitir lectura a usuarios anónimos y autenticados
    - Permitir escritura solo a usuarios autenticados (admin)

  3. Políticas para tabla servicios_municipios
    - Permitir lectura a usuarios anónimos y autenticados
    - Permitir escritura solo a usuarios autenticados (admin)
*/

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Allow read access to provinces" ON provincias;
DROP POLICY IF EXISTS "Allow admin write access to provinces" ON provincias;
DROP POLICY IF EXISTS "Allow read access to municipalities" ON municipios;
DROP POLICY IF EXISTS "Allow admin write access to municipalities" ON municipios;
DROP POLICY IF EXISTS "Allow read access to service availability" ON servicios_municipios;
DROP POLICY IF EXISTS "Allow admin write access to service availability" ON servicios_municipios;

-- Asegurar que RLS esté habilitado
ALTER TABLE provincias ENABLE ROW LEVEL SECURITY;
ALTER TABLE municipios ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicios_municipios ENABLE ROW LEVEL SECURITY;

-- Políticas para tabla provincias
CREATE POLICY "Allow read access to provinces"
  ON provincias
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow admin write access to provinces"
  ON provincias
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Políticas para tabla municipios
CREATE POLICY "Allow read access to municipalities"
  ON municipios
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow admin write access to municipalities"
  ON municipios
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Políticas para tabla servicios_municipios
CREATE POLICY "Allow read access to service availability"
  ON servicios_municipios
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow admin write access to service availability"
  ON servicios_municipios
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);