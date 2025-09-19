import { supabase } from './supabase';
import bcrypt from 'bcryptjs';

export interface User {
  id_user: number;
  username: string;
  fullname: string;
  password: string;
  rol: string;
  created_at: string;
}

export const authenticateUser = async (username: string, password: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username);

    if (error || !data || data.length === 0) {
      return null;
    }

    const user = data[0];

    // Check if password is already hashed (starts with $2a$, $2b$, or $2y$)
    const isHashed = user.password.startsWith('$2a$') || user.password.startsWith('$2b$') || user.password.startsWith('$2y$');
    
    let isPasswordValid = false;
    
    if (isHashed) {
      // Compare with bcrypt for hashed passwords
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      // Direct comparison for plain text passwords (for backward compatibility)
      isPasswordValid = password === user.password;
      
      // If login is successful with plain text, hash the password for future use
      if (isPasswordValid) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        await supabase
          .from('users')
          .update({ password: hashedPassword })
          .eq('id_user', user.id_user);
      }
    }
    
    if (!isPasswordValid) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
};

export const createUser = async (userData: {
  username: string;
  fullname: string;
  password: string;
  rol: string;
}): Promise<User | null> => {
  try {
    // Hash the password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          username: userData.username,
          fullname: userData.fullname,
          password: hashedPassword, // Store hashed password
          rol: userData.rol
        }
      ])
      .select()
      .single();

    if (error) {
      return null;
    }

    return data;
  } catch (error) {
    return null;
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return [];
    }

    return data || [];
  } catch (error) {
    return [];
  }
};

export const updateUser = async (id: number, userData: {
  username?: string;
  fullname?: string;
  password?: string;
  rol?: string;
}): Promise<User | null> => {
  try {
    // If password is provided, hash it
    const updateData: any = {
      username: userData.username,
      fullname: userData.fullname,
      rol: userData.rol
    };
    
    if (userData.password && userData.password.trim()) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(userData.password, saltRounds);
    }
    
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id_user', id)
      .select()
      .single();

    if (error) {
      return null;
    }

    return data;
  } catch (error) {
    return null;
  }
};

export const deleteUser = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id_user', id);

    if (error) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};