import React, { useState } from 'react';
import { Menu, X, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/logo png.png"
              alt="RMoney Logo"
              className="h-16 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('inicio')}
              className="text-gray-700 hover:text-[#00B871] font-medium transition-colors"
            >
              Inicio
            </button>
            <button
              onClick={() => scrollToSection('proceso')}
              className="text-gray-700 hover:text-[#00B871] font-medium transition-colors"
            >
              Proceso
            </button>
            <button
              onClick={() => scrollToSection('ofertas')}
              className="text-gray-700 hover:text-[#00B871] font-medium transition-colors"
            >
              Ofertas
            </button>
            <button
              onClick={() => scrollToSection('testimonios')}
              className="text-gray-700 hover:text-[#00B871] font-medium transition-colors"
            >
              Testimonios
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-gray-700 hover:text-[#00B871] font-medium transition-colors"
            >
              Preguntas Frecuentes
            </button>
            <button
              onClick={() => scrollToSection('contacto')}
              className="text-gray-700 hover:text-[#00B871] font-medium transition-colors"
            >
              Contacto
            </button>
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/iniciar_sesion"
              className="text-gray-700 hover:text-[#00B871] font-medium transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/registrar"
              className="border border-[#00B871] text-[#00B871] px-4 py-2 rounded-lg hover:bg-[#00B871] hover:text-white transition-colors font-medium"
            >
              Registrarse
            </Link>
            <button
              onClick={() => scrollToSection('ofertas')}
              className="bg-[#00B871] text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md"
            >
              Enviar remesa
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection('inicio')}
                className="text-left text-gray-700 hover:text-[#00B871] font-medium transition-colors"
              >
                Inicio
              </button>
              <button
                onClick={() => scrollToSection('proceso')}
                className="text-left text-gray-700 hover:text-[#00B871] font-medium transition-colors"
              >
                Proceso
              </button>
              <button
                onClick={() => scrollToSection('ofertas')}
                className="text-left text-gray-700 hover:text-[#00B871] font-medium transition-colors"
              >
                Ofertas
              </button>
              <button
                onClick={() => scrollToSection('testimonios')}
                className="text-left text-gray-700 hover:text-[#00B871] font-medium transition-colors"
              >
                Testimonios
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-left text-gray-700 hover:text-[#00B871] font-medium transition-colors"
              >
                Preguntas Frecuentes
              </button>
              <button
                onClick={() => scrollToSection('ofertas')}
                className="text-left text-gray-700 hover:text-[#00B871] font-medium transition-colors"
              >
                Contacto
              </button>
              <div className="flex flex-col space-y-3 pt-4">
                <Link
                  to="/iniciar_sesion"
                  className="text-left text-gray-700 hover:text-[#00B871] font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registrar"
                  className="border border-[#00B871] text-[#00B871] px-4 py-2 rounded-lg hover:bg-[#00B871] hover:text-white transition-colors font-medium w-fit"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Registrarse
                </Link>
                <button
                  onClick={() => scrollToSection('contacto')}
                  className="bg-[#00B871] text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md w-fit"
                >
                  Enviar remesa
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;