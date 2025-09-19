import React from 'react';
import { Zap, DollarSign, HeadphonesIcon, MapPin } from 'lucide-react';

const Benefits: React.FC = () => {
  const benefits = [
    {
      icon: Zap,
      title: 'Rápido y confiable',
      description: 'Transferencias inmediatas con la máxima seguridad y confiabilidad.'
    },
    {
      icon: DollarSign,
      title: 'Mejores tarifas',
      description: 'Las mejores tasas de cambio del mercado. Sin comisiones ocultas ni sorpresas.'
    },
    {
      icon: HeadphonesIcon,
      title: 'Atención personalizada',
      description: 'Soporte 24/7 en español. Te acompañamos en todo el proceso.'
    },
    {
      icon: MapPin,
      title: 'Seguimiento en tiempo real',
      description: 'Rastrea tu remesa en cada paso del camino hasta su destino final.'
    }
  ];

  return (
    <section id="proceso" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ¿Por qué elegir <span className="text-[#00B871]">RMoney</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ofrecemos el mejor servicio de remesas a Cuba con la confianza y seguridad que tu familia merece.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 group animate-fade-in-delay"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#00B871] transition-colors duration-300">
                <benefit.icon className="w-8 h-8 text-[#00B871] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;