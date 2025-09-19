/*
  # Fix admin user password

  1. Updates
    - Update admin user with correctly hashed password for "admin"
    - Ensure the hash is properly generated with bcrypt
*/

-- First, let's update the admin user with a properly hashed password
-- This hash corresponds to the password "admin" hashed with bcrypt
UPDATE users 
SET password = '$2a$10$N9qo8uLOickgx2ZMRZoMye.IcnJgRnOXinPwwUW0So7BqiDuW2eMy'
WHERE username = 'admin';

-- If the admin user doesn't exist, create it
INSERT INTO users (username, fullname, password, rol)
SELECT 'admin', 'Administrador', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IcnJgRnOXinPwwUW0So7BqiDuW2eMy', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');