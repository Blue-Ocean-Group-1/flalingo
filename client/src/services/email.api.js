import api from './index.js';
import Logger from '../../config/logger.js';

export const sendFormSubmission = async (formData) => {
  try {
    Logger.debug('email.api.js: Attempting to send form submission');
    const response = await api.post(`/email`, formData);
    Logger.debug('email.api.js: Form submission successful');
    return response.data;
  } catch (error) {
    Logger.error('email.api.js: Form submission failed', error);
    throw error;
  }
};
