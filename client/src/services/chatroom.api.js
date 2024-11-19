import api from './index.js';
import Logger from '../../config/logger.js';

// export const loginService = async (username, password) => {
//   try {
//     Logger.info('auth.api.js: Attempting to log in');
//     const response = await api.post(`auth/login`, { username, password });
//     Logger.info('auth.api.js: Login successful');
//     return response.data;
//   } catch (error) {
//     Logger.error('auth.api.js: Login failed', error);
//     throw error;
//   }
// };
const getChatrooms = async () => {
  try {
    Logger.info('Attempting to get all chatrooms');
    const response = await api.get('/chatrooms');
    Logger.info('Successfully retrieved all chatrooms');
    return response.data;
  } catch (error) {
    Logger.error('Failed to get all chatrooms', error);
    throw error;
  }
};

const getChatroom = async (roomId) => {
  const response = await api.get(`/chatrooms/${roomId}`);
  return response.data;
};

const getChatroomMessages = async (roomId) => {
  const response = await api.get(`/chatrooms/${roomId}/messages`);
  return response.data;
};

const createChatMessage = async ({
  userId,
  username,
  roomId,
  language,
  content,
}) => {
  const response = await api.post(`/chatrooms/${roomId}/messages`, {
    senderId: userId,
    senderName: username,
    roomId,
    language,
    content,
  });
  return response.data;
};
export { getChatrooms, getChatroom, getChatroomMessages, createChatMessage };
