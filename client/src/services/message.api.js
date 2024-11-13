import api from './index.js';

const getMessages = async () => {
  const response = await api.get('/messages');
  return response.data;
};
