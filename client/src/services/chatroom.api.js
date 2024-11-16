import api from './index.js';

const getChatrooms = async () => {
  const response = await api.get('/chatrooms');
  return response.data;
};

const createChatMessage = async (userId, roomId, content) => {
  const response = await api.post(`/chatrooms/${roomId}`, {
    userId,
    roomId,
    content,
  });
  return response.data;
};

export { getChatrooms, createChatMessage };
