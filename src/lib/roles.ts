import { supabase } from './supabase';

export interface Role {
  id_role: number;
  name: string;
  created_at: string;
}

export interface RolePermission {
  id_permissions: number;
  role: string;
  administrar_usuarios: boolean;
  administrar_leads: boolean;
  Administrar_precios: boolean;
  created_at: string;
}

// Roles management
export const getAllRoles = async (): Promise<Role[]> => {
  try {
    const { data, error } = await supabase
      .from('users_role')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching roles:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching roles:', error);
    return [];
  }
};

export const createRole = async (name: string): Promise<Role | null> => {
  try {
    const { data, error } = await supabase
      .from('users_role')
      .insert([{ name }])
      .select()
      .single();

    if (error) {
      console.error('Error creating role:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error creating role:', error);
    return null;
  }
};

export const updateRole = async (id: number, name: string): Promise<Role | null> => {
  try {
    const { data, error } = await supabase
      .from('users_role')
      .update({ name })
      .eq('id_role', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating role:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error updating role:', error);
    return null;
  }
};

export const deleteRole = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('users_role')
      .delete()
      .eq('id_role', id);

    if (error) {
      console.error('Error deleting role:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting role:', error);
    return false;
  }
};

// Role permissions management
export const getAllRolePermissions = async (): Promise<RolePermission[]> => {
  try {
    const { data, error } = await supabase
      .from('role_permissions')
      .select('*')
      .order('role', { ascending: true });

    if (error) {
      console.error('Error fetching role permissions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching role permissions:', error);
    return [];
  }
};

export const createRolePermission = async (permissionData: {
  role: string;
  administrar_usuarios: boolean;
  administrar_leads: boolean;
  Administrar_precios: boolean;
}): Promise<RolePermission | null> => {
  try {
    const { data, error } = await supabase
      .from('role_permissions')
      .insert([permissionData])
      .select()
      .single();

    if (error) {
      console.error('Error creating role permission:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error creating role permission:', error);
    return null;
  }
};

export const updateRolePermission = async (
  id: number, 
  permissionData: {
    role?: string;
    administrar_usuarios?: boolean;
    administrar_leads?: boolean;
    Administrar_precios?: boolean;
  }
): Promise<RolePermission | null> => {
  try {
    const { data, error } = await supabase
      .from('role_permissions')
      .update(permissionData)
      .eq('id_permissions', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating role permission:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error updating role permission:', error);
    return null;
  }
};

export const deleteRolePermission = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('role_permissions')
      .delete()
      .eq('id_permissions', id);

    if (error) {
      console.error('Error deleting role permission:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting role permission:', error);
    return false;
  }
};

export const getRolePermissionByRole = async (roleName: string): Promise<RolePermission | null> => {
  try {
    const { data, error } = await supabase
      .from('role_permissions')
      .select('*')
      .eq('role', roleName)
      .single();

    if (error) {
      if (error.code !== 'PGRST116') { // Not found error
        console.error('Error fetching role permission:', error);
      }
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching role permission:', error);
    return null;
  }
};