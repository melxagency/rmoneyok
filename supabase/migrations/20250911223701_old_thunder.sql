/*
  # Create simple admin user without encryption

  1. New Users
    - Insert admin user with plain text password
  2. Security
    - Simple authentication without bcrypt
*/

-- Insert admin user with plain text password
INSERT INTO users (username, fullname, password, rol) 
VALUES ('admin', 'Administrador', 'admin', 'admin')
ON CONFLICT (username) DO UPDATE SET
  fullname = EXCLUDED.fullname,
  password = EXCLUDED.password,
  rol = EXCLUDED.rol;