import { supabase } from './supabase';

export interface Lead {
  id: string;
  nombre_completo: string;
  email: string;
  telefono: string;
  mensaje: string;
  estado?: string;
  created_at: string;
}

export const createLead = async (leadData: {
  nombre_completo: string;
  email: string;
  telefono: string;
  mensaje: string;
}): Promise<Lead | null> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single();

    if (error) {
      console.error('Error creating lead:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error creating lead:', error);
    return null;
  }
};

export const getAllLeads = async (): Promise<Lead[]> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching leads:', error);
    return [];
  }
};

export const updateLeadStatus = async (id: string, estado: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('leads')
      .update({ estado })
      .eq('id', id);

    if (error) {
      console.error('Error updating lead status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating lead status:', error);
    return false;
  }
};