import React, { useState, useEffect } from 'react';
import { useClientAuth } from '../context/ClientAuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, ArrowLeft, Mail, RefreshCw } from 'lucide-react';
import { resendVerificationEmail } from '../lib/clients';

const ClientLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [email, setEmail] = useState('');
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const { login, isAuthenticated } = useClientAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowEmailVerification(false);

    login(username, password).then((success) => {
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Credenciales incorrectas. Verifica tu usuario y contraseña.');
      }
    }).catch((error) => {
      if (error.message === 'EMAIL_NOT_VERIFIED') {
        setShowEmailVerification(true);
        setError('');
      } else {
        setError('Error durante el login. Intenta nuevamente.');
      }
    });
  };

  const handleResendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setResendingEmail(true);
    setResendMessage('');

    try {
      const success = await resendVerificationEmail(email);
      if (success) {
        setResendMessage('¡Correo de verificación enviado! Revisa tu bandeja de entrada.');
      } else {
        setResendMessage('Error al enviar el correo. Verifica que el email sea correcto.');
      }
    } catch (error) {
      setResendMessage('Error al enviar el correo. Intenta nuevamente.');
    } finally {
      setResendingEmail(false);
    }
  };

  if (showEmailVerification) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8">
          <div>
            <button
              onClick={() => setShowEmailVerification(false)}
              className="flex items-center text-[#00B871] hover:text-green-700 mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al login
            </button>
            <div className="text-center">
              <img
                src="/logo png.png"
                alt="RMoney Logo"
                className="mx-auto h-24 w-auto mb-4"
              />
              <Mail className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifica tu correo</h2>
              <p className="text-sm text-gray-600 mb-6">
                Tu cuenta no está activada. Necesitas verificar tu correo electrónico antes de poder iniciar sesión.
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              Si no recibiste el correo de verificación, puedes solicitar uno nuevo ingresando tu email.
            </p>
          </div>

          <form onSubmit={handleResendEmail} className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B871] focus:border-[#00B871]"
                  placeholder="Tu correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {resendMessage && (
              <div className={`rounded-md p-4 ${
                resendMessage.includes('Error') 
                  ? 'bg-red-50 text-red-800' 
                  : 'bg-green-50 text-green-800'
              }`}>
                <div className="text-sm">{resendMessage}</div>
              </div>
            )}

            <button
              type="submit"
              disabled={resendingEmail}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#00B871] hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00B871] transition-colors disabled:opacity-50"
            >
              {resendingEmail ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Reenviar correo de verificación'
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link to="/registrar" className="font-medium text-[#00B871] hover:text-green-700">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-[#00B871] hover:text-green-700 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </button>
          <div className="text-center">
            <img
              src="/logo png.png"
              alt="RMoney Logo"
              className="mx-auto h-32 w-auto mb-4"
            />
            <h2 className="text-3xl font-bold text-gray-900">Iniciar Sesión</h2>
            <p className="mt-2 text-sm text-gray-600">Accede a tu cuenta de cliente</p>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">Usuario</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B871] focus:border-[#00B871]"
                  placeholder="Nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B871] focus:border-[#00B871]"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#00B871] hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00B871] transition-colors"
            >
              Iniciar Sesión
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link to="/registrar" className="font-medium text-[#00B871] hover:text-green-700">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientLogin;