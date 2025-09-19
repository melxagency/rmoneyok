import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <img
              src="/logo png.png"
              alt="RMoney Logo"
              className="h-24 w-auto mb-4"
            />
            <p className="text-gray-300 mb-6 max-w-md">
              Conectando familias a través del océano. Enviamos tus remesas a Cuba de forma rápida, 
              segura y confiable con las mejores tasas del mercado.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-[#00B871] transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-[#00B871] transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-[#00B871] transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => document.getElementById('inicio')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-300 hover:text-[#00B871] transition-colors"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('proceso')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-300 hover:text-[#00B871] transition-colors"
                >
                  Proceso
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('ofertas')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-300 hover:text-[#00B871] transition-colors"
                >
                  Ofertas
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('testimonios')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-300 hover:text-[#00B871] transition-colors"
                >
                  Testimonios
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-300 hover:text-[#00B871] transition-colors"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-[#00B871] mr-2" />
                <span className="text-gray-300">+1 (786) 883-0056</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-[#00B871] mr-2" />
                <span className="text-gray-300">info@rmoney.com</span>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-[#00B871] mr-2 mt-0.5" />
                <span className="text-gray-300">7155 Rue Notre Dame 4<br/>Miami Beach, FL 33141</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Horarios de Oficina</h4>
              <p className="text-sm text-gray-300">
                Lun - Vie: 9:00 AM - 6:00 PM<br/>
                Sáb: 9:00 AM - 2:00 PM<br/>
                Dom: Cerrado
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2024 RMoney. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-300 hover:text-[#00B871] text-sm transition-colors">
                Términos y Condiciones
              </a>
              <a href="#" className="text-gray-300 hover:text-[#00B871] text-sm transition-colors">
                Política de Privacidad
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;