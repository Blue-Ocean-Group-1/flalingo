import api from './index.js';

export const getMessages = async () => {
  const response = await api.get('/messages');
  return response.data;
};
