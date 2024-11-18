// src/services/auth.services.js
import api from './index.js';
import Logger from '../../config/logger.js';

export const loginService = async (username, password) => {
  try {
    Logger.info('auth.api.js: Attempting to log in');
    const response = await api.post(`auth/login`, { username, password });
    Logger.info('auth.api.js: Login successful');
    return response.data;
  } catch (error) {
    Logger.error('auth.api.js: Login failed', error);
    throw error;
  }
};

export const registerService = async (username, email, password, name) => {
  try {
    Logger.info('auth.api.js: Attempting to register');
    const response = await api.post(`/auth/register`, {
      username,
      email,
      password,
      name,
    });
    Logger.info('auth.api.js: Registration successful');
    return response.data;
  } catch (error) {
    if (error.response.status === 409) {
      Logger.error('auth.api.js: User already exists');
      throw new Error('User already exists');
    } else {
      Logger.error('auth.api.js: Registration failed', error);
      throw error;
    }
  }
};

export const logoutService = () => {
  // TODO: Implement logout service
  Logger.info('auth.api.js: Attempting to log out');
};
