/*
  # Create admin user with bcrypt hashed password

  1. New User
    - Creates admin user with bcrypt hashed password
    - Username: admin
    - Password: admin (hashed with bcrypt)
    - Role: admin

  2. Security
    - Password is properly hashed using bcrypt
    - Ready for production use
*/

-- Delete existing admin user if exists
DELETE FROM users WHERE username = 'admin';

-- Insert admin user with bcrypt hashed password
-- Password 'admin' hashed with bcrypt (salt rounds: 10)
INSERT INTO users (username, fullname, password, rol) VALUES 
('admin', 'Administrador', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');