import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const TOKEN_KEY = 'survey_token';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  const setAxiosToken = (value) => {
    if (value) {
      axios.defaults.headers.common.Authorization = `Bearer ${value}`;
      localStorage.setItem(TOKEN_KEY, value);
    } else {
      delete axios.defaults.headers.common.Authorization;
      localStorage.removeItem(TOKEN_KEY);
    }
  };

  useEffect(() => {
    setAxiosToken(token);
  }, []);

  const login = (value) => {
    setToken(value);
    setAxiosToken(value);
  };

  const logout = () => {
    setToken(null);
    setAxiosToken(null);
  };

  const value = useMemo(() => ({
    token,
    isAuthenticated: Boolean(token),
    login,
    logout,
  }), [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return ctx;
};
