import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('jwt_token') || null);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setIsAuthenticated(true);
    setRole(userData.role);
    if (jwtToken) {
      setToken(jwtToken);
      localStorage.setItem('jwt_token', jwtToken);
    }
  };
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setRole(null);
    setToken(null);
    localStorage.removeItem('jwt_token');
  };

  // Helper to get token for API requests
  const getToken = () => token;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, role, login, logout, token, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
