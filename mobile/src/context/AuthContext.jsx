import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const updateAuthentication = (newUser) => {
    if (!newUser) {
      return setUser(null);
    }

    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!user,
      updateAuthentication,
      user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}