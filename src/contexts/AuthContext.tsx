import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define auth context type
type AuthContextType = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  user: string | null;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
  user: null,
});

// Simple auth credentials (in a real app, this would be handled by a backend)
const ADMIN_CREDENTIALS = {
  username: 'contact@elektr-ame.com',
  password: '92Alcolea2025'
};

// Auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('elektrame_auth');
    if (savedAuth === 'true') {
      const savedUser = localStorage.getItem('elektrame_user');
      setIsAuthenticated(true);
      setUser(savedUser);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      setUser(username);
      localStorage.setItem('elektrame_auth', 'true');
      localStorage.setItem('elektrame_user', username);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('elektrame_auth');
    localStorage.removeItem('elektrame_user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = () => useContext(AuthContext);
