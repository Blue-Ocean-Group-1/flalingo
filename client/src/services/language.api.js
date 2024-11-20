import api from './index.js';

export const fetchLanguageNames = async () => {
  try {
    const response = await api.get('/languages/names');
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
