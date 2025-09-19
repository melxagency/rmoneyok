import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: '¿Cuánto tiempo tarda en llegar mi remesa a Cuba?',
      answer: 'Nuestras remesas son procesadas de forma inmediata. El dinero estará disponible para tu familia en Cuba en un máximo de 24 horas.'
    },
    {
      question: '¿Qué métodos de pago aceptan?',
      answer: 'Aceptamos Zelle, transferencias bancarias, efectivo en nuestras oficinas y tarjetas de crédito/débito. Todos los pagos son seguros y procesados con la máxima confidencialidad.'
    },
    {
      question: '¿Cómo puedo rastrear mi remesa?',
      answer: 'Una vez que tu remesa sea procesada, recibirás un número de seguimiento que te permitirá rastrear el estado de tu transferencia en tiempo real desde nuestra página web.'
    },
    {
      question: '¿En qué monedas puede recibir mi familia el dinero?',
      answer: 'Tu familia puede recibir el dinero en CUP (pesos cubanos), MLC (moneda libremente convertible), TC (tarjeta de crédito), USD o Euros en efectivo, según la oferta que elijas.'
    },
    {
      question: '¿Qué pasa si hay algún problema con mi remesa?',
      answer: 'Todas nuestras remesas están aseguradas. En el caso poco probable de algún problema, te reembolsaremos el valor total de la transferencia según nuestra póliza de garantía.'
    },
    {
      question: '¿Tienen oficinas físicas donde puedo realizar el envío?',
      answer: 'Sí, tenemos oficinas en Miami, Orlando y Tampa donde puedes realizar tus remesas en persona. También puedes enviar desde la comodidad de tu casa usando Zelle. Consulta nuestras ubicaciones en la sección de contacto.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Preguntas <span className="text-[#00B871]">Frecuentes</span>
          </h2>
          <p className="text-xl text-gray-600">
            Resolvemos las dudas más comunes sobre nuestros servicios de envío.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in-delay"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <button
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <Minus className="w-6 h-6 text-[#00B871] flex-shrink-0" />
                ) : (
                  <Plus className="w-6 h-6 text-[#00B871] flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            ¿No encontraste lo que buscabas?
          </p>
          <button
            onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-[#00B871] text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Contáctanos
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;