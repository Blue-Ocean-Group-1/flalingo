// src/hooks/useAuth.js
import { useContext, useState } from 'react';
import AuthContext from '../context/authContext.js';
import { loginService } from '../services/auth.api.js';
import Logger from '../../config/logger.js';

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const { auth, login, logout } = useContext(AuthContext);

  const isAuthenticated = auth.isAuthenticated;

  const loginUser = async (username, password) => {
    Logger.info('useAuth: Attempting to log in user');
    try {
      setLoading(true);
      Logger.debug('useAuth: Calling loginService with username:', username);
      const data = await loginService(username, password);
      Logger.info('useAuth: Login successful');
      login(data.token);
    } catch (error) {
      Logger.error('useAuth: Login failed', error);
      throw error;
    } finally {
      setLoading(false);
      Logger.debug('useAuth: Login process completed');
    }
  };

  return {
    isAuthenticated,
    loginUser,
    logout,
    login,
    loading,
    token: auth.token,
  };
};

export default useAuth;
