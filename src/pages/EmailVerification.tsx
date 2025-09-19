import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { verifyEmail } from '../lib/clients';

const EmailVerification: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setVerificationStatus('error');
      setMessage('Token de verificación no válido.');
      return;
    }

    const verify = async () => {
      try {
        const success = await verifyEmail(token);
        
        if (success) {
          setVerificationStatus('success');
          setMessage('¡Tu cuenta ha sido activada exitosamente!');
        } else {
          setVerificationStatus('error');
          setMessage('El enlace de verificación ha expirado o no es válido.');
        }
      } catch (error) {
        setVerificationStatus('error');
        setMessage('Error al verificar la cuenta. Intenta nuevamente.');
      }
    };

    verify();
  }, [token]);

  const handleGoToLogin = () => {
    navigate('/iniciar_sesion');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <img
            src="/logo png.png"
            alt="RMoney Logo"
            className="h-16 w-auto mx-auto mb-4"
          />
        </div>
        
        <div className="mb-6">
          {verificationStatus === 'loading' && (
            <>
              <RefreshCw className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verificando cuenta...
              </h2>
              <p className="text-gray-600">
                Por favor espera mientras verificamos tu cuenta.
              </p>
            </>
          )}
          
          {verificationStatus === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Cuenta Activada!
              </h2>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-800">
                  Ya puedes iniciar sesión con tu cuenta y comenzar a enviar remesas a Cuba.
                </p>
              </div>
            </>
          )}
          
          {verificationStatus === 'error' && (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Error de Verificación
              </h2>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800">
                  Si el problema persiste, puedes solicitar un nuevo correo de verificación desde la página de inicio de sesión.
                </p>
              </div>
            </>
          )}
        </div>
        
        <div className="space-y-3">
          {verificationStatus === 'success' && (
            <button
              onClick={handleGoToLogin}
              className="w-full bg-[#00B871] text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Iniciar Sesión
            </button>
          )}
          
          <button
            onClick={handleGoHome}
            className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;