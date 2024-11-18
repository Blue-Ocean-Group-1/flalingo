// src/context/authContext.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Logger from '../../config/logger.js';
import AuthContext from './authContext.js';

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    isAuthenticated: false,
  });

  useEffect(() => {
    if (auth.token) {
      Logger.info(
        'authContext.jsx: Token found in localStorage, setting isAuthenticated to true',
      );
      setAuth((prevAuth) => ({ ...prevAuth, isAuthenticated: true }));
    } else {
      Logger.debug('authContext.jsx: No token found in localStorage');
    }
  }, [auth.token]);

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
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
