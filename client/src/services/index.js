import axios from 'axios';
import { env } from '../../config/env.js';
import logger from '../../config/logger.js';

const api = axios.create({
  baseURL: env.API_URL, // Should be http://localhost:3000/api
  timeout: env.API_TIMEOUT,
});

api.interceptors.request.use(
  (config) => {
    logger.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    logger.error('API Request Error:', error);
    return Promise.reject(error);
  },
);

export default api;
