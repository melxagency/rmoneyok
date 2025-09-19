import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Mail, Eye, Home } from 'lucide-react';

const RemesaExitosa: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const trackingLink = searchParams.get('link');
  const email = searchParams.get('email');

  const handleTrackOrder = () => {
    if (trackingLink) {
      navigate(`/seguimiento/${trackingLink}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Remesa Enviada Exitosamente!
          </h1>
          <p className="text-lg text-gray-600">
            Tu solicitud de remesa ha sido procesada correctamente
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-green-800 mb-4">
            ¿Qué sigue ahora?
          </h2>
          <div className="space-y-3 text-left">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <p className="text-green-700">
                <strong>Contacto inmediato:</strong> En breve nos pondremos en contacto contigo para coordinar el método de pago.
              </p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <p className="text-green-700">
                <strong>Seguimiento por email:</strong> Hemos enviado un correo a <strong>{email}</strong> con un enlace para rastrear tu remesa.
              </p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <p className="text-green-700">
                <strong>Enlace válido por 72 horas:</strong> Podrás consultar el estado de tu remesa durante las próximas 72 horas.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <Mail className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <h3 className="font-semibold text-blue-900 mb-2">
            Revisa tu correo electrónico
          </h3>
          <p className="text-sm text-blue-800">
            Te hemos enviado toda la información de seguimiento a tu email. 
            Si no lo encuentras, revisa tu carpeta de spam.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {trackingLink && (
            <button
              onClick={handleTrackOrder}
              className="flex items-center justify-center px-6 py-3 bg-[#00B871] text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              <Eye className="w-5 h-5 mr-2" />
              Ver Estado de Remesa
            </button>
          )}
          
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            <Home className="w-5 h-5 mr-2" />
            Volver al Inicio
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>¿Necesitas ayuda? Contáctanos al +1 (786) 883-0056</p>
        </div>
      </div>
    </div>
  );
};

export default RemesaExitosa;