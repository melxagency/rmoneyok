import { supabase } from './supabase';
import bcrypt from 'bcryptjs';

export interface Client {
  id: string;
  fullname: string;
  email: string;
  contacto: string;
  username: string;
  password: string;
  email_verified: boolean;
  verification_token?: string;
  verification_expires_at?: string;
  created_at: string;
}

// Generate a random verification token
const generateVerificationToken = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Send verification email
const sendVerificationEmail = async (email: string, fullname: string, verificationToken: string): Promise<boolean> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-verification-email`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        fullname,
        verificationToken
      })
    });

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

export const registerClient = async (clientData: {
  fullname: string;
  email: string;
  contacto: string;
  username: string;
  password: string;
}): Promise<Client | null> => {
  try {
    // Hash the password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(clientData.password, saltRounds);
    
    // Generate verification token and expiration (24 hours from now)
    const verificationToken = generateVerificationToken();
    const verificationExpiresAt = new Date();
    verificationExpiresAt.setHours(verificationExpiresAt.getHours() + 24);
    
    const { data, error } = await supabase
      .from('clientes')
      .insert([
        {
          fullname: clientData.fullname,
          email: clientData.email,
          contacto: clientData.contacto,
          username: clientData.username,
          password: hashedPassword,
          email_verified: false,
          verification_token: verificationToken,
          verification_expires_at: verificationExpiresAt.toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error registering client:', error);
      return null;
    }

    // Send verification email
    const emailSent = await sendVerificationEmail(clientData.email, clientData.fullname, verificationToken);
    if (!emailSent) {
      console.warn('Failed to send verification email, but user was created');
    }

    return data;
  } catch (error) {
    console.error('Error registering client:', error);
    return null;
  }
};

export const authenticateClient = async (username: string, password: string): Promise<Client | null> => {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('username', username);

    if (error || !data || data.length === 0) {
      return null;
    }

    const client = data[0];

    // Check if email is verified
    if (!client.email_verified) {
      throw new Error('EMAIL_NOT_VERIFIED');
    }

    // Check if password is already hashed
    const isHashed = client.password.startsWith('$2a$') || client.password.startsWith('$2b$') || client.password.startsWith('$2y$');
    
    let isPasswordValid = false;
    
    if (isHashed) {
      // Compare with bcrypt for hashed passwords
      isPasswordValid = await bcrypt.compare(password, client.password);
    } else {
      // Direct comparison for plain text passwords (for backward compatibility)
      isPasswordValid = password === client.password;
      
      // If login is successful with plain text, hash the password for future use
      if (isPasswordValid) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        await supabase
          .from('clientes')
          .update({ password: hashedPassword })
          .eq('id', client.id);
      }
    }
    
    if (!isPasswordValid) {
      return null;
    }

    return client;
  } catch (error) {
    console.error('Error authenticating client:', error);
    if (error instanceof Error && error.message === 'EMAIL_NOT_VERIFIED') {
      throw error;
    }
    return null;
  }
};

export const verifyEmail = async (token: string): Promise<boolean> => {
  try {
    console.log('🔍 Verifying email with token:', token);
    
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('verification_token', token)
      .single();

    console.log('📊 Verification query result:', { data, error });

    if (error || !data) {
      console.log('❌ No user found with this token');
      return false;
    }

    // Check if token has expired
    const now = new Date();
    const expiresAt = new Date(data.verification_expires_at);
    
    console.log('⏰ Token expiration check:', { now, expiresAt, expired: now > expiresAt });
    
    if (now > expiresAt) {
      console.log('⚠️ Token has expired');
      return false;
    }

    // Update user as verified
    const { error: updateError } = await supabase
      .from('clientes')
      .update({
        email_verified: true,
        verification_token: null,
        verification_expires_at: null
      })
      .eq('id_cliente', data.id_cliente);

    console.log('✅ Update result:', { updateError });
    
    return !updateError;
  } catch (error) {
    console.error('Error verifying email:', error);
    return false;
  }
};

export const resendVerificationEmail = async (email: string): Promise<boolean> => {
  try {
    console.log('📧 Resending verification email to:', email);
    
    // Get user by email
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('email', email)
      .single();

    console.log('👤 User lookup result:', { data, error });

    if (error || !data) {
      console.log('❌ User not found');
      return false;
    }

    // If already verified, return false
    if (data.email_verified) {
      console.log('✅ User already verified');
      return false;
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    const verificationExpiresAt = new Date();
    verificationExpiresAt.setHours(verificationExpiresAt.getHours() + 24);

    console.log('🔄 Updating user with new token:', verificationToken);

    // Update user with new token
    const { error: updateError } = await supabase
      .from('clientes')
      .update({
        verification_token: verificationToken,
        verification_expires_at: verificationExpiresAt.toISOString()
      })
      .eq('id_cliente', data.id_cliente);

    console.log('📝 Token update result:', { updateError });

    if (updateError) {
      return false;
    }

    // Send verification email
    return await sendVerificationEmail(data.email, data.fullname, verificationToken);
  } catch (error) {
    console.error('Error resending verification email:', error);
    return false;
  }
};