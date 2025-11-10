import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import client from '../api/client.js';

const TOKEN_KEY = 'survey_token';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  const setAxiosToken = (value) => {
    if (value) {
      axios.defaults.headers.common.Authorization = `Bearer ${value}`;
      client.defaults.headers.common.Authorization = `Bearer ${value}`;
      localStorage.setItem(TOKEN_KEY, value);
    } else {
      delete axios.defaults.headers.common.Authorization;
      delete client.defaults.headers.common.Authorization;
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

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return ctx;
};
