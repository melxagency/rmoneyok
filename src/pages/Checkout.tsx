import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, User, MapPin, CreditCard, Send, Check } from 'lucide-react';
import { getAllProvinces, getMunicipalitiesByProvince, getServiceAvailability, Province, Municipality } from '../lib/provinces';
import { createRemittanceOrderWithLink } from '../lib/orders';
import { countries } from '../lib/countries';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedOffer = searchParams.get('offer') || 'Oferta 1';

  const [currentStep, setCurrentStep] = useState(1);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [availableServices, setAvailableServices] = useState<{efectivo: boolean, transferencia: boolean}>({efectivo: false, transferencia: false});
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Datos del formulario divididos por pasos
  const [senderData, setSenderData] = useState({
    nombre_completo: '',
    email: '',
    telefono_contacto: '',
    pais: 'US' // Default to United States
  });

  const [receiverData, setReceiverData] = useState({
    nombre_completo_receptor: '',
    carnet_identidad: '',
    numero_familiar: '',
    provincia: '',
    municipio: '',
    direccion: '',
    detalles: ''
  });

  const [paymentData, setPaymentData] = useState({
    metodo_cobro: '' as 'efectivo' | 'transferencia' | '',
    moneda_cobro: '',
    tarjeta: ''
  });

  const offers = {
    'Oferta 1': {
      zelle: '$110',
      efectivo: { euros: '80', usd: '100', cup: '40,500' },
      transferencia: { cup: '40,800', mlc: '213', tc: '100' }
    },
    'Oferta 2': {
      zelle: '$220',
      efectivo: { euros: '160', usd: '200', cup: '81,000' },
      transferencia: { cup: '81,600', mlc: '426', tc: '200' }
    },
    'Oferta 3': {
      zelle: '$324',
      efectivo: { euros: '240', usd: '300', cup: '121,500' },
      transferencia: { cup: '122,400', mlc: '639', tc: '300' }
    },
    'Envío Personalizado': null // Will be loaded from localStorage
  };

  // Load custom offer from localStorage if it's a custom order
  const [customOfferData, setCustomOfferData] = useState<any>(null);
  
  useEffect(() => {
    if (selectedOffer === 'Envío Personalizado') {
      const storedCustomOffer = localStorage.getItem('customOffer');
      if (storedCustomOffer) {
        const customOffer = JSON.parse(storedCustomOffer);
        setCustomOfferData(customOffer);
      }
    }
  }, [selectedOffer]);

  const currentOffer = selectedOffer === 'Envío Personalizado' && customOfferData 
    ? customOfferData 
    : offers[selectedOffer as keyof typeof offers] || offers['Oferta 1'];

  useEffect(() => {
    console.log('🚀 Checkout component mounted, loading provinces...');
    console.log('🔧 Environment check:');
    console.log('- VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? 'SET' : 'NOT SET');
    console.log('- VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
    loadProvinces();
  }, []);

  useEffect(() => {
    if (receiverData.provincia) {
      loadMunicipalities(receiverData.provincia);
    }
  }, [receiverData.provincia]);

  useEffect(() => {
    if (receiverData.municipio) {
      loadServiceAvailability(receiverData.municipio);
    }
  }, [receiverData.municipio]);

  const loadProvinces = async () => {
    console.log('🔄 Starting loadProvinces function...');
    setLoading(true);
    
    try {
      console.log('📞 Calling getAllProvinces...');
      const fetchedProvinces = await getAllProvinces();
      console.log('📥 Received provinces:', fetchedProvinces);
      console.log('📊 Provinces count:', fetchedProvinces.length);
      
      setProvinces(fetchedProvinces);
      console.log('✅ Provinces state updated');
    } catch (error) {
      console.error('💥 Error in loadProvinces:', error);
    } finally {
      setLoading(false);
      console.log('🏁 loadProvinces completed');
    }
  };

  const loadMunicipalities = async (provinciaName: string) => {
    const fetchedMunicipalities = await getMunicipalitiesByProvince(provinciaName);
    setMunicipalities(fetchedMunicipalities);
    setReceiverData(prev => ({ ...prev, municipio: '' }));
    setPaymentData({ metodo_cobro: '', moneda_cobro: '' });
  };

  const loadServiceAvailability = async (municipioName: string) => {
    const services = await getServiceAvailability(municipioName);
    if (services) {
      setAvailableServices({
        efectivo: services.efectivo,
        transferencia: services.transferencia
      });
    } else {
      setAvailableServices({
        efectivo: true,
        transferencia: true
      });
    }
    setPaymentData({ metodo_cobro: '', moneda_cobro: '' });
  };

  const handleSenderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSenderData(prev => ({ ...prev, [name]: value }));
  };

  const handleReceiverChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReceiverData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
    
    // Reset tarjeta when changing method
    if (name === 'metodo_cobro') {
      setPaymentData(prev => ({ ...prev, tarjeta: '' }));
    }
  };

  const handleTarjetaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPaymentData(prev => ({ ...prev, tarjeta: value }));
  };

  const getAvailableCurrencies = () => {
    if (paymentData.metodo_cobro === 'efectivo') {
      return [
        { value: `euros - ${currentOffer.efectivo.euros}`, label: `€ Euros (${currentOffer.efectivo.euros})` },
        { value: `usd - ${currentOffer.efectivo.usd}`, label: `$ USD (${currentOffer.efectivo.usd})` },
        { value: `cup - ${currentOffer.efectivo.cup}`, label: `₱ CUP (${currentOffer.efectivo.cup})` }
      ];
    } else if (paymentData.metodo_cobro === 'transferencia') {
      return [
        { value: `cup - ${currentOffer.transferencia.cup}`, label: `CUP (${currentOffer.transferencia.cup})` },
        { value: `mlc - ${currentOffer.transferencia.mlc}`, label: `MLC (${currentOffer.transferencia.mlc})` },
        { value: `tc - ${currentOffer.transferencia.tc}`, label: `TC (${currentOffer.transferencia.tc})` }
      ];
    }
    return [];
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return senderData.nombre_completo && senderData.email && senderData.telefono_contacto && senderData.pais;
      case 2:
        return receiverData.nombre_completo_receptor && receiverData.carnet_identidad && 
               receiverData.numero_familiar && receiverData.provincia && receiverData.municipio && 
               receiverData.direccion;
      case 3:
        const basicValidation = paymentData.metodo_cobro && paymentData.moneda_cobro;
        if (paymentData.metodo_cobro === 'transferencia') {
          return basicValidation && paymentData.tarjeta;
        }
        return basicValidation;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    setSubmitMessage('');

    try {
      // Extract amount from offer
      let importe = 0;
      let importeCobrar = 0;
      
      if (selectedOffer === 'Envío Personalizado' && customOfferData) {
        importe = parseInt(customOfferData.zelle.replace('$', ''));
        // Extract the amount to be received from the selected currency
        const [currency, amount] = paymentData.moneda_cobro.split(' - ');
        importeCobrar = parseFloat(amount.replace(/[^0-9.-]/g, ''));
      } else {
        const offerAmounts: { [key: string]: number } = {
          'Oferta 1': 110,
          'Oferta 2': 220,
          'Oferta 3': 324
        };
        importe = offerAmounts[selectedOffer] || 0;
        
        // Extract the amount to be received from the selected currency
        const [currency, amount] = paymentData.moneda_cobro.split(' - ');
        importeCobrar = parseFloat(amount.replace(/[^0-9.-]/g, ''));
      }

      const orderData = {
        fullname_remitente: senderData.nombre_completo,
        correo_remitente: senderData.email,
        numero_remitente: senderData.telefono_contacto,
        pais_remitente: countries.find(c => c.code === senderData.pais)?.name || 'Estados Unidos',
        fullname_receptor: receiverData.nombre_completo_receptor,
        carnet_receptor: receiverData.carnet_identidad,
        contacto_receptor: receiverData.numero_familiar,
        provincia: receiverData.provincia,
        municipio: receiverData.municipio,
        direccion: receiverData.direccion,
        detalles: receiverData.detalles,
        metodo_cobro: paymentData.metodo_cobro,
        moneda: paymentData.moneda_cobro.split(' - ')[0], // Extract currency code
        importe: importe,
        importe_cobrar: importeCobrar,
        oferta_seleccionada: selectedOffer,
        tarjeta: paymentData.metodo_cobro === 'transferencia' ? paymentData.tarjeta : undefined
      };

      const { order, trackingLink } = await createRemittanceOrderWithLink(orderData);
      
      if (order) {
        // Navigate to success page with tracking link
        navigate(`/remesa-exitosa?link=${trackingLink}&email=${encodeURIComponent(senderData.email)}`);
      } else {
        setSubmitMessage('Hubo un error al crear la orden. Por favor intenta nuevamente.');
      }
    } catch (error) {
      setSubmitMessage('Hubo un error al crear la orden. Por favor intenta nuevamente.');
      console.error('Error creating order:', error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Datos del Remitente', icon: User },
    { number: 2, title: 'Datos del Receptor', icon: MapPin },
    { number: 3, title: 'Método de Cobro', icon: CreditCard }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900">Solicitud de Remesa</h1>
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-[#00B871] hover:text-green-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver al inicio
            </button>
            <div className="flex items-center">
              <img
                src="/logo png.png"
                alt="RMoney Logo"
                className="h-12 w-auto"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Resumen de la oferta */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white to-green-50 rounded-lg shadow-lg p-4 sticky top-4 border border-green-100">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00B871] to-green-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Tu Remesa</h3>
                <p className="text-sm text-gray-600">Resumen de la transferencia</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 mb-4 border border-green-200">
                <div className="text-center">
                  <h4 className="font-bold text-[#00B871] text-sm mb-2">{selectedOffer}</h4>
                  <div className="text-2xl font-bold text-[#00B871] mb-1">{currentOffer.zelle}</div>
                  <div className="text-sm text-gray-600 font-medium">💳 Pago por Zelle</div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                    <h5 className="font-semibold text-gray-900 mb-2 text-sm flex items-center">
                      <span className="mr-2">💰</span> Efectivo:
                    </h5>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 text-sm">€ Euros:</span>
                        <span className="font-bold text-[#00B871] text-sm">{currentOffer.efectivo.euros}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 text-sm">$ USD:</span>
                        <span className="font-bold text-[#00B871] text-sm">{currentOffer.efectivo.usd}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 text-sm">₱ CUP:</span>
                        <span className="font-bold text-[#00B871] text-sm">{currentOffer.efectivo.cup}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                    <h5 className="font-semibold text-gray-900 mb-2 text-sm flex items-center">
                      <span className="mr-2">💳</span> Transferencia:
                    </h5>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 text-sm">CUP:</span>
                        <span className="font-bold text-[#00B871] text-sm">{currentOffer.transferencia.cup}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 text-sm">MLC:</span>
                        <span className="font-bold text-[#00B871] text-sm">{currentOffer.transferencia.mlc}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 text-sm">TC:</span>
                        <span className="font-bold text-[#00B871] text-sm">{currentOffer.transferencia.tc}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-800 font-semibold text-xs text-center">
                  ⚡ Transferencia garantizada en 24 horas
                </p>
              </div>
            </div>
          </div>

          {/* Formularios */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 ${
                      currentStep >= step.number 
                        ? 'bg-[#00B871] border-[#00B871] text-white' 
                        : 'border-gray-300 text-gray-500'
                    }`}>
                      {currentStep > step.number ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <step.icon className="w-3 h-3" />
                      )}
                    </div>
                    <div className="ml-2">
                      <div className={`text-sm font-medium ${
                        currentStep >= step.number ? 'text-[#00B871]' : 'text-gray-500'
                      }`}>
                        Paso {step.number}
                      </div>
                      <div className={`text-xs ${
                        currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-4 ${
                        currentStep > step.number ? 'bg-[#00B871]' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Container */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${(currentStep - 1) * 100}%)` }}
                >
                  {/* Paso 1: Datos del Remitente */}
                  <div className="w-full flex-shrink-0 p-3">
                    <div className="flex items-center mb-4">
                      <User className="w-5 h-5 text-[#00B871] mr-2" />
                      <h2 className="text-base font-bold text-gray-900">Datos del Remitente</h2>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre completo *
                        </label>
                        <input
                          type="text"
                          name="nombre_completo"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B871]"
                          value={senderData.nombre_completo}
                          onChange={handleSenderChange}
                          placeholder="Tu nombre y apellidos"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          País de residencia *
                        </label>
                        <select
                          name="pais"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B871] bg-white"
                          value={senderData.pais}
                          onChange={handleSenderChange}
                        >
                          {countries.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Correo electrónico *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B871]"
                          value={senderData.email}
                          onChange={handleSenderChange}
                          placeholder="tu@email.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Número de contacto *
                        </label>
                        <input
                          type="tel"
                          name="telefono_contacto"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B871]"
                          value={senderData.telefono_contacto}
                          onChange={handleSenderChange}
                          placeholder="+1 (305) 123-4567"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Paso 2: Datos del Receptor */}
                  <div className="w-full flex-shrink-0 p-3">
                    <div className="flex items-center mb-4">
                      <MapPin className="w-5 h-5 text-[#00B871] mr-2" />
                      <h2 className="text-base font-bold text-gray-900">Datos del Receptor en Cuba</h2>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre completo *
                          </label>
                          <input
                            type="text"
                            name="nombre_completo_receptor"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B871]"
                            value={receiverData.nombre_completo_receptor}
                            onChange={handleReceiverChange}
                            placeholder="Nombre del receptor"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Carnet de identidad *
                          </label>
                          <input
                            type="text"
                            name="carnet_identidad"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B871]"
                            value={receiverData.carnet_identidad}
                            onChange={handleReceiverChange}
                            placeholder="12345678901"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Número de contacto en Cuba *
                        </label>
                        <input
                          type="tel"
                          name="numero_familiar"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B871]"
                          value={receiverData.numero_familiar}
                          onChange={handleReceiverChange}
                          placeholder="+53 5123 4567"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Provincia *
                          </label>
                          <select
                            name="provincia"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B871] bg-white"
                            value={receiverData.provincia}
                            onChange={handleReceiverChange}
                          >
                            <option value="">Seleccionar provincia</option>
                            {provinces.map((province, index) => (
                              <option key={`provincia-${province.id_provincia}-${index}`} value={province.nombre || ''}>
                                {province.nombre || `Provincia ${province.id_provincia}`}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Municipio *
                          </label>
                          <select
                            name="municipio"
                            required
                            disabled={!receiverData.provincia}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B871] bg-white disabled:bg-gray-100"
                            value={receiverData.municipio}
                            onChange={handleReceiverChange}
                          >
                            <option value="">Seleccionar municipio</option>
                            {municipalities.map((municipality, index) => (
                              <option key={`municipio-${municipality.id_municipio}-${index}`} value={municipality.nombre || ''}>
                                {municipality.nombre || `Municipio ${municipality.id_municipio}`}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dirección completa *
                        </label>
                        <textarea
                          name="direccion"
                          required
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B871] resize-none"
                          value={receiverData.direccion}
                          onChange={handleReceiverChange}
                          placeholder="Calle, número, entre calles, reparto, etc."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Detalles adicionales (opcional)
                        </label>
                        <textarea
                          name="detalles"
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B871] resize-none"
                          value={receiverData.detalles}
                          onChange={handleReceiverChange}
                          placeholder="Cualquier detalle importante que debamos saber..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Paso 3: Método de Cobro */}
                  <div className="w-full flex-shrink-0 p-3">
                    <div className="flex items-center mb-4">
                      <CreditCard className="w-5 h-5 text-[#00B871] mr-2" />
                      <h2 className="text-base font-bold text-gray-900">Método de Cobro</h2>
                    </div>
                    
                    <div className="space-y-2">
                      {receiverData.municipio && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Método de cobro *
                            </label>
                            <select
                              name="metodo_cobro"
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B871] bg-white"
                              value={paymentData.metodo_cobro}
                              onChange={handlePaymentChange}
                            >
                              <option value="">Seleccionar método</option>
                              {availableServices.efectivo && (
                                <option value="efectivo">💰 Efectivo</option>
                              )}
                              {availableServices.transferencia && (
                                <option value="transferencia">💳 Transferencia</option>
                              )}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Moneda de cobro *
                            </label>
                            <select
                              name="moneda_cobro"
                              required
                              disabled={!paymentData.metodo_cobro}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B871] bg-white disabled:bg-gray-100"
                              value={paymentData.moneda_cobro}
                              onChange={handlePaymentChange}
                            >
                              <option value="">Seleccionar moneda</option>
                              {getAvailableCurrencies().map(currency => (
                                <option key={currency.value} value={currency.value}>
                                  {currency.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {paymentData.metodo_cobro === 'transferencia' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tarjeta bancaria *
                              </label>
                              <input
                                type="text"
                                name="tarjeta"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B871]"
                                value={paymentData.tarjeta}
                                onChange={handleTarjetaChange}
                                placeholder="Número de tarjeta bancaria"
                              />
                            </div>
                          )}

                          {paymentData.metodo_cobro && paymentData.moneda_cobro && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <h4 className="font-semibold text-green-800 mb-1 text-sm">Resumen del cobro:</h4>
                              <div className="text-sm text-green-700">
                                <p><strong>Método:</strong> {paymentData.metodo_cobro === 'efectivo' ? 'Efectivo' : 'Transferencia'}</p>
                                <p><strong>Moneda:</strong> {paymentData.moneda_cobro}</p>
                                {paymentData.metodo_cobro === 'transferencia' && paymentData.tarjeta && (
                                  <p><strong>Tarjeta:</strong> {paymentData.tarjeta}</p>
                                )}
                                <p><strong>Municipio:</strong> {receiverData.municipio}</p>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {!receiverData.municipio && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-yellow-800 text-sm">
                            Por favor completa los datos del receptor en el paso anterior para ver los métodos de cobro disponibles.
                          </p>
                        </div>
                      )}

                      {submitMessage && (
                        <div className={`p-4 rounded-lg ${submitMessage.includes('error') || submitMessage.includes('Hubo') 
                          ? 'bg-red-50 text-red-800' 
                          : 'bg-green-50 text-green-800'
                        }`}>
                          {submitMessage}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Anterior
                </button>

                <div className="flex items-center space-x-2">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        currentStep > index + 1 ? 'bg-[#00B871]' : currentStep === index + 1 ? 'bg-[#00B871]' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {currentStep < 3 ? (
                  <button
                    onClick={nextStep}
                    disabled={!validateStep(currentStep)}
                    className="flex items-center px-3 py-2 bg-[#00B871] text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    Siguiente
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !validateStep(3)}
                    className="flex items-center px-3 py-2 bg-gradient-to-r from-[#00B871] to-green-600 text-white rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg text-sm"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Send className="w-3 h-3 mr-2" />
                        Enviar remesa
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;