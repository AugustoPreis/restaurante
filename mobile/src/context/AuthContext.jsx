import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const updateAuthentication = (isAuthenticated) => {
    setIsAuthenticated(isAuthenticated);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, updateAuthentication }}>
      {children}
    </AuthContext.Provider>
  );
}