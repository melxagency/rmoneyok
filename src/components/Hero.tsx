import React from 'react';
import { Send, ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contacto');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="inicio" className="pt-20 bg-gradient-to-br from-green-50 to-white min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Envía remesas a <span className="text-[#00B871]">Cuba</span> de forma rápida y segura
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Con las mejores tasas de cambio y transferencias confiables. Tu familia en Cuba recibirá el dinero de manera segura y puntual.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={scrollToContact}
                className="group bg-[#00B871] text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-all duration-300 font-semibold text-lg shadow-lg flex items-center justify-center"
              >
                Enviar remesa
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => document.getElementById('proceso')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-[#00B871] text-[#00B871] px-8 py-4 rounded-lg hover:bg-[#00B871] hover:text-white transition-all duration-300 font-semibold text-lg"
              >
                Conocer proceso
              </button>
            </div>
          </div>
          
          <div className="relative animate-fade-in-delay">
            <div className="bg-white p-8 rounded-2xl shadow-2xl">
              <div className="flex items-center justify-center w-16 h-16 bg-[#00B871] rounded-full mb-6 mx-auto">
                <Send className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-4">
                Remesas confiables desde EE.UU. a Cuba
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-[#00B871] rounded-full mr-3"></div>
                  Transferencia inmediata
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-[#00B871] rounded-full mr-3"></div>
                  Seguimiento en tiempo real
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-[#00B871] rounded-full mr-3"></div>
                  Mejores tasas de cambio
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-[#00B871] rounded-full mr-3"></div>
                  Soporte 24/7
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;