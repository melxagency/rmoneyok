import { supabase } from './supabase';

export interface PaymentMethod {
  id_metodo: number;
  nombre: string;
  activo: boolean;
  created_at: string;
}

export const getAllPaymentMethods = async (): Promise<PaymentMethod[]> => {
  try {
    const { data, error } = await supabase
      .from('metodos_pago')
      .select('*')
      .eq('activo', true)
      .order('nombre', { ascending: true });

    if (error) {
      console.error('Error fetching payment methods:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
};