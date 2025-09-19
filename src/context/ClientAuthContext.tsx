import React, { createContext, useContext, useState } from 'react';
import { authenticateClient, Client } from '../lib/clients';

type ClientAuthContextType = {
  isAuthenticated: boolean;
  client: Client | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined);

export const ClientAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [client, setClient] = useState<Client | null>(null);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const authenticatedClient = await authenticateClient(username, password);
      
      if (authenticatedClient) {
        setIsAuthenticated(true);
        setClient(authenticatedClient);
        return true;
      } else {
        setIsAuthenticated(false);
        setClient(null);
        return false;
      }
    } catch (error) {
      setIsAuthenticated(false);
      setClient(null);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setClient(null);
  };

  return (
    <ClientAuthContext.Provider value={{ isAuthenticated, client, login, logout }}>
      {children}
    </ClientAuthContext.Provider>
  );
};

export const useClientAuth = () => {
  const context = useContext(ClientAuthContext);
  if (!context) throw new Error('useClientAuth must be used within ClientAuthProvider');
  return context;
};