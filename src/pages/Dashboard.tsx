import React, { useState } from 'react';
import { useClientAuth } from '../context/ClientAuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Send, Users, MessageSquare, Star, Plus, Eye } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { isAuthenticated, client, logout } = useClientAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('remesas');

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/iniciar_sesion');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated || !client) {
    return null;
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
                <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">Bienvenido, {client.fullname}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#00B871] transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-lg shadow p-6">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveSection('remesas')}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeSection === 'remesas' 
                        ? 'bg-[#00B871] text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Send className="w-4 h-4 mr-3" />
                    Mis Remesas
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection('familiares')}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeSection === 'familiares' 
                        ? 'bg-[#00B871] text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Users className="w-4 h-4 mr-3" />
                    Familiares
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection('comentarios')}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeSection === 'comentarios' 
                        ? 'bg-[#00B871] text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 mr-3" />
                    Comentarios
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection('calificaciones')}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeSection === 'calificaciones' 
                        ? 'bg-[#00B871] text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Star className="w-4 h-4 mr-3" />
                    Calificar Servicio
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              {activeSection === 'remesas' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Mis Remesas</h2>
                    <button
                      onClick={() => navigate('/checkout')}
                      className="flex items-center px-4 py-2 bg-[#00B871] text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nueva Remesa
                    </button>
                  </div>
                  
                  <div className="text-center py-12">
                    <Send className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes remesas aún</h3>
                    <p className="text-gray-600 mb-4">Envía tu primera remesa a Cuba de forma rápida y segura</p>
                    <button
                      onClick={() => navigate('/checkout')}
                      className="bg-[#00B871] text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Enviar Primera Remesa
                    </button>
                  </div>
                </div>
              )}

              {activeSection === 'familiares' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Mis Familiares</h2>
                    <button className="flex items-center px-4 py-2 bg-[#00B871] text-white rounded-lg hover:bg-green-700 transition-colors">
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Familiar
                    </button>
                  </div>
                  
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes familiares registrados</h3>
                    <p className="text-gray-600 mb-4">Guarda la información de tus familiares para envíos más rápidos</p>
                    <button className="bg-[#00B871] text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Agregar Primer Familiar
                    </button>
                  </div>
                </div>
              )}

              {activeSection === 'comentarios' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Mis Comentarios</h2>
                    <button className="flex items-center px-4 py-2 bg-[#00B871] text-white rounded-lg hover:bg-green-700 transition-colors">
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Comentario
                    </button>
                  </div>
                  
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes comentarios</h3>
                    <p className="text-gray-600 mb-4">Comparte tu experiencia con nuestro servicio</p>
                    <button className="bg-[#00B871] text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Escribir Comentario
                    </button>
                  </div>
                </div>
              )}

              {activeSection === 'calificaciones' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Calificar Servicio</h2>
                  
                  <div className="text-center py-12">
                    <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Califica nuestro servicio</h3>
                    <p className="text-gray-600 mb-4">Tu opinión nos ayuda a mejorar</p>
                    <button className="bg-[#00B871] text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Calificar Ahora
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;