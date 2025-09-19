import React from 'react';
import { User, Users, Eye, MessageSquare, Gift, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LoginBenefits: React.FC = () => {
  const benefits = [
    {
      icon: User,
      title: 'Mayor facilidad de envío',
      description: 'Formularios pre-llenados con tu información personal para envíos más rápidos.'
    },
    {
      icon: Users,
      title: 'Registro de familiares',
      description: 'Guarda la información de tus familiares para llenado automático del formulario.'
    },
    {
      icon: Eye,
      title: 'Control de remesas',
      description: 'Visualiza todas tus remesas realizadas y su estado en tiempo real.'
    },
    {
      icon: MessageSquare,
      title: 'Comentarios y sugerencias',
      description: 'Envía comentarios, quejas y sugerencias directamente desde tu cuenta.'
    },
    {
      icon: Gift,
      title: 'Ofertas exclusivas',
      description: 'Recibe ofertas especiales y promociones exclusivas para usuarios registrados.'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ¿Por qué <span className="text-[#00B871]">registrarte</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Crea tu cuenta gratuita y disfruta de beneficios exclusivos que harán tus envíos más fáciles y convenientes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group animate-fade-in-delay"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#00B871] to-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <benefit.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¡Únete a miles de familias satisfechas!
            </h3>
            <p className="text-gray-600 mb-6">
              Registrarte es gratis y solo toma 2 minutos. Comienza a disfrutar de todos estos beneficios hoy mismo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/registrar"
                className="group bg-gradient-to-r from-[#00B871] to-green-600 text-white px-8 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 font-semibold shadow-lg flex items-center justify-center"
              >
                Crear cuenta gratis
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/iniciar_sesion"
                className="border-2 border-[#00B871] text-[#00B871] px-8 py-3 rounded-lg hover:bg-[#00B871] hover:text-white transition-all duration-300 font-semibold"
              >
                Ya tengo cuenta
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginBenefits;