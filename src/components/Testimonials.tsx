import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'María González',
      location: 'Miami, FL',
      rating: 5,
      comment: 'Excelente servicio! Mi familia en La Habana recibió el paquete en tiempo record. Muy recomendado.',
      comment: 'Excelente servicio! Mi familia en La Habana recibió la remesa en tiempo record. Muy recomendado.',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: 'Carlos Rodríguez',
      location: 'Orlando, FL',
      rating: 5,
      comment: 'Llevaba años buscando un servicio confiable. RMoney superó todas mis expectativas. Precios justos y entrega puntual.',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: 'Ana Martínez',
      location: 'Tampa, FL',
      rating: 5,
      comment: 'El seguimiento en tiempo real me dio mucha tranquilidad. Mi madre recibió sus medicinas sin problemas.',
      image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    }
  ];

  return (
    <section id="testimonios" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Lo que dicen nuestros <span className="text-[#00B871]">clientes</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Miles de familias confían en nosotros para enviar remesas a Cuba de forma segura.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative animate-fade-in-delay"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-[#00B871] opacity-20" />
              
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.location}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-gray-700 italic leading-relaxed">
                "{testimonial.comment}"
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00B871] mb-2">10,000+</div>
              <div className="text-gray-600">Remesas enviadas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00B871] mb-2">98%</div>
              <div className="text-gray-600">Satisfacción</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00B871] mb-2">24</div>
              <div className="text-gray-600">Horas máximo</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00B871] mb-2">24/7</div>
              <div className="text-gray-600">Soporte</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;