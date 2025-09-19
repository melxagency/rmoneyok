import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, User, MapPin, CreditCard, Calendar, AlertTriangle, Home, X } from 'lucide-react';
import { getOrderByTrackingLink, RemittanceOrder } from '../lib/orders';

const SeguimientoRemesa: React.FC = () => {
  const { link } = useParams<{ link: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<RemittanceOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (link) {
      loadOrder();
    }
  }, [link]);

  const loadOrder = async () => {
    if (!link) return;
    
    setLoading(true);
    try {
      const orderData = await getOrderByTrackingLink(link);
      if (orderData) {
        setOrder(orderData);
      } else {
        setError('No se encontró la remesa o el enlace ha expirado.');
      }
    } catch (error) {
      setError('Error al cargar la información de la remesa.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'contactado': return 'bg-blue-100 text-blue-800';
      case 'cobrado': return 'bg-green-100 text-green-800';
      case 'entregado': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'Pendiente';
      case 'contactado': return 'Contactado';
      case 'cobrado': return 'Cobrado';
      case 'entregado': return 'Entregado';
      default: return estado;
    }
  };

  const handleCancelRequest = () => {
    setShowCancelModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B871] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información de la remesa...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Remesa no encontrada
          </h2>
          <p className="text-gray-600 mb-6">
            {error || 'El enlace de seguimiento no es válido o ha expirado.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#00B871] text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img
                src="/logo png.png"
                alt="RMoney Logo"
                className="h-12 w-auto mr-4"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Seguimiento de Remesa</h1>
                <p className="text-sm text-gray-600">Estado actual de tu transferencia</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-[#00B871] hover:text-green-700 transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Inicio
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-[#00B871] mr-3" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Remesa #{order.id_pedido}</h2>
                <p className="text-gray-600">Oferta {order.oferta}</p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(order.estado)}`}>
              {getStatusText(order.estado)}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Fecha de solicitud</p>
              <p className="font-semibold">{new Date(order.created_at).toLocaleDateString('es-ES')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Importe</p>
              <p className="font-semibold">${order.importe} USD → {order.importe_cobrar} {order.moneda.toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#00B871] to-green-600 text-white p-6">
            <h3 className="text-xl font-bold">Factura de Remesa</h3>
            <p className="opacity-90">Detalles completos de la transferencia</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Sender Info */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-center mb-4">
                <User className="w-5 h-5 text-[#00B871] mr-2" />
                <h4 className="text-lg font-semibold text-gray-900">Remitente</h4>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nombre completo</p>
                  <p className="font-medium">{order.fullname_remitente}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{order.correo_remitente}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Teléfono</p>
                  <p className="font-medium">{order.numero_remitente}</p>
                </div>
              </div>
            </div>

            {/* Receiver Info */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-center mb-4">
                <MapPin className="w-5 h-5 text-[#00B871] mr-2" />
                <h4 className="text-lg font-semibold text-gray-900">Receptor</h4>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nombre completo</p>
                  <p className="font-medium">{order.fullname_receptor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Carnet de identidad</p>
                  <p className="font-medium">{order.carnet_receptor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Teléfono</p>
                  <p className="font-medium">{order.contacto_receptor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ubicación</p>
                  <p className="font-medium">{order.provincia}, {order.municipio}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Dirección</p>
                  <p className="font-medium">{order.direccion}</p>
                </div>
                {order.detalles && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Detalles adicionales</p>
                    <p className="font-medium">{order.detalles}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Info */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-center mb-4">
                <CreditCard className="w-5 h-5 text-[#00B871] mr-2" />
                <h4 className="text-lg font-semibold text-gray-900">Información de Cobro</h4>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Método de cobro</p>
                  <p className="font-medium capitalize">{order.metodo_cobro}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Moneda</p>
                  <p className="font-medium">{order.moneda.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Importe a enviar</p>
                  <p className="font-medium">${order.importe} USD</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Importe a recibir</p>
                  <p className="font-medium">{order.importe_cobrar} {order.moneda.toUpperCase()}</p>
                </div>
                {order.tarjeta && (
                  <div>
                    <p className="text-sm text-gray-600">Tarjeta bancaria</p>
                    <p className="font-medium">{order.tarjeta}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <div className="flex items-center mb-4">
                <Calendar className="w-5 h-5 text-[#00B871] mr-2" />
                <h4 className="text-lg font-semibold text-gray-900">Estado de la Remesa</h4>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-center text-gray-600 mb-2">Estado actual:</p>
                <div className={`inline-block px-4 py-2 rounded-full font-semibold ${getStatusColor(order.estado)} mx-auto`}>
                  {getStatusText(order.estado)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleCancelRequest}
            className="flex items-center px-6 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-semibold"
          >
            <X className="w-5 h-5 mr-2" />
            Solicitar Cancelación
          </button>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Solicitar Cancelación
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas solicitar la cancelación de esta remesa? 
              Nos pondremos en contacto contigo para procesar tu solicitud.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Here you would implement the cancellation request logic
                  alert('Solicitud de cancelación enviada. Te contactaremos pronto.');
                  setShowCancelModal(false);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeguimientoRemesa;