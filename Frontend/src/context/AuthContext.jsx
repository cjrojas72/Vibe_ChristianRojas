import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();


export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('jwt_token') && !!localStorage.getItem('user');
  });
  const [role, setRole] = useState(() => {
    const stored = localStorage.getItem('role');
    return stored ? stored : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('jwt_token') || null);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setIsAuthenticated(true);
    setRole(userData.role);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('role', userData.role || '');
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
    localStorage.removeItem('user');
    localStorage.removeItem('role');
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
