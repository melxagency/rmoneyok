import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ClientAuthProvider } from './context/ClientAuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import ClientLogin from './pages/ClientLogin';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Checkout from './pages/Checkout';
import EmailVerification from './pages/EmailVerification';
import RemesaExitosa from './pages/RemesaExitosa';
import SeguimientoRemesa from './pages/SeguimientoRemesa';

function App() {
  return (
    <AuthProvider>
      <ClientAuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/administracion" element={<Login />} />
            <Route path="/admin_dashboard" element={<AdminPanel />} />
            <Route path="/iniciar_sesion" element={<ClientLogin />} />
            <Route path="/registrar" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/verificar-email" element={<EmailVerification />} />
            <Route path="/remesa-exitosa" element={<RemesaExitosa />} />
            <Route path="/seguimiento/:link" element={<SeguimientoRemesa />} />
          </Routes>
        </Router>
      </ClientAuthProvider>
    </AuthProvider>
  );
}

export default App;