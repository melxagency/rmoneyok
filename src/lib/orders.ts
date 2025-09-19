import { supabase } from './supabase';

export interface RemittanceOrder {
  id_pedido: number;
  oferta: number;
  created_at: string;
  fullname_remitente: string;
  correo_remitente: string;
  numero_remitente: number;
  pais_remitente?: string;
  fullname_receptor: string;
  carnet_receptor: number;
  contacto_receptor: number;
  provincia: string;
  municipio: string;
  direccion: string;
  detalles?: string;
  metodo_cobro: string;
  moneda: string;
  importe: number;
  importe_cobrar?: number;
  referencia_pago?: string;
  metodo_pago?: string;
  estado: string;
  tarjeta?: string;
  link?: string;
}

export const createRemittanceOrder = async (orderData: {
  fullname_remitente: string;
  correo_remitente: string;
  numero_remitente: string;
  pais_remitente?: string;
  fullname_receptor: string;
  carnet_receptor: string;
  contacto_receptor: string;
  provincia: string;
  municipio: string;
  direccion: string;
  detalles?: string;
  metodo_cobro: string;
  moneda: string;
  importe: number;
  oferta_seleccionada: string;
  importe_cobrar: number;
  tarjeta?: string;
}): Promise<RemittanceOrder | null> => {
  try {
    // Map offer name to number
    const ofertaMap: { [key: string]: number } = {
      'Oferta 1': 1,
      'Oferta 2': 2,
      'Oferta 3': 3,
      'Envío Personalizado': 4
    };

    const ofertaNumber = ofertaMap[orderData.oferta_seleccionada] || 4;

    const { data, error } = await supabase
      .from('pedidos_directos_remesas')
      .insert([{
        oferta: ofertaNumber,
        fullname_remitente: orderData.fullname_remitente,
        correo_remitente: orderData.correo_remitente,
        numero_remitente: parseInt(orderData.numero_remitente.toString()),
        fullname_receptor: orderData.fullname_receptor,
        carnet_receptor: parseInt(orderData.carnet_receptor.toString()),
        contacto_receptor: parseInt(orderData.contacto_receptor.toString()),
        provincia: orderData.provincia,
        municipio: orderData.municipio,
        direccion: orderData.direccion,
        detalles: orderData.detalles || '',
        metodo_cobro: orderData.metodo_cobro,
        moneda: orderData.moneda,
        importe: orderData.importe,
        importe_cobrar: orderData.importe_cobrar,
        tarjeta: orderData.tarjeta,
        estado: 'pendiente'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating remittance order:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error creating remittance order:', error);
    return null;
  }
};

// Generate tracking link
const generateTrackingLink = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const createRemittanceOrderWithLink = async (orderData: {
  fullname_remitente: string;
  correo_remitente: string;
  numero_remitente: string;
  pais_remitente?: string;
  fullname_receptor: string;
  carnet_receptor: string;
  contacto_receptor: string;
  provincia: string;
  municipio: string;
  direccion: string;
  detalles?: string;
  metodo_cobro: string;
  moneda: string;
  importe: number;
  oferta_seleccionada: string;
  importe_cobrar: number;
  tarjeta?: string;
}): Promise<{ order: RemittanceOrder | null, trackingLink: string }> => {
  try {
    const trackingLink = generateTrackingLink();
    
    // Map offer name to number
    const ofertaMap: { [key: string]: number } = {
      'Oferta 1': 1,
      'Oferta 2': 2,
      'Oferta 3': 3,
      'Envío Personalizado': 4
    };

    const ofertaNumber = ofertaMap[orderData.oferta_seleccionada] || 4;

    const { data, error } = await supabase
      .from('pedidos_directos_remesas')
      .insert([{
        oferta: ofertaNumber,
        fullname_remitente: orderData.fullname_remitente,
        correo_remitente: orderData.correo_remitente,
        numero_remitente: parseInt(orderData.numero_remitente.toString()),
        fullname_receptor: orderData.fullname_receptor,
        carnet_receptor: parseInt(orderData.carnet_receptor.toString()),
        contacto_receptor: parseInt(orderData.contacto_receptor.toString()),
        provincia: orderData.provincia,
        municipio: orderData.municipio,
        direccion: orderData.direccion,
        detalles: orderData.detalles || '',
        metodo_cobro: orderData.metodo_cobro,
        moneda: orderData.moneda,
        importe: orderData.importe,
        importe_cobrar: orderData.importe_cobrar,
        tarjeta: orderData.tarjeta,
        link: trackingLink,
        estado: 'pendiente'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating remittance order:', error);
      return { order: null, trackingLink: '' };
    }

    return { order: data, trackingLink };
  } catch (error) {
    console.error('Error creating remittance order:', error);
    return { order: null, trackingLink: '' };
  }
};

export const getOrderByTrackingLink = async (link: string): Promise<RemittanceOrder | null> => {
  try {
    const { data, error } = await supabase
      .from('pedidos_directos_remesas')
      .select('*')
      .eq('link', link)
      .single();

    if (error) {
      console.error('Error fetching order by link:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching order by link:', error);
    return null;
  }
};

export const getAllRemittanceOrders = async (): Promise<RemittanceOrder[]> => {
  try {
    const { data, error } = await supabase
      .from('pedidos_directos_remesas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching remittance orders:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching remittance orders:', error);
    return [];
  }
};

export const updateRemittanceOrderPayment = async (
  id: number, 
  metodo_pago: string, 
  referencia_pago: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('pedidos_directos_remesas')
      .update({ 
        metodo_pago,
        referencia_pago 
      })
      .eq('id_pedido', id);

    if (error) {
      console.error('Error updating payment info:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating payment info:', error);
    return false;
  }
};
export const updateRemittanceOrderStatus = async (id: number, estado: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('pedidos_directos_remesas')
      .update({ estado })
      .eq('id_pedido', id);

    if (error) {
      console.error('Error updating remittance order status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating remittance order status:', error);
    return false;
  }
}