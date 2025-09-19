import { supabase } from './supabase';

export interface Province {
  id_provincia: number;
  nombre: string;
  created_at: string;
}

export interface Municipality {
  id_municipio: number;
  nombre: string;
  provincia: string;
  created_at: string;
}

export interface ServiceAvailability {
  id_servicio: number;
  municipio: string;
  efectivo: boolean;
  transferencia: boolean;
  created_at: string;
}

export const getAllProvinces = async (): Promise<Province[]> => {
  try {
    console.log('🔍 Fetching provinces from Supabase table: provincias');
    console.log('🔗 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    
    const { data, error } = await supabase
      .from('provincias')
      .select('*')
      .order('nombre', { ascending: true });

    console.log('📊 Raw Supabase response - data:', data);
    console.log('📊 Raw Supabase response - error:', error);
    console.log('📊 Data type:', typeof data);
    console.log('📊 Data is array:', Array.isArray(data));
    
    if (data) {
      console.log('✅ Number of provinces loaded:', data.length);
      if (data.length > 0) {
        console.log('📋 First province example:', data[0]);
        data.forEach((province, index) => {
          console.log(`🏛️ Province ${index + 1}:`, province.nombre || 'NO NAME', `(ID: ${province.id_provincia})`);
        });
      } else {
        console.log('⚠️ No provinces found in database');
      }
    }

    if (error) {
      console.error('❌ Supabase error details:', error);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('💥 JavaScript error in getAllProvinces:', error);
    return [];
  }
};

export const getMunicipalitiesByProvince = async (provinciaName: string): Promise<Municipality[]> => {
  try {
    console.log('🏘️ Fetching municipalities for province:', provinciaName);
    const { data, error } = await supabase
      .from('municipios')
      .select('*')
      .eq('provincia', provinciaName)
      .order('nombre', { ascending: true });

    console.log('📊 Municipalities data received:', data);
    console.log('❌ Municipalities error (if any):', error);
    
    if (data) {
      console.log('✅ Number of municipalities loaded:', data.length);
      data.forEach((municipality, index) => {
        console.log(`Municipality ${index + 1}:`, municipality.nombre, `(ID: ${municipality.id_municipio})`);
      });
    }

    if (error) {
      console.error('Error fetching municipalities:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching municipalities:', error);
    return [];
  }
};

export const getServiceAvailability = async (municipioName: string): Promise<ServiceAvailability | null> => {
  try {
    const { data, error } = await supabase
      .from('servicios_municipios')
      .select('*')
      .eq('municipio', municipioName)
      .single();

    if (error) {
      if (error.code !== 'PGRST116') { // Not found error
        console.error('Error fetching service availability:', error);
      }
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching service availability:', error);
    return null;
  }
};