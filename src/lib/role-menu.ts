import { supabase } from './supabase';

export interface RoleMenu {
  id_role_menu: number;
  role: string;
  captacion: boolean;
  administracion: boolean;
  reportes: boolean;
  configuracion: boolean;
  created_at: string;
}

export const getRoleMenuByRole = async (roleName: string): Promise<RoleMenu | null> => {
  try {
    console.log('🔍 Fetching role menu for role:', roleName);
    
    const { data, error } = await supabase
      .from('role_menu')
      .select('*')
      .eq('role', roleName)
      .single();

    console.log('📊 Role menu query result:', { data, error });

    if (error) {
      if (error.code !== 'PGRST116') { // Not found error
        console.error('Error fetching role menu:', error);
      }
      console.log('⚠️ No role menu found for role:', roleName);
      return null;
    }

    console.log('✅ Role menu found:', data);
    return data;
  } catch (error) {
    console.error('Error fetching role menu:', error);
    return null;
  }
};