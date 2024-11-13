import api from './index.js';
import logger from '../../config/logger.js';

const getHealth = async () => {
  try {
    logger.debug('Making health check request');
    const response = await api.get('/test/health');
    logger.debug('Health check response:', response.data);
    return response.data;
  } catch (error) {
    logger.error('Health check failed:', error);
    throw error;
  }
};

export default getHealth;
