// src/context/authContext.jsx
import React, { useState, useEffect } from 'react';
import Logger from '../../config/logger.js';
import AuthContext from './authContext.js';

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    isAuthenticated: false,
  });
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      Logger.debug('authContext.jsx: Initializing auth with token:', token);

      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const isExpired = payload.exp * 1000 < Date.now();

          if (isExpired) {
            Logger.warn('authContext.jsx: Token is expired');
            localStorage.removeItem('token');
            setAuth({ token: null, isAuthenticated: false });
          } else {
            Logger.info('authContext.jsx: Token is valid');
            setAuth({ token, isAuthenticated: true });
          }
        } catch (error) {
          Logger.error('authContext.jsx: Error parsing token:', error);
          localStorage.removeItem('token');
          setAuth({ token: null, isAuthenticated: false });
        }
      }
      setAuthInitialized(true);
    };

    initializeAuth();
  }, []);

  const login = (token) => {
    try {
      localStorage.setItem('token', token);
      setAuth({ token, isAuthenticated: true });
      Logger.info('authContext.jsx: User logged in successfully');
    } catch (error) {
      Logger.error('authContext.jsx: Error during login:', error);
    }
  };

  const logout = (callback) => {
    try {
      localStorage.removeItem('token');
      setAuth({ token: null, isAuthenticated: false });
      Logger.info('authContext.jsx: User logged out successfully');
      if (callback) {
        callback();
      }
    } catch (error) {
      Logger.error('authContext.jsx: Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, authInitialized }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
