import React, { useState } from 'react';
import { Check, DollarSign, Send } from 'lucide-react';

const Pricing: React.FC = () => {
  const offers = [
    {
      name: 'Oferta 1',
      zelle: '$110',
      description: 'Ideal para remesas pequeñas',
      efectivo: {
        euros: '80',
        usd: '100',
        cup: '40,500'
      },
      transferencia: {
        cup: '40,800',
        mlc: '213',
        tc: '100'
      },
      comision: '10%',
      comisionUsd: '$10',
      popular: false
    },
    {
      name: 'Oferta 2',
      zelle: '$220',
      description: 'La opción más popular',
      efectivo: {
        euros: '160',
        usd: '200',
        cup: '81,000'
      },
      transferencia: {
        cup: '81,600',
        mlc: '426',
        tc: '200'
      },
      comision: '10%',
      comisionUsd: '$20',
      popular: true
    },
    {
      name: 'Oferta 3',
      zelle: '$324',
      description: 'Para remesas grandes',
      efectivo: {
        euros: '240',
        usd: '300',
        cup: '121,500'
      },
      transferencia: {
        cup: '122,400',
        mlc: '639',
        tc: '300'
      },
      comision: '8%',
      comisionUsd: '$24',
      popular: false
    }
  ];

  const [customAmount, setCustomAmount] = useState('');
  const [customCalculation, setCustomCalculation] = useState<{
    efectivo: { euros: string, usd: string, cup: string },
    transferencia: { cup: string, mlc: string, tc: string }
  } | null>(null);

  // Tasas de cambio base (usando Oferta 2 como referencia: $220 = valores base)
  const baseRates = {
    efectivo: {
      euros: 160 / 220, // 0.727
      usd: 200 / 220,   // 0.909
      cup: 81000 / 220  // 368.18
    },
    transferencia: {
      cup: 81600 / 220, // 370.91
      mlc: 426 / 220,   // 1.936
      tc: 200 / 220     // 0.909
    }
  };

  const calculateCustomAmount = (usdAmount: string) => {
    const amount = parseFloat(usdAmount);
    if (isNaN(amount) || amount <= 0) {
      setCustomCalculation(null);
      return;
    }

    const calculation = {
      efectivo: {
        euros: Math.round(amount * baseRates.efectivo.euros).toString(),
        usd: Math.round(amount * baseRates.efectivo.usd).toString(),
        cup: Math.round(amount * baseRates.efectivo.cup).toLocaleString()
      },
      transferencia: {
        cup: Math.round(amount * baseRates.transferencia.cup).toLocaleString(),
        mlc: Math.round(amount * baseRates.transferencia.mlc).toString(),
        tc: Math.round(amount * baseRates.transferencia.tc).toString()
      }
    };

    setCustomCalculation(calculation);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    calculateCustomAmount(value);
  };

  const handleCustomCheckout = () => {
    if (customAmount && customCalculation) {
      const customOfferData = {
        name: 'Envío Personalizado',
        zelle: `$${customAmount}`,
        efectivo: customCalculation.efectivo,
        transferencia: customCalculation.transferencia
      };
      
      // Store custom offer data in localStorage for checkout
      localStorage.setItem('customOffer', JSON.stringify(customOfferData));
      window.location.href = `/checkout?offer=${encodeURIComponent('Envío Personalizado')}`;
    }
  };
  const scrollToContact = () => {
    const element = document.getElementById('contacto');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="ofertas" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nuestras <span className="text-[#00B871]">Ofertas</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Elige la oferta que mejor se adapte a tus necesidades de remesa. Todas incluyen seguimiento y soporte.
          </p>
          <div className="mt-6 flex justify-center">
            <div className="bg-gradient-to-r from-[#00B871] to-green-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
              ✨ Mejores tasas del mercado garantizadas
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {offers.map((offer, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                offer.popular ? 'ring-2 ring-[#00B871] bg-gradient-to-br from-white to-green-50' : 'hover:scale-105'
              } animate-fade-in-delay`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {offer.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-[#00B871] to-green-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                    Más Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  offer.popular 
                    ? 'bg-gradient-to-br from-[#00B871] to-green-600 shadow-lg' 
                    : 'bg-gradient-to-br from-green-100 to-green-200'
                }`}>
                  <DollarSign className={`w-6 h-6 ${offer.popular ? 'text-white' : 'text-[#00B871]'}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{offer.name}</h3>
                <p className="text-gray-600 mb-3 text-sm">{offer.description}</p>
                <div className="flex items-baseline justify-center mb-3">
                  <span className="text-3xl font-bold text-[#00B871]">{offer.zelle}</span>
                  <span className="text-gray-600 ml-2 text-sm font-semibold">ZELLE</span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2 text-sm flex items-center">
                    <span className="mr-2">💰</span> Efectivo:
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-2 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-700 text-xs">€ Euros:</span>
                      <span className="font-bold text-[#00B871] text-xs">{offer.efectivo.euros}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 text-xs">$ USD:</span>
                      <span className="font-bold text-[#00B871] text-xs">{offer.efectivo.usd}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 text-xs">₱ CUP:</span>
                      <span className="font-bold text-[#00B871] text-xs">{offer.efectivo.cup}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2 text-sm flex items-center">
                    <span className="mr-2">💳</span> Transferencia:
                  </h4>
                  <div className="bg-green-50 rounded-lg p-2 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-700 text-xs">CUP:</span>
                      <span className="font-bold text-[#00B871] text-xs">{offer.transferencia.cup}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 text-xs">MLC:</span>
                      <span className="font-bold text-[#00B871] text-xs">{offer.transferencia.mlc}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 text-xs">TC:</span>
                      <span className="font-bold text-[#00B871] text-xs">{offer.transferencia.tc}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-green-50 rounded-lg p-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold text-xs">% Comisión:</span>
                    <div className="text-right">
                      <div className="font-bold text-[#00B871] text-sm">{offer.comision}</div>
                      <div className="text-xs text-gray-600">{offer.comisionUsd}</div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => window.location.href = `/checkout?offer=${encodeURIComponent(offer.name)}`}
                className={`w-full py-3 px-4 rounded-lg font-bold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  offer.popular
                    ? 'bg-gradient-to-r from-[#00B871] to-green-600 text-white hover:from-green-700 hover:to-green-800 shadow-xl'
                    : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 hover:from-[#00B871] hover:to-green-600 hover:text-white'
                }`}
              >
                Seleccionar Oferta
              </button>
            </div>
          ))}
        </div>

        {/* Envío Personalizado */}
        <div className="max-w-xl mx-auto">
          <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-xl p-6 text-center animate-fade-in border border-green-100">
            <div className="w-16 h-16 bg-gradient-to-br from-[#00B871] to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Send className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Envío Personalizado
            </h3>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              Ingresa la cantidad en USD que deseas enviar y ve el cálculo automático.
            </p>
            
            {/* Calculadora personalizada */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad en USD
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">$</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="100"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B871] focus:border-[#00B871] text-center font-semibold text-lg"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                />
              </div>
            </div>

            {customCalculation && (
              <div className="space-y-4 mb-6">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center justify-center">
                    <span className="mr-2">💰</span> Efectivo:
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="font-bold text-[#00B871]">€{customCalculation.efectivo.euros}</div>
                      <div className="text-gray-600">Euros</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-[#00B871]">${customCalculation.efectivo.usd}</div>
                      <div className="text-gray-600">USD</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-[#00B871]">₱{customCalculation.efectivo.cup}</div>
                      <div className="text-gray-600">CUP</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center justify-center">
                    <span className="mr-2">💳</span> Transferencia:
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="font-bold text-[#00B871]">{customCalculation.transferencia.cup}</div>
                      <div className="text-gray-600">CUP</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-[#00B871]">{customCalculation.transferencia.mlc}</div>
                      <div className="text-gray-600">MLC</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-[#00B871]">{customCalculation.transferencia.tc}</div>
                      <div className="text-gray-600">TC</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {customCalculation ? (
                <button
                  onClick={handleCustomCheckout}
                  className="bg-gradient-to-r from-[#00B871] to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 font-bold text-sm shadow-lg transform hover:scale-105"
                >
                  Proceder con ${customAmount} USD
                </button>
              ) : (
                <div className="bg-gray-100 text-gray-500 px-6 py-3 rounded-lg font-bold text-sm">
                  Ingresa una cantidad para ver el cálculo
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={scrollToContact}
                  className="border-2 border-[#00B871] text-[#00B871] px-4 py-2 rounded-lg hover:bg-[#00B871] hover:text-white transition-all duration-300 font-semibold text-xs"
                >
                  Consultar por WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;