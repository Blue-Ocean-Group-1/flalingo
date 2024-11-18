import api from './index.js';

const getChatrooms = async () => {
  const response = await api.get('/chatrooms');
  return response.data;
};

const getChatroom = async (roomId) => {
  const response = await api.get(`/chatrooms/${roomId}`);
  return response.data;
};

const getChatroomMessages = async (roomId) => {
  const response = await api.get(`/chatrooms/${roomId}/messages`);
  return response.data;
};

const createChatMessage = async (roomId, userId, message) => {
  const response = await api.post(`/chatrooms/${roomId}/messages`, {
    userId,
    message,
  });
  return response.data;
};
export { getChatrooms, getChatroom, getChatroomMessages, createChatMessage };
