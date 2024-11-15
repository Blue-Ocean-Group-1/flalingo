import api from './index.js';

const getChatrooms = async () => {
  const response = await api.get('/chatrooms');
  return response.data;
};

export { getChatrooms };
